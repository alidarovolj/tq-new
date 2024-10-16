<script setup>
import { ref } from "vue";
import axios from "axios";
import { useOrdersStore } from "~/stores/orders";
import { useNotificationStore } from "~/stores/notifications";
import { useModalsStore } from "~/stores/modals";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";

const orders = useOrdersStore();
const notifications = useNotificationStore();
const modals = useModalsStore();
const loading = ref(false);
const route = useRoute();
const runtimeConfig = useRuntimeConfig();
const auth = useAuthStore();
auth.initCookieToken();
const { token } = storeToRefs(auth);

const form = ref({
  id: modals.modal.modalData.id, // Preset id from modal data if available
  reason: "",
  file: null,
});

const v$ = useVuelidate(
  {
    reason: { required },
  },
  form
);

const makeReturn = async () => {
  loading.value = true;
  await v$.value.$validate();

  if (v$.value.$error) {
    notifications.showNotification(
      "error",
      "Данные не заполнены",
      "Проверьте правильность введенных данных и попробуйте снова."
    );
    loading.value = false;
    return;
  }

  const formData = new FormData();
  formData.append("id", form.value.id);
  formData.append("reason", form.value.reason);
  if (form.value.file) {
    formData.append("file", form.value.file);
  }

  try {
    const response = await axios.post(
      `https://api-new.gazbas.kz/api/orders/my-orders/${modals.modal.modalData.id}/return`,
      formData,
      {
        params: route.query,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token.value}`,
        },
      }
    );

    if (response.status === 200) {
      await orders.getOrders();
      modals.modal.show = false;
      notifications.showNotification(
        "success",
        "Успешно",
        "Заявка на возврат отправлена."
      );
    }
  } catch (error) {
    console.error(error);
    notifications.showNotification(
      "error",
      "Ошибка",
      "Не удалось отправить заявку на возврат."
    );
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div>
    <p class="text-xl font-semibold mb-6">Оформление возврата</p>
    <p>
      Для оформления возврата пожалуйста предоставьте данные и причину возврата.
      Мы рассмотрим вашу заявку в течение дня.
    </p>
    <form @submit.prevent="makeReturn">
      <div class="mt-6">
        <label for="reason" class="block text-sm font-medium text-gray-700">
          Причина возврата
        </label>
        <textarea
          id="reason"
          v-model="form.reason"
          placeholder="Введите причину возврата"
          name="reason"
          rows="3"
          class="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          :class="{ '!border-red-500': v$.reason.$error }"
        ></textarea>
      </div>
      <div class="mt-6">
        <label for="file" class="block text-sm font-medium text-gray-700 mb-2">
          Прикрепите фото товара
        </label>
        <input
          type="file"
          @change="(e) => (form.file = e.target.files[0])"
          class="block w-full text-sm text-gray-500"
        />
      </div>
      <div class="flex justify-end gap-3 mt-6">
        <button
          type="button"
          class="px-6 py-2 text-mainColor border border-mainColor rounded-lg"
          @click="modals.modal.show = false"
        >
          Отмена
        </button>
        <button
          type="submit"
          class="px-6 py-2 bg-mainColor text-white rounded-lg"
          :disabled="loading"
        >
          Отправить
        </button>
      </div>
    </form>
  </div>
</template>
