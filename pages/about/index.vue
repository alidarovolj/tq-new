<script setup>
import News from "~/components/general/news.vue";
import Breadcrumbs from "~/components/general/breadcrumbs.vue";

const localePath = useLocalePath()

const links = computed(() => [
  {title: "Главная", link: localePath('/')},
  {title: "О компании", link: localePath('/about')},
]);

const stats = [
  {
    label: 'Клиентов довольные сотрудничеством с нами',
    value: '100%',
  },
  {
    label: 'Товаров в нашем ассортименте',
    value: '50 000+',
  },
]
const values = [
  {
    name: 'Широкий ассортимент',
    description:
        'Мы предлагаем богатый выбор дворников и фар различных типов, размеров и моделей, чтобы удовлетворить потребности всех автовладельцев.',
  },
  {
    name: 'Качество',
    description:
        'TrustQuality работает только с ведущими производителями, известными своей надежностью и качеством продукции. Все товары проходят строгий контроль качества.',
  },
  {
    name: 'Профессиональные консультации',
    description:
        'Наши эксперты всегда готовы предоставить консультации по выбору наиболее подходящих дворников, автоламп и аксуссуаров, учитывая марку и модель вашего автомобиля.',
  },
  {
    name: 'Доставка',
    description:
        'Мы предоставляем удобные опции доставки по всему Казахстану и СНГ, чтобы сделать процесс покупки максимально удобным для клиентов.',
  },
  {
    name: 'Цены и акции',
    description:
        'У нас всегда актуальные цены и специальные предложения для наших клиентов. Мы стремимся сделать наши товары доступными для широкой аудитории.',
  },
]
const team = [
  {
    name: 'Нурболат Мешитбай',
    role: 'Backend разработчик',
    imageUrl:
        'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80',
  },
  // More people...
]
</script>

