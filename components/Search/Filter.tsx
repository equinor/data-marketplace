import {
  EdsProvider,
  Checkbox,
  List,
} from "@equinor/eds-core-react"
import { tokens } from "@equinor/eds-tokens"
import { useRouter } from "next/router"
import { useState, useEffect, FunctionComponent } from "react"
import styled from "styled-components"

import { HttpClient } from "lib/HttpClient"
import { updateCommunityFilter } from "lib/updateCommunityFilter"

const { Item } = List

const CheckboxContainer = styled.div`
display: flex;
flex-wrap: wrap;
flex-direction: column;
grid-gap:${tokens.spacings.comfortable.x_small};
`

const UnstyledList = styled(List)`
  list-style: none;
  padding: 0; 
`

type Props = {
  disabled: boolean
}

export const Filter: FunctionComponent<Props> = ({ disabled }) => {
  const [communities, setCommunities] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    (async () => {
      try {
        const { body } = await HttpClient.get("/api/communities")
        setCommunities(body)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("[Search] Failed fetching communities", error)
      }
    })()
  }, [])
  const onCommunityFilterClick = (id: string) => {
    const filters = updateCommunityFilter(id, router.query.community)
    router.push({
      pathname: router.pathname,
      query: { ...router.query, community: filters },
    })
  }

  return (
    <CheckboxContainer>
      <EdsProvider density="compact">
        {communities?.map((community) => (
          <UnstyledList key={community.id}>
            <Item>
              <Checkbox
                disabled={disabled}
                label={community.name}
                key={community.id}
                checked={!!router.query.community?.includes(community.id)}
                onChange={() => onCommunityFilterClick(community.id)}
              />
            </Item>
          </UnstyledList>
        ))}
      </EdsProvider>
    </CheckboxContainer>
  )
}
