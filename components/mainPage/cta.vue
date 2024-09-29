<script setup>
</script>

<template>
  <div class="bg-white">
    <div class="mx-auto max-w-7xl py-24 sm:px-6 sm:py-14 lg:px-8">
      <div
          class="relative isolate overflow-hidden bg-gray-900 px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
        <svg aria-hidden="true"
             class="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0"
             viewBox="0 0 1024 1024">
          <circle cx="512" cy="512" fill="url(#759c1415-0410-454c-8f7c-9a820de03641)" fill-opacity="0.7" r="512"/>
          <defs>
            <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
              <stop stop-color="#d62d2d"/>
              <stop offset="1" stop-color="#a32222"/>
            </radialGradient>
          </defs>
        </svg>
        <div class="flex flex-col md:flex-row items-center justify-between w-full">
          <div class="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
            <h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">Широкий ассортимент.<br/>Качество</h2>
            <p class="mt-6 text-lg leading-8 text-gray-300">
              Мы предлагаем богатый выбор дворников и фар различных типов, размеров и моделей, чтобы удовлетворить
              потребности всех автовладельцев.
            </p>
            <div class="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
              <NuxtLink
                  class="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  to="/products">
                Перейти к товарам <span aria-hidden="true">→</span>
              </NuxtLink>
            </div>
          </div>
          <div class="h-full flex items-center justify-center">
            <img alt="App screenshot" class="w-[30rem] max-w-none rounded-md " src="@/assets/img/lights.png"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
