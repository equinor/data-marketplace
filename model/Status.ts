type StatusInit = {
  id: string
  name: string
  description: string
  createdAt: Date | number | string
  updatedAt: Date | number | string
}

export class Status {
  id: string
  name: string
  description: string
  createdAt: Date
  updatedAt: Date

  constructor(init: StatusInit) {
    this.id = init.id
    this.name = init.name
    this.description = init.description
    this.createdAt = new Date(init.createdAt)
    this.updatedAt = new Date(init.updatedAt)
  }

  static fromCollibraStatus(data: Collibra.Status) {
    return new Status({
      id: data.id,
      name: data.name!,
      description: data.description,
      createdAt: data.createdOn,
      updatedAt: data.lastModifiedOn,
    })
  }
}
