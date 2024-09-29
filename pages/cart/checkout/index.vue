<script setup>
import Breadcrumbs from "~/components/general/breadcrumbs.vue";
import {CreditCardIcon} from "@heroicons/vue/24/outline"
import {useCartStore} from "~/stores/cart.js";
import {MinusIcon, PlusIcon} from "@heroicons/vue/24/outline/index.js";
import NoResults from "~/components/general/noResults.vue";
import {useNotificationStore} from "~/stores/notifications.js";
import {useAddressesStore} from "~/stores/addresses.js";
import {useUserStore} from "~/stores/user.js";
import YandexMap from "~/components/maps/YandexMaps.vue";
import {useVuelidate} from "@vuelidate/core";
import {required} from "@vuelidate/validators";
import {vMaska} from "maska/vue"

const {t} = useI18n()
const localePath = useLocalePath()
const deliveryType = ref(1)
const cart = useCartStore()
const {cartList, cartPrice} = storeToRefs(cart)
const notifications = useNotificationStore()
const modals = useModalsStore()
const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
auth.initCookieToken()
const {token} = storeToRefs(auth)
const user = useUserStore()
const addresses = useAddressesStore()
const loading = ref(false)
const closeCity = ref(false)

const editForm = ref({
  quantity: null
})

const form = ref({
  name: "",
  phone: "",
  delivery_address: "",
  delivery_type: "",
  payment_type: "by-manager",
  amount: "",
  city_id: ""
})

const formAddress = ref({
  entrance: "",
  floor: "",
  float: ""
})

const v$ = useVuelidate({
  phone: {required, minLength: 11},
  name: {required},
  delivery_address: {required},
  delivery_type: {required},
  payment_type: {required},
  amount: {required},
  city_id: {required}
}, form);

const editQuantity = async (id, quantity) => {
  editForm.value.quantity = quantity
  if (editForm.value.quantity === 0) {
    notifications.showNotification('error', t('notification.error_title'), t('notification.error_message'))
    editForm.value.quantity = null
    return
  }
  await cart.editItem(id, editForm.value)
  if (token.value) {
    await cart.getCart()
  } else {
    await cart.getTemporaryCart()
  }
  editForm.value.quantity = null
}

const tempCode = useCookie('temporary_code', {
  sameSite: true,
  maxAge: 60 * 60 * 24,
})

const links = computed(() => [
  {title: t('breadcrumbs.home'), link: localePath('/')},
  {title: t('breadcrumbs.cart'), link: localePath('/cart')},
  {title: t('breadcrumbs.checkout'), link: localePath('/cart/checkout')},
]);

const isDisabled = computed(() => !!user.userProfile && !!user.userProfile.data && !!user.userProfile.data.name);
const isDisabledPhone = computed(() => !!user.userProfile && !!user.userProfile.data && !!user.userProfile.data.phone);

const makeCheckout = async () => {
  if (!token.value) {
    form.value.temporary_code = tempCode.value.toString()
  }

  loading.value = true;
  form.value.amount = cart.cartPrice
  await v$.value.$validate();

  if (v$.value.$error) {
    notifications.showNotification("error", t('notification.error_title'), t('notification.error_message'));
    loading.value = false;
    return;
  }

  try {
    const response = await api(`/carts/order`, "POST", {
      body: JSON.stringify(form.value)
    }, route.query);

    notifications.showNotification("success", t('notification.success_title'), t('notification.success_message'));
    await nextTick()
    if (token.value) {
      await user.getProfile()
    }
    if (token.value) {
      await cart.getCart()
    } else {
      await cart.getTemporaryCart()
    }
    await router.push(localePath('/payment-success'))
  } catch (e) {
    loading.value = false;
    notifications.showNotification("error", t('notification.error_title'), e);
  }

}

onMounted(async () => {
  await nextTick()
  await addresses.getCities()
  if (token.value) {
    await user.getProfile()
    form.value.phone = user.userProfile.phone
    form.value.name = user.userProfile.name
    form.value.city_id = user.userProfile.city.id
    closeCity.value = true
  } else {
    await cart.getTemporaryCart()
  }
})

useHead({
  title: t("headers.checkout.title"),
  meta: [
    {
      property: "description",
      content: t("headers.checkout.description"),
    },
    {
      property: "og:description",
      content: t("headers.checkout.description"),
    },
    {
      property: "og:title",
      content: t("headers.checkout.title"),
    },
    {
      property: "og:url",
      content: t("headers.checkout.og_url"),
    },
  ],
  link: [{rel: "canonical", href: t("headers.checkout.canonical")}],
});
</script>

