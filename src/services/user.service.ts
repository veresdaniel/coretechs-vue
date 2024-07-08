import User from "@/models/user.model";
import { useAppStore } from "@/stores/app";

interface SortBy {
  key: string;
  order: 'asc' | 'desc';
}

interface GetUsersParams {
  page: number;
  itemsPerPage: number;
  sortBy: SortBy[];
}

interface PaginatedResult {
  items: User[];
  total: number;
}

export const UserService = {

  async getUsers({ page, itemsPerPage, sortBy }: GetUsersParams): Promise<PaginatedResult> {
    const appStore = useAppStore();

    return new Promise((resolve) => {
      setTimeout(() => {
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const items = appStore.app.users.slice();

        if (sortBy.length) {
          const sortKey = sortBy[0].key;
          const sortOrder = sortBy[0].order;
          items.sort((a: any, b: any) => {
            const aValue = a[sortKey];
            const bValue = b[sortKey];
            return sortOrder === "desc" ? bValue - aValue : aValue - bValue;
          });
        }

        const paginated = items.slice(start, end);
        resolve({ items: paginated, total: items.length });
      }, 500);
    });
  },
  async postUser(user: User) {
    const appStore = useAppStore();

    return new Promise((resolve) => {
      appStore.addUser(user as User);
      resolve("success");
    })
  },

  async updateUser(user: User) {
    const appStore = useAppStore();
    appStore.updateUser(user as User);

    return new Promise((resolve) => {
      resolve("success");
    })
  },

  async deleteUser(userId: number) {
    const appStore = useAppStore();

    return new Promise((resolve) => {
      appStore.deleteUser(userId);
      resolve("success");
    })
  },
}
