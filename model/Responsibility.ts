type ResponsibilityOwner = {
  id: string
  type: string
}

type ResponsibilityInit = {
  id: string
  name: string
  owner: ResponsibilityOwner
}

export class Responsibility {
  id: string
  name: string
  owner: ResponsibilityOwner

  constructor(init: ResponsibilityInit) {
    this.id = init.id
    this.name = init.name
    this.owner = init.owner
  }

  static fromCollibraResponsibility(data: Collibra.Responsibility) {
    return new Responsibility({
      id: data.id,
      name: data.role.name!,
      owner: {
        id: data.owner.id,
        type: data.owner.resourceType,
      },
    })
  }
}
