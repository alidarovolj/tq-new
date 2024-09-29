<script lang="ts" setup>
import {vMaska} from "maska/vue"
import Breadcrumbs from "~/components/general/breadcrumbs.vue";
import {useNotificationStore} from "~/stores/notifications";
import {useVuelidate} from "@vuelidate/core";
import {required} from "@vuelidate/validators";

const localePath = useLocalePath()

const links = computed(() => [
  {title: "Главная", link: localePath('/')},
  {title: "Контакты", link: localePath('/contacts')},
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
    notifications.showNotification("error", "Данные не заполнены", "Проверьте правильность введенных данных и попробуйте снова.");
    loading.value = false;
    return;
  }

  try {
    const response = await api(`/feedback`, "POST", {
      body: JSON.stringify(form.value)
    }, route.query);

    notifications.showNotification("success", "Успешно", "Вы успешно отправили сообщение, мы свяжемся с вами в ближайшее время.");
  } catch (e) {
    loading.value = false;
    notifications.showNotification("error", "Произошла ошибка", e);
  }

}
</script>

<template>
  <Breadcrumbs :links="links"/>
  <div class="pt-12 pb-32">
    <div class="container mx-auto px-4 md:px-0">
      <div class="mx-auto max-w-2xl lg:mx-0">
        <h2 class="text-3xl font-bold tracking-tight text-gray-900">Наши контакты</h2>
        <p class="my-6 leading-8 text-gray-600">
          Вы можете связаться с нами по любым вопросам, связанным с нашей деятельностью. Мы всегда рады помочь вам.
        </p>
      </div>
      <div class="flex flex-col md:flex-row gap-10">
        <form
            class="w-full lg:flex-auto"
            @submit.prevent="sendForm">
          <div class="mx-auto">
            <div class="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
              <div>
                <label class="block text-sm font-semibold leading-6 text-gray-900" for="first-name">
                  Имя
                </label>
                <div class="mt-2.5">
                  <input
                      id="first-name"
                      v-model="form.name"
                      :class="{ '!border !border-red-500' : v$.name.$error }"
                      autocomplete="given-name"
                      class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-mainColor sm:text-sm sm:leading-6"
                      name="first-name"
                      placeholder="Иван Иванов"
                      type="text"/>
                </div>
              </div>
              <div class="sm:col-span-2">
                <label class="block text-sm font-semibold leading-6 text-gray-900" for="email">Email</label>
                <div class="mt-2.5">
                  <input
                      id="email"
                      v-model="form.email"
                      :class="{ '!border !border-red-500' : v$.email.$error }"
                      autocomplete="email"
                      class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-mainColor sm:text-sm sm:leading-6"
                      name="email"
                      placeholder="test@test.com"
                      type="email"/>
                </div>
              </div>
              <div class="sm:col-span-2">
                <label class="block text-sm font-semibold leading-6 text-gray-900" for="phone-number">
                  Номер телефона
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
                      name="phone-number"
                      placeholder="+7 (___) ___-__-__"
                      type="tel"/>
                </div>
              </div>
              <div class="sm:col-span-2">
                <label class="block text-sm font-semibold leading-6 text-gray-900" for="message">
                  Сообщение
                </label>
                <div class="mt-2.5">
                <textarea
                    id="message"
                    v-model="form.note"
                    :class="{ '!border !border-red-500' : v$.note.$error }"
                    class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-mainColor sm:text-sm sm:leading-6"
                    name="message"
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
                  Подавая заявку, вы принимаете условия офертового соглашения и соглашаетесь на обработку ваших
                  персональных данных в соответствии с политикой конфиденциальности
                </label>
              </div>
              <button class="rounded-md bg-mainColor px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mainColor"
                      type="submit">
                Отправить сообщение
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
        <div>
          <h3 class="border-l border-mainColor pl-6 font-semibold text-gray-900">По вопросам сотрудничества:</h3>
          <address class="border-l border-gray-200 pl-6 pt-2 not-italic text-gray-600">
            <p>город Астана</p>
            <p>Акмолинская область</p>
            <p>Улытауская область</p>
            <p>Карагандинская область</p>
            <p>Павлодарская область</p>
            <p>Северо-Казахстанская область</p>
            <p>Костанайская область</p>
            <p class=" font-semibold mt-5">
              Ордабек Аят <a class="text-mainColor font-normal" href="tel:+7 775 245-33-03">+7 775 245-33-03</a>
            </p>
          </address>
        </div>
        <div>
          <h3 class="border-l border-mainColor pl-6 font-semibold text-gray-900">По вопросам сотрудничества:</h3>
          <address class="border-l border-gray-200 pl-6 pt-2 not-italic text-gray-600">
            <p>Актюбинская область</p>
            <p>Западно-Казахстанская область</p>
            <p>Атырауская область</p>
            <p>Мангистауская область</p>
            <p class=" font-semibold mt-5">
              Жанбиров Дамир Бауржанович <a class="text-mainColor font-normal" href="tel:+7 776 713-13-33">+7 776
              713-13-33</a>
            </p>
          </address>
        </div>
        <div>
          <h3 class="border-l border-mainColor pl-6 font-semibold text-gray-900">По вопросам сотрудничества:</h3>
          <address class="border-l border-gray-200 pl-6 pt-2 not-italic text-gray-600">
            <p>Восточно-Казахстанская область</p>
            <p>Абайская область</p>
            <p>Алматинская область</p>
            <p>Жамбылская область</p>
            <p>Туркестанская область</p>
            <p>Кызылординская область</p>
            <p>Жетысуская область</p>
            <p>город Алматы</p>
            <p>город Шымкент</p>
            <p class=" font-semibold mt-5">
              Нугман Даулет <a class="text-mainColor font-normal" href="tel:+7 707 111 97 81">+7 707 111 97 81</a>
            </p>
          </address>
        </div>
        <div>
          <h3 class="border-l border-mainColor pl-6 font-semibold text-gray-900">По вопросам сотрудничества ТЦ "Car
            City" (2 ярус, 222 бутик) адрес: мкр. Баянауыл 57.</h3>
          <address class="border-l border-gray-200 pl-6 pt-2 not-italic text-gray-600">
            <p class=" font-semibold mt-5">
              Қасымжан Ерболсын Дауренұлы <a class="text-mainColor font-normal" href="tel:+7 747 237-79-75">+7 747
              237-79-75</a>
            </p>
          </address>
        </div>
      </div>
    </div>
  </div>
</template>
