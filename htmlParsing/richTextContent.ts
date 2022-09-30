import blockTools from "@sanity/block-tools"
import jsdom from "jsdom"
import { v4 as uuidv4 } from "uuid"
import xss from "xss"

import { richTextSchema } from "./schema"

const { JSDOM } = jsdom

const blockContentType = richTextSchema.get("description")
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

      const thead = Array.from(el.children).find(
        // @ts-ignore
        (child) => child.tagName.toLowerCase() === "thead",
      )

      // @ts-ignore
      const headerRow = thead && Array.from(thead.children).map((row) => {
        // @ts-ignore
        const headCells = Array.from(row.children).map((headCell) => ({
          _type: "th",
          // @ts-ignore
          text: headCell.textContent,
          key: uuidv4(),
        }))
        return {
          _type: "tr",
          cells: headCells,
          key: uuidv4(),
        }
      })
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
        headerRow,
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
