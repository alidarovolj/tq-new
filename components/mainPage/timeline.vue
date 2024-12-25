<script setup>
const timeline = [
  {
    name: "mainPage.timeline.founded.name",
    description: "mainPage.timeline.founded.description",
    date: "mainPage.timeline.founded.date",
    dateTime: "2021-08",
  },
  {
    name: "mainPage.timeline.secured.name",
    description: "mainPage.timeline.secured.description",
    date: "mainPage.timeline.secured.date",
    dateTime: "2021-12",
  },
  {
    name: "mainPage.timeline.released.name",
    description: "mainPage.timeline.released.description",
    date: "mainPage.timeline.released.date",
    dateTime: "2022-02",
  },
  {
    name: "mainPage.timeline.globalLaunch.name",
    description: "mainPage.timeline.globalLaunch.description",
    date: "mainPage.timeline.globalLaunch.date",
    dateTime: "2022-12",
  },
];
</script>

<template>
  <div class="bg-white py-24 sm:py-32">
    <div class="mx-auto container px-6">
      <p
        class="mx-auto mt-2 max-w-xl text-pretty text-center text-2xl md:text-4xl font-semibold tracking-tight text-gray-950 sm:text-5xl mb-10"
      >
        Немного истории нашей компании
      </p>
      <div
        class="mx-auto grid max-w-2xl grid-cols-1 gap-8 overflow-hidden lg:mx-0 lg:max-w-none lg:grid-cols-4"
      >
        <div v-for="item in timeline" :key="item.name">
          <time
            :datetime="item.dateTime"
            class="flex items-center text-sm font-semibold leading-6 text-mainColor"
          >
            <svg
              viewBox="0 0 4 4"
              class="mr-4 h-1 w-1 flex-none"
              aria-hidden="true"
            >
              <circle cx="2" cy="2" r="2" fill="currentColor" />
            </svg>
            {{ $t(item.date) }}
            <div
              class="absolute -ml-2 h-px w-screen -translate-x-full bg-gray-900/10 sm:-ml-4 lg:static lg:-mr-6 lg:ml-8 lg:w-auto lg:flex-auto lg:translate-x-0"
              aria-hidden="true"
            />
          </time>
          <p
            class="mt-6 text-lg font-semibold leading-8 tracking-tight text-gray-900"
          >
            {{ $t(item.name) }}
          </p>
          <p class="mt-1 text-base leading-7 text-gray-600">
            {{ $t(item.description) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
