<script setup>
import {ChevronLeftIcon, ChevronRightIcon} from "@heroicons/vue/24/outline";
import bg from "@/assets/img/auth/1.jpg";
import bg1 from "@/assets/img/auth/2.jpg";

const localePath = useLocalePath();
const router = useRouter()

const {t} = useI18n();
const hero_carousel = ref(null);
const auth = useAuthStore();
const modals = useModalsStore();
const products = useProductsStore();
const settings = {
  itemsToShow: 1,
  snapAlign: "center",
};

const result = ref([
  {
    id: "1",
    img: bg1,
    title: `<h1>${t("mainPage.hero.slide.first.title.order")}</h1>`,
    content: t("mainPage.hero.slide.first.content"),
    button: {
      text: t("mainPage.hero.slide.buttons.browse"),
      link: localePath("/artworks"),
    },
    secButton: {
      text: t("mainPage.hero.slide.buttons.explore"),
      link: localePath("/artists"),
    },
  },
  {
    id: "1",
    img: bg,
    title: `<h1><span class='font-bold'>${t("mainPage.hero.slide.second.title.buy")}</span><br> <span class='italic'>${t("mainPage.hero.slide.second.title.reallyMade")}</span></h1>`,
    content: t("mainPage.hero.slide.second.content"),
    button: {
      text: t("mainPage.hero.slide.buttons.order"),
      link: localePath("/commission"),
    },
  },
]);

onMounted(async () => {
  await nextTick()
  await products.getCatalog()
});
</script>

<template>
  <div class="mb-20 container mx-auto px-4 md:px-0">
    <div
        v-if="products.catalogList"
        class="hero_carousel rounded-xl">
      <ClientOnly>
        <my-carousel-carousel
            ref="hero_carousel"
            :autoplay="6000"
            :items-to-show="settings.itemsToShow"
            :loop="true"
            :mouse-drag="true"
            :touch-drag="true"
            :wrap-around="true"
            class="flex flex-col justify-between h-full relative rounded-xl"
        >
          <my-carousel-slide
              v-for="(slide, index) in result"
              :key="index"
              class="flex items-center justify-center h-full rounded-xl relative"
          >
            <img
                :src="slide.img"
                alt=""
                class="w-full h-full absolute left-0 top-0 object-cover object-center rounded-xl"
                height="672"
                width="1000"
            />
<!--            <div class="absolute top-0 left-0 w-full h-full bg-black bg-opacity-70 -z-10"></div>-->
<!--            <div class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">-->
<!--              <div class="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#d62d2d] to-[#a32222] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" />-->
<!--            </div>-->
            <div class="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56 relative z-20">
              <client-only>
                <div class="hidden sm:mb-8 sm:flex sm:justify-center">
                  <NuxtLink
                      to="/about"
                      class="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-400 ring-1 ring-white/10 hover:ring-white/20">
                    Ознакомьтесь с нашей компанией поближе <a href="#" class="font-semibold text-white"><span
                      class="absolute inset-0" aria-hidden="true"/>Изучить ближе <span aria-hidden="true">&rarr;</span></a>
                  </NuxtLink>
                </div>
              </client-only>
              <div class="text-center">
                <!--          <h1 class="text-4xl font-bold tracking-tight text-white sm:text-6xl">Data to enrich your online business</h1>-->
                <img src="@/assets/img/logos/mainWhite.png" alt="">
                <p class="mt-6 text-lg leading-2 text-gray-300">
                  Мы - ваш надежный партнер в области инновационных и эффективных решений для автомобильного освещения.
                  С 2016 года мы являемся ведущей компанией по продаже и распространению автомобильных аксессуаров,
                  гарантируя качество и надежность в каждой поставке.
                </p>
              </div>
            </div>
            <div
                class="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
                aria-hidden="true">
              <div
                  class="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#d62d2d] to-[#a32222] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
                  style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"/>
            </div>
          </my-carousel-slide>
          <template #addons="{ currentSlide, slidesCount }">
            <div class="flex justify-between items-center">
              <div class="flex items-center justify-between w-full">
                <div
                    v-for="(page, index) of result"
                    :key="index"
                    :class="{
                    '!bg-[#1A1A1A] ': currentSlide === index,
                  }"
                    class="w-full bg-[#CCCCCC] h-[1px] mr-4 cursor-pointer"
                    @click="hero_carousel.slideTo(index)"
                />
              </div>
              <div class="flex flex-row-reverse py-2">
                <button
                    :class="{
                    'text-[#CCCCCC]': currentSlide + 1 === slidesCount,
                  }"
                    class=""
                    @click="hero_carousel.next"
                >
                  <ChevronRightIcon class="w-5 h-5"/>
                </button>
                <p class="whitespace-nowrap ">
                  {{ currentSlide + 1 }}/{{ slidesCount }}
                </p>
                <button
                    :class="{ 'text-[#CCCCCC]': currentSlide + 1 === 1 }"
                    class=""
                    @click="hero_carousel.prev"
                >
                  <ChevronLeftIcon class="w-5 h-5"/>
                </button>
              </div>
            </div>
          </template>
        </my-carousel-carousel>
      </ClientOnly>
    </div>
    <div v-else>
      <div class="skeleton h-[572px] max-h-[572px] w-full mb-3"/>
      <div class="flex justify-between gap-2">
        <div class="skeleton w-1/2 h-2"/>
        <div class="skeleton w-1/2 h-2"/>
        <div class="skeleton w-5 h-2"/>
      </div>
    </div>
  </div>
</template>