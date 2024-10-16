<script setup>
import Breadcrumbs from "~/components/general/breadcrumbs.vue";
import { useOrdersStore } from "~/stores/orders.js";
import { useUserStore } from "~/stores/user.js";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  CubeIcon,
  TrashIcon,
  TruckIcon,
} from "@heroicons/vue/24/outline";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { formatDate } from "~/utils/formatDate.js";
import { differenceInDays } from "date-fns";

const { t } = useI18n();
const localePath = useLocalePath();
const user = useUserStore();
const orders = useOrdersStore();
const modals = useModalsStore();
const addresses = useAddressesStore();
const { addressesList } = storeToRefs(addresses);

const links = computed(() => [
  { title: t("breadcrumbs.home"), link: localePath("/") },
  { title: t("breadcrumbs.profile"), link: localePath("/profile") },
]);

useHead({
  title: t("headers.profile.title"),
  meta: [
    {
      property: "description",
      content: t("headers.profile.description"),
    },
    {
      property: "og:description",
      content: t("headers.profile.description"),
    },
    {
      property: "og:title",
      content: t("headers.profile.title"),
    },
    {
      property: "og:url",
      content: t("headers.profile.og_url"),
    },
  ],
  link: [{ rel: "canonical", href: t("headers.profile.canonical") }],
});

onMounted(async () => {
  await nextTick();
  await user.getProfile();
  await orders.getOrders();
  await addresses.getAddresses();
});
</script>

<template>
  <div>
    <Breadcrumbs :links="links" />
    <NuxtLayout name="profile">
      <div class="bg-white p-6 rounded-2xl set_shadow">
        <div
          class="flex items-center gap-8 border-b border-[#F0DFDF] pb-3 mb-4"
        >
          <p v-if="user.userProfile" class="text-3xl font-semibold">
            {{ user.userProfile.name }}
          </p>
          <div v-else class="skeleton h-5 w-1/2"></div>
        </div>
        <div class="flex flex-col gap-4">
          <div class="flex items-center">
            <p class="w-1/2 md:w-1/6 text-lg text-[#7B7B7B]">
              {{ $t("profile.phone") }}:
            </p>
            <p v-if="user.userProfile">{{ user.userProfile.phone }}</p>
            <div v-else class="skeleton h-5 w-1/3"></div>
          </div>
          <div class="flex items-center">
            <p class="w-1/2 md:w-1/6 text-lg text-[#7B7B7B]">Email:</p>
            <p v-if="user.userProfile">{{ user.userProfile.email }}</p>
            <div v-else class="skeleton h-5 w-1/3"></div>
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-4">
        <div
          v-if="orders.ordersList"
          class="bg-white p-6 rounded-2xl set_shadow"
        >
          <div class="flex justify-between items-center mb-4">
            <div class="flex gap-3 items-center">
              <CubeIcon class="text-mainColor w-8 h-8" />
              <p class="text-xl font-medium">{{ $t("orders.title") }}</p>
            </div>
          </div>
          <div
            v-if="orders.ordersList.data.length > 0"
            class="flex flex-col gap-5"
          >
            <Disclosure
              v-for="(item, index) in orders.ordersList.data"
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
                        {{ $t("orders.order.title") }} №{{ item.id }}
                      </p>
                      <p class="text-sm font-medium">
                        {{ $t("orders.order.status") }}:
                        <span
                          v-if="item.status === 'pending'"
                          class="bg-blue-200 text-blue-500 p-2 rounded"
                          >{{ $t("orders.statuses.pending") }}</span
                        >
                        <span
                          v-if="item.status === 'payed'"
                          class="bg-orange-200 text-orange-500 p-2 rounded"
                          >{{ $t("orders.statuses.payed") }}</span
                        >
                        <span
                          v-if="item.status === 'delivery'"
                          class="bg-purple-200 text-purple-500 p-2 rounded"
                          >{{ $t("orders.statuses.delivery") }}</span
                        >
                        <span
                          v-if="item.status === 'delivered'"
                          class="bg-green-200 text-green-500 p-2 rounded"
                          >{{ $t("orders.statuses.delivered") }}</span
                        >
                        <span
                          v-if="item.status === 'canceled'"
                          class="bg-red-200 text-red-500 p-2 rounded"
                          >{{ $t("orders.statuses.canceled") }}</span
                        >
                        <span
                          v-if="item.status === 'return_process'"
                          class="bg-red-200 text-red-500 p-2 rounded"
                          >{{ $t("orders.statuses.return_process") }}</span
                        >
                      </p>
                    </div>
                    <div class="text-right">
                      <p class="font-light mb-5">
                        {{ formatDate(item.created_at) }}
                      </p>
                      <div class="flex items-center mb-3 justify-end">
                        <p
                          v-if="
                            differenceInDays(
                              new Date(),
                              new Date(item.created_at)
                            ) <= 14 && item.status !== 'return_process'
                          "
                          @click="modals.showModal('makeReturn', item)"
                          class="text-xs bg-mainColor px-4 py-1 rounded text-white"
                        >
                          {{ $t("orders.return") }}
                        </p>
                      </div>
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
                        <div class="text-gray-900">{{ it.price }}₸</div>
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
      <div class="bg-white p-6 rounded-2xl set_shadow">
        <div class="flex justify-between items-center mb-4">
          <div class="flex gap-3 items-center">
            <TruckIcon class="text-mainColor w-8 h-8" />
            <p class="text-xl font-medium">{{ $t("profile.my_addresses") }}</p>
          </div>
          <NuxtLink
            :to="localePath('/profile/addresses')"
            class="text-[#2157E2]"
          >
            {{ $t("profile.to_addresses") }}
          </NuxtLink>
        </div>
        <div v-if="addressesList">
          <div v-if="addressesList.data.length > 0" class="flex flex-col gap-5">
            <div
              v-for="(item, index) of addressesList.data"
              :key="index"
              class="p-4 border border-[#F0DFDF] rounded-lg flex items-center justify-between"
            >
              <p>
                {{ item.city.name }}, {{ item.address }}, {{ item.entrance }}
                {{ $t("profile.entrance") }}, {{ $t("profile.floor") }}
                {{ item.floor }}, {{ item.apartment }}
                {{ item.float }}
              </p>
              <TrashIcon
                class="w-5 h-5 text-red-500 cursor-pointer"
                @click="modals.showModal('removeAddress', item)"
              />
            </div>
          </div>
          <p v-else class="text-center text-red-500">
            {{ $t("profile.no_addresses") }}
          </p>
        </div>
        <div v-else class="spinner p-3"></div>
      </div>
    </NuxtLayout>
  </div>
</template>
