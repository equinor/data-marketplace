import { updateCommunityFilter } from "./updateCommunityFilter"

describe("handleCommunityFilterUpdate", () => {
  test("should return given ID when provided with undefined query", () => {
    const id = "abc123"
    expect(updateCommunityFilter(id)).toBe(id)
  })

  test("should return array when adding id to single query param", () => {
    const id = "def123"
    const q = "abc123"
    const r = updateCommunityFilter(id, q) as string[]

    expect(r).toBeInstanceOf(Array)
    expect(r[0]).toBe(q)
    expect(r[1]).toBe(id)
  })

  test("should return array containing two IDs when adding ID to query param array", () => {
    const id = "ghi123"
    const q = ["abc123", "def123"]
    const r = updateCommunityFilter(id, q) as string[]

    expect(r).toBeInstanceOf(Array)
    expect(r[0]).toBe(q[0])
    expect(r[1]).toBe(q[1])
    expect(r[2]).toBe(id)
  })
})
