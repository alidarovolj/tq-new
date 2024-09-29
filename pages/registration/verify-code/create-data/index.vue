<script setup>
import {vMaska} from "maska/vue"
import {useVuelidate} from "@vuelidate/core"
import {required} from "@vuelidate/validators"
import {useNotificationStore} from "~/stores/notifications.js";
import img1 from "@/assets/img/auth/1.jpg";
import img2 from "@/assets/img/auth/2.jpg";
import img3 from "@/assets/img/auth/3.jpg";
import {useAddressesStore} from "~/stores/addresses.js";
import {useUserStore} from "~/stores/user.js";

const loading = ref(false);
const notifications = useNotificationStore()
const route = useRoute()
const router = useRouter()
const localePath = useLocalePath()
const addresses = useAddressesStore()
const {citiesList} = storeToRefs(addresses)
const auth = useAuthStore()
const user = useUserStore()

const form = ref({
  name: '',
  phone: route.query.phone,
  email: '',
  city_id: null,
  password: ''
})

const v$ = useVuelidate({
  name: {required},
  phone: {required, minLength: 11},
  city_id: {required},
  password: {required}
}, form);

const carousel = ref([
  img1, img2, img3
])

const breakpoints = ref({
  0: {
    itemsToShow: 1,
    snapAlign: "center"
  },
  700: {
    itemsToShow: 1,
    snapAlign: "start"
  }
})

const registerUser = async () => {
  loading.value = true;
  await v$.value.$validate();

  if (v$.value.$error) {
    notifications.showNotification("error", "Данные не заполнены", "Проверьте правильность введенных данных и попробуйте снова.");
    loading.value = false;
    return;
  }

  try {
    const response = await api(`/signup`, "POST", {
      body: JSON.stringify(form.value)
    }, route.query);

    await auth.initCookieToken(response.data.token);
    auth.token = response.data.token;
    await nextTick()
    notifications.showNotification("success", "Успешно", "Вы успешно зарегистрировались!");
    await user.getProfile()
    loading.value = false;
    await router.push(localePath('/'));
  } catch (e) {
    notifications.showNotification("error", "Произошла ошибка", e);
  }
  loading.value = false;
}

onMounted(async () => {
  await nextTick()
  await addresses.getCities()
})
</script>

