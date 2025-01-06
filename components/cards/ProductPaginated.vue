<script setup>

import intl from "~/utils/intl.js";
import {useCartStore} from "~/stores/cart.js";
import {computed} from "vue";
import errorImg from '@/assets/img/logos/mainVert.png'

const props = defineProps(['product'])

const cart = useCartStore();

const addToCart = ref({
 product_id: props.product.id,
 quantity: 1
})

const isInCart = computed(
  () => cart.cartList
    && Array.isArray(cart.cartList.data)
    && cart.cartList.data.some(
      item => item.product.id === props.product.id
    )
)

const onError = e => {
 e.target.setAttribute('src', errorImg || '')
}

</script>

<template>
 <div class="hover:shadow-lg hover:-translate-y-3 transition-all">
  <NuxtLink
    :to="`/products/${product.id}`"
    class="relative">
   <div class="relative h-72 w-full overflow-hidden rounded-lg">
    <img
      v-if="product.icon !== 'https://static.thenounproject.com/png/5191452-200.png'"
      :alt="product.name"
      :src="product.icon || errorImg"
      @error="onError"
      class="h-full w-full object-contain object-center px-5"
    />
    <img
      v-else
      :alt="product.name"
      class="h-full w-full object-contain object-center px-5"
      src="@/assets/img/logos/mainVert.png"
    />
   </div>
   <div class="relative mt-4 px-2">
    <h3 class="text-sm font-medium text-gray-900 h-10 flex items-center">{{ product.name }}</h3>
    <p class="text-lg font-semibold my-1">{{ intl(product?.price) }}</p>
    <p class="text-gray-500 text-xs">Вы можете указать кол-во товара в корзине</p>
   </div>
  </NuxtLink>
  <div class="mt-6 p-2">
   <div
     v-if="product.quantity === 0"
     class="relative bg-gray-200 cursor-not-allowed flex transition-all items-center justify-center rounded-md border border-transparent px-3 py-2 text-sm font-medium text-gray-900">
    Добавить в корзину
   </div>
   <div v-else
        :class="['relative flex transition-all bg-mainColor items-center cursor-pointer justify-center rounded-md border border-transparent px-3 py-2 text-sm font-medium',
           isInCart ? '!bg-green-500 text-white' : 'bg-green-500 text-white']"
        v-bind="isInCart ? {} : { 'onClick': () => cart.addItem(addToCart) }">
    {{ isInCart ? 'В корзине' : `Добавить в корзину` }}
   </div>
  </div>
 </div>
</template>