<script setup>
import { vMaska } from "maska/vue";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { useNotificationStore } from "~/stores/notifications.js";
import img1 from "@/assets/img/auth/1.jpg";
import img2 from "@/assets/img/auth/2.jpg";
import img3 from "@/assets/img/auth/3.jpg";
import { useAddressesStore } from "~/stores/addresses.js";

const loading = ref(false);
const notifications = useNotificationStore();
const route = useRoute();
const router = useRouter();
const localePath = useLocalePath();
const addresses = useAddressesStore();
const { citiesList } = storeToRefs(addresses);

const form = ref({
  phone: route.query.phone,
  code: "",
});

const v$ = useVuelidate(
  {
    phone: { required, minLength: 11 },
    code: { required },
  },
  form
);

const carousel = ref([img1, img2, img3]);

const breakpoints = ref({
  0: {
    itemsToShow: 1,
    snapAlign: "center",
  },
  700: {
    itemsToShow: 1,
    snapAlign: "start",
  },
});

const registerUser = async () => {
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

  try {
    const response = await api(
      `/validate-phone/`,
      "POST",
      {
        body: JSON.stringify(form.value),
      },
      route.query
    );

    if (response.success) {
      notifications.showNotification(
        "success",
        "Успешно",
        "Вы успешно подтвердили номер телефона!"
      );
      loading.value = false;
      await router.push({
        path: localePath("/registration/verify-code/create-data"),
        query: { phone: form.value.phone },
      });
    }
  } catch (e) {
    notifications.showNotification("error", "Произошла ошибка", e);
  }
  loading.value = false;
};
</script>

<template>
  <div class="container mx-auto px-4 lg:px-0">
    <div class="flex min-h-full flex-1 items-center py-10">
      <div
        class="flex flex-1 flex-col justify-center px-4 sm:pr-6 lg:flex-none lg:pr-20 xl:pr-24"
      >
        <div class="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <h2
              class="text-2xl font-bold leading-9 tracking-tight text-gray-900"
            >
              {{ $t("forms.registration.verify_code") }}
            </h2>
            <!--            <p class="mt-2 text-sm leading-6 text-gray-500">-->
            <!--              {{ $t('forms.registration.already_have') }}-->
            <!--              {{ ' ' }}-->
            <!--              <NuxtLink-->
            <!--                  :to="localePath('/login')"-->
            <!--                  class="font-semibold text-mainColor">-->
            <!--                {{ $t('forms.registration.login') }}-->
            <!--              </NuxtLink>-->
            <!--            </p>-->
          </div>

          <div class="mt-10">
            <div>
              <form action="" class="space-y-6" @submit.prevent="registerUser">
                <div
                  :class="{ '!border !border-red-500': v$.phone.$error }"
                  class="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600"
                >
                  <label
                    class="block text-xs font-medium text-gray-900"
                    for="phone"
                  >
                    {{ $t("forms.phone_number.title") }}
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
                  :class="{ '!border !border-red-500': v$.code.$error }"
                  class="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600"
                >
                  <label
                    class="block text-xs font-medium text-gray-900"
                    for="name"
                  >
                    {{ $t("forms.registration.code") }}
                  </label>
                  <input
                    id="name"
                    v-model="form.code"
                    autocomplete="name"
                    class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    name="name"
                    placeholder="Введите код"
                    type="text"
                  />
                </div>

                <div>
                  <button
                    class="flex w-full justify-center rounded-md bg-mainColor px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mainColor"
                    type="submit"
                  >
                    {{ $t("forms.registration.verify") }}
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
              <my-carousel-pagination />
            </template>
          </my-carousel-carousel>
        </client-only>
      </div>
    </div>
  </div>
</template>
