<script setup>

const breakpoints = ref({
 0: {
  itemsToShow: 1,
  snapAlign: "center",
 },
 600: {
  itemsToShow: 3,
  snapAlign: "center",
 },
 700: {
  itemsToShow: 4,
  snapAlign: "start",
 },
 900: {
  itemsToShow: 5,
  snapAlign: "start",
 },
});

const liquidationProducts = ref(null)

const getLiquidations = async () => {
 const { data, error } = await useApi('/products/liquidation')

 if(error.value) return

 liquidationProducts.value = data.value
}

getLiquidations()

</script>

<template>
 <div
   v-if="liquidationProducts && liquidationProducts?.data?.length"
   class="mt-10 mb-5 container mx-auto px-4 md:px-0 py-10">
  <div class="mx-auto max-w-2xl text-center mb-5">
   <h2 class="font-bold tracking-tight text-gray-900 text-3xl sm:text-4xl">
    {{ $t("mainPage.liquidations.title") }}
   </h2>
  </div>
  <client-only>
   <my-carousel-carousel
     :breakpoints="breakpoints"
     :autoplay="6000"
     :mouse-drag="true"
     :touch-drag="true"
   >
    <my-carousel-slide
      v-for="(item, index) of liquidationProducts.data"
      :key="index"
      class="px-3"
    >
     <CardsProduct :product="item"/>
    </my-carousel-slide>
    <template #addons>
     <div>
      <my-carousel-navigation/>
     </div>
     <my-carousel-pagination/>
    </template>
   </my-carousel-carousel>
  </client-only>
 </div>
</template>