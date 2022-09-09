declare type AdapterFn<T, R> = (v: T) => R

declare type Optional<T> = T | null

declare namespace DataMarketplace {
  type Identifiable = {
    id: string
  }

  type Nameable = {
    name: string
  }

  type Dateable = {
    createdAt: Optional<Date>
    updatedAt: Optional<Date>
  }

  export type Tag = Identifiable & Nameable

  export type Asset = Identifiable & Nameable & Dateable & {
    description?: string
    domain?: string
    tags?: Tag[]
  }
}
