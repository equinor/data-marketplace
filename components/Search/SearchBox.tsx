import { useState, useRef /* useEffect */ } from "react"
import { useSearchBox } from "react-instantsearch-hooks-web"
import { useIntl } from "react-intl"
import styled from "styled-components"

const Input = styled.input`
  background-color: var(--white);
  border: 2px solid var(--moss-green-100);
  padding: 2rem;
  font-size: var(--typeScale-1);
  width: 100%;
  color: black;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 1px var(--white);
  }

  }
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
    <form action="" role="search" noValidate>
      <Input
        id="site-search"
        ref={inputRef}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        maxLength={512}
        type="search"
        value={inputValue}
        onChange={handleOnChange}
        placeholder={intl.formatMessage({ id: "search.box.placeholder" })}
        /*      onInput={handleReset} */
      />
    </form>
  )
}
