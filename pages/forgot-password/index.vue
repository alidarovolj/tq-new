<script setup>
import { vMaska } from "maska/vue"
import { useVuelidate} from "@vuelidate/core"
import {minLength, required} from "@vuelidate/validators"
import { useUserStore} from "~/stores/user.js"
import { useNotificationStore} from "~/stores/notifications.js"
import img1 from "@/assets/img/auth/1.jpg"
import img2 from "@/assets/img/auth/2.jpg"
import img3 from "@/assets/img/auth/3.jpg"

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const localePath = useLocalePath()

const notifications = useNotificationStore()
const auth = useAuthStore()
const user = useUserStore()

const loading = ref(false)
const codeSent = ref(false)
const tempToken = ref(null)
const resendTimeout = ref(60)
const resendDisabled = ref(false)

const form = ref({ phone_number: ''})

const formCode = ref({ phone: '', code: '' })

const formUpdate = ref({ password: '', password_confirmation: '' })

const carousel = ref([ img1, img2, img3 ])

const breakpoints = ref({
  0: { itemsToShow: 1, snapAlign: "center" },
  700: { itemsToShow: 1, snapAlign: "start" }
})

const v$ = useVuelidate({
  phone_number: {required, minLength: minLength(18)}
}, form)

const v$Code = useVuelidate({
 code: { required }
}, formCode)

const v$Password = useVuelidate({
 password: { required, minLength: minLength(8) },
 password_confirmation: { required, minLength: minLength(8) }
}, formUpdate)

const sendConfirmCode = async () => {
  loading.value = true
  await v$.value.$validate()

  if (v$.value.$error) {
    notifications.showNotification("error", "Данные не заполнены", "Проверьте правильность введенных данных и попробуйте снова.")
    loading.value = false
    return
  }

  const { error } = await useApi(`/forgot-password?phone=${form.value.phone_number}`)

  if(error.value) {
   notifications.showNotification("error", "Произошла ошибка", error.value)
   return
  }

  codeSent.value = true
  formCode.value.phone = form.value.phone_number
  notifications.showNotification("success", "Код запрошен", "Проверьте ваш телефон и введите код подтверждения.")

  startResendTimer()
}

const validateCode = async () => {
  loading.value = true
  await v$Code.value.$validate()

  if (v$Code.value.$error) {
    notifications.showNotification("error", "Данные не заполнены", "Проверьте правильность введенных данных и попробуйте снова.")
    loading.value = false
    return
  }

  const { data, error } = await useApi('/validate-phone', {
   method: 'POST',
   body: formCode.value,
  })

  if(error.value) {
   notifications.showNotification("error", "Произошла ошибка", error.value);
  }
  tempToken.value = data.value.access_token
}

const updatePassword = async () => {
 loading.value = true
 await v$Password.value.$validate()

 if (v$Password.value.$error) {
  notifications.showNotification("error", "Данные не заполнены", "Пароль должен содержать минимум 8 символов")
  loading.value = false
  return
 }

 const { error } = await useApi('/update-password', {
  method: 'POST',
  body: formUpdate.value,
  headers: {
   Authorization: `Bearer ${tempToken.value}`,
   accept: 'application/json'
  }
 })

 if(error.value) {
  notifications.showNotification("error", "Произошла ошибка", error.value);
  return
 }

 notifications.showNotification("success", "Ваш пароль успешно обновлен", "Войдите с новым паролем");
 await navigateTo(localePath('/login'))
}

const startResendTimer = () => {
 resendDisabled.value = true
 resendTimeout.value = 60

 const timer = setInterval(() => {
  resendTimeout.value--
  if (resendTimeout.value <= 0) {
   clearInterval(timer)
   resendDisabled.value = false
  }
 }, 1000)
}

useHead({
  title: t("headers.forgot_pass.title"),
  meta: [
    {
      property: "description",
      content: t("headers.forgot_pass.description"),
    },
    {
      property: "og:description",
      content: t("headers.forgot_pass.description"),
    },
    {
      property: "og:title",
      content: t("headers.forgot_pass.title"),
    },
    {
      property: "og:url",
      content: t("headers.forgot_pass.og_url"),
    },
  ],
  link: [{rel: "canonical", href: t("headers.forgot_pass.canonical")}],
});
</script>

