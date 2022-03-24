import { Button, Input, Label, Typography } from "@equinor/eds-core-react"
import { ChangeEventHandler, FormEvent, FormEventHandler, MouseEventHandler, SyntheticEvent, useState, VoidFunctionComponent } from "react"
import styled from "styled-components"

const Form = styled.form`
  > *:not(:last-child) {
    margin-bottom: 1rem;
  }
`

export type SignInFormState = {
  username: string
  password: string
}

type Props = {
  onSubmit: (formState: SignInFormState, e?: FormEvent<HTMLFormElement>) => Promise<void>
  onCancel: (e?: SyntheticEvent<HTMLButtonElement>) => void
}

export const SignInForm: VoidFunctionComponent<Props> = ({ onSubmit, onCancel }) => {
  const [formState, setFormState] = useState<SignInFormState>({ username: "", password: "" })

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    await onSubmit(formState, e)
  }

  const handleCancel: MouseEventHandler<HTMLButtonElement> = (e) => {
    setFormState({ username: "", password: "" })
    onCancel(e)
  }

  const handleFieldChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value })
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Typography>
        Sign in to Data Marketplace using your Equinor credentials
      </Typography>

      <div>
        <Label label="Email" htmlFor="username" />
        <Input
          type="email"
          id="username"
          name="username"
          placeholder="username@equinor.com"
          onChange={handleFieldChange}
        />
      </div>

      <div>
        <Label label="Password" htmlFor="password" />
        <Input
          type="password"
          id="password"
          name="password"
          placeholder="supersecurepassword"
          onChange={handleFieldChange}
        />
      </div>

      <div>
        <Button type="submit">
          {/* TODO: add spinner and disable while submitting (should not reduce width) */}
          Sign in
        </Button>
        <Button variant="ghost" color="secondary" type="button" onClick={handleCancel}>
          Cancel
        </Button>
      </div>
    </Form>
  )
}
