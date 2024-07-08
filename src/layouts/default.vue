<template>
  <v-app>
    <v-main>
      <v-container>
        <v-responsive>
          <v-row>
            <v-col cols="12">
              <div class="d-flex justify-space-between">
                <div class="d-inline-flex">
                  <div>
                    <router-link to="/">
                      <v-btn
                        :variant="
                          $router.currentRoute.value.fullPath === '/'
                            ? 'flat'
                            : 'tonal'
                        "
                        color="green"
                        class="mx-1"
                      >
                        <v-icon dark>mdi-home</v-icon>
                      </v-btn>
                    </router-link>
                  </div>
                  <div>
                    <router-link to="/stats">
                      <v-btn
                        :variant="
                          $router.currentRoute.value.fullPath === '/stats'
                            ? 'flat'
                            : 'tonal'
                        "
                        color="green"
                        class="mx-1"
                      >
                        {{ t("STATS.TITLE") }}</v-btn
                      >
                    </router-link>
                  </div>
                </div>
                <div class="d-inline-flex">
                  <div>
                    <v-btn
                      :variant="
                        appStore.app.currentLanguage === 'en'
                          ? 'flat'
                          : 'tonal'
                      "
                      color="blue"
                      @click="setLanguage('en')"
                      class="mx-1"
                      >{{ t('COMMON.ENGLISH') }}</v-btn
                    >
                    <v-btn
                      :variant="
                        appStore.app.currentLanguage === 'hu'
                          ? 'flat'
                          : 'tonal'
                      "
                      color="blue"
                      @click="setLanguage('hu')"
                      class="mx-1"
                      >{{ t('COMMON.HUNGARIAN') }}</v-btn
                    >
                  </div>
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
import router from "@/router";

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
