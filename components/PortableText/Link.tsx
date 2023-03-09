/* eslint-disable camelcase */
import { Icon } from "@equinor/eds-core-react"
import { external_link, email, link } from "@equinor/eds-icons"
import type { PortableTextLink } from "@portabletext/types"
import styled from "styled-components"

const IconLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 2px;
`
const getIconData = (href: string) => {
  if (href.startsWith("http")) {
    return external_link
  }
  if (href.startsWith("mailto")) {
    return email
  }
  return link
}

export const Link = ({ value, children }: { value: PortableTextLink; children: React.ReactNode }) => {
  const { href } = value
  // Adding this temporarily to make it easier to see internal links
  if (href.startsWith("/")) {
    /* eslint-disable no-console */
    console.warn("Internal link", href)
  }
  return (
    <IconLink href={href}>
      {children}
      <Icon data={getIconData(href)} size={16} />
    </IconLink>
  )
}
