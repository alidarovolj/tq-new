<script setup>
import { ref } from "vue";
import axios from "axios";
import { useOrdersStore } from "~/stores/orders";
import { useNotificationStore } from "~/stores/notifications";
import { useModalsStore } from "~/stores/modals";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import intl from "~/utils/intl.js";

const runtimeConfig = useRuntimeConfig();
const route = useRoute();

const { t } = useI18n();

const orders = useOrdersStore();
const notifications = useNotificationStore();
const modals = useModalsStore();
const auth = useAuthStore();
auth.initCookieToken();
const { token } = storeToRefs(auth);

const loading = ref(false);
const form = ref({
  id: modals.modal.modalData.id,
  order_item_ids: [],
  comment: "",
});

const v$ = useVuelidate(
  {
    order_item_ids: { required },
    comment: { required },
  },
  form
);


// Select all logic
const isAllSelected = computed(() => {
 const orderItemIds = modals.modal.modalData.order_items.map(item => item.id);
 return orderItemIds.every(id => form.value.order_item_ids.includes(id));
});

const indeterminate = computed(() => {
 const orderItemIds = modals.modal.modalData.order_items.map(item => item.id);
 return (
   form.value.order_item_ids.length > 0 &&
   !isAllSelected.value
 );
});

const toggleSelectAll = () => {
 if (isAllSelected.value) {
  form.value.order_item_ids = []
 } else {
  form.value.order_item_ids = modals.modal.modalData.order_items.map(
    item => item.id
  )
 }
}

const handleReturnSubmit = async () => {
  loading.value = true
  await v$.value.$validate()

  if (v$.value.$error) {
    notifications.showNotification(
      "error",
      "Данные не заполнены",
      "Проверьте правильность введенных данных и попробуйте снова."
    )
    loading.value = false
    return
  }

  // const formData = new FormData();
  // formData.append("id", form.value.id);
  // formData.append("reason", form.value.reason);
  // if (form.value.file) {
  //   formData.append("file", form.value.file);
  // }

  try {
    const response = await axios.post(
      `https://api-new.gazbas.kz/api/orders/my-orders/${modals.modal.modalData.id}/return`,
      form.value,
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
    <p class="text-xl font-semibold mb-6">
     Оформление возврата
    </p>
    <span>
      Для оформления возврата пожалуйста предоставьте данные и причину возврата.
      Мы рассмотрим вашу заявку в течение дня.
    </span>
    <form @submit.prevent="handleReturnSubmit">
     <table
       v-if="modals.modal.modalData.order_items.length"
       class="min-w-full divide-y divide-gray-300">
      <thead class="bg-[#FAFAFA]">
       <tr class="px-4">
        <th
          class="py-3.5 pr-3 text-left font-semibold text-gray-900"
          scope="col"
        >
         <input
           type="checkbox"
           :indeterminate="indeterminate"
           :checked="isAllSelected"
           @change="toggleSelectAll"
         />
        </th>
        <th
          class="py-3.5 text-left font-semibold text-gray-900"
          scope="col"
        >
         {{ t("cart.table.product") }}
        </th>
        <th
          class="px-3 py-3.5 text-left font-semibold text-gray-900"
          scope="col"
        >
         {{ t("cart.table.quantity") }}
        </th>
        <th
          class="px-3 py-3.5 text-left font-semibold text-gray-900"
          scope="col"
        >
         {{ t("cart.table.price") }}
        </th>
       </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 bg-white">
       <tr
         v-for="(item, key) in modals.modal.modalData.order_items"
         :key="key"
         class="border-b">
        <td class="whitespace-nowrap pl-4 pr-3 sm:pl-0">
         <input
           type="checkbox"
           :value="item.id"
           v-model="form.order_item_ids"
         />
        </td>
        <td>
         <div class="flex items-center">
          <div class="h-24 w-24 flex-shrink-0">
           <img
             :src="item.icon"
             alt=""
             class="h-24 w-24 rounded-full object-cover transition-all"
           />
          </div>
          <div class="ml-4">
           <div class="font-medium text-gray-900">
            {{ item.product }}
           </div>
          </div>
         </div>
        </td>
        <td class="whitespace-nowrap px-3">
         <div class="text-mainColor flex items-center gap-5">
          <p class="text-sm">{{ item.quantity }} шт.</p>
         </div>
        </td>
        <td class="whitespace-nowrap px-3">
         <div class="text-gray-900">{{ intl(item.price) }}</div>
        </td>
       </tr>
      </tbody>
     </table>
      <div class="mt-6">
        <label
          for="reason"
          class="block text-sm font-medium text-gray-700">
          Причина возврата
        </label>
        <textarea
          v-model="form.comment"
          id="reason"
          class="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          :class="{ '!border-red-500': v$.comment.$error }"
          placeholder="Введите причину возврата"
          name="reason"
          rows="3"/>
      </div>
<!--      <div class="mt-6">-->
<!--        <label for="file" class="block text-sm font-medium text-gray-700 mb-2">-->
<!--          Прикрепите фото товара-->
<!--        </label>-->
<!--        <input-->
<!--          type="file"-->
<!--          @change="(e) => (form.file = e.target.files[0])"-->
<!--          class="block w-full text-sm text-gray-500"-->
<!--        />-->
<!--      </div>-->
      <div class="flex justify-end gap-3 mt-6">
        <button
          type="button"
          class="px-6 py-2 text-mainColor border border-mainColor rounded-lg"
          @click="modals.modal.show = false">
          Отмена
        </button>
        <button
          type="submit"
          class="px-6 py-2 bg-mainColor text-white rounded-lg"
          :disabled="loading">
          Отправить
        </button>
      </div>
    </form>
  </div>
</template>