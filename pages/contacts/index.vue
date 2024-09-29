<script lang="ts" setup>
import {vMaska} from "maska/vue"
import Breadcrumbs from "~/components/general/breadcrumbs.vue";
import {useNotificationStore} from "~/stores/notifications";
import {useVuelidate} from "@vuelidate/core";
import {required} from "@vuelidate/validators";

const localePath = useLocalePath()
const {t} = useI18n()

const links = computed(() => [
  {title: t('breadcrumbs.home'), link: localePath('/')},
  {title: t('breadcrumbs.contacts'), link: localePath('/contacts')},
]);

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
    notifications.showNotification("error", t('contacts.notification.error_title'), t('contacts.notification.error_message'));
    loading.value = false;
    return;
  }

  try {
    const response = await api(`/feedback`, "POST", {
      body: JSON.stringify(form.value)
    }, route.query);

    notifications.showNotification("success", t('contacts.notification.success_title'), t('contacts.notification.success_message'));
  } catch (e) {
    loading.value = false;
    notifications.showNotification("error", t('contacts.notification.error_title'), e);
  }
}

useHead({
  title: t("headers.contacts.title"),
  meta: [
    {
      property: "description",
      content: t("headers.contacts.description"),
    },
    {
      property: "og:description",
      content: t("headers.contacts.description"),
    },
    {
      property: "og:title",
      content: t("headers.contacts.title"),
    },
    {
      property: "og:url",
      content: t("headers.contacts.og_url"),
    },
  ],
  link: [{rel: "canonical", href: t("headers.contacts.canonical")}],
});
</script>

