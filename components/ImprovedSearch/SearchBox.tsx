import { Search, Icon } from "@equinor/eds-core-react"
import { search } from "@equinor/eds-icons"
import { tokens } from "@equinor/eds-tokens"
import { useState } from "react"
import { SearchBox as AlgoliaSearchBox, useSearchBox } from "react-instantsearch-hooks-web"
import styled from "styled-components"

const StyledAlgoliaSearchBox = styled(AlgoliaSearchBox)`
  color: ${tokens.colors.text.static_icons__default};
  & form {
    width: 100%;
    position: relative;
    --eds-input-adornment-color: var(--eds_text__static_icons__tertiary, rgba(111, 111, 111, 1));
    --eds-input-color: var(--eds_text__static_icons__default, rgba(61, 61, 61, 1));
    position: relative;
    height: 36px;
    width: 100%;
    border: none;
    box-sizing: border-box;
    box-shadow: inset 0px -1px 0px 0px var(--eds_text__static_icons__tertiary, rgba(111, 111, 111, 1));
    background: var(--eds_ui_background__light, rgba(247, 247, 247, 1));
    outline: 1px solid transparent;
    outline-offset: 0px;
  }

  & .ais-SearchBox-input {
    appearance: none;
    width: 100%;
    position: relative;
    border: none;
    background: transparent;
    padding-left: 40px;
    padding-top: 6px;
    padding-right: 40px;
    padding-bottom: 6px;
    font-family: Equinor;
    font-size: 1rem;
    font-weight: 400;
    letter-spacing: 0.025em;
    line-height: 1.5em;
    outline: none;
    padding-left: 40px;
    padding-right: 40px;
  }
  & .ais-SearchBox-submit {
    appearance: none;
    position: absolute;
    z-index: 1;
    top: 50%;
    left: 0.3rem;
    transform: translateY(-50%);
    padding: 0;
    overflow: visible;
    font: inherit;
    line-height: normal;
    color: inherit;
    background: 0 0;
    border: 0;
    cursor: pointer;
    user-select: none;
  }
`
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const SearchBox = () => {
  const { query, refine } = useSearchBox()
  const [inputValue, setInputValue] = useState(query)

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value
    setInputValue(newValue)
    refine(newValue)
  }
  // eslint-disable-next-line react/jsx-props-no-spreading
  return (
    <Wrapper>
      <StyledAlgoliaSearchBox
        /*  eslint-disable-next-line react/no-unstable-nested-components */
        submitIconComponent={() => <Icon size={18} data={search} />}
        placeholder="Algolia component"
      />

      <Search onChange={handleOnChange} value={inputValue} placeholder="EDS component" />
      <input type="search" placeholder="Native search" onChange={handleOnChange} value={inputValue} />
    </Wrapper>
  )
}
