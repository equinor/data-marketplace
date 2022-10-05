import { Icon } from "@equinor/eds-core-react"
import { image } from "@equinor/eds-icons"
import { tokens } from "@equinor/eds-tokens"
import { CSSProperties } from "react"
import styled from "styled-components"

// Since we don't have access to the real images from Collibra,
// this placeholder image is used to hightlight in the UI where
// the description actually contains an image
const PlaceholderImage = styled.div`
  background-color: ${tokens.colors.ui.background__medium.hsla};
  aspect-ratio: var(--width) / var(--height);
  display: grid;
  place-content: center;
`

export const Image = ({ value }: any) => {
  const width = value.width || 16
  const height = value.height || 9

  return (
    <PlaceholderImage style={{ "--height": height, "--width": width }as CSSProperties}>
      <Icon color={tokens.colors.ui.background__scrim.hsla} size={48} data={image} />
    </PlaceholderImage>
  )
}
