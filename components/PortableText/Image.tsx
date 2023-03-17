import { Icon } from "@equinor/eds-core-react"
import { image } from "@equinor/eds-icons"
import { CSSProperties } from "react"
import styled from "styled-components"

// Since we don't have access to the real images from Collibra,
// this placeholder image is used to hightlight in the UI where
// the description actually contains an image
const PlaceholderImage = styled.div`
  background-color: var(--medium-grey);
  aspect-ratio: var(--width, 16) / var(--height, 9);
  display: grid;
  place-content: center;
`

export const Image = ({ value }: any) => {
  const { width } = value
  const { height } = value

  return (
    <PlaceholderImage style={{ "--height": height, "--width": width } as CSSProperties}>
      <Icon color="var(--charcoal )" size={48} data={image} />
    </PlaceholderImage>
  )
}
