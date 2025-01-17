<template>
  <div
    class="bg-white dark:text-darkText dark:bg-darkElBg rounded-md px-0 md:px-5 h-full"
  >
    <form @submit.prevent="searchByFilter" class="w-full relative text-xs">
      <div class="w-full">
        <div class="flex gap-2 md:gap-5">
          <div class="relative w-full">
            <input
              v-model="form.name"
              class="py-2 px-4 border border-gray-300 mb-0 rounded-md w-full bg-white dark:bg-darkInp dark:text-darkText text-sm"
              placeholder="Поиск..."
              type="text"
              @input="filterElements"
              @focus="handleFocus"
              @blur="handleBlur"
            />
            <div
              v-if="isOpen && products.searchedProducts?.data.length"
              class="absolute top-full left-0 w-full bg-white dark:bg-darkElBg border z-30 rounded-md"
            >
              <ul>
                <li
                  v-for="(element, index) in products.searchedProducts?.data"
                  :key="index"
                  class="px-3 py-1 hover:bg-gray-200 dark:hover:bg-darkInp cursor-pointer flex items-center justify-between"
                  @click="router.push('/products/' + element.product_id)"
                >
                  <div class="flex items-center gap-2">
                    <img
                      v-if="element.product_icon"
                      :src="element.product_icon"
                      class="w-8 h-8 object-cover rounded-md"
                    />
                    <img
                      v-else
                      src="@/assets/img/logos/mainVert.png"
                      class="w-8 h-8 object-cover rounded-md"
                    />
                    <p>{{ element.product_name }}</p>
                  </div>
                  <p class="text-gray-400">{{ element.category_name }}</p>
                </li>
              </ul>
            </div>
          </div>

          <div
            class="flex h-full w-max px-3 md:px-10 py-2 bg-mainColor text-white text-center rounded-md text-sm"
          >
            <MagnifyingGlassIcon class="w-5 h-5" />
            <button class="w-full hidden md:block" type="submit">Поиск</button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { MagnifyingGlassIcon } from "@heroicons/vue/24/outline";
import { useRoute, useRouter } from "vue-router";

const isOpen = ref(false);
const form = ref({ name: "" });
const filteredElements = ref([]);
const dropdownWrapper = ref(null);
const route = useRoute();
const router = useRouter();
const products = useProductsStore();

const filterElements = async () => {
  await router.push({
    query: { ...route.query, page: 1, keyword: form.value.name },
  });
  await products.productsSearch();
};

const handleFocus = () => {
  isOpen.value = true;
};

const handleBlur = () => {
  setTimeout(() => {
    isOpen.value = false;
  }, 200);
};

const handleClickOutside = (event) => {
  if (dropdownWrapper.value && !dropdownWrapper.value.contains(event.target)) {
    isOpen.value = false;
  }
};

const searchByFilter = () => {
  const queryFilters = {};
  Object.keys(form.value).forEach((key) => {
    const value = form.value[key];
    if (value) {
      queryFilters[`fields[${key}]`] = value.trim();
    }
  });
  router.push({ query: { ...route.query, ...queryFilters, page: 1 } });
};

onMounted(() => {
  document.addEventListener("mousedown", handleClickOutside);
  populateFormFromQuery();
});

onBeforeUnmount(() => {
  document.removeEventListener("mousedown", handleClickOutside);
});

const populateFormFromQuery = async () => {
  if (route.query.keyword) {
    await products.productsSearch();
  }
  await nextTick();
  Object.keys(form.value).forEach((key) => {
    const queryFilter = `fields[${key}]`;
    if (route.query[queryFilter]) {
      form.value[key] = route.query[queryFilter];
    }
  });
};
</script>

<style scoped>
/* Add any required styling here */
</style>
