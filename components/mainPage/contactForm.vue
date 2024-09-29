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
            <!-- SVG background omitted for brevity -->
          </div>
          <h2 class="text-3xl font-bold tracking-tight text-gray-900">{{ $t('contact_form.title') }}</h2>
          <p class="mt-6 text-lg leading-8 text-gray-600">{{ $t('contact_form.description') }}</p>
          <dl class="mt-10 space-y-4 text-base leading-7 text-gray-600">
            <div class="flex gap-x-4">
              <dt class="flex-none">
                <span class="sr-only">{{ $t('contact_form.icons.address') }}</span>
                <BuildingOffice2Icon aria-hidden="true" class="h-7 w-6 text-gray-400"/>
              </dt>
              <dd>{{ $t('contact_form.address') }}</dd>
            </div>
            <div class="flex gap-x-4">
              <dt class="flex-none">
                <span class="sr-only">{{ $t('contact_form.icons.phone') }}</span>
                <PhoneIcon aria-hidden="true" class="h-7 w-6 text-gray-400"/>
              </dt>
              <dd><a class="hover:text-gray-900" href="tel:+77714142525">{{ $t('contact_form.phone') }}: +7 (771) 414-25-25</a></dd>
            </div>
            <div class="flex gap-x-4">
              <dt class="flex-none">
                <span class="sr-only">{{ $t('contact_form.icons.email') }}</span>
                <EnvelopeIcon aria-hidden="true" class="h-7 w-6 text-gray-400"/>
              </dt>
              <dd><a class="hover:text-gray-900" href="mailto:support@tq.kz">{{ $t('contact_form.email') }}: support@tq.kz</a></dd>
            </div>
          </dl>
        </div>
      </div>
      <form class="px-6 pb-24 pt-20 sm:pb-32 lg:px-8 lg:py-48" @submit.prevent="sendForm">
        <div class="mx-auto max-w-xl lg:mr-0 lg:max-w-lg">
          <div class="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
            <div>
              <label class="block text-sm font-semibold leading-6 text-gray-900" for="first-name">{{ $t('contact_form.fields.name') }}</label>
              <div class="mt-2.5">
                <input
                    id="first-name"
                    v-model="form.name"
                    :class="{ '!border !border-red-500' : v$.name.$error }"
                    autocomplete="given-name"
                    class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-mainColor sm:text-sm sm:leading-6"
                    :placeholder="$t('contact_form.placeholders.name')"
                    type="text"/>
              </div>
            </div>
            <div class="sm:col-span-2">
              <label class="block text-sm font-semibold leading-6 text-gray-900" for="email">{{ $t('contact_form.fields.email') }}</label>
              <div class="mt-2.5">
                <input
                    id="email"
                    v-model="form.email"
                    :class="{ '!border !border-red-500' : v$.email.$error }"
                    autocomplete="email"
                    class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-mainColor sm:text-sm sm:leading-6"
                    :placeholder="$t('contact_form.placeholders.email')"
                    type="email"/>
              </div>
            </div>
            <div class="sm:col-span-2">
              <label class="block text-sm font-semibold leading-6 text-gray-900" for="phone-number">{{ $t('contact_form.fields.phone') }}</label>
              <div class="mt-2.5">
                <input
                    id="phone-number"
                    v-model="form.phone"
                    v-maska
                    :class="{ '!border !border-red-500' : v$.phone.$error }"
                    autocomplete="tel"
                    class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-mainColor sm:text-sm sm:leading-6"
                    data-maska="+7 (###) ###-##-##"
                    :placeholder="$t('contact_form.placeholders.phone')"
                    type="tel"/>
              </div>
            </div>
            <div class="sm:col-span-2">
              <label class="block text-sm font-semibold leading-6 text-gray-900" for="message">{{ $t('contact_form.fields.message') }}</label>
              <div class="mt-2.5">
                <textarea
                    id="message"
                    v-model="form.note"
                    :class="{ '!border !border-red-500' : v$.note.$error }"
                    class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-mainColor sm:text-sm sm:leading-6"
                    :placeholder="$t('contact_form.placeholders.message')"
                    rows="4"/>
              </div>
            </div>
          </div>
          <div class="mt-8 flex flex-col gap-5">
            <div class="flex items-center">
              <input
                  id="agreement"
                  v-model="form.agreement"
                  :class="{ '!border !border-red-500' : v$.agreement.$error }"
                  aria-describedby="agreement-description"
                  class="rounded border-gray-300 text-mainColor focus:ring-mainColor"
                  type="checkbox"/>
              <label class="ml-2 block text-sm text-gray-900" for="agreement">
                {{ $t('contact_form.fields.agreement') }}
              </label>
            </div>
            <button class="rounded-md bg-mainColor px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mainColor"
                    type="submit">
              {{ $t('contact_form.submit') }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