<template>
  <Breadcrumbs :links="links"/>
  <div class="pt-12 pb-32">
    <div class="container mx-auto px-4 md:px-0">
      <div class="mx-auto max-w-2xl lg:mx-0">
        <h2 class="text-3xl font-bold tracking-tight text-gray-900">{{ $t('contacts.title') }}</h2>
        <p class="my-6 leading-8 text-gray-600">{{ $t('contacts.description') }}</p>
      </div>
      <div class="flex flex-col md:flex-row gap-10">
        <form
            class="w-full lg:flex-auto"
            @submit.prevent="sendForm">
          <div class="mx-auto">
            <div class="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
              <div>
                <label class="block text-sm font-semibold leading-6 text-gray-900" for="first-name">
                  {{ $t('contacts.form.name') }}
                </label>
                <div class="mt-2.5">
                  <input
                      id="first-name"
                      v-model="form.name"
                      :class="{ '!border !border-red-500' : v$.name.$error }"
                      autocomplete="given-name"
                      class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-mainColor sm:text-sm sm:leading-6"
                      placeholder="Иван Иванов"
                      type="text"/>
                </div>
              </div>
              <div class="sm:col-span-2">
                <label class="block text-sm font-semibold leading-6 text-gray-900" for="email">{{ $t('contacts.form.email') }}</label>
                <div class="mt-2.5">
                  <input
                      id="email"
                      v-model="form.email"
                      :class="{ '!border !border-red-500' : v$.email.$error }"
                      autocomplete="email"
                      class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-mainColor sm:text-sm sm:leading-6"
                      placeholder="test@test.com"
                      type="email"/>
                </div>
              </div>
              <div class="sm:col-span-2">
                <label class="block text-sm font-semibold leading-6 text-gray-900" for="phone-number">
                  {{ $t('contacts.form.phone') }}
                </label>
                <div class="mt-2.5">
                  <input
                      id="phone-number"
                      v-model="form.phone"
                      v-maska
                      :class="{ '!border !border-red-500' : v$.phone.$error }"
                      autocomplete="tel"
                      class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-mainColor sm:text-sm sm:leading-6"
                      data-maska="+7 (###) ###-##-##"
                      placeholder="+7 (___) ___-__-__"
                      type="tel"/>
                </div>
              </div>
              <div class="sm:col-span-2">
                <label class="block text-sm font-semibold leading-6 text-gray-900" for="message">
                  {{ $t('contacts.form.message') }}
                </label>
                <div class="mt-2.5">
                <textarea
                    id="message"
                    v-model="form.note"
                    :class="{ '!border !border-red-500' : v$.note.$error }"
                    class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-mainColor sm:text-sm sm:leading-6"
                    placeholder="Ваше сообщение..."
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
                  {{ $t('contacts.form.agreement') }}
                </label>
              </div>
              <button class="rounded-md bg-mainColor px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mainColor"
                      type="submit">
                {{ $t('contacts.form.submit') }}
              </button>
            </div>
          </div>
        </form>
        <iframe
            frameborder="0"
            height="538" src="https://yandex.ru/map-widget/v1/?um=constructor%3A4c6d3f0416cfdbf45c45ea2f3603b94ebf8147db2aaac311ea6d6bba015a23b9&amp;source=constructor" width="100%"></iframe>
      </div>
      <div
          class="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 text-base leading-7 sm:grid-cols-2 sm:gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-4">

        <!-- North Region -->
        <div>
          <h3 class="border-l border-mainColor pl-6 font-semibold text-gray-900">
            {{ $t('contacts.regions.north.title') }}
          </h3>
          <address class="border-l border-gray-200 pl-6 pt-2 not-italic text-gray-600">
            <p>{{ $t('contacts.regions.north.regions[0]') }}</p>
            <p>{{ $t('contacts.regions.north.regions[1]') }}</p>
            <p>{{ $t('contacts.regions.north.regions[2]') }}</p>
            <p>{{ $t('contacts.regions.north.regions[3]') }}</p>
            <p>{{ $t('contacts.regions.north.regions[4]') }}</p>
            <p>{{ $t('contacts.regions.north.regions[5]') }}</p>
            <p>{{ $t('contacts.regions.north.regions[6]') }}</p>
            <p class="font-semibold mt-5">
              {{ $t('contacts.regions.north.contact_name') }} <a class="text-mainColor font-normal" href="tel:+7 775 245-33-03">+7 775 245-33-03</a>
            </p>
          </address>
        </div>

        <!-- West Region -->
        <div>
          <h3 class="border-l border-mainColor pl-6 font-semibold text-gray-900">
            {{ $t('contacts.regions.west.title') }}
          </h3>
          <address class="border-l border-gray-200 pl-6 pt-2 not-italic text-gray-600">
            <p>{{ $t('contacts.regions.west.regions[0]') }}</p>
            <p>{{ $t('contacts.regions.west.regions[1]') }}</p>
            <p>{{ $t('contacts.regions.west.regions[2]') }}</p>
            <p>{{ $t('contacts.regions.west.regions[3]') }}</p>
            <p class="font-semibold mt-5">
              {{ $t('contacts.regions.west.contact_name') }} <a class="text-mainColor font-normal" href="tel:+7 776 713-13-33">+7 776 713-13-33</a>
            </p>
          </address>
        </div>

        <!-- South Region -->
        <div>
          <h3 class="border-l border-mainColor pl-6 font-semibold text-gray-900">
            {{ $t('contacts.regions.south.title') }}
          </h3>
          <address class="border-l border-gray-200 pl-6 pt-2 not-italic text-gray-600">
            <p>{{ $t('contacts.regions.south.regions[0]') }}</p>
            <p>{{ $t('contacts.regions.south.regions[1]') }}</p>
            <p>{{ $t('contacts.regions.south.regions[2]') }}</p>
            <p>{{ $t('contacts.regions.south.regions[3]') }}</p>
            <p>{{ $t('contacts.regions.south.regions[4]') }}</p>
            <p>{{ $t('contacts.regions.south.regions[5]') }}</p>
            <p>{{ $t('contacts.regions.south.regions[6]') }}</p>
            <p>{{ $t('contacts.regions.south.regions[7]') }}</p>
            <p>{{ $t('contacts.regions.south.regions[8]') }}</p>
            <p class="font-semibold mt-5">
              {{ $t('contacts.regions.south.contact_name') }} <a class="text-mainColor font-normal" href="tel:+7 707 111 97 81">+7 707 111 97 81</a>
            </p>
          </address>
        </div>

        <!-- Car City Region -->
        <div>
          <h3 class="border-l border-mainColor pl-6 font-semibold text-gray-900">
            {{ $t('contacts.regions.car_city.title') }}
          </h3>
          <address class="border-l border-gray-200 pl-6 pt-2 not-italic text-gray-600">
            <p class="font-semibold mt-5">
              {{ $t('contacts.regions.car_city.contact_name') }} <a class="text-mainColor font-normal" href="tel:+7 747 237-79-75">+7 747 237-79-75</a>
            </p>
          </address>
        </div>

      </div>

    </div>
  </div>
</template>