<template>
  <Breadcrumbs :links="links"/>
  <div class="bg-white">

    <main class="isolate">
      <!-- Hero section -->
      <div class="relative isolate -z-10">
        <svg
            class="absolute inset-x-0 top-0 -z-10 h-[64rem] w-full stroke-gray-200 [mask-image:radial-gradient(32rem_32rem_at_center,white,transparent)]"
            aria-hidden="true">
          <defs>
            <pattern id="1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84" width="200" height="200" x="50%" y="-1"
                     patternUnits="userSpaceOnUse">
              <path d="M.5 200V.5H200" fill="none"/>
            </pattern>
          </defs>
          <svg x="50%" y="-1" class="overflow-visible fill-gray-50">
            <path d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
                  stroke-width="0"/>
          </svg>
          <rect width="100%" height="100%" stroke-width="0" fill="url(#1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84)"/>
        </svg>
        <div
            class="absolute left-1/2 right-0 top-0 -z-10 -ml-24 transform-gpu overflow-hidden blur-3xl lg:ml-24 xl:ml-48"
            aria-hidden="true">
          <div class="aspect-[801/1036] w-[50.0625rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
               style="clip-path: polygon(63.1% 29.5%, 100% 17.1%, 76.6% 3%, 48.4% 0%, 44.6% 4.7%, 54.5% 25.3%, 59.8% 49%, 55.2% 57.8%, 44.4% 57.2%, 27.8% 47.9%, 35.1% 81.5%, 0% 97.7%, 39.2% 100%, 35.2% 81.4%, 97.2% 52.8%, 63.1% 29.5%)"/>
        </div>
        <div class="overflow-hidden">
          <div class="mx-auto max-w-7xl px-6 pb-32 pt-36 sm:pt-60 lg:px-8 lg:pt-32">
            <div class="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
              <div class="w-full max-w-xl lg:shrink-0 xl:max-w-2xl">
                <h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                  <span class="text-mainColor">T</span>rust<span class="text-mainColor">Q</span>uality – доверяй
                  качеству
                </h1>
                <p class="relative mt-6 text-lg leading-8 text-gray-600 sm:max-w-md lg:max-w-none">
                  Компания TrustQuality специализируется на поставке высококачественных автомобильных дворников и ламп
                  для широкого спектра автомобилей. Нашей главной целью является обеспечение безопасности и комфорта на
                  дороге, предоставляя клиентам доступ к самым современным и надежным автомобильным аксессуарам.
                </p>
              </div>
              <div class="mt-14 flex justify-end gap-8 sm:-mt-44 sm:justify-start sm:pl-20 lg:mt-0 lg:pl-0">
                <div
                    class="ml-auto w-44 flex-none space-y-8 pt-32 sm:ml-0 sm:pt-80 lg:order-last lg:pt-36 xl:order-none xl:pt-80">
                  <div class="relative">
                    <img
                        src="@/assets/img/about/1.jpeg"
                        alt="" class="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"/>
                    <div class="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10"/>
                  </div>
                </div>
                <div class="mr-auto w-44 flex-none space-y-8 sm:mr-0 sm:pt-52 lg:pt-36">
                  <div class="relative">
                    <img
                        src="@/assets/img/about/2.jpg"
                        alt="" class="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"/>
                    <div class="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10"/>
                  </div>
                  <div class="relative">
                    <img
                        src="@/assets/img/about/4.jpg"
                        alt="" class="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"/>
                    <div class="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10"/>
                  </div>
                </div>
                <div class="w-44 flex-none space-y-8 pt-32 sm:pt-0">
                  <div class="relative">
                    <img
                        src="@/assets/img/about/3.jpg"
                        alt="" class="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover object-left shadow-lg"/>
                    <div class="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10"/>
                  </div>
                  <div class="relative">
                    <img
                        src="@/assets/img/about/5.jpg"
                        alt="" class="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"/>
                    <div class="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10"/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Content section -->
      <div class="mx-auto -mt-12 max-w-7xl px-6 sm:mt-0 lg:px-8 xl:-mt-8">
        <div class="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
          <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Наша миссия
          </h2>
          <div class="mt-6 flex flex-col gap-x-8 gap-y-20 lg:flex-row">
            <div class="lg:w-full lg:max-w-2xl lg:flex-auto">
              <p class="text-xl leading-8 text-gray-600">
                TrustQuality – это компания, которая заботится о безопасности и комфорте автовладельцев. Мы предлагаем
                широкий ассортимент высококачественных автомобильных аксессуаров, включая дворники и фары, чтобы
                обеспечить безопасность и комфорт на дорогах.
              </p>
              <div class="mt-10 max-w-xl text-base leading-7 text-gray-700">
                <p>
                  Мы работаем только с проверенными производителями, чтобы предоставить клиентам доступ к самым
                  надежным и современным автомобильным аксессуарам. Все товары проходят строгий контроль качества, чтобы вы
                  могли быть уверены в их надежности и долговечности.
                </p>
                <p class="mt-10">
                  Наша команда экспертов всегда готова предоставить профессиональные консультации по выбору наиболее
                  подходящих дворников, автоламп и аксуссуаров, учитывая марку и модель вашего автомобиля. Мы стремимся
                  сделать процесс покупки максимально удобным для клиентов, предоставляя удобные опции доставки по всему
                  Казахстану и СНГ.
                </p>
              </div>
            </div>
            <div class="lg:flex lg:flex-auto lg:justify-center">
              <dl class="w-64 space-y-8 xl:w-80">
                <div v-for="stat in stats" :key="stat.label" class="flex flex-col-reverse gap-y-4">
                  <dt class="text-base leading-7 text-gray-600">{{ stat.label }}</dt>
                  <dd class="text-5xl font-semibold tracking-tight text-gray-900">{{ stat.value }}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Image section -->
      <div class="mt-32 sm:mt-40 xl:mx-auto xl:max-w-7xl xl:px-8">
        <img
            src="@/assets/img/about/imageSection.jpg"
            alt="" class="aspect-[5/2] w-full object-cover xl:rounded-3xl"/>
      </div>

      <!-- Values section -->
      <div class="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
        <div class="mx-auto max-w-2xl lg:mx-0">
          <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Наши ключевые преимущества
          </h2>
          <p class="mt-6 text-lg leading-8 text-gray-600">
            Мы гордимся тем, что помогаем автолюбителям обеспечивать безопасность и комфорт на дорогах.
          </p>
        </div>
        <dl class="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 text-base leading-7 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          <div v-for="value in values" :key="value.name">
            <dt class="font-semibold text-gray-900">{{ value.name }}</dt>
            <dd class="mt-1 text-gray-600">{{ value.description }}</dd>
          </div>
        </dl>
      </div>

      <!-- Logo cloud -->
      <div class="relative isolate -z-10 mt-32 sm:mt-48">
        <div
            class="absolute inset-x-0 top-1/2 -z-10 flex -translate-y-1/2 justify-center overflow-hidden [mask-image:radial-gradient(50%_45%_at_50%_55%,white,transparent)]">
          <svg class="h-[40rem] w-[80rem] flex-none stroke-gray-200" aria-hidden="true">
            <defs>
              <pattern id="e9033f3e-f665-41a6-84ef-756f6778e6fe" width="200" height="200" x="50%" y="50%"
                       patternUnits="userSpaceOnUse" patternTransform="translate(-100 0)">
                <path d="M.5 200V.5H200" fill="none"/>
              </pattern>
            </defs>
            <svg x="50%" y="50%" class="overflow-visible fill-gray-50">
              <path d="M-300 0h201v201h-201Z M300 200h201v201h-201Z" stroke-width="0"/>
            </svg>
            <rect width="100%" height="100%" stroke-width="0" fill="url(#e9033f3e-f665-41a6-84ef-756f6778e6fe)"/>
          </svg>
        </div>
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 class="text-center text-lg font-semibold leading-8 text-gray-900">
            Наши партнеры что доверяют нам
          </h2>
          <div
              class="mx-auto mt-10 grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-5">
            <img
                class="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
                src="@/assets/img/partners/1.png"
                alt="Transistor"
                width="158"
                height="48"
            />
            <img
                class="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
                src="@/assets/img/partners/2.png"
                alt="Reform"
                width="158"
                height="48"
            />
            <img
                class="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
                src="@/assets/img/partners/3.png"
                alt="Tuple"
                width="158"
                height="48"
            />
            <img
                class="col-span-2 max-h-12 w-full object-contain sm:col-start-2 lg:col-span-1"
                src="@/assets/img/partners/4.png"
                alt="SavvyCal"
                width="158"
                height="48"
            />
            <img
                class="col-span-2 col-start-2 max-h-12 w-full object-contain sm:col-start-auto lg:col-span-1"
                src="@/assets/img/partners/5.png"
                alt="Statamic"
                width="158"
                height="48"
            />
          </div>
        </div>
      </div>

      <!-- Team section -->
      <div class="mx-auto mt-32 max-w-7xl px-6 sm:mt-48 lg:px-8">
        <div class="mx-auto max-w-2xl lg:mx-0">
          <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Наша команда</h2>
          <p class="mt-6 text-lg leading-8 text-gray-600">
            Наша команда экспертов всегда готова предоставить профессиональные консультации по выбору наиболее
            подходящих дворников, автоламп и аксуссуаров, учитывая марку и модель вашего автомобиля.
          </p>
        </div>
        <ul role="list"
            class="mx-auto mt-20 grid max-w-2xl grid-cols-2 gap-x-8 gap-y-16 text-center sm:grid-cols-3 md:grid-cols-4 lg:mx-0 lg:max-w-none lg:grid-cols-5 xl:grid-cols-6">
          <li v-for="person in team" :key="person.name">
            <img class="mx-auto h-24 w-24 rounded-full" :src="person.imageUrl" alt=""/>
            <h3 class="mt-6 text-base font-semibold leading-7 tracking-tight text-gray-900">{{ person.name }}</h3>
            <p class="text-sm leading-6 text-gray-600">{{ person.role }}</p>
          </li>
        </ul>
      </div>

      <!-- Blog section -->
      <News/>
    </main>

  </div>
</template>
