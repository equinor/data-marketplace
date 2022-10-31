declare type Optional<T> = T | null

declare namespace DataMarketplace {
  import { PortableTextBlock } from "@portabletext/types"

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

  export type Asset = Identifiable &
    Nameable &
    Dateable & {
      description: Optional<string> | PortableTextBlock[]
      domain: Optional<string>
      updateFrequency: Optional<string> | PortableTextBlock[]
      tags: Optional<Tag[]>
    }
}
