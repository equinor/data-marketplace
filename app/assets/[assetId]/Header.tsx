"use client"

import { Button, Icon, Typography } from "@equinor/eds-core-react"
import { key } from "@equinor/eds-icons"
import NextLink from "next/link"
import { FunctionComponent } from "react"
import { useIntl } from "react-intl"
import styled from "styled-components"

import { Heading } from "components/Typography"

const Header = styled.header`
  @media (min-width: 850px) {
    display: grid;
    grid-template-columns: 1fr auto;
    grid-gap: 1.5rem;
    align-items: end;
  }
`

const AssetHeading = styled.div`
  margin-bottom: var(--space-32);
  @media (min-width: 850px) {
    margin-bottom: 0;
  }
`

type Props = {
  communityName: string
  id: string
  name: string
}

export const AssetPageHeader: FunctionComponent<Props> = ({ communityName, name, id }) => {
  const intl = useIntl()

  return (
    <Header>
      <AssetHeading>
        {!!communityName && (
          <Typography variant="overline" as="span" style={{ fontSize: "var(--text-xs)" }}>
            {communityName}
          </Typography>
        )}
        <Heading level="h1" size="2xl">
          {name}
        </Heading>
      </AssetHeading>
      <Button
        as={NextLink}
        /*  Because EDS types href as string */
        /* @ts-ignore */
        href={{
          pathname: "/checkout/terms",
          query: { id },
        }}
      >
        <Icon data={key} />
        {intl.formatMessage({ id: "asset.getAccess" })}
      </Button>
    </Header>
  )
}
