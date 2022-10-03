// @todo look into next/future/image instead
import NextImage from "next/image"

export const Image = ({ value }: any) => {
  const whereToPutThis = "https://equinor.collibra.com"

  return (
    /* Random fallback aspect because some of the images didn't have this information -> boom */
    <NextImage width={value.width || 500} height={value.height || 300} src={`${whereToPutThis}${value.src}`} alt={value.alt} />
  )
}
