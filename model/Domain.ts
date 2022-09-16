type DomainInit = {
  id: string
  name: string
  description: string
  createdAt: Date | number | string
  updatedAt: Date | number | string
}

export class Domain {
  id: string
  name: string
  description: string
  createdAt: Date
  updatedAt: Date

  constructor(init: DomainInit) {
    this.id = init.id
    this.name = init.name
    this.description = init.description
    this.createdAt = new Date(init.createdAt)
    this.updatedAt = new Date(init.updatedAt)
  }

  static fromCollibraDomain(data: Collibra.Domain) {
    return new Domain({
      id: data.id,
      name: data.name!,
      description: data.description,
      createdAt: data.createdOn,
      updatedAt: data.lastModifiedOn,
    })
  }
}