<template>
  <div>
    <Breadcrumbs :links="links"/>
    <div class="container mx-auto px-4 md:px-0">
      <div class="pt-12 pb-32">

        <h1 class="text-xl md:text-3xl font-semibold mb-12">
          {{ $t('checkout.title') }}
        </h1>

        <div class="flex flex-col-reverse md:flex-row items-start gap-5">
          <div class="w-full md:w-2/3 flex flex-col gap-12">
            <div class="w-full">
              <div class="flex gap-6 mb-4 border-b border-[#F0DFDF] pb-3 items-center">
                <div
                    class="w-8 h-8 rounded-full bg-mainColor flex items-center justify-center text-white text-xl font-semibold">
                  1
                </div>
                <p class="text-base md:text-2xl font-semibold">
                  {{ $t('checkout.first.title') }}
                </p>
              </div>

              <div class="flex flex-col gap-4">
                <div>
                  <input
                      v-model="form.name"
                      :disabled="isDisabled"
                      :placeholder="$t('checkout.first.name')"
                      class="w-full px-4 border-b border-[#F0DFDF] rounded-lg py-3"
                      type="text">
                </div>
                <div>
                  <input
                      v-model="form.phone"
                      v-maska
                      :disabled="isDisabledPhone"
                      :placeholder="$t('checkout.first.phone')"
                      class="w-full px-4 border-b border-[#F0DFDF] rounded-lg py-3"
                      data-maska="+7 (###) ###-##-##"
                      type="text">
                </div>
              </div>
            </div>

            <!-- Delivery Information -->
            <div class="w-full">
              <div class="flex items-center gap-6 mb-4 border-b border-[#F0DFDF] pb-3">
                <div
                    class="w-8 h-8 rounded-full bg-mainColor flex items-center justify-center text-white text-xl font-semibold">
                  2
                </div>
                <p class="text-base md:text-2xl font-semibold">
                  {{ $t('checkout.second.title') }}
                </p>
              </div>
              <div>
                <div class="flex flex-col gap-3 justify-between mb-6">
                  <p class="text-xl font-semibold">
                    {{ $t('checkout.second.address') }}
                  </p>
                  <div>
                    <label
                        class="block text-sm font-medium text-gray-700"
                        for="address">
                      {{ $t('checkout.second.delivery_type') }}
                    </label>
                    <input
                        id="address"
                        v-model="form.delivery_type"
                        :class="{ 'border-red-500' : v$.delivery_type.$error }"
                        class="py-2 px-4 border border-[#F0DFDF] rounded-lg w-full bg-white "
                        name="address"
                        :placeholder="$t('checkout.second.delivery_type_placeholder')"
                        type="text">
                  </div>

                  <YandexMap
                      @send_data="(data) => form.delivery_address = data.address"
                  />

                  <!-- City and Address Inputs -->
                  <div class="grid grid-cols-1 sm:gap-y-4 sm:grid-cols-2 gap-x-4 xl:grid-cols-3">
                    <div v-if="addresses.citiesList" class="mb-4">
                      <label class="block text-sm font-medium text-gray-700" for="city">
                        {{ $t('addresses.create.city') }}
                      </label>
                      <select
                          id="city"
                          v-model="form.city_id"
                          :class="{ 'border-red-500' : v$.city_id.$error }"
                          :disabled="closeCity"
                          class="py-2 px-4 border border-[#F0DFDF] rounded-lg w-full bg-white">
                        <option :value="null">{{ $t('addresses.create.city_placeholder') }}</option>
                        <option v-for="(city, index) of addresses.citiesList" :key="index" :value="city.id">
                          {{ city.name }}
                        </option>
                      </select>
                    </div>

                    <div class="mb-4">
                      <label class="block text-sm font-medium text-gray-700" for="address">
                        {{ $t('addresses.create.address') }}
                      </label>
                      <input
                          id="address"
                          v-model="form.delivery_address"
                          :class="{ 'border-red-500' : v$.delivery_address.$error }"
                          :placeholder="$t('addresses.create.address_placeholder')"
                          class="py-2 px-4 border border-[#F0DFDF] rounded-lg w-full bg-white"
                          name="address"
                          type="text">
                    </div>

                    <div class="mb-4">
                      <label class="block text-sm font-medium text-gray-700" for="entrance">
                        {{ $t('addresses.create.entrance') }} <span class="text-gray-400">(необязательно)</span>
                      </label>
                      <input
                          id="entrance"
                          v-model="formAddress.entrance"
                          :placeholder="$t('addresses.create.entrance_placeholder')"
                          class="py-2 px-4 border border-[#F0DFDF] rounded-lg w-full bg-white"
                          name="entrance"
                          type="text">
                    </div>

                    <div class="mb-4">
                      <label class="block text-sm font-medium text-gray-700" for="floor">
                        {{ $t('addresses.create.floor') }} <span class="text-gray-400">(необязательно)</span>
                      </label>
                      <input
                          id="floor"
                          v-model="formAddress.floor"
                          :placeholder="$t('addresses.create.floor_placeholder')"
                          class="py-2 px-4 border border-[#F0DFDF] rounded-lg w-full bg-white"
                          name="floor"
                          type="text">
                    </div>

                    <div class="mb-4">
                      <label class="block text-sm font-medium text-gray-700" for="apartment">
                        {{ $t('addresses.create.apartment') }} <span class="text-gray-400">(необязательно)</span>
                      </label>
                      <input
                          id="apartment"
                          v-model="formAddress.float"
                          :placeholder="$t('addresses.create.apartment_placeholder')"
                          class="py-2 px-4 border border-[#F0DFDF] rounded-lg w-full bg-white"
                          name="apartment"
                          type="text">
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Payment Information -->
            <div class="w-full">
              <div class="flex items-center gap-6 mb-4 border-b border-[#F0DFDF] pb-3">
                <div
                    class="w-8 h-8 rounded-full bg-mainColor flex items-center justify-center text-white text-xl font-semibold">
                  3
                </div>
                <p class="text-base md:text-2xl font-semibold">
                  {{ $t('checkout.third.title') }}
                </p>
              </div>
              <div class="flex flex-col md:flex-row gap-5 mb-6">
                <div
                    :class="{ 'bg-[#F0DFDF]' : deliveryType === 1 }"
                    class="transition-all cursor-pointer rounded-lg py-3 w-full text-mainColor border border-[#F0DFDF] flex items-center justify-center gap-2"
                    @click="deliveryType = 1">
                  <CreditCardIcon class="w-5 h-5"/>
                  <p>{{ $t('checkout.payment_type') }}</p>
                </div>
              </div>
              <p class="font-bold mb-4">
                {{ $t('checkout.third.to_pay') }}: {{ cartPrice }} ₸
              </p>
              <p
                  class="w-full md:w-1/3 bg-mainColor cursor-pointer text-white py-3 rounded-lg text-lg font-semibold text-center"
                  @click="makeCheckout">
                {{ $t('cart.checkout.checkout_button') }}
              </p>
            </div>
          </div>

          <!-- Order Summary -->
          <div class="w-full md:w-1/3 bg-[#FAFAFA] py-5 px-4 rounded-lg">
            <div class="flex gap-6 mb-4 border-b border-[#F0DFDF] pb-3">
              <p class="text-xl font-semibold">
                {{ $t('checkout.items') }}
              </p>
            </div>

            <div class="flow-root">
              <div v-if="cartList" class="-mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div v-if="cartList.data.length > 0"
                     class="inline-block min-w-full align-middle sm:px-6 lg:px-8 overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-300 text-xs">
                    <thead class="bg-[#FAFAFA]">
                    <tr>
                      <th class="py-3.5 pr-3 text-left font-semibold text-gray-900" scope="col">
                        {{ t('cart.table.product') }}
                      </th>
                      <th class="px-3 py-3.5 text-left font-semibold text-gray-900" scope="col">
                        {{ t('cart.table.quantity') }}
                      </th>
                      <th class="px-3 py-3.5 text-left font-semibold text-gray-900" scope="col">
                        {{ t('cart.table.total') }}
                      </th>
                    </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                    <tr v-for="(item, index) in cartList.data" :key="index">
                      <td class="whitespace-nowrap py-5 pl-4 pr-3 sm:pl-0">
                        <div class="font-medium text-gray-900">{{ item.product.name }}</div>
                      </td>
                      <td class="whitespace-nowrap px-3 py-5">
                        <div class="text-mainColor flex gap-3 items-center">
                          <button
                              class="border border-[#F0DFDF] rounded-full w-5 h-5 flex items-center justify-center hover:bg-[#F0DFDF] transition-all"
                              @click="editQuantity(item.id, item.quantity - 1)">
                            <MinusIcon class="w-5 h-5"/>
                          </button>
                          <p class="text-xs">{{ item.quantity }}</p>
                          <button
                              class="border border-[#F0DFDF] rounded-full w-5 h-5 flex items-center justify-center hover:bg-[#F0DFDF] transition-all"
                              @click="editQuantity(item.id, item.quantity + 1)">
                            <PlusIcon class="w-5 h-5"/>
                          </button>
                        </div>
                      </td>
                      <td class="whitespace-nowrap px-3 py-5 font-semibold">
                        {{ item.price }}₸
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </div>
                <NoResults v-else/>
              </div>
              <div v-else class="border rounded-lg p-2">
                <!-- Skeleton for Loading State -->
              </div>
              <div class="font-bold text-sm">
                <div class="flex items-center justify-between py-3">
                  <p>{{ $t('checkout.del_type') }}:</p>
                  <p>{{ $t('checkout.delivery_status.delivery') }}</p>
                </div>
                <div class="flex items-center justify-between pt-3">
                  <p>{{ $t('checkout.to_pay') }}:</p>
                  <p>{{ cartPrice }} ₸</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
