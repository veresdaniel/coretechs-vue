import { useAppStore } from "@/stores/app";

export const appService = {
  initialize() {
    const appStore = useAppStore();
    const defaultLocale = 'hu';
    const savedLocale = appStore.app.currentLanguage ?? defaultLocale;
    console.log(savedLocale)
  },
};
