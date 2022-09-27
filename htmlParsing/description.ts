// This file can probably be a more general concept then "description"
// but using description as a start. Can probably be a richTextField

import blockTools from "@sanity/block-tools"

import { descriptionSchema } from "./schema"

const jsdom = require("jsdom")

const { JSDOM } = jsdom

const blockContentType = descriptionSchema.get("description")
  .fields.find((field: any) => field.name === "body").type

export const getPortableText = (html: string) => (
  blockTools.htmlToBlocks(
    html,
    blockContentType,
    {
      parseHtml: (htmlAsString:string) => new JSDOM(htmlAsString).window.document,
    },
  )
)