<template>
  <div class="container mx-auto">
    <div class="flex min-h-full flex-1 items-center py-10">
      <div class="flex flex-1 flex-col justify-center px-4 sm:pr-6 lg:flex-none lg:pr-20 xl:pr-24">
        <div class="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <h2 class="text-2xl font-bold leading-9 tracking-tight text-gray-900">
              {{ $t('forms.forgot_password.title') }}
            </h2>
            <p
              v-if="!codeSent"
              class="mt-2 text-sm leading-6 text-gray-500">
              {{ $t('forms.forgot_password.description') }}
            </p>
           <p
             v-else-if="codeSent && !tempToken"
             class="mt-2 text-sm leading-6 text-gray-500">
            {{ $t('forms.forgot_password.description_code') }}
           </p>
           <p
             v-else
             class="mt-2 text-sm leading-6 text-gray-500">
            {{ $t('forms.forgot_password.description_password') }}
           </p>
          </div>

          <div class="mt-7">
            <div>
              <form
                  v-if="!codeSent"
                  class="space-y-6"
                  @submit.prevent="sendConfirmCode">
                <div
                    :class="{ '!border !border-red-500': v$.phone_number.$error }"
                    class="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                  <label
                    class="block text-xs font-medium text-gray-900"
                    for="phone_number">
                    {{ $t('forms.phone_number.title') }}
                  </label>
                  <input
                      id="phone_number"
                      v-model="form.phone_number"
                      v-maska
                      autocomplete="phone_number"
                      class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      data-maska="+7 (###) ###-##-##"
                      name="phone_number"
                      placeholder="+7 (___) ___-__-__"
                      type="text" />
                </div>

                <div>
                  <button
                    class="flex w-full justify-center rounded-md bg-mainColor px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mainColor"
                    type="submit">
                    {{ $t('forms.forgot_password.button') }}
                  </button>
                </div>
              </form>
              <form
                  v-else-if="codeSent && !tempToken"
                  @submit.prevent="validateCode">
                <div
                  :class="{'!border !border-red-500':v$Code.code.$error}"
                  class="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                  <label
                    class="block text-xs font-medium text-gray-900"
                    for="code">
                    {{ $t('forms.code.title') }}
                  </label>
                  <input
                      id="code"
                      v-model="formCode.code"
                      :placeholder="$t('forms.code.placeholder')"
                      autocomplete="code"
                      class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      name="code"
                      type="text" />
                </div>

               <button
                 type="button"
                 class="text-xs text-end mb-4 w-full mt-2"
                 :disabled="resendDisabled"
                 @click="sendConfirmCode">
                {{ resendDisabled ? `${$t('forms.forgot_password.resend_code')} 00:${resendTimeout < 10 ? '0' : ''}${resendTimeout}` : $t('forms.forgot_password.resend_code')  }}
               </button>

                <div>
                  <button
                      class="flex w-full justify-center rounded-md bg-mainColor px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mainColor"
                      type="submit">
                    {{ $t('forms.forgot_password.code_button') }}
                  </button>
                </div>
              </form>
             <form
               v-else
               class="space-y-6"
               @submit.prevent="updatePassword">
              <div
                :class="{'!border !border-red-500':v$Password.password.$error}"
                class="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
               <label
                 class="block text-xs font-medium text-gray-900"
                 for="password">
                {{ $t("forms.password.title") }}
               </label>
               <input
                 id="password"
                 v-model.trim="formUpdate.password"
                 placeholder="********"
                 class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                 name="password"
                 type="password" />
              </div>

              <div
                :class="{'!border !border-red-500':v$Password.password_confirmation.$error}"
                class="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
               <label
                 class="block text-xs font-medium text-gray-900"
                 for="password_confirmation">
                {{ $t('forms.confirm_password.title') }}
               </label>
               <input
                 id="password_confirmation"
                 v-model.trim="formUpdate.password_confirmation"
                 placeholder="********"
                 class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                 name="password_confirmation"
                 type="text" />
              </div>

              <div>
               <button
                 class="flex w-full justify-center rounded-md bg-mainColor px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mainColor"
                 type="submit">
                {{ $t('forms.forgot_password.code_button') }}
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
              :touch-drag="true">
            <my-carousel-slide
                v-for="(item, index) of carousel"
                :key="index"
                class="h-full">
              <img
                  :src="item"
                  alt=""
                  class="w-full h-full object-cover rounded-2xl"/>
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