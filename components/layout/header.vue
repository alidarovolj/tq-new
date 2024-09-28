<script setup>
import {Dialog, DialogPanel, Menu, MenuButton, MenuItem, MenuItems, PopoverGroup,} from '@headlessui/vue'
import {Bars3Icon, ShoppingBagIcon, XMarkIcon, ArchiveBoxIcon, MapPinIcon, UserIcon, ArrowRightStartOnRectangleIcon} from '@heroicons/vue/24/outline'
import {ChevronDownIcon} from '@heroicons/vue/20/solid'
import {useUserStore} from "~/stores/user.js";
import {useNotificationStore} from "~/stores/notifications.js";

const loading = ref(false)
const router = useRouter()
const route = useRoute()
const localePath = useLocalePath()
const user = useUserStore()
const auth = useAuthStore()
auth.initCookieToken()
const {token} = useAuthStore()
const notifications = useNotificationStore()
const cart = useCartStore()

const mobileMenuOpen = ref(false)

const logoutUser = async () => {
  loading.value = true;

  try {
    const response = await api(`/auth/logout`, "POST", {}, route.query);

    auth.token = null;
    await nextTick();
    user.userProfile = false;
    const authCookie = useCookie('token')
    authCookie.value = null
    notifications.showNotification("success", "Успешно", "Вы успешно вышли из аккаунта");
    loading.value = false;
    await router.push(localePath('/'));
  } catch (e) {
    console.log(e)
    if (e.response) {
      notifications.showNotification("error", "Произошла ошибка", e);
    }
  }
  loading.value = false;
}

const tempCode = useCookie('temporary_code', {
  sameSite: true,
  maxAge: 60 * 60 * 24,
})

onMounted(async () => {
  await nextTick()
  if (auth.token) {
    await user.getProfile()
    await cart.getCart()
  } else {
    if (!tempCode.value) {
      await cart.getTemporaryCode()
      tempCode.value = cart.temporaryCode.temporary_code
      await nextTick()
    }
    await cart.getTemporaryCart()
    user.userProfile = false
  }
})
</script>


<template>
  <header class="bg-white">
    <nav class="mx-auto flex container px-4 md:px-0 items-center justify-between py-6" aria-label="Global">
      <div class="flex lg:flex-1">
        <NuxtLink :to="localePath('/')" class="-m-1.5 p-1.5">
          <span class="sr-only">
            Your Company
          </span>
          <img
              class="h-5 w-auto"
              src="@/assets/img/logos/main.png"
              alt=""
          />
        </NuxtLink>
      </div>
      <div class="flex lg:hidden">
        <button type="button" class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                @click="mobileMenuOpen = true">
          <span class="sr-only">Open main menu</span>
          <Bars3Icon class="h-6 w-6" aria-hidden="true"/>
        </button>
      </div>
      <client-only>
        <PopoverGroup class="hidden lg:flex lg:gap-x-12">
          <NuxtLink
              to="/products"
              :class="{ 'text-mainColor' : route.fullPath.includes('/products') }"
              class="text-sm font-semibold leading-6 text-gray-900">
            Продукты
          </NuxtLink>
          <NuxtLink
              to="/about"
              :class="{ 'text-mainColor' : route.fullPath.includes('/about') }"
              class="text-sm font-semibold leading-6 text-gray-900">
            О компании
          </NuxtLink>
