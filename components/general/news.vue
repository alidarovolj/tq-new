<template>
  <div class="bg-white py-24 sm:py-32">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="mx-auto max-w-2xl text-center">
        <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Новости
        </h2>
        <p class="mt-2 text-lg leading-8 text-gray-600">
          Узнайте последние новости и события из мира технологий и бизнеса.
        </p>
      </div>
      <div
          v-if="newsList"
          class="mx-auto mt-16">

        <client-only>
          <my-carousel-carousel
              :breakpoints="breakpoints"
              :mouse-drag="true"
              :touch-drag="true"
              :wrap-around="true"
              autoplay="3000"
          >
            <my-carousel-slide
                v-for="(post, index) in newsList.data"
                :key="index"
                class="px-4"
            >
              <NuxtLink
                  :to="`/news/${post.id}`"
                  class="flex flex-col items-start">
                <div class="relative w-full">
                  <img
                      :src="post.image_url"
                      alt=""
                      class="aspect-[16/9] w-full rounded-2xl bg-gray-100 object-contain sm:aspect-[2/1] lg:aspect-[3/2]"/>
                  <div class="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10"/>
                </div>
                <div class="text-start">
                  <div class="mt-8 flex items-center gap-x-4 text-xs">
                    <time :datetime="post.created_at" class="text-gray-500">{{ formatDate(post.created_at) }}</time>
                  </div>
                  <div class="group relative">
                    <h3 class="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                      {{ post.title.ru }}
                    </h3>
                    <p v-html="post.description.ru" class="mt-5 line-clamp-3 text-sm leading-6 text-gray-600"></p>
                  </div>
                </div>
              </NuxtLink>
            </my-carousel-slide>
            <template #addons>
              <my-carousel-navigation/>
              <my-carousel-pagination/>
            </template>
          </my-carousel-carousel>
        </client-only>

      </div>
    </div>
  </div>
</template>

<script setup>
import {useNewsStore} from "~/stores/news.js";
import {formatDate} from "@/utils/formatDate.js"

const news = useNewsStore()
const {newsList} = storeToRefs(news)

const breakpoints = ref({
  0: {
    itemsToShow: 1,
    snapAlign: "center",
  },
  700: {
    itemsToShow: 3,
    snapAlign: "center",
  },
});

onMounted(async () => {
  await nextTick()
  await news.getNews()
})
</script>