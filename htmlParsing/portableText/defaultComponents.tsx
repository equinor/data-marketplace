import { Typography } from "@equinor/eds-core-react"
import { PortableTextBlock } from "@portabletext/types"

export const defaultComponents = {
  block: {
    normal: ({ children }: PortableTextBlock) => (
      <Typography variant="body_long">
        {/*  eslint-disable-next-line react/jsx-no-useless-fragment */}
        <>{children}</>
      </Typography>
    ),
  },
}
