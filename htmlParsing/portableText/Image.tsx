// @todo look into next/future/image instead
import NextImage from "next/image"

export const Image = ({ value }: any) => {
  const whereToPutThis = "https://equinor.collibra.com"

  return (
    <>
      <NextImage width={value.width} height={value.height} src={`${whereToPutThis}${value.src}`} alt={value.alt} />
      <NextImage width="748" height="421" src="https://gfx.nrk.no/F-I2RjmBMg24C4ZJapNjYQZPhuKgx9GI-IXKS4255xWw.jpg" alt="I'm from NRK" />
    </>
  )
}
