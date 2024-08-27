<script setup lang="ts">
import {computed, nextTick, onMounted, ref} from 'vue';
import {useProductsStore} from '~/stores/products.js';
import {storeToRefs} from 'pinia';
import Product from "~/components/cards/product.vue";
import Breadcrumbs from "~/components/general/breadcrumbs.vue";
import ProductPreloader from "~/components/general/productPreloader.vue";

const route = useRoute()
const router = useRouter()
const productsStore = useProductsStore();
const {categoryWithProducts, catalogList} = storeToRefs(productsStore);

const itemsToShow = ref(2);

const displayedItems = computed(() => {
  return categoryWithProducts.value?.data.slice(0, itemsToShow.value) || [];
});

const showMoreItems = () => {
  itemsToShow.value += 2;
};

const localePath = useLocalePath()

const links = computed(() => [
  {title: "Главная", link: localePath('/')},
  {title: "Продукты", link: localePath('/products')},
]);

const setCategory = async (id) => {
  await router.push({query: {category: id}})
  await nextTick()
  await productsStore.getProductsByCategory(id);
}

onMounted(async () => {
  await nextTick();
  await productsStore.getCategoryWithEightProducts();
  await productsStore.getCatalog()
  if(route.query.category) {
    await productsStore.getProductsByCategory(route.query.category);
  }
});
</script>

<template>
  <Breadcrumbs :links="links"/>
  <div class="container mx-auto px-4 md:px-0 mt-10">
    <div class="max-w-2xl mb-5">
      <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        Каталог товаров
      </h2>
      <p class="mt-2 text-lg leading-8 text-gray-600">
        Ознакомьтесь с нашим ассортиментом товаров для автомобильного освещения.
      </p>
    </div>
    <div class="flex flex-col md:flex-row items-start gap-5">
      <div class="w-full md:w-1/4 shadow p-5 rounded-lg relative mb-5 md:md-0">
        <div v-if="catalogList">
          <h3 class="text-lg font-bold text-gray-900 mb-5">Категории</h3>
          <div
              class="grid grid-cols-1 gap-y-2">
            <div
                v-for="(item, index) of catalogList.data"
                :key="index"
                :class="{ 'bg-gray-100' : item.id === parseInt(route.query.category) }"
                @click="setCategory(item.id)"
                class="flex items-center gap-5 hover:shadow-lg transition-shadow duration-300 ease-in-out cursor-pointer rounded-lg p-1">
              <img
                  v-if="item.icon !== 'https://static.thenounproject.com/png/5191452-200.png'"
                  :src="item.icon"
                  :alt="item.name"
                  class="h-10 w-10 object-contain object-center"
              />
              <img
                  v-else
                  src="@/assets/img/logos/mainVert.png"
                  :alt="item.name"
                  class="h-10 w-10 object-contain object-center"
              />
              <h3 class="text-center text-sm font-bold">{{ item.name }}</h3>
            </div>
          </div>
        </div>
      </div>
      <div
          class="bg-white w-full md:w-3/4">
        <div v-if="categoryWithProducts && !route.query.category">
          <div
              v-for="(item, index) in displayedItems"
              :key="index"
              class="mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8 pb-10"
          >
            <h2 class="text-xl font-bold text-gray-900">{{ item.name }}</h2>
            <div class="mt-8 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
              <div v-for="(product, ind) in item.products" :key="ind">
                <Product :product="product"/>
              </div>
            </div>
          </div>
          <div class="mt-8 flex justify-center">
            <button
                v-if="itemsToShow < categoryWithProducts.data.length"
                @click="showMoreItems"
                class="rounded-md bg-mainColor px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mainColor"
            >
              Показать больше
            </button>
          </div>
        </div>
        <div v-else-if="productsStore.productsByCategory && route.query.category">
          <h2 class="text-3xl font-semibold mb-10">
            {{ productsStore.productsByCategory.data.name }}
          </h2>
          <div class="mb-8 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
            <div v-for="(product, ind) in productsStore.productsByCategory.data.products_limitless" :key="ind">
              <Product :product="product"/>
            </div>
          </div>
          <div
              v-for="(item, index) in productsStore.productsByCategory.data.sub_category_limitless"
              :key="index"
              class="mx-auto pb-10"
          >
            <h2 class="text-xl font-bold text-gray-900">{{ item.name }}</h2>
            <div class="mt-8 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
              <div v-for="(product, ind) in item.products_limitless" :key="ind">
                <Product :product="product"/>
              </div>
            </div>
          </div>
        </div>
        <ProductPreloader v-else />
      </div>
    </div>
  </div>
</template>