<template>
  <div class="container mx-auto px-4 lg:px-0">
    <div class="flex min-h-full flex-1 items-center py-10">
      <div class="flex flex-1 flex-col justify-center px-4 sm:pr-6 lg:flex-none lg:pr-20 xl:pr-24">
        <div class="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <h2 class="text-2xl font-bold leading-9 tracking-tight text-gray-900">
              {{ $t('forms.registration.title') }}
            </h2>
            <p class="mt-2 text-sm leading-6 text-gray-500">
              {{ $t('forms.registration.already_have') }}
              {{ ' ' }}
              <NuxtLink
                  :to="localePath('/login')"
                  class="font-semibold text-mainColor">
                {{ $t('forms.registration.login') }}
              </NuxtLink>
            </p>
          </div>

          <div class="mt-10">
            <div>
              <form
                  action=""
                  class="space-y-6"
                  @submit.prevent="registerUser">

                <div
                    :class="{ '!border !border-red-500' : v$.name.$error }"
                    class="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                  <label class="block text-xs font-medium text-gray-900" for="name">
                    {{ $t('forms.name.title') }}
                  </label>
                  <input
                      id="name"
                      v-model="form.name"
                      :placeholder="$t('forms.name.placeholder')"
                      autocomplete="name"
                      class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      name="name"
                      type="text"
                  />
                </div>

                <div
                    :class="{ '!border !border-red-500' : v$.phone.$error }"
                    class="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                  <label class="block text-xs font-medium text-gray-900" for="phone">
                    {{ $t('forms.phone_number.title') }}
                  </label>
                  <input
                      id="phone"
                      v-model="form.phone"
                      v-maska
                      autocomplete="phone"
                      class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      data-maska="+7 (###) ###-##-##"
                      disabled
                      name="phone"
                      placeholder="+7 (___) ___-__-__"
                      type="text"
                  />
                </div>

                <div
                    class="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                  <label class="block text-xs font-medium text-gray-900" for="email">
                    {{ $t('forms.email.title') }} <span class="text-gray-400">(необязательно)</span>
                  </label>
                  <input
                      id="email"
                      v-model="form.email"
                      :placeholder="$t('forms.email.placeholder')"
                      autocomplete="email"
                      class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      name="email"
                      type="text"
                  />
                </div>

                <div
                    v-if="citiesList"
                    :class="{ '!border !border-red-500' : v$.city_id.$error }"
                    class="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                  <label
                      class="block text-xs font-medium text-gray-900"
                      for="city">
                    {{ $t('addresses.create.city') }}
                  </label>
                  <select
                      id="city"
                      v-model="form.city_id"
                      :class="{ 'border-red-500' : v$.city_id.$error }"
                      class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      name="city">
                    <option :value="null">{{ $t('addresses.create.city_placeholder') }}</option>
                    <option
                        v-for="(city, index) of addresses.citiesList"
                        :key="index"
                        :value="city.id">
                      {{ city.name }}
                    </option>
                  </select>
                </div>

                <div
                    :class="{ '!border !border-red-500' : v$.password.$error }"
                    class="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                  <label class="block text-xs font-medium text-gray-900" for="password">
                    {{ $t('forms.password.title') }}
                  </label>
                  <input
                      id="password"
                      v-model="form.password"
                      autocomplete="password"
                      class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      name="password"
                      placeholder="********"
                      type="password"
                  />
                </div>

                <ul class="list-disc pl-5 text-xs">
                  <li :class="{ 'text-green-600' : form.password.length >= 8 }">
                    {{ $t('forms.registration.rules.first') }}
                  </li>
                  <li :class="{ 'text-green-600' : /[A-Z]/.test(form.password) }">
                    {{ $t('forms.registration.rules.second') }}
                  </li>
                  <li :class="{ 'text-green-600' : /[a-z]/.test(form.password) }">
                    {{ $t('forms.registration.rules.third') }}
                  </li>
                  <li :class="{ 'text-green-600' : /[0-9]/.test(form.password) }">
                    {{ $t('forms.registration.rules.fourth') }}
                  </li>
                </ul>

                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <input id="remember-me" class="h-4 w-4 rounded border-gray-300 text-mainColor focus:ring-mainColor" name="remember-me"
                           type="checkbox"/>
                    <label class="ml-3 block text-sm leading-6 text-gray-700" for="remember-me">
                      {{ $t('forms.remember_me') }}
                    </label>
                  </div>

                  <div class="text-sm leading-6">
                    <NuxtLink
                        :to="localePath('/forgot-password')"
                        class="font-semibold text-mainColor">
                      {{ $t('forms.forgot_pass') }}
                    </NuxtLink>
                  </div>
                </div>

                <div>
                  <button class="flex w-full justify-center rounded-md bg-mainColor px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mainColor"
                          type="submit">
                    {{ $t('forms.registration.button') }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div class="relative hidden w-full md:block auth">
        <client-only>
          <my-carousel-carousel
              :breakpoints="breakpoints"
              :mouse-drag="true"
              :touch-drag="true"
          >
            <my-carousel-slide
                v-for="(item, index) of carousel"
                :key="index"
                class="h-full"
            >
              <img
                  :src="item"
                  alt=""
                  class="w-full h-full object-cover rounded-2xl"
              />
            </my-carousel-slide>
            <template #addons>
              <my-carousel-pagination/>
            </template>
          </my-carousel-carousel>
        </client-only>
      </div>
    </div>
  </div>
</template>
