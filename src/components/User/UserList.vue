<template>
  <v-container class="fill-height">
    <v-responsive class="my-10 fill-height mx-auto">
      <v-row>
        <v-col cols="12">
          <v-data-table-server
            v-model:items-per-page="itemsPerPage"
            :headers="headers"
            :items="serverItems"
            :items-length="totalItems"
            :loading="loading"
            :search="search"
            mobile-breakpoint="md"
            item-value="name"
            @update:options="loadItems"
          >
            <template v-slot:item="row">
              <tr>
                <td>{{ row.item.id }}</td>
                <td v-if="appStore.app.currentLanguage === 'en'">
                  {{ row.item.firstName }} {{ row.item.lastName }}
                </td>
                <td v-if="appStore.app.currentLanguage === 'hu'">
                  {{ row.item.lastName }} {{ row.item.firstName }}
                </td>
                <td>{{ row.item.email }}</td>
                <td>
                  <v-checkbox
                    v-model="row.item.isActive"
                    disabled
                    hide-details="true"
                  ></v-checkbox>
                </td>
                <td class="text-right">
                  <v-btn class="mx-1 my-1" fab dark small color="green"  @click="editUser(row.item)">
                    <v-icon dark>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn class="mx-1 my-1" fab dark small color="red" @click="showDeleteConfirmation(row.item.id)">
                    <v-icon dark>mdi-trash-can</v-icon>
                  </v-btn>
                </td>
              </tr>
            </template>
          </v-data-table-server>

          <v-dialog v-model="dialog" max-width="600">
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn
                class="text-none font-weight-regular"
                prepend-icon="mdi-account"
                :text="t('USER_LIST.BUTTON.ADD_USER')"
                variant="tonal"
                v-bind="activatorProps"
              ></v-btn>
            </template>
            <v-form v-model="form" @submit.prevent="onSubmit">
              <v-card
                prepend-icon="mdi-account"
                :title="
                  user.id
                    ? t('USER_LIST.DIALOG.TITLE_EDIT')
                    : t('USER_LIST.DIALOG.TITLE_NEW')
                "
              >
                <v-card-text>
                  <v-row>
                    <v-col cols="6">
                      <v-text-field
                        v-model="user.firstName"
                        :label="t('USER_LIST.DIALOG.LABEL.FIRST_NAME')"
                        :rules="[required]"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        v-model="user.lastName"
                        :label="t('USER_LIST.DIALOG.LABEL.LAST_NAME')"
                        :rules="[required]"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="user.email"
                        type="email"
                        :label="t('USER_LIST.DIALOG.LABEL.EMAIL')"
                        :rules="[required]"
                      >
                      </v-text-field>
                      <v-checkbox
                        v-model="user.isActive"
                        :label="t('USER_LIST.DIALOG.LABEL.IS_ACTIVE')"
                      >
                      </v-checkbox>
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    :disabled="!form"
                    :text="t('COMMON.BUTTON.SAVE')"
                    variant="plain"
                    type="submit"
                  ></v-btn>
                  <v-btn
                    color="primary"
                    :text="t('COMMON.BUTTON.CANCEL')"
                    variant="tonal"
                    @click="closeDialog"
                  ></v-btn>
                </v-card-actions>
              </v-card>
            </v-form>
          </v-dialog>

          <v-dialog v-model="confirmDeleteDialog" max-width="600">
            <v-card
                prepend-icon="mdi-trash-can"
                :title="t('USER_LIST.DIALOG.TITLE_DELETE')">
                <v-card-text>
                  <v-row>
                    <v-col cols="12">
                      {{ t('USER_LIST.DIALOG.CONTENT.DELETE') }}
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    :text="t('COMMON.BUTTON.DELETE')"
                    variant="plain"
                    @click="deleteUser"
                  ></v-btn>
                  <v-btn
                    color="primary"
                    :text="t('COMMON.BUTTON.CANCEL')"
                    variant="tonal"
                    @click="confirmDeleteDialog = false"
                  ></v-btn>
                </v-card-actions>
              </v-card>
          </v-dialog>

          <v-dialog v-model="confirmDeleteAllDialog" max-width="600">
            <v-card
                prepend-icon="mdi-trash-can"
                :title="t('USER_LIST.DIALOG.TITLE_DELETE_ALL')">
                <v-card-text>
                  <v-row>
                    <v-col cols="12">
                      {{ t('USER_LIST.DIALOG.CONTENT.DELETE_ALL') }}
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    :text="t('COMMON.BUTTON.DELETE')"
                    variant="plain"
                    @click="deleteAllUsers"
                  ></v-btn>
                  <v-btn
                    color="primary"
                    :text="t('COMMON.BUTTON.CANCEL')"
                    variant="tonal"
                    @click="confirmDeleteAllDialog = false"
                  ></v-btn>
                </v-card-actions>
              </v-card>
          </v-dialog>

          <v-btn
            class="text-none font-weight-regular mx-2"
            color="red"
            prepend-icon="mdi-delete"
            :text="t('USER_LIST.BUTTON.DELETE_ALL_USER')"
            variant="tonal"
            @click="confirmDeleteAllDialog = true"
          ></v-btn>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
  <v-snackbar
      :text="notificationText"
      v-model="snackbar"
    >
      <template v-slot:actions>
        <v-btn
          color="pink"
          variant="text"
          @click="snackbar = false"
        >
          {{ t('COMMON.BUTTON.CLOSE') }}
        </v-btn>
      </template>
    </v-snackbar>
