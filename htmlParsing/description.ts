// This file can probably be a more general concept then "description"
// but using description as a start. Can probably be a richTextField

import blockTools from "@sanity/block-tools"
import jsdom from "jsdom"
import xss from "xss"

import { descriptionSchema } from "./schema"

const { JSDOM } = jsdom

const blockContentType = descriptionSchema.get("description")
  .fields.find((field: any) => field.name === "body").type

export const getPortableText = (html: string) => (
  blockTools.htmlToBlocks(
    html,
    blockContentType,
    {
      parseHtml: (htmlAsString:string) => new JSDOM(xss(htmlAsString)).window.document,
    },
  )
)
