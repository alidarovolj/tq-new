<script setup>
import {vMaska} from "maska/vue"
import {BuildingOffice2Icon, EnvelopeIcon, PhoneIcon} from "@heroicons/vue/24/outline"
import {useVuelidate} from "@vuelidate/core";
import {required} from "@vuelidate/validators";
import {useNotificationStore} from "~/stores/notifications.js";

const loading = ref(false);
const notifications = useNotificationStore()
const route = useRoute()

const form = ref({
  email: "",
  name: "",
  note: "",
  agreement: false,
  phone: ""
})

const agreementTrue = (value) => value === true;

const v$ = useVuelidate({
  email: {required},
  name: {required},
  note: {required},
  agreement: {required, agreementTrue},
  phone: {required, minLength: 11},
}, form);

const sendForm = async () => {
  loading.value = true;
  await v$.value.$validate();

  if (v$.value.$error) {
    notifications.showNotification("error", "Данные не заполнены", "Проверьте правильность введенных данных и попробуйте снова.");
    loading.value = false;
    return;
  }

  try {
    const response = await api(`/feedback`, "POST", {
      body: JSON.stringify(form.value)
    }, route.query);

    notifications.showNotification("success", "Успешно", "Вы успешно отправили сообщение, мы свяжемся с вами в ближайшее время.");
    form.value = {
      email: "",
      name: "",
      note: "",
      agreement: false,
      phone: ""
    }
    loading.value = false;
    v$.value.$reset()
  } catch (e) {
    loading.value = false;
    notifications.showNotification("error", "Произошла ошибка", e);
  }

}
</script>

<template>
  <div class="relative isolate bg-white">
    <div class="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2">
      <div class="relative px-6 pb-20 pt-24 sm:pt-32 lg:static lg:px-8 lg:py-48">
        <div class="mx-auto max-w-xl lg:mx-0 lg:max-w-lg">
          <div
              class="absolute inset-y-0 left-0 -z-10 w-full overflow-hidden bg-gray-100 ring-1 ring-gray-900/10 lg:w-1/2">
            <svg
                class="absolute inset-0 h-full w-full stroke-gray-200 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
                aria-hidden="true">
              <defs>
                <pattern id="83fd4e5a-9d52-42fc-97b6-718e5d7ee527" width="200" height="200" x="100%" y="-1"
                         patternUnits="userSpaceOnUse">
                  <path d="M130 200V.5M.5 .5H200" fill="none"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" stroke-width="0" fill="white"/>
              <svg x="100%" y="-1" class="overflow-visible fill-gray-50">
                <path d="M-470.5 0h201v201h-201Z" stroke-width="0"/>
              </svg>
              <rect width="100%" height="100%" stroke-width="0" fill="url(#83fd4e5a-9d52-42fc-97b6-718e5d7ee527)"/>
            </svg>
          </div>
          <h2 class="text-3xl font-bold tracking-tight text-gray-900">Свяжитесь с нами</h2>
          <p class="mt-6 text-lg leading-8 text-gray-600">
            Напишите нам, и мы ответим вам в ближайшее время. Если у вас есть вопросы, предложения или пожелания, мы
            всегда рады помочь.
          </p>
          <dl class="mt-10 space-y-4 text-base leading-7 text-gray-600">
            <div class="flex gap-x-4">
              <dt class="flex-none">
                <span class="sr-only">Адрес</span>
                <BuildingOffice2Icon class="h-7 w-6 text-gray-400" aria-hidden="true"/>
              </dt>
              <dd>Алматы, Казахстан, Садовников 99</dd>
            </div>
            <div class="flex gap-x-4">
              <dt class="flex-none">
                <span class="sr-only">Телефон</span>
                <PhoneIcon class="h-7 w-6 text-gray-400" aria-hidden="true"/>
              </dt>
              <dd><a class="hover:text-gray-900" href="tel:+77714142525">+7 (771) 414-25-25</a></dd>
            </div>
            <div class="flex gap-x-4">
              <dt class="flex-none">
                <span class="sr-only">Email</span>
                <EnvelopeIcon class="h-7 w-6 text-gray-400" aria-hidden="true"/>
              </dt>
              <dd><a class="hover:text-gray-900" href="mailto:support@tq.kz">support@tq.kz</a></dd>
            </div>
          </dl>
        </div>
      </div>
      <form
          @submit.prevent="sendForm"
          class="px-6 pb-24 pt-20 sm:pb-32 lg:px-8 lg:py-48">
        <div class="mx-auto max-w-xl lg:mr-0 lg:max-w-lg">
          <div class="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
            <div>
              <label for="first-name" class="block text-sm font-semibold leading-6 text-gray-900">
                Имя
              </label>
              <div class="mt-2.5">
                <input
                    v-model="form.name"
                    :class="{ '!border !border-red-500' : v$.name.$error }"
                    type="text"
                    name="first-name"
                    id="first-name"
                    autocomplete="given-name"
                    placeholder="Иван Иванов"
                    class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-mainColor sm:text-sm sm:leading-6"/>
              </div>
            </div>
            <div class="sm:col-span-2">
              <label for="email" class="block text-sm font-semibold leading-6 text-gray-900">Email</label>
              <div class="mt-2.5">
                <input
                    v-model="form.email"
                    :class="{ '!border !border-red-500' : v$.email.$error }"
                    type="email"
                    name="email"
                    id="email"
                    autocomplete="email"
                    placeholder="test@test.com"
                    class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-mainColor sm:text-sm sm:leading-6"/>
              </div>
            </div>
            <div class="sm:col-span-2">
              <label for="phone-number" class="block text-sm font-semibold leading-6 text-gray-900">
                Номер телефона
              </label>
              <div class="mt-2.5">
                <input
                    v-model="form.phone"
                    :class="{ '!border !border-red-500' : v$.phone.$error }"
                    type="tel"
                    name="phone-number"
                    id="phone-number"
                    autocomplete="tel"
                    v-maska
                    data-maska="+7 (###) ###-##-##"
                    placeholder="+7 (___) ___-__-__"
                    class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-mainColor sm:text-sm sm:leading-6"/>
              </div>
            </div>
            <div class="sm:col-span-2">
              <label for="message" class="block text-sm font-semibold leading-6 text-gray-900">
                Сообщение
              </label>
              <div class="mt-2.5">
                <textarea
                    v-model="form.note"
                    :class="{ '!border !border-red-500' : v$.note.$error }"
                    name="message"
                    id="message"
                    rows="4"
                    placeholder="Ваше сообщение..."
                    class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-mainColor sm:text-sm sm:leading-6"/>
              </div>
            </div>
          </div>
          <div class="mt-8 flex flex-col gap-5">
            <div class="flex items-center">
              <input
                  v-model="form.agreement"
                  :class="{ '!border !border-red-500' : v$.agreement.$error }"
                  type="checkbox"
                  id="agreement"
                  class="rounded border-gray-300 text-mainColor focus:ring-mainColor"
                  aria-describedby="agreement-description"/>
              <label for="agreement" class="ml-2 block text-sm text-gray-900">
                Подавая заявку, вы принимаете условия офертового соглашения и соглашаетесь на обработку ваших
                персональных данных в соответствии с политикой конфиденциальности
              </label>
            </div>
            <button type="submit"
                    class="rounded-md bg-mainColor px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mainColor">
              Отправить сообщение
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>