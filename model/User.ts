type UserInit = {
  id: string
  firstName: string
  lastName: string
  email: string
  createdAt: Date | number | string
  updatedAt: Date | number | string
}

export class User {
  id: string
  firstName: string
  lastName: string
  email: string
  createdAt: Date
  updatedAt: Date

  constructor(init: UserInit) {
    this.id = init.id
    this.firstName = init.firstName
    this.lastName = init.lastName
    this.email = init.email
    this.createdAt = new Date(init.createdAt)
    this.updatedAt = new Date(init.updatedAt)
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`
  }

  static fromCollibraUser(user: Collibra.User) {
    return new User({
      createdAt: user.createdOn,
      email: user.emailAddress.toLowerCase(),
      firstName: user.firstName,
      id: user.id,
      lastName: user.lastName,
      updatedAt: user.lastModifiedOn,
    })
  }
}
