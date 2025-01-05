<script setup>
import errorImg from '@/assets/img/logos/mainVert.png'

const route = useRoute()
const router = useRouter()

const catalog = ref()

const getCatalog = async () => {

 const {data, error} = await useApi('/catalog')

 if (error.value) return

 catalog.value = data.value

}

getCatalog()

const setCategory = (id, type) => {
 if (type === 'category') {
  router.push({
   query: {
    ...route.query,
    page:1,
    perPage:24,
    category: id,
    subCategory: undefined
   }
  })
 } else {
  router.push({
   query: {
    ...route.query,
    perPage:24,
    subCategory: id,
   }
  })
 }
}
</script>

<template>

 <div class="shadow-lg p-6 rounded-lg md:sticky md:top-[1rem] mb-5 bg-white">

  <div v-if="catalog">

   <div v-if="catalog.data.length">

    <h3 class="text-lg font-bold text-gray-900 mb-2">
     {{ $t("catalog.categories.title") }}
    </h3>

    <div class="flex flex-col gap-2">
     <div
       v-for="(category, key) in catalog.data"
       :key="key">
      <div
        @click="setCategory(category.id, 'category')"
        :class="{
          'bg-red-100 border border-red-400 shadow-md': category.id === +route.query.category,
          'hover:bg-gray-50': category.id !== +route.query.category
        }"
        class="flex items-center gap-4 cursor-pointer font-bold rounded-lg p-3 transition-all duration-300 ease-in-out">
       <img
         :src="category.icon || errorImg"
         class="h-12 w-12">
       <h3>
        {{ category.name }}
       </h3>
      </div>

      <div v-if="category.sub_category.length">
       <div
         v-if="category.id === +route.query.category"
         class="flex flex-col gap-2 mt-2 ml-8">
        <div
          v-for="(subCategory, index) in category.sub_category"
          :key="index"
          class="subcategory-item">
         <div
           @click="setCategory(subCategory.id, 'sub_category')"
           :class="{
              'bg-red-200 border border-red-400 shadow-md': subCategory.id === +route.query.subCategory,
              'hover:bg-gray-50': subCategory.id !== +route.query.subCategory
            }"
           class="flex items-center border rounded font-medium p-1 sub_category cursor-pointer">
          <img
            :src="subCategory.icon || errorImg"
            class="h-12 w-12">
          <h3>
           {{ subCategory.name }}
          </h3>
         </div>
        </div>
       </div>
      </div>

     </div>
    </div>
   </div>

   <div v-else>
    Нет данных
   </div>

  </div>

  <div v-else>
   Подождите...
  </div>

 </div>

</template>