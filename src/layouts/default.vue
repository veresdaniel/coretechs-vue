<template>
  <v-app>
    <v-main>
      <v-container>
        <v-responsive>
          <v-row>
            <v-col cols="12">
              <div class="justify-space-between">
                <div class="d-inline-flex">
                  <router-link to="/">
                    <v-btn variant="tonal" color="blue" class="mx-1">
                      <v-icon dark>mdi-home</v-icon>
                    </v-btn>
                  </router-link>
                </div>
                <div class="d-inline-flex">
                  <v-btn
                    variant="tonal"
                    color="blue"
                    @click="setLanguage('en')"
                    class="mx-1"
                    >English</v-btn
                  >
                  <v-btn
                    variant="tonal"
                    color="blue"
                    @click="setLanguage('hu')"
                    class="mx-1"
                    >Hungarian</v-btn
                  >
                </div>
                <div class="d-inline-flex mx-1">
                  <router-link to="/stats">
                    <v-btn variant="tonal" color="blue">{{
                      t("STATS.TITLE")
                    }}</v-btn>
                  </router-link>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-responsive>
      </v-container>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { watchEffect } from "vue";
import { useAppStore } from "@/stores/app";

const { t } = useI18n({ inheritLocale: true });
const { locale } = useI18n();
const appStore = useAppStore();

const setLanguage = (newLang: string) => {
  locale.value = newLang;
  appStore.setLocale(newLang);
};

watchEffect(() => {
  const storedLang = appStore.app.currentLanguage;
  if (storedLang) {
    locale.value = storedLang;
  }
});
</script>
