<script setup>
import { ref } from "vue";
import axios from "axios";
import { useOrdersStore } from "~/stores/orders";
import { useNotificationStore } from "~/stores/notifications";
import { useModalsStore } from "~/stores/modals";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import intl from "~/utils/intl.js";
import {MinusIcon, PlusIcon} from "@heroicons/vue/24/outline/index.js";

const runtimeConfig = useRuntimeConfig();
const route = useRoute();

const { t } = useI18n();

const orders = useOrdersStore();
const notifications = useNotificationStore();
const modals = useModalsStore();
const auth = useAuthStore();
auth.initCookieToken();
const { token } = storeToRefs(auth);

const isSubmitted = ref(false)
const loading = ref(false);
const form = ref({
 order_item: modals.modal.modalData?.order_items.map(item => ({
  id: item.id,
  quantity: item.quantity || 1,
  selected: false,
  product: item.product,
  icon: item.icon,
  price: item.price,
  maxQuantity: item.quantity
 })),
 comment: "",
});

const v$ = useVuelidate(
  {
   order_item: {
    required,
    $each: { selected: { required } },
   },
   comment: { required },
  },
  form
);

const isAllSelected = computed(() => {
 return form.value.order_item.every(item => item.selected);
});

const indeterminate = computed(() => {
 const selectedCount = form.value.order_item.filter(item => item.selected).length;
 return selectedCount > 0 && selectedCount < form.value.order_item.length;
});

const toggleSelectAll = () => {
 const allSelected = isAllSelected.value;
 form.value.order_item.forEach(item => {
  item.selected = !allSelected;
 });
};

const editQuantity = (id, newQuantity) => {
 const item = form.value.order_item.find(item => item.id === id);
 if (item) {
  item.quantity = Math.min(item.maxQuantity, Math.max(1, newQuantity)); // Учет maxQuantity
 }
};

const handleReturnSubmit = async () => {
 loading.value = true
 isSubmitted.value = true
 await v$.value.$validate()

 if (v$.value.$error) {
  notifications.showNotification(
    "error",
    "Данные не заполнены",
    "Проверьте правильность введенных данных и попробуйте снова."
  );
  loading.value = false;
  return;
 }

 const selectedItems = form.value.order_item
   .filter(item => item.selected)
   .map(item => ({ id: item.id, quantity: item.quantity }));

 if (selectedItems.length === 0) {
  notifications.showNotification(
    "error",
    "Ошибка",
    "Выберите хотя бы один товар."
  );
  loading.value = false;
  return;
 }

 try {
  const response = await axios.post(
    `https://api-new.gazbas.kz/api/orders/my-orders/${modals.modal.modalData.id}/return`,
    { order_item: selectedItems, comment: form.value.comment },
    {
     params: route.query,
     headers: {
      Authorization: `Bearer ${token.value}`,
      "Content-Type": "application/json",
     },
    }
  );

  if (response.status === 200) {
   await orders.getOrders();
   modals.modal.show = false;
   notifications.showNotification("success", "Успешно", "Заявка на возврат отправлена.");
  }
 } catch (error) {
  notifications.showNotification("error", "Ошибка", "Не удалось отправить заявку на возврат.");
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
     <div v-if="form.order_item.length">
      <table class="min-w-full divide-y divide-gray-300">
       <thead class="bg-[#FAFAFA]">
       <tr class="px-4">
        <th
          class="py-3.5 pr-3 text-left font-semibold text-gray-900"
          scope="col">
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
         v-for="(item, key) in form.order_item"
         :key="key"
         class="border-b">
        <td class="whitespace-nowrap pl-4 pr-3 sm:pl-0">
         <input
           v-model="item.selected"
           type="checkbox"/>
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
         <div class="text-mainColor flex items-center w-max gap-7">
          <button
            type="button"
            :disabled="item.quantity <= 1"
            class="border border-[#F0DFDF] rounded-full w-7 h-7 flex items-center justify-center hover:bg-[#F0DFDF] transition-all"
            @click="editQuantity(item.id, item.quantity - 1)">
           <MinusIcon class="w-5 h-5"/>
          </button>
          <input
            v-model="item.quantity"
            class="max-w-[50px] text-center border-[#F0DFDF] bg-[#FAFAFA] rounded-md"
            min="1"
            :max="item.maxQuantity"
            @blur="editQuantity(item.id, item.quantity)"
            type="number">
          <button
            type="button"
            class="border border-[#F0DFDF] rounded-full w-7 h-7 flex items-center justify-center hover:bg-[#F0DFDF] transition-all"
            :disabled="item.quantity >= item.maxQuantity"
            @click="editQuantity(item.id, item.quantity + 1)">
           <PlusIcon class="w-5 h-5"/>
          </button>
         </div>
        </td>
        <td class="whitespace-nowrap px-3">
         <div class="text-gray-900">{{ intl(item.price) }}</div>
        </td>
       </tr>
       </tbody>
      </table>
      <span
        v-if="form.order_item.every(item => !item.selected) && isSubmitted"
        class="text-red-500">
          Необходимо выбрать хотя бы один товар.
        </span>
     </div>
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
          :class="{ '!border-red-500': v$.comment.$error && v$.comment.$dirty }"
          placeholder="Введите причину возврата"
          name="reason"
          rows="3"/>
      </div>
     <span
       v-if="v$.comment.$error && v$.comment.$dirty"
       class="text-red-500 text-sm">
      Введите причину возврата
     </span>
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

<style scoped>
/* Для всех браузеров */
input[type="number"] {
 -moz-appearance: textfield; /* Для Firefox */
 -webkit-appearance: none;  /* Для Chrome, Safari, Edge */
 appearance: none;          /* Универсальное свойство */
}

/* Убирает стрелки на мобильных устройствах */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
 -webkit-appearance: none;
 margin: 0;
}
</style>