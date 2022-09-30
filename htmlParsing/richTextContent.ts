import blockTools from "@sanity/block-tools"
import jsdom from "jsdom"
import xss from "xss"

import { rules } from "./rules"
import { richTextSchema } from "./schema"

const { JSDOM } = jsdom

const blockContentType = richTextSchema.get("description")
  .fields.find((field: any) => field.name === "body").type

export const getPortableText = (html: string) => (
  blockTools.htmlToBlocks(
    html,
    blockContentType,
    {
      rules,
      parseHtml: (htmlAsString:string) => new JSDOM(xss(htmlAsString)).window.document,
    },
  )
)
