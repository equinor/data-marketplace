// @TODO Not able to figure out exactly the types
export const isEmpty = (children: any[]) =>
  children.every((child) => child.length === 0 || child === String.fromCharCode(160))
