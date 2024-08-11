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

const editForm = ref({
  quantity: null
})

const form = ref({
  order_number: "",
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
  order_number: {required},
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
    notifications.showNotification('error', 'Редактирование не удалось', 'Кол-во не может ровняться 0 или меньше')
    editForm.value.quantity = null
    return
  }
  await cart.editItem(id, editForm.value)
  if(token.value) {
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

const generateRandomString = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const makeCheckout = async () => {
  if(!token.value) {
    form.value.temproary_code = tempCode.value
  }

  loading.value = true;
  form.value.amount = cart.cartPrice
  await v$.value.$validate();

  if (v$.value.$error) {
    notifications.showNotification("error", "Данные не заполнены", "Проверьте правильность введенных данных и попробуйте снова.");
    loading.value = false;
    return;
  }

  try {
    const response = await api(`/carts/order`, "POST", {
      body: JSON.stringify(form.value)
    }, route.query);

    notifications.showNotification("success", "Успешно", "Вы успешно оформили заказ");
    await nextTick()
    if(token.value) {
      await user.getProfile()
    }
    if(token.value) {
      await cart.getCart()
    } else {
      await cart.getTemporaryCart()
    }
    await router.push(localePath('/payment-success'))
  } catch (e) {
    loading.value = false;
    notifications.showNotification("error", "Произошла ошибка", e);
  }

}

onMounted(async () => {
  await nextTick()
  if(token.value) {
    await user.getProfile()
    form.value.phone = user.userProfile.data.phone
    form.value.name = user.userProfile.data.name
  } else {
    await cart.getTemporaryCart()
  }
  form.value.order_number = generateRandomString();
  await addresses.getCities()
})
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
                  Информация о получателе
                </p>
              </div>

              <div class="flex flex-col gap-4">
                <div>
                  <input
                      type="text"
                      :placeholder="$t('checkout.first.name')"
                      v-model="form.name"
                      :disabled="isDisabled"
                      class="w-full px-4 border-b border-[#F0DFDF] rounded-lg py-3">
                </div>
                <div>
                  <input
                      type="text"
                      :placeholder="$t('checkout.first.phone')"
                      v-model="form.phone"
                      :disabled="isDisabledPhone"
                      class="w-full px-4 border-b border-[#F0DFDF] rounded-lg py-3">
                </div>
              </div>
            </div>
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
                        for="address"
                        class="block text-sm font-medium text-gray-700">
                      Способ доставки
                    </label>
                    <input
                        :class="{ 'border-red-500' : v$.delivery_type.$error }"
                        v-model="form.delivery_type"
                        placeholder="Укажите способ"
                        type="text"
                        name="address"
                        id="address"
                        class="py-2 px-4 border border-[#F0DFDF] rounded-lg w-full bg-white ">
                  </div>
                  <div>
                    <YandexMap
                        @send_data="(data) => form.delivery_address = data.address"
                    />
                    <div>
                      <div class="grid grid-cols-1 grid-y-2 sm:gap-y-4 sm:grid-cols-2 gap-x-4 xl:grid-cols-3">
                        <div
                            v-if="addresses.citiesList"
                            class="mb-4">
                          <label
                              for="city"
                              class="block text-sm font-medium text-gray-700">
                            {{ $t('addresses.create.city') }}
                          </label>
                          <select
                              v-model="form.city_id"
                              :class="{ 'border-red-500' : v$.city_id.$error }"
                              class="py-2 px-4 border border-[#F0DFDF] rounded-lg w-full bg-white"
                              name=""
                              id="">
                            <option :value="null">{{ $t('addresses.create.city_placeholder') }}</option>
                            <option
                                v-for="(city, index) of addresses.citiesList"
                                :key="index"
                                :value="city.id">
                              {{ city.name }}
                            </option>
                          </select>
                        </div>
                        <div class="mb-4">
                          <label
                              for="address"
                              class="block text-sm font-medium text-gray-700">
                            {{ $t('addresses.create.address') }}
                          </label>
                          <input
                              :class="{ 'border-red-500' : v$.delivery_address.$error }"
                              v-model="form.delivery_address"
                              :placeholder="$t('addresses.create.address_placeholder')"
                              type="text"
                              name="address"
                              id="address"
                              class="py-2 px-4 border border-[#F0DFDF] rounded-lg w-full bg-white ">
                        </div>
                        <div class="mb-4">
                          <label
                              for="address"
                              class="block text-sm font-medium text-gray-700">
                            {{ $t('addresses.create.entrance') }} <span class="text-gray-400">(необязательно)</span>
                          </label>
                          <input
                              v-model="formAddress.entrance"
                              :placeholder="$t('addresses.create.entrance_placeholder')"
                              type="text"
                              name="address"
                              id="address"
                              class="py-2 px-4 border border-[#F0DFDF] rounded-lg w-full bg-white ">
                        </div>
                        <div class="mb-4">
                          <label
                              for="address"
                              class="block text-sm font-medium text-gray-700">
                            {{ $t('addresses.create.floor') }} <span class="text-gray-400">(необязательно)</span>
                          </label>
                          <input
                              v-model="formAddress.floor"
                              :placeholder="$t('addresses.create.floor_placeholder')"
                              type="text"
                              name="address"
                              id="address"
                              class="py-2 px-4 border border-[#F0DFDF] rounded-lg w-full bg-white ">
                        </div>
                        <div class="mb-4">
                          <label
                              for="address"
                              class="block text-sm font-medium text-gray-700">
                            {{ $t('addresses.create.apartment') }} <span class="text-gray-400">(необязательно)</span>
                          </label>
                          <input
                              v-model="formAddress.float"
                              :placeholder="$t('addresses.create.apartment_placeholder')"
                              type="text"
                              name="address"
                              id="address"
                              class="py-2 px-4 border border-[#F0DFDF] rounded-lg w-full bg-white ">
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
                    @click="deliveryType = 1"
                    :class="{ 'bg-[#F0DFDF]' : deliveryType === 1 }"
                    class="transition-all cursor-pointer rounded-lg py-3 w-full text-mainColor border border-[#F0DFDF] flex items-center justify-center gap-2">
                  <CreditCardIcon class="w-5 h-5"/>
                  <p>Оплата через менеджера</p>
                </div>
              </div>
              <p class="font-bold mb-4">
                {{ $t('checkout.third.to_pay') }}: {{ cartPrice }} ₸
              </p>
              <p
                  @click="makeCheckout"
                  class="w-full md:w-1/3 bg-mainColor text-white py-3 rounded-lg text-lg font-semibold text-center">
                {{ $t('cart.checkout.checkout_button') }}
              </p>
            </div>
          </div>
          <div class="w-full md:w-1/3 bg-[#FAFAFA] py-5 px-4 rounded-lg">
            <div class="flex gap-6 mb-4 border-b border-[#F0DFDF] pb-3">
              <p class="text-xl font-semibold">
                {{ $t('checkout.items') }}
              </p>
            </div>

            <div class="flow-root">
              <div
                  v-if="cartList"
                  class="-mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div
                    v-if="cartList.data.length > 0"
                    class="inline-block min-w-full align-middle sm:px-6 lg:px-8 overflow-x-auto">
                  <table
                      class="min-w-full divide-y divide-gray-300 text-xs">
                    <thead class="bg-[#FAFAFA]">
                    <tr>
                      <th scope="col" class="py-3.5 pr-3 text-left  font-semibold text-gray-900">
                        {{ t('cart.table.product') }}
                      </th>
                      <th scope="col" class="px-3 py-3.5 text-left  font-semibold text-gray-900">
                        {{ t('cart.table.quantity') }}
                      </th>
                      <th scope="col" class="px-3 py-3.5 text-left  font-semibold text-gray-900">
                        {{ t('cart.table.total') }}
                      </th>
                    </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                    <tr
                        v-for="(item, index) in cartList.data"
                        :key="index">
                      <td class="whitespace-nowrap py-5 pl-4 pr-3  sm:pl-0">
                        <div class="font-medium text-gray-900">{{ item.product.name }}</div>
                      </td>
                      <td class="whitespace-nowrap px-3 py-5">
                        <div class="text-mainColor flex gap-3 items-center">
                          <button
                              @click="editQuantity(item.id, item.quantity - 1)"
                              class="border border-[#F0DFDF] rounded-full w-5 h-5 flex items-center justify-center hover:bg-[#F0DFDF] transition-all">
                            <MinusIcon class="w-5 h-5"/>
                          </button>
                          <p class=" text-xs">
                            {{ item.quantity }}
                          </p>
                          <button
                              @click="editQuantity(item.id, item.quantity + 1)"
                              class="border border-[#F0DFDF] rounded-full w-5 h-5 flex items-center justify-center hover:bg-[#F0DFDF] transition-all">
                            <PlusIcon class="w-5 h-5"/>
                          </button>
                        </div>
                      </td>
                      <td class="whitespace-nowrap px-3 py-5 font-semibold ">
                        {{ item.price }}₸
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </div>
                <NoResults v-else/>
              </div>
              <div
                  v-else
                  class="border rounded-lg p-2">
                <div
                    v-for="(_, index) of 10"
                    :key="index">
                  <div class="flex justify-between mb-3 border p-2 rounded-lg gap-3">
                    <div
                        class="skeleton w-10 h-4"
                        :class="{ 'bg-[#989898]' : index === 0 }"
                    ></div>
                    <div
                        :class="{ 'bg-[#989898]' : index === 0 }"
                        class="skeleton w-20 h-4"></div>
                    <div
                        :class="{ 'bg-[#989898]' : index === 0 }"
                        class="skeleton w-32 h-4"></div>
                    <div
                        :class="{ 'bg-[#989898]' : index === 0 }"
                        class="skeleton w-1/2 h-4"></div>
                    <div
                        :class="{ 'bg-[#989898]' : index === 0 }"
                        class="skeleton w-1/2 h-4"></div>
                    <div
                        :class="{ 'bg-[#989898]' : index === 0 }"
                        class="skeleton w-20 h-4"></div>
                  </div>
                </div>
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