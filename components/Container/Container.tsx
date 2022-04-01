import styled from "styled-components"

export const Container = styled.div`
  width: 100%;
  padding: 0 1rem;
  margin: 0 auto;

  @media screen and (min-width: 768px) {
    padding: 0 1.5rem;
  }

  @media screen and (min-width: 992px) {
    padding: 0 2rem;
    max-width: 70rem;
  }

  @media screen and (min-width: 1200px) {
    padding: 0 4rem;
    max-width: 80rem;
  }
`
