<script lang="ts" setup>
import {vMaska} from "maska/vue";
import Breadcrumbs from "~/components/general/breadcrumbs.vue";
import {useNotificationStore} from "~/stores/notifications";
import {useVuelidate} from "@vuelidate/core";
import {required} from "@vuelidate/validators";

const localePath = useLocalePath();
const {t} = useI18n();

const links = computed(() => [
  {title: t("breadcrumbs.home"), link: localePath("/")},
  {title: t("breadcrumbs.contacts"), link: localePath("/contacts")},
]);

const loading = ref(false);
const notifications = useNotificationStore();
const route = useRoute();

const form = ref({
  email: "",
  name: "",
  note: "",
  agreement: false,
  phone: "",
});

const agreementTrue = (value) => value === true;

const v$ = useVuelidate(
  {
    email: {required},
    name: {required},
    note: {required},
    agreement: {required, agreementTrue},
    phone: {required, minLength: 11},
  },
  form
);

const sendForm = async () => {
  loading.value = true;
  await v$.value.$validate();

  if (v$.value.$error) {
    notifications.showNotification(
      "error",
      t("contacts.notification.error_title"),
      t("contacts.notification.error_message")
    );
    loading.value = false;
    return;
  }

  try {
    const response = await api(
      `/feedback`,
      "POST",
      {
        body: JSON.stringify(form.value),
      },
      route.query
    );

    notifications.showNotification(
      "success",
      t("contacts.notification.success_title"),
      t("contacts.notification.success_message")
    );
  } catch (e) {
    loading.value = false;
    notifications.showNotification(
      "error",
      t("contacts.notification.error_title"),
      e
    );
  }
};

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
        <h2 class="text-3xl font-bold tracking-tight text-gray-900">
          {{ $t("contacts.title") }}
        </h2>
        <p class="my-3 text-gray-600">
          {{ $t("contacts.description") }}
        </p>
      </div>
      <div class="">
        <!-- North Region -->
        <div>
          <h3
            class="font-semibold text-gray-900"
          >
            Жанбиров Дамир Бауржанович
          </h3>
          <h3
            class="font-semibold text-gray-900 mb-4"
          >
            Қасымжан Ерболсын Дауренұлы
          </h3>


          <address class="not-italic text-gray-600">
            <p class="font-semibold mb-2">
              📧 Электронная почта:
              <NuxtLink
                class="text-mainColor font-normal"
                href="mailto:tq.gazbas@gmail.com">
                tq.gazbas@gmail.com
              </NuxtLink>
            </p>
            <p class="font-semibold mb-2">
              📍Адрес:
              <NuxtLink
                class="text-mainColor font-normal"
                href="https://2gis.kz/almaty/geo/9430047375085852?m=76.874271%2C43.229795%2F16"
                target="_blank">
                г. Алматы, ул. Садовникова 99
              </NuxtLink
              >
            </p>

            <p class="font-semibold mb-2">
              📞 Телефон:
              <NuxtLink
                class="text-mainColor font-normal"
                href="tel:+77767131333">
                +7 (776) 713-13-33
              </NuxtLink>
            </p>
            <p class="font-semibold mb-2">
              📞 Телефон:
              <NuxtLink
                class="text-mainColor font-normal"
                href="tel:+77472377975">
                +7 (747) 237-79-75
              </NuxtLink>
            </p>
          </address>
          <p class="my-6 leading-8 text-gray-600">
            Мы ценим ваше время и стремимся отвечать максимально быстро. Обращайтесь, и мы обязательно поможем!
          </p>
        </div>
      </div>
      <div class="flex flex-col md:flex-row gap-10">
        <form class="w-full lg:flex-auto" @submit.prevent="sendForm">
          <div class="mx-auto">
            <div class="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
              <div class="sm:col-span-2">
                <label
                  class="block text-sm font-semibold leading-6 text-gray-900"
                  for="first-name"
                >
                  {{ $t("contacts.form.name") }}
                </label>
                <div class="mt-2.5">
                  <input
                    id="first-name"
                    v-model="form.name"
                    :class="{ '!border !border-red-500': v$.name.$error }"
                    autocomplete="given-name"
                    class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-mainColor sm:text-sm sm:leading-6"
                    placeholder="Иван Иванов"
                    type="text"
                  />
                </div>
              </div>
              <div class="sm:col-span-2">
                <label
                  class="block text-sm font-semibold leading-6 text-gray-900"
                  for="email"
                >{{ $t("contacts.form.email") }}</label
                >
                <div class="mt-2.5">
                  <input
                    id="email"
                    v-model="form.email"
                    :class="{ '!border !border-red-500': v$.email.$error }"
                    autocomplete="email"
                    class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-mainColor sm:text-sm sm:leading-6"
                    placeholder="test@test.com"
                    type="email"
                  />
                </div>
              </div>
              <div class="sm:col-span-2">
                <label
                  class="block text-sm font-semibold leading-6 text-gray-900"
                  for="phone-number"
                >
                  {{ $t("contacts.form.phone") }}
                </label>
                <div class="mt-2.5">
                  <input
                    id="phone-number"
                    v-model="form.phone"
                    v-maska
                    :class="{ '!border !border-red-500': v$.phone.$error }"
                    autocomplete="tel"
                    class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-mainColor sm:text-sm sm:leading-6"
                    data-maska="+7 (###) ###-##-##"
                    placeholder="+7 (___) ___-__-__"
                    type="tel"
                  />
                </div>
              </div>
              <div class="sm:col-span-2">
                <label
                  class="block text-sm font-semibold leading-6 text-gray-900"
                  for="message"
                >
                  {{ $t("contacts.form.message") }}
                </label>
                <div class="mt-2.5">
                  <textarea
                    id="message"
                    v-model="form.note"
                    :class="{ '!border !border-red-500': v$.note.$error }"
                    class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-mainColor sm:text-sm sm:leading-6"
                    placeholder="Ваше сообщение..."
                    rows="4"
                  />
                </div>
              </div>
            </div>
            <div class="mt-8 flex flex-col gap-5">
              <div class="flex items-center">
                <input
                  id="agreement"
                  v-model="form.agreement"
                  :class="{ '!border !border-red-500': v$.agreement.$error }"
                  aria-describedby="agreement-description"
                  class="rounded border-gray-300 text-mainColor focus:ring-mainColor"
                  type="checkbox"
                />
                <label class="ml-2 block text-sm text-gray-900" for="agreement">
                  {{ $t("contacts.form.agreement") }}
                </label>
              </div>
              <button
                class="rounded-md bg-mainColor px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mainColor"
                type="submit"
              >
                {{ $t("contacts.form.submit") }}
              </button>
            </div>
          </div>
        </form>
        <iframe
          allowfullscreen="true"
          frameborder="0"
          height="538"
          src="https://yandex.kz/map-widget/v1/?ll=76.874149%2C43.229194&mode=search&oid=100256009348&ol=biz&z=17.14"
          style="position:relative;"
          width="100%"></iframe>
      </div>
    </div>
  </div>
</template>