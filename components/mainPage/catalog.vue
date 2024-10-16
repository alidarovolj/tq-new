<script setup>
import { useProductsStore } from "~/stores/products.js";

const products = useProductsStore();
const { catalogList } = storeToRefs(products);

onMounted(async () => {
  await nextTick();
  await products.getCatalog();
});
</script>

<template>
  <div class="container mx-auto px-4 md:px-0 py-10">
    <div class="mx-auto max-w-2xl text-center mb-5">
      <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        {{ $t("catalog_section.title") }}
      </h2>
      <p class="mt-2 text-base md:text-lg leading-5 md:leading-8 text-gray-600">
        {{ $t("catalog_section.description") }}
      </p>
    </div>
    <div v-if="catalogList">
      <div class="grid grid-cols-2 md:grid-cols-5 gap-x-5 gap-y-5">
        <NuxtLink
          v-for="(item, index) of catalogList.data"
          :key="index"
          :to="{ path: `/products`, query: { category: item.id } }"
          class="bg-white p-2 md:p-5 hover:shadow-lg transition-shadow duration-300 ease-in-out cursor-pointer rounded-2xl"
        >
          <img
            v-if="
              item.icon !==
              'https://static.thenounproject.com/png/5191452-200.png'
            "
            :alt="item.name"
            :src="item.icon"
            class="h-3/4 w-full object-cover md:object-contain object-center px-2 md:px-5"
          />
          <img
            v-else
            :alt="item.name"
            class="h-3/4 w-full object-contain object-center px-5"
            src="@/assets/img/logos/mainVert.png"
          />
          <h3 class="text-center text-xl font-bold mt-5">{{ item.name }}</h3>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
