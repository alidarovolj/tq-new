<script setup>
import {useProductsStore} from "~/stores/products.js";

const products = useProductsStore();
const {catalogList} = storeToRefs(products);

onMounted(async () => {
  await nextTick()
  await products.getCatalog()
});
</script>

<template>
  <div class="container mx-auto px-4 md:px-0">
    <div class="mx-auto max-w-2xl text-center mb-5">
      <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        Каталог товаров
      </h2>
      <p class="mt-2 text-lg leading-8 text-gray-600">
        Ознакомьтесь с нашим ассортиментом товаров для автомобильного освещения.
      </p>
    </div>
    <div v-if="catalogList">
      <div
          class="grid grid-cols-2 md:grid-cols-5 gap-x-5 gap-y-5">
        <NuxtLink
            :to="{ path: `/products`, query: { category: item.id } }"
            v-for="(item, index) of catalogList.data"
            :key="index"
            class="bg-white p-5 hover:shadow-lg transition-shadow duration-300 ease-in-out cursor-pointer rounded-2xl">
          <img
              v-if="item.icon !== 'https://static.thenounproject.com/png/5191452-200.png'"
              :src="item.icon"
              :alt="item.name"
              class="h-3/4 w-full object-contain object-center px-5"
          />
          <img
              v-else
              src="@/assets/img/logos/mainVert.png"
              :alt="item.name"
              class="h-3/4 w-full object-contain object-center px-5"
          />
          <h3 class="text-center text-xl font-bold mt-5">{{ item.name }}</h3>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>