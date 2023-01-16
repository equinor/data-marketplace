declare namespace Collibra {
  export type Community = Resource & {
    name: string
    description: string
  }

  export interface PagedResponse<T = any> {
    total: number
    offset: number
    limit: number
    results: T[]
  }

  export interface PagedCommunityResponse extends PagedResponse<Community> {}
}
