import { Typography } from "@equinor/eds-core-react"
import { tokens } from "@equinor/eds-tokens"
import Link from "next/link"
import styled from "styled-components"

import { TruncatedDescription } from "../helpers"

const CardContainer = styled.div`
  box-shadow: ${tokens.elevation.raised};
  border-radius: ${tokens.shape.corners.borderRadius};
  padding: 2rem;

  &:not(:last-child) {
    margin-bottom: 1.5rem;
  }

  a > *:not(:last-child) {
    margin-bottom: 1rem;
  }
`

const MetaContainer = styled.div`
  display: flex;

  > *:not(:last-child) {
    margin-right: 1rem;
  }
`

type Props = {
  description: string
  id: string
  meta?: { label: string, value: string|number }[]
  title: string
}

export const AssetCard = ({
  description,
  id,
  meta,
  title,
}: Props) => (
  <CardContainer>
    <Link href={{ pathname: "/assets/[id]", query: { id } }}>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a>
        <div>
          <Typography variant="h4" as="p">{title}</Typography>
        </div>

        {meta && (
          <MetaContainer data-testid="meta-container">
            {meta.map((m, i) => (
              <Typography variant="caption" key={`${id}-meta-${i + 1}`}>
                {m.label}
                {" "}
                {m.value}
              </Typography>
            ))}
          </MetaContainer>
        )}

        <div>

          {/*
            * html strings are sanitized in backend at this point,
            * so we should(TM) be safe to do this
            */}
          <TruncatedDescription variant="body_long" dangerouslySetInnerHTML={{ __html: description }} />
        </div>
      </a>
    </Link>
  </CardContainer>
)
