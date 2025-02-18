import { defineStore } from 'pinia'
import User from '@/models/user.model'
import AppStore from '@/models/app.store.model';
import {v4 as uuidv4} from 'uuid';

export const useAppStore = defineStore('app', {
  state: () => ({
    app: JSON.parse(localStorage.getItem("app") ?? '{"currentLanguage": "en", "users": []}') as AppStore,
  }),
  actions: {
    persistToLocalStorage() {
      localStorage.setItem("app", JSON.stringify(this.app));
    },
    addUser(user: User) {
      this.app.users.push({ ...user, id: uuidv4(), creationDate: new Date().toISOString() });
      this.persistToLocalStorage();
    },
    updateUser(updatedUser: User) {
       this.app.users = this.app.users.map((obj) => {
        return obj.id === updatedUser.id ? {...updatedUser} : obj
      }
    );
      this.persistToLocalStorage();
    },
    deleteUser(userId: string) {
      this.app.users = this.app.users.filter((object) => {
        return object.id !== userId;
      });
      this.persistToLocalStorage();
    },

    setLocale(languageCode: string) {
      this.app.currentLanguage = languageCode;
      this.persistToLocalStorage();
    },

    deleteAllUsers() {
      this.app.users = [];
      this.persistToLocalStorage();
    }
  },
})
