import { Search } from "@equinor/eds-core-react"
import { useState, useRef /* useEffect */ } from "react"
import { useSearchBox } from "react-instantsearch-hooks-web"
import { useIntl } from "react-intl"
import styled from "styled-components"

const StyledSearch = styled(Search)`
  --eds_ui_background__light: var(--white);
`

export const SearchBox = () => {
  const intl = useIntl()
  const { query, refine } = useSearchBox()

  const [inputValue, setInputValue] = useState(query)

  const inputRef = useRef<HTMLInputElement>(null)

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value
    setInputValue(newValue)
    refine(newValue)
  }

  // @TODO: To be discussed at some point
  /* 
  useEffect(() => {
    const timer = setTimeout(() => {
      if(query !== inputValue) {
        setInputValue(query), 1000)
      }
    }
    return () => clearTimeout(timer)
  }, [query]) */

  if (query !== inputValue && document.activeElement !== inputRef.current) {
    setInputValue(query)
  }

  return (
    <StyledSearch
      ref={inputRef}
      onChange={handleOnChange}
      value={inputValue}
      placeholder={intl.formatMessage({ id: "search.box.placeholder" })}
    />
  )
}
