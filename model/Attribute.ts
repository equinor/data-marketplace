type AttributeInit = {
  id: string
  value: string
  type: string
  createdAt: Date | string | number
  updatedAt: Date | string | number
}

export class Attribute {
  id: string
  value: string
  type: string
  createdAt: Date
  updatedAt: Date

  constructor(init: AttributeInit) {
    this.id = init.id
    this.value = init.value
    this.type = init.type
    this.createdAt = new Date(init.createdAt)
    this.updatedAt = new Date(init.updatedAt)
  }

  static fromCollibraAttribute(data: Collibra.Attribute) {
    return new Attribute({
      id: data.id,
      value: data.value,
      type: data.type.name,
      createdAt: data.createdOn,
      updatedAt: data.lastModifiedOn,
    })
  }
}
