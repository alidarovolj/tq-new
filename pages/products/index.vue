<script setup>
import ProductPreloader from "~/components/general/productPreloader.vue";
import ProductsCatalog from "~/components/products/ProductsCatalog.vue";
import ProductPaginated from "~/components/cards/ProductPaginated.vue";
import Breadcrumbs from "~/components/general/breadcrumbs.vue";

const { t } = useI18n();
const localePath = useLocalePath();

const links = computed(() => [
 { title: t("breadcrumbs.home"), link: localePath("/") },
 { title: t("breadcrumbs.store"), link: localePath("/products") },
]);

const route = useRoute();
const router = useRouter();

const productsStore = useProductsStore();
const { catalogList } = storeToRefs(productsStore);

const pending = ref(true);
const products = ref();
const order_by = ref('new')

const sortOrders = ref([
 {
  id:'new',
  title:'Сначала новые'
 },
 {
  id:'asc',
  title:'По возрастанию цены'
 },
 {
  id:'desc',
  title:'По убыванию цены'
 }
])

const getProducts = async (id, page = 1, perPage = 24) => {
 pending.value = true;
 const { data } = await useApi(`/products/paginated/${id}`, {
  params: {
   ...route.query,
   page,
   perPage,
  },
 });
 products.value = data.value;
 pending.value = false;
};

const updateQuery = (updates) => {
 router.push({
  query: {
   ...route.query,
   ...updates,
  },
 })
}

const changePerPage = () => {
 const newPerPage = (Number(route.query.perPage) || 24) + 24;
 updateQuery({ perPage: newPerPage, page: 1 })
}

onMounted(async () => {
 await nextTick();
 order_by.value = route.query.order_by || 'new'
 const id = route.query.subCategory || route.query.category;
 if (id) {
  await getProducts(id, Number(route.query.page) || 1, Number(route.query.perPage) || 24);
 }
});

watch(
  () => route.query,
  async () => {
   const id = route.query.subCategory || route.query.category;
   if (id) {
    await getProducts(id, Number(route.query.page) || 1, Number(route.query.perPage) || 24);
   }
  }
);

watch(
  () => [route.query.subCategory, route.query.category],
  ([newSubCategory, newCategory], [oldSubCategory, oldCategory]) => {
   if (newSubCategory !== oldSubCategory || newCategory !== oldCategory) {
    order_by.value = 'new'
    updateQuery({ order_by: 'new' })
   }
  }
)

onBeforeRouteUpdate((to, from, next) => {

 if (!Object.keys(to.query).length) {
  return next({
   query: {
    perPage: 24,
    page: 1,
    category:17
   }
  })
 }
 next()
})

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
 link: [{ rel: "canonical", href: t("headers.store.canonical") }],
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

  <div class="flex flex-col md:flex-row items-start gap-5 relative">

   <div class="w-full md:w-2/4 lg:w-1/4 md:sticky md:top-[1rem]">
    <ProductsCatalog/>
   </div>

   <div class="w-full md:w-[74%] transition-height min-h-[800px]">
    <ProductPreloader v-if="pending"/>

    <div v-else-if="products">
     <div
       class="text-red-500 text-center"
       v-if="!products.data.length">
      {{ $t("catalog.no_products") }}
     </div>

     <div v-else-if="products.data">
      <div class="flex justify-end">
       <select
         class="w-full md:w-max"
         v-model="order_by"
         name="order_by"
         id="order_by"
         @change="$event => navigateTo({
          query: {
            ...route.query,
            order_by: $event.target.value
          }
        })">
        <option
          v-for="(sort, key) of sortOrders"
          :key="key"
          :value="sort.id">
         {{sort.title}}
        </option>
       </select>
      </div>
      <div class="grid gap-x-2 grid-cols-2 gap-y-12 md:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
       <div
         v-for="(product, key) in products.data"
         :key="key">
        <ProductPaginated :product="product"/>
       </div>
      </div>
     </div>

     <div
       v-if="(products.meta.total > 0) && (products.meta.per_page < products.meta.total)"
       class="mt-8 flex justify-center" >
      <button
        class="rounded-md bg-mainColor px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mainColor"
        @click="changePerPage">
       <span v-if="pending">Подождите...</span>
       <span v-else>{{ $t("catalog.show_more") }}</span>
      </button>
     </div>

    </div>
   </div>
  </div>
 </div>
</template>

<style scoped>
.transition-height {
 transition: height 0.3s ease-in-out;
}
</style>