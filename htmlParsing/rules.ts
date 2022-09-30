import { v4 as uuidv4 } from "uuid"

const findElementByTagName = (el: HTMLElement, tagName: string) => Array.from(el.children).find(
  (child) => child.tagName.toLowerCase() === tagName,
)

const findTableRows = (el: HTMLTableSectionElement, cellType: string) => (Array
  .from(el.children).map((row) => {
    const cells = Array.from(row.children).map((cell) => ({
      _type: cellType,
      text: cell.textContent,
      key: uuidv4(),
    }))
    return {
      _type: "tr",
      cells,
      key: uuidv4(),
    }
  }))

export const rules = [
  {
    deserialize(el: HTMLElement, next: any, block: any) {
      if (el.tagName.toLowerCase() !== "table") {
        return undefined
      }
      const thead = findElementByTagName(el, "thead")
      const tbody = findElementByTagName(el, "tbody")

      const headerRow = thead && findTableRows(thead as HTMLTableSectionElement, "th")
      const rows = tbody && findTableRows(tbody as HTMLTableSectionElement, "td")

      return block({
        _type: "table",
        key: uuidv4(),
        headerRow,
        rows,
      })
    },
  },

]
