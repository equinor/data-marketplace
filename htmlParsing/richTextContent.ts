import blockTools from "@sanity/block-tools"
import jsdom from "jsdom"
import { v4 as uuidv4 } from "uuid"
import xss from "xss"

import { descriptionSchema } from "./schema"

const { JSDOM } = jsdom

const blockContentType = descriptionSchema.get("description")
  .fields.find((field: any) => field.name === "body").type

const rules = [
  {
    deserialize(el: any, next: any, block: any) {
      if (el.tagName.toLowerCase() !== "table") {
        return undefined
      }
      /* HTMLTableSectionElement */
      const tbody = Array.from(el.children).find(
        // @ts-ignore
        (child) => child.tagName.toLowerCase() === "tbody",
      )
      // @ts-ignore
      const rows = Array.from(tbody.children).map((child) => {
        // @ts-ignore
        const cells = Array.from(child.children).map((cell) => ({
          _type: "td",
          // @ts-ignore
          text: cell.textContent,
          key: uuidv4(),
        }))
        return {
          _type: "tr",
          cells,
          key: uuidv4(),
        }
      })

      return block({
        _type: "table",
        key: uuidv4(),
        rows,
      })
    },
  },

]

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
