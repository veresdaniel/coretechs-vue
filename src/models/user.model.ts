export default interface User {
  id?: number,
  firstName: string,
  lastName: string,
  email?: string,
  isActive: boolean,
  creationDate?: string
}