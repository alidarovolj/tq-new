<script setup>
import {computed, nextTick, onMounted, ref} from 'vue';
import {useProductsStore} from '~/stores/products.js';
import {storeToRefs} from 'pinia';

const productsStore = useProductsStore();
const {categoryWithProducts} = storeToRefs(productsStore);

const itemsToShow = ref(2);

const displayedItems = computed(() => {
  return categoryWithProducts.value?.data.slice(0, itemsToShow.value) || [];
});

const showMoreItems = () => {
  itemsToShow.value += 2;
};

onMounted(async () => {
  await nextTick();
  await productsStore.getCategoryWithEightProducts();
});
</script>

<template>

</template>