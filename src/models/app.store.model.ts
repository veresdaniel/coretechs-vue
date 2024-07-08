import User from "./user.model"

export default interface AppStore {
  currentLanguage: string,
  users: User[]
}