<!--          <NuxtLink-->
<!--              to="/news"-->
<!--              :class="{ 'text-mainColor' : route.fullPath.includes('/news') }"-->
<!--              class="text-sm font-semibold leading-6 text-gray-900">-->
<!--            Новости-->
<!--          </NuxtLink>-->
          <NuxtLink
              to="/contacts"
              :class="{ 'text-mainColor' : route.fullPath.includes('/contacts') }"
              class="text-sm font-semibold leading-6 text-gray-900">
            Контакты
          </NuxtLink>
        </PopoverGroup>
      </client-only>
      <div class="hidden lg:flex lg:flex-1 lg:justify-end gap-3 items-center">
        <div v-if="cart.cartList">
          <NuxtLink
              class="relative"
              :to="localePath('/cart')">
            <div
                v-if="cart.cartList.data.length > 0"
                class="bg-mainColor text-white w-5 h-5 absolute right-0 top-0 translate-x-1/2 -translate-y-2/3 flex items-center justify-center rounded-full text-xs">
              {{ cart.cartList.data.length }}
            </div>
            <ShoppingBagIcon class="w-5 h-5 cursor-pointer text-mainColor"/>
          </NuxtLink>
        </div>
        <div
            v-if="user.userProfile === false"
            class="flex items-center gap-3 text-sm">
          <NuxtLink
              :to="localePath('/login')"
              class="block rounded-lg px-3 py-2.5 font-semibold leading-7">
            {{ $t('header_links.login') }}
          </NuxtLink>
          <NuxtLink
              :to="localePath('/registration')"
              class="block text-white bg-mainColor rounded-lg px-3 py-2.5 font-semibold leading-7">
            {{ $t('header_links.register') }}
          </NuxtLink>
        </div>
        <div
            v-else-if="user.userProfile"
            class="flex items-center gap-3">
          <Menu as="div" class="relative inline-block text-left">
            <div>
              <MenuButton
                  class="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                {{ user.userProfile.name }}
                <ChevronDownIcon class="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true"/>
              </MenuButton>
            </div>

            <transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95">
              <MenuItems
                  class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div class="py-1">
                  <MenuItem v-slot="{ active }">
                    <div class="flex gap-2">
                      <NuxtLink
                          to="profile/orders"
                          class="flex gap-2"
                          :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block w-full px-4 py-2 text-left text-sm']">
                        <ArchiveBoxIcon class="h-5 w-5"/>
                        <p>Мои заказы</p>
                      </NuxtLink>
                    </div>
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <div class="flex gap-2">
                      <NuxtLink
                          to="profile/addresses"
                          class="flex gap-2"
                          :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block w-full px-4 py-2 text-left text-sm']">
                        <MapPinIcon class="h-5 w-5"/>
                        <p>Мои адреса</p>
                      </NuxtLink>
                    </div>
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                      <NuxtLink
                          to="profile"
                          class="flex gap-2"
                          :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block w-full px-4 py-2 text-left text-sm']">

                        <UserIcon class="h-5 w-5"/>
                        <p>Мой профиль</p>
                      </NuxtLink>
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                      <div
                          @click="logoutUser"
                          class="text-red-500 flex gap-2"
                          :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block w-full px-4 py-2 text-left text-sm']">
                        <ArrowRightStartOnRectangleIcon class="h-5 w-5"/>
                        <p>{{ $t('profile.logout') }}</p>
                      </div>
                  </MenuItem>
                </div>
              </MenuItems>
            </transition>
          </Menu>
        </div>
        <div v-else class="spinner"></div>
      </div>
    </nav>
    <Dialog class="lg:hidden" @close="mobileMenuOpen = false" :open="mobileMenuOpen">
      <div class="fixed inset-0 z-10"/>
      <DialogPanel
          class="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
        <div class="flex items-center justify-between">
          <a href="#" class="-m-1.5 p-1.5">
            <span class="sr-only">Your Company</span>
            <img
                class="h-8 w-auto"
                src="@/assets/img/logos/main.png"
                alt=""
            />
          </a>
          <button type="button" class="-m-2.5 rounded-md p-2.5 text-gray-700" @click="mobileMenuOpen = false">
            <span class="sr-only">Close menu</span>
            <XMarkIcon class="h-6 w-6" aria-hidden="true"/>
          </button>
        </div>
        <div class="mt-6 flow-root">
          <div class="-my-6 divide-y divide-gray-500/10 flex flex-col justify-between h-full">
            <div class="space-y-2 py-6">
              <NuxtLink
                  @click="mobileMenuOpen = false"
                  to="/products"
                  class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                Продукты
              </NuxtLink>
              <NuxtLink
                  @click="mobileMenuOpen = false"
                  to="/about"
                  class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                О компании
              </NuxtLink>
<!--              <NuxtLink-->
<!--                  @click="mobileMenuOpen = false"-->
<!--                  to="/news"-->
<!--                  class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">-->
<!--                Новости-->
<!--              </NuxtLink>-->
              <NuxtLink
                  @click="mobileMenuOpen = false"
                  to="/contacts"
                  class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                Контакты
              </NuxtLink>
            </div>
            <div class="flex lg:flex-1 lg:justify-end gap-3 items-center">
              <div
                  v-if="user.userProfile === false"
                  class="flex items-center gap-3 text-sm">
                <NuxtLink
                    :to="localePath('/login')"
                    @click="mobileMenuOpen = false"
                    class="block rounded-lg px-3 py-2.5 font-semibold leading-7">
                  {{ $t('header_links.login') }}
                </NuxtLink>
                <NuxtLink
                    :to="localePath('/registration')"
                    @click="mobileMenuOpen = false"
                    class="block text-white bg-mainColor rounded-lg px-3 py-2.5 font-semibold leading-7">
                  {{ $t('header_links.register') }}
                </NuxtLink>
              </div>
              <div
                  v-else-if="user.userProfile"
                  class="flex items-center gap-3">
                <div v-if="cart.cartList">
                  <NuxtLink
                      class="relative"
                      @click="mobileMenuOpen = false"
                      :to="localePath('/cart')">
                    <div
                        v-if="cart.cartList.data.length > 0"
                        class="bg-mainColor text-white w-5 h-5 absolute right-0 top-0 translate-x-1/2 -translate-y-2/3 flex items-center justify-center rounded-full text-xs">
                      {{ cart.cartList.data.length }}
                    </div>
                    <ShoppingBagIcon class="w-5 h-5 cursor-pointer text-mainColor"/>
                  </NuxtLink>
                </div>
                <Menu as="div" class="relative inline-block text-left">
                  <div>
                    <MenuButton
                        class="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                      {{ user.userProfile.data.name }}
                      <ChevronDownIcon class="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true"/>
                    </MenuButton>
                  </div>

                  <transition
                      enter-active-class="transition ease-out duration-100"
                      enter-from-class="transform opacity-0 scale-95"
                      enter-to-class="transform opacity-100 scale-100"
                      leave-active-class="transition ease-in duration-75"
                      leave-from-class="transform opacity-100 scale-100"
                      leave-to-class="transform opacity-0 scale-95">
                    <MenuItems
                        class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div class="py-1">
                        <MenuItem v-slot="{ active }">
                          <div
                              @click="logoutUser"
                              class="text-red-500"
                              :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block w-full px-4 py-2 text-left text-sm']">
                            {{ $t('profile.logout') }}
                          </div>
                        </MenuItem>
                      </div>
                    </MenuItems>
                  </transition>
                </Menu>
              </div>
              <div v-else class="spinner"></div>
            </div>
          </div>
        </div>
      </DialogPanel>
    </Dialog>
  </header>
</template>
