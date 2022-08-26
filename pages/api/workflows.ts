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

    const { body: user } = await HttpClient.get<Collibra.User>(`${config.COLLIBRA_BASE_URL}/users/current`, {
      headers: { authorization },
    })

    console.log(user)

    return res.status(501).end()
  } catch (error) {
    console.error("[WorkflowsHandler]", error)

    if (error instanceof HttpError) {
      return res.status(error.statusCode).json(error.body)
    }

    return res.status(500).end()
  }
}

export default WorkflowsHandler