</template>



<script setup lang="ts">
import { useAppStore } from "@/stores/app";
import { UserService } from "@/services/user.service";
import { useI18n } from "vue-i18n";
import User from "@/models/user.model";

const { t } = useI18n({ inheritLocale: true });
const form = ref(false);
const editMode = ref(false);
const snackbar = ref(false);
const notificationText = ref("");
const selectedUserId = ref(-1);
const itemsPerPage = ref(10);
const search: Ref<string> = ref("");
const serverItems: Ref<[]> = ref([]);
const loading: Ref<boolean> = ref(true);
const totalItems: Ref<number> = ref(0);

const user: User = reactive({
  id: undefined,
  firstName: '',
  lastName: '',
  email: '',
  isActive: true,
  creationDate: undefined
});

const dialog = ref(false);
const confirmDeleteDialog = ref(false);
const confirmDeleteAllDialog = ref(false);

const headers = ref([
  { title: t("USER_LIST.TABLE.HEADER.ID"), key: "id", align: "start" },
  { title: t("USER_LIST.TABLE.HEADER.NAME"), key: "name", align: "start" },
  { title: t("USER_LIST.TABLE.HEADER.EMAIL"), key: "email", align: "start" },
  {
    title: t("USER_LIST.TABLE.HEADER.IS_ACTIVE"),
    key: "isActive",
    align: "start",
  },
  { title: t("USER_LIST.TABLE.HEADER.ACTIONS"), key: "actions", align: "end" },
]);

const appStore = useAppStore();

watch(
  () => appStore.app.currentLanguage,
  async () => {
    headers.value = [
      { title: t("USER_LIST.TABLE.HEADER.ID"), key: "id", align: "start" },
      { title: t("USER_LIST.TABLE.HEADER.NAME"), key: "name", align: "start" },
      {
        title: t("USER_LIST.TABLE.HEADER.EMAIL"),
        key: "email",
        align: "start",
      },
      {
        title: t("USER_LIST.TABLE.HEADER.IS_ACTIVE"),
        key: "isActive",
        align: "start",
      },
      {
        title: t("USER_LIST.TABLE.HEADER.ACTIONS"),
        key: "actions",
        align: "end",
      },
    ];
  }
);

function loadItems({ page, itemsPerPage, sortBy }) {
  loading.value = true;
  UserService.getUsers({ page, itemsPerPage, sortBy }).then(
    ({ items, total }) => {
      serverItems.value = items;
      totalItems.value = total;
      loading.value = false;
    }
  );
}

function onSubmit() {
  if (!form.value) return;
  if (editMode.value === true) {
    UserService.updateUser(user as User)
    notificationText.value = t('COMMON.MESSAGE.SUCCESFULLY_UPDATED');
    showSnackbar();
  } else {
    UserService.postUser(user as User);
    notificationText.value = t('COMMON.MESSAGE.SUCCESFULLY_CREATED');
  }
  closeDialog();
  refreshDataTable();
}

function resetForm() {
  user.firstName = '';
  user.lastName = '';
  user.email = '';
  user.isActive = true;
}

function closeDialog() {
  dialog.value = false;
  editMode.value = false;
  resetForm();
}

function required(v: string) {
  //TODO: Translate error.
  return !!v || t("COMMON.ERROR.REQUIRED");
}

function editUser(userData: User) {
  user.id = userData.id;
  user.firstName = userData.firstName
  user.lastName = userData.lastName
  user.email = userData.email;
  user.isActive = userData.isActive;
  dialog.value = true;
  editMode.value = true;
}

function showDeleteConfirmation(userId: number) {
  confirmDeleteDialog.value = true;
  selectedUserId.value = userId;
}

function deleteUser() {
  UserService.deleteUser(selectedUserId.value);
  confirmDeleteDialog.value = false;
  refreshDataTable();
}

function deleteAllUsers() {
  appStore.deleteAllUsers();
  confirmDeleteAllDialog.value = false;
  refreshDataTable();
}

function refreshDataTable() {
  loadItems({ page: 1, itemsPerPage: itemsPerPage.value, sortBy: [] });
}

function showSnackbar() {
  snackbar.value = true;
  setTimeout(() => {
    snackbar.value = false;
  }, 3000)
}
</script>