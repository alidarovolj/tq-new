<script setup>
import {useNewsStore} from "~/stores/news.js";
import Breadcrumbs from "~/components/general/breadcrumbs.vue";

const news = useNewsStore();
const {newsList} = storeToRefs(news);

const localePath = useLocalePath()

const links = computed(() => [
  {title: "Главная", link: localePath('/')},
  {title: "Новости", link: localePath('/news')},
]);

onMounted(async () => {
  await nextTick()
  await news.getNews();
});
</script>

<template>
  <div class="pb-16">
    <Breadcrumbs :links="links"/>
    <div class="py-10">
      <div class="container mx-auto px-4 lg:px-0">
        <h1 class="text-3xl font-semibold">
          Новости
        </h1>
      </div>
    </div>
    <div
        v-if="newsList"
        class="container mx-auto px-4 lg:px-0">
      <div v-if="newsList.data.length > 0" class="flex flex-col gap-10">
        <div
            v-for="(news, index) in newsList.data"
            :key="news.id"
            :class="{ 'flex-col md:!flex-row-reverse' : index % 2 === 0 }"
            class="bg-white rounded-lg shadow-md flex flex-col md:flex-row items-center">
          <img
              :src="news.image_url"
              alt=""
              class="w-full md:w-1/2 min-w-[50%] h-[414px] object-cover rounded-t-lg">
          <div class="p-5 md:p-14">
            <h2 class="text-xl font-semibold mb-4">
              {{ news.title.ru }}
            </h2>
            <p
                class="text-sm text-gray-500 mb-8"
                v-html="news.description.ru">
            </p>
            <nuxt-link
                :to="localePath(`/news/${news.id}`)"
                class="text-mainColor border-2 border-mainColor py-2 px-7 rounded">
              {{ $t('news.read_more') }}
            </nuxt-link>
          </div>
        </div>
      </div>
      <div v-else>
        <p class="text-red-500 text-center text-xl">
          Нет новостей для показа
        </p>
      </div>
      <!--      <Pagination :meta-data="newsList.meta"/>-->
    </div>
  </div>
</template>