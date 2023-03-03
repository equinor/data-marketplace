// @TODO: Update this when the indexer is done
const dataSetName = "Data_Set"

export type BusinessArea = {
  name: string
  searchTerm?: string
  inactive?: boolean
}

export const businessAreas: BusinessArea[] = [
  {
    name: "Marketing & Supply",
    searchTerm: `${dataSetName}%5BrefinementList%5D%5Bcommunity%5D%5B0%5D=Marketing%20and%20Supply`,
  },
  {
    name: "Renewables",
    searchTerm: `${dataSetName}%5BrefinementList%5D%5Bcommunity%5D%5B0%5D=Renewables`,
  },
  {
    name: "Subsurface",
    searchTerm: `${dataSetName}%5BrefinementList%5D%5Bcommunity%5D%5B0%5D=Subsurface`,
  },
  {
    name: "More coming soon...",
    inactive: true,
  },
]
