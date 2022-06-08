/**
 * Appends a given community ID to the given filters, if any.
 * If no existing filters are provided, it will simply return the given community ID.
 * If the existing filters are a string, the function will return the updated filters as
 * an array of strings.
 * If the existing filters are an array, the given community ID will be pushed to the filters array.
 * If the given ID is in the filters, it will be removed.
 * @param id The community ID
 * @param communities The existing filters
 * @returns The updated query parameter with the given community ID added
 */
export const handleCommunityFilterUpdate = (id: string, communities?: string | string[]) => {
  let filters = communities

  if (!filters) {
    filters = id
  } else if (typeof filters === "string") {
    if (filters === id) {
      filters = undefined
    } else {
      filters = [filters, id]
    }
  } else {
    const existingIdx = filters.findIndex((f) => f === id)
    if (existingIdx === -1) {
      filters.push(id)
    } else {
      filters = [
        ...filters.slice(0, existingIdx),
        ...filters.slice(existingIdx + 1, filters.length),
      ]
    }
  }

  return filters
}
