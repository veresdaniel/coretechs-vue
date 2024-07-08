import router from "@/router";

export const appService = {
  initialize() {
    router.onError((error, to) => {
      if (error.message.includes('Failed to fetch dynamically imported module') || error.message.includes("Importing a module script failed")) {
        window.location.href = to.fullPath;
      }
    })
  },
};
