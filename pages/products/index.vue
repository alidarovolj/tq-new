<script setup>
import ProductPreloader from "~/components/general/productPreloader.vue";
import ProductPaginated from "~/components/cards/ProductPaginated.vue";
import Breadcrumbs from "~/components/general/breadcrumbs.vue";
import errorImg from '@/assets/img/logos/mainVert.png'

const {t} = useI18n();
const localePath = useLocalePath();

const links = computed(() => [
 {title: t("breadcrumbs.home"), link: localePath("/")},
 {title: t("breadcrumbs.store"), link: localePath("/products")},
]);

const route = useRoute();
const router = useRouter();

const productsStore = useProductsStore();
const {catalogList} = storeToRefs(productsStore);

const products = ref([])

const currentPage = ref(1)
const isLoadingMore = ref(false)
const hasMorePages = computed(() => products.value.meta?.current_page < products.value.meta?.last_page);

const getProducts = async (id, page = 1) => {
 const { data } = await useApi(`/products/paginated/${id}`, {
  params: {
   ...route.query,
   page,
   perPage: 24,
  },
 });

 if (page === 1) {
  products.value = data.value; // Перезаписываем список на первой странице
 } else {
  products.value.data.push(...data.value.data); // Добавляем данные к текущему списку
 }
 currentPage.value = data.value.meta?.current_page; // Обновляем текущую страницу
};

const showMoreItems = async () => {
 if (hasMorePages.value && !isLoadingMore.value) {
  isLoadingMore.value = true; // Включаем состояние загрузки
  await getProducts(route.query.subCategory || route.query.category, currentPage.value + 1);
  isLoadingMore.value = false; // Выключаем состояние загрузки
 }
};

productsStore.getCatalog()

const setCategory = async (id) => {
 await router.push({
  query: {
   ...route.query,
   category: id,
   subCategory: undefined
  }
 })
 await nextTick()
 await getProducts(id)
}

const setSubCategory = async (id) => {
 await router.push({
  query: {
   ...route.query,
   subCategory: id
  }
 })
 await nextTick()
 await getProducts(id)
}

if (route.query.subCategory) {
 getProducts(route.query.subCategory)
} else {
 getProducts(route.query.category)
}

useHead({
 title: t("headers.store.title"),
 meta: [
  {
   property: "description",
   content: t("headers.store.description"),
  },
  {
   property: "og:description",
   content: t("headers.store.description"),
  },
  {
   property: "og:title",
   content: t("headers.store.title"),
  },
  {
   property: "og:url",
   content: t("headers.store.og_url"),
  },
 ],
 link: [{rel: "canonical", href: t("headers.store.canonical")}],
});
</script>

<template>
 <Breadcrumbs :links="links"/>
 <div class="container mx-auto px-4 md:px-0 mt-10 pb-10">
  <div class="max-w-2xl mb-5">
   <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
    {{ $t("catalog.title") }}
   </h2>
   <h3 class="mt-2 text-lg leading-8 text-gray-600">
    {{ $t("catalog.description") }}
   </h3>
  </div>

  <div class="flex flex-col md:flex-row items-start gap-5">

   <div class="w-full md:w-fourth shadow p-5 rounded-lg relative mb-5 md:md-0 bg-white">
    <div v-if="catalogList">
     <h3 class="text-lg font-bold text-gray-900 mb-5">
      {{ $t("catalog.categories.title") }}
     </h3>
     <div v-for="(category, index) of catalogList.data" :key="index">
      <div
        :class="{'bg-gray-100': category.id === +route.query.category}"
        class="flex items-center gap-5 hover:shadow-lg transition-shadow duration-300 ease-in-out cursor-pointer rounded-lg p-1"
        @click="setCategory(category.id)">
       <img
         v-if="category.icon !== 'https://static.thenounproject.com/png/5191452-200.png'"
         :alt="category.name"
         :src="category.icon || errorImg"
         class="h-10 w-10 object-contain object-center"/>
       <img
         v-else
         :alt="category.name"
         class="h-10 w-10 object-contain object-center"
         src="@/assets/img/logos/mainVert.png"/>
       <h3 class="text-center text-sm font-bold">{{ category.name }}</h3>
      </div>
      <div
        v-if="category.id === +route.query.category"
        class="pl-5 mt-2">
       <div
         v-for="(subCategory, ind) of category.sub_category"
         :key="ind"
         :class="{ 'bg-gray-100': subCategory.id === +route.query.subCategory}"
         class="flex items-center gap-5 hover:shadow-lg transition-shadow duration-300 ease-in-out cursor-pointer rounded-lg p-1"
         @click="setSubCategory(subCategory.id)">
        <img
          v-if="subCategory.icon !== 'https://static.thenounproject.com/png/5191452-200.png'"
          :alt="subCategory.name"
          :src="subCategory.icon"
          class="h-10 w-10 object-contain object-center"/>
        <img
          v-else
          :alt="subCategory.name"
          class="h-10 w-10 object-contain object-center"
          src="@/assets/img/logos/mainVert.png"/>
        <h3 class="text-center text-sm font-bold">
         {{ subCategory.name }}
        </h3>
       </div>
      </div>
     </div>
    </div>
   </div>

   <div class="w-full md:w-[74%]">
    <div v-if="products">
     <div v-if="products.data && products.data.length"
          class="mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8 pb-10">
      <div class="mt-8 grid gap-x-2 grid-cols-2 gap-y-12 md:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
       <div
         v-for="(product, key) in products.data"
         :key="key">
        <ProductPaginated :product="product"/>
       </div>
      </div>
      <div class="mt-8 flex justify-center" v-if="hasMorePages">
       <button
         class="rounded-md bg-mainColor px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mainColor"
         @click="showMoreItems">
        <span v-if="isLoadingMore">Подождите...</span>
        <span v-else>{{ $t("catalog.show_more") }}</span>
       </button>
      </div>
     </div>
     <div v-else class="text-red-500 text-center">
      {{ $t("catalog.no_products") }}
     </div>
    </div>
    <div v-else class="mt-8 grid gap-x-2 grid-cols-2 gap-y-12 md:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
     <ProductPreloader/>
    </div>
   </div>

  </div>
 </div>
</template>