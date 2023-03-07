export type BusinessArea = {
  name: string
  searchTerm?: (indexName: string) => string
  inactive?: boolean
}

export const businessAreas: BusinessArea[] = [
  {
    name: "Marketing & Supply",
    searchTerm: (indexName) => `${indexName}%5BrefinementList%5D%5Bcommunity%5D%5B0%5D=Marketing%20and%20Supply`,
  },
  {
    name: "Renewables",
    searchTerm: (indexName) => `${indexName}%5BrefinementList%5D%5Bcommunity%5D%5B0%5D=Renewables`,
  },
  {
    name: "Subsurface",
    searchTerm: (indexName) => `${indexName}%5BrefinementList%5D%5Bcommunity%5D%5B0%5D=Subsurface`,
  },
  {
    name: "More coming soon...",
    inactive: true,
  },
]
