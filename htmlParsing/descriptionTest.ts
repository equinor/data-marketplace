import blockTools from "@sanity/block-tools"

import { descriptionSchema } from "./schema"

const blockContentType = descriptionSchema.get("description")
  .fields.find((field: any) => field.name === "body").type

export const getPortableText = (html: string) => (
  blockTools.htmlToBlocks(
    html,

    blockContentType,

  )
)
