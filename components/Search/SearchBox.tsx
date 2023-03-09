import { Search } from "@equinor/eds-core-react"
import { tokens } from "@equinor/eds-tokens"
import { useState } from "react"
import { useSearchBox } from "react-instantsearch-hooks-web"
import { useIntl } from "react-intl"
import styled from "styled-components"

const StyledSearch = styled(Search)`
  --eds_ui_background__light: ${tokens.colors.ui.background__default.hsla};
`

export const SearchBox = () => {
  const intl = useIntl()
  const { query, refine } = useSearchBox()
  const [inputValue, setInputValue] = useState(query)

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value
    setInputValue(newValue)
    refine(newValue)
  }
  return (
    <StyledSearch
      onChange={handleOnChange}
      value={inputValue}
      placeholder={intl.formatMessage({ id: "improvedSearch.box.placeholder" })}
    />
  )
}
