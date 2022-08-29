import { STATUS_CODES } from "http"

import type { NextApiHandler } from "next"
import { getToken } from "next-auth/jwt"

import { config } from "../../config"
import { HttpClient } from "../../lib/HttpClient"
import { HttpError } from "../../lib/HttpError"

const WorkflowsHandler: NextApiHandler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).end()
  }

  const token = await getToken({ req })

  if (!token || !token.accessToken) {
    return res.status(401).end()
  }

  if (!req.body) {
    console.warn("[WorkflowsHandler] Missing request body", req.body)
    return res.status(400).end()
  }

  if (
    !req.body.assetId
    || typeof req.body.assetId !== "string"
    || !/^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i.test(req.body.assetId)
  ) {
    console.warn("[WorkflowsHandler] Invalid asset ID", req.body)
    return res.status(400).end()
  }

  if (!req.body.termsAccepted) {
    console.warn("[WorkflowsHandler] User did not accept Terms and Conditions", req.body)
    return res.status(400).end()
  }

  if (typeof req.body.description !== "string" || req.body.description.length < 10) {
    console.warn("[WorkflowsHandler] Invalid description", req.body)
    return res.status(400).end()
  }

  const authorization = `Bearer ${token.accessToken}`

  try {
    const workflowDefinitionsRes = await HttpClient.get<Collibra.PagedWorkflowDefinitionResponse>(`${config.COLLIBRA_BASE_URL}/workflowDefinitions`, {
      headers: { authorization },
      query: {
        assetId: req.body.assetId,
        name: "Request Access",
      },
    })

    if (!workflowDefinitionsRes.body || workflowDefinitionsRes.body.total === 0) {
      throw new HttpError(`Failed getting workflow definitions for asset ${req.body.assetId}`, workflowDefinitionsRes.statusCode, workflowDefinitionsRes.headers, workflowDefinitionsRes.body)
    }

    const requestAccessWorkflowDef = workflowDefinitionsRes.body.results.find((def) => def.processId === "requestAccessDataProduct")

    if (!requestAccessWorkflowDef) {
      throw new HttpError(`No requestAccessDataProduct for asset ${req.body.assetId}`, 400, {})
    }

    const { body: user } = await HttpClient.get<Collibra.User>(`${config.COLLIBRA_BASE_URL}/users/current`, {
      headers: { authorization },
    })

    if (!user) {
      throw new HttpError("No currently logged in user found", 401, {})
    }

    const { body: workflowInstances } = await HttpClient.post<Collibra.WorkflowInstance[]>(`${config.COLLIBRA_BASE_URL}/workflowInstances`, {
      headers: { authorization },
      body: {
        workflowDefinitionId: workflowDefinitionsRes.body.results[0].id,
        businessItemIds: [req.body.assetId],
        businessItemType: "ASSET",
        guestUserId: user.id,
      } as Collibra.StartWorkflowInstanceRequest,
    })

    if (!workflowInstances || workflowInstances.length === 0) {
      throw new HttpError("Unable to instantiate workflow instance", 500, {}, workflowInstances)
    }

    const acceptRTUtask = workflowInstances[0].tasks.find((task) => task.type === "acceptrejectrtu")

    if (!acceptRTUtask) {
      throw new HttpError("Collibra gave no task to accept Terms and Conditions", 500, {})
    }

    const { body: tasks } = await HttpClient.post<Collibra.WorkflowTask[]>(`${config.COLLIBRA_BASE_URL}/workflowTasks/completed`, {
      headers: { authorization },
      body: {
        formProperties: {
          accept: req.body.termsAccepted,
          reject: !req.body.termsAccepted,
        },
        taskIds: [acceptRTUtask.id],
      },
    })

    if (!tasks || tasks.length === 0) {
      throw new HttpError("Collibra provided no new tasks, when one was needed to complete checkout", 500, {})
    }

    const reasonForAccessTask = tasks.find((task) => task.type === "reasonforaccess")

    if (!reasonForAccessTask) {
      throw new HttpError("Colliba provided no task to provide Reason for Access when it was expected to be the next one", 500, {})
    }

    const { body: nextTasks } = await HttpClient.post<Collibra.WorkflowTask[]>(`${config.COLLIBRA_BASE_URL}/workflowTasks/completed`, {
      headers: { authorization },
      body: {
        formProperties: {
          NextAccess: true,
          accessMethod: "",
          cancelAccess: false,
          purpose: req.body.description,
        },
        taskIds: [reasonForAccessTask.id],
      },
    })

    console.log(nextTasks)

    return res.status(501).end()
  } catch (error) {
    console.error("[WorkflowsHandler]", error)

    if (error instanceof HttpError) {
      const statusCode = error.statusCode || 500
      return res.status(statusCode).json(error.body ?? STATUS_CODES[statusCode])
    }

    return res.status(500).end()
  }
}

export default WorkflowsHandler
