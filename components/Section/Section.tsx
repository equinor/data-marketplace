import styled from "styled-components"

export const Section = styled.section`
  /* &:not(:last-child) { */
    margin-bottom: 2rem;

    @media screen and (min-width: 768px) {
      margin-bottom: 2.5rem;
    }

    @media screen and (min-width: 992px) {
      margin-bottom: 3.5rem;
    }

    @media screen and (min-width: 1200px) {
      margin-bottom: 5rem;
    }
  /* } */
`
