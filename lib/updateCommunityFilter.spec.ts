import { updateCommunityFilter } from "./updateCommunityFilter"

describe("handleCommunityFilterUpdate", () => {
  test("should return given ID when provided with undefined query", () => {
    const id = "abc123"

    expect(updateCommunityFilter(id)).toBe(id)
  })

  test("should return array when adding id to single query param", () => {
    const id = "def123"
    const q = "abc123"
    const r = updateCommunityFilter(id, q)

    expect(r).toBeInstanceOf(Array)
    expect(r!.includes(q)).toBe(true)
    expect(r!.includes(id)).toBe(true)
  })

  test("should return array containing two IDs when adding ID to query param array", () => {
    const id = "ghi123"
    const q = ["abc123", "def123"]
    const r = updateCommunityFilter(id, q)

    expect(r).toBeInstanceOf(Array)
    expect(r!.includes(q[0])).toBe(true)
    expect(r!.includes(q[1])).toBe(true)
    expect(r!.includes(id)).toBe(true)
  })

  test("should return undefined when removing ID matching single string query param", () => {
    const id = "abc123"

    expect(typeof updateCommunityFilter(id, id)).toBe("undefined")
  })

  test("should remove ID from query param array", () => {
    const id = "def123"
    const q = ["abc123", "def123"]
    const r = updateCommunityFilter(id, q)

    expect(r!.includes(q[0])).toBe(true)
    expect(r!.includes(id)).toBe(false)
  })
})
