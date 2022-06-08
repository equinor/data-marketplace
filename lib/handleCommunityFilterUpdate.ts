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
