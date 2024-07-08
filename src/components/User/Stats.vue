<template>
  <v-container class="fill-height">
    <v-responsive class="my-10 fill-height mx-auto">
      <v-row>
        <v-col class="v-col-12 v-col-md-6">
          <v-card
            class="mx-auto"
            prepend-icon="mdi-account"
            :subtitle="t('STATS.ACTIVE_USERS_SUBTITLE')"
            width="100%"
          >
            <template v-slot:title>
              <span class="font-weight-black">{{
                t("STATS.ACTIVE_USERS")
              }}</span>
            </template>

            <v-card-text class="bg-surface-light pt-4">
              <h2>
                {{
                  t("STATS.ACTIVE_USER_COUNT", { count: activeUsers.length })
                }}
              </h2>
            </v-card-text>
          </v-card>
          <template
            v-for="u in groupUsersByMonogram(activeUsers)" :key="u"
          >
          <v-card class="my-4">
            <v-card-text>
              <div>{{ u.monogram }}: {{ u.count }}</div>
            </v-card-text>
          </v-card>
          </template>
        </v-col>
        <v-col class="v-col-12 v-col-md-6">
          <v-card
            class="mx-auto"
            prepend-icon="mdi-account-alert-outline"
            :subtitle="t('STATS.INACTIVE_USERS_SUBTITLE')"
            width="100%"
          >
            <template v-slot:title>
              <span class="font-weight-black">{{
                t("STATS.INACTIVE_USERS")
              }}</span>
            </template>

            <v-card-text class="bg-surface-light pt-4">
              <h2>
                {{
                  t("STATS.INACTIVE_USER_COUNT", {
                    count: inactiveUsers.length,
                  })
                }}
              </h2>
            </v-card-text>
          </v-card>
          <template
            v-for="u in groupUsersByMonogram(inactiveUsers)" :key="u"
          >
          <v-card class="my-4">
            <v-card-text>
              <div>{{ u.monogram }}: {{ u.count }}</div>
            </v-card-text>
          </v-card>
          </template>
        </v-col>
      </v-row>
    </v-responsive>
    {{ appStore.app.users }}
  </v-container>
</template>

<script setup lang="ts">
import User from "@/models/user.model";
import { useAppStore } from "@/stores/app";
import { useI18n } from "vue-i18n";

const { t } = useI18n({ inheritLocale: true });
const appStore = useAppStore();

const activeUsers = computed(() => {
  return appStore.app.users.filter(
    (u: { isActive: boolean }) => u.isActive === true
  );
});

const inactiveUsers = computed(() => {
  return appStore.app.users.filter(
    (u: { isActive: boolean }) => u.isActive === false
  );
});

function groupUsersByMonogram(users: User[]) {
  const monogramCounts = users.reduce((acc: any, user: User) => {
    const monogram = `${user.firstName[0]}.${user.lastName[0]}.`;

    if (acc[monogram]) {
      acc[monogram]++;
    } else {
      acc[monogram] = 1;
    }

    return acc;
  }, {});

  return Object.keys(monogramCounts).map((monogram) => ({
    monogram,
    count: monogramCounts[monogram],
  }));
}
</script>
