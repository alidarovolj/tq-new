<script lang="ts" setup>
import { formatDate } from "~/utils/formatDate";
import { useLocalePath } from "#i18n";
import { differenceInDays } from "date-fns";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { ChevronDownIcon, ChevronUpIcon, CubeIcon, ReceiptRefundIcon} from "@heroicons/vue/24/outline";
import intl from "@/utils/intl";
import { useOrdersStore } from "~/stores/orders";
import Breadcrumbs from "~/components/general/breadcrumbs.vue";

const orders = useOrdersStore();
const localePath = useLocalePath();
const { t } = useI18n();
const modals = useModalsStore();

const links = computed(() => [
 { title: t("breadcrumbs.home"), link: localePath("/") },
 { title: t("breadcrumbs.profile"), link: localePath("/profile") },
 { title: t("breadcrumbs.refunds"), link: localePath("/profile/refunds") },
]);

const statuses = {
 'in_process': {
  title: 'В процессе',
  color:'bg-blue-200 text-blue-500'
 },
 'returned': {
  title: 'Возврат оформлен',
  color:'bg-yellow-200 text-yellow-500'
 }
}

onMounted(async () => {
 await nextTick();
 await orders.getRefunds();
});

useHead({
 title: t("headers.orders.title"),
 meta: [
  {
   property: "description",
   content: t("headers.orders.description"),
  },
  {
   property: "og:description",
   content: t("headers.orders.description"),
  },
  {
   property: "og:title",
   content: t("headers.orders.title"),
  },
  {
   property: "og:url",
   content: t("headers.orders.og_url"),
  },
 ],
 link: [{ rel: "canonical", href: t("headers.orders.canonical") }],
});
</script>

<template>
 <div>
  <Breadcrumbs :links="links" />
  <NuxtLayout name="profile">
   <div class="flex flex-col gap-4">
    <div
      v-if="orders.refunds"
      class="bg-white p-6 rounded-2xl set_shadow">
     <div class="flex justify-between items-center mb-4">
      <div class="flex gap-3 items-center">
       <ReceiptRefundIcon class="text-mainColor w-8 h-8" />
       <p class="text-xl font-medium">Мои возвраты</p>
      </div>
     </div>
     <div
       v-if="orders.refunds.data.length > 0"
       class="flex flex-col gap-5"
     >
      <Disclosure
        v-for="(item, index) in orders.refunds.data"
        :key="index"
        v-slot="{ open }"
        as="div"
        class="px-4 py-3 border border-[#F0DFDF] rounded-xl w-full"
      >
       <dt class="w-full">
        <DisclosureButton class="w-full">
         <div
           class="flex w-full items-start justify-between text-left text-gray-900"
         >
          <div>
           <p class="text-xl font-medium mb-5">
            {{ $t("orders.order.title") }} №{{ item.order_id }}
           </p>
           <p class="text-sm font-medium">
            {{ $t("orders.order.status") }}:
            <span
              :class="statuses[item.status]?.color"
              class="p-2 rounded">
              {{statuses[item.status]?.title}}
             </span>
           </p>
          </div>
          <div class="text-right">
           <p class="font-light mb-5">
            {{ formatDate(item.created_at) }}
           </p>
<!--           <div class="flex items-center mb-3 justify-end">-->
<!--            <p-->
<!--              v-if="-->
<!--              differenceInDays(-->
<!--                  new Date(),-->
<!--                  new Date(item.created_at)-->
<!--                ) <= 14 && item.status !== 'return_process'-->
<!--              "-->
<!--              @click="modals.showModal('makeReturn', item)"-->
<!--              class="text-xs bg-mainColor px-4 py-1 rounded text-white"-->
<!--            >-->
<!--             {{ $t("orders.return") }}-->
<!--            </p>-->
<!--           </div>-->
           <p class="font-semibold">
            {{ $t("orders.order.amount") }}: {{ item.amount }} ₸
           </p>
          </div>
         </div>
         <div
           v-if="!open"
           class="text-xs text-[#2157E2] flex items-center justify-center gap-2"
         >
          <p>{{ $t("orders.order.show") }}</p>
          <ChevronDownIcon class="w-5 h-5" />
         </div>
         <div
           v-else
           class="text-xs text-[#2157E2] flex items-center justify-center gap-2"
         >
          <p>{{ $t("orders.order.hide") }}</p>
          <ChevronUpIcon class="w-5 h-5" />
         </div>
        </DisclosureButton>
       </dt>
       <DisclosurePanel as="dd" class="mt-2">
        <table class="min-w-full divide-y divide-gray-300">
         <thead class="bg-[#FAFAFA]">
         <tr class="px-4">
          <th
            class="py-3.5 pl-4 pr-3 text-left font-semibold text-gray-900"
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
           v-for="(it, ind) in item.order_items"
           :key="ind"
           class="border-b news-card cursor-pointer"
         >
          <td class="whitespace-nowrap pl-4 pr-3 sm:pl-0">
           <div class="flex items-center">
            <div class="h-24 w-24 flex-shrink-0">
             <img
               :src="it.icon"
               alt=""
               class="h-24 w-24 rounded-full object-cover transition-all"
             />
            </div>
            <div class="ml-4">
             <div class="font-medium text-gray-900">
              {{ it.product }}
             </div>
            </div>
           </div>
          </td>
          <td class="whitespace-nowrap px-3">
           <div class="text-mainColor flex items-center gap-5">
            <p class="text-sm">{{ it.quantity }} шт.</p>
           </div>
          </td>
          <td class="whitespace-nowrap px-3">
           <div class="text-gray-900">{{ intl(it.price)}}</div>
          </td>
         </tr>
         </tbody>
        </table>
       </DisclosurePanel>
      </Disclosure>
     </div>
     <p v-else class="text-center text-red-500">
      {{ $t("orders.empty") }}
     </p>
    </div>
   </div>
  </NuxtLayout>
 </div>
</template>