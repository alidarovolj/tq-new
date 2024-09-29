<script setup>
import {computed} from 'vue';
import {useCartStore} from '~/stores/cart.js';

const props = defineProps(['product']);
const cart = useCartStore();

const addToCart = ref({
  product_id: props.product.id,
  quantity: 1
})

const isInCart = computed(() => cart.cartList && Array.isArray(cart.cartList.data) && cart.cartList.data.some(item => item.product.id === props.product.id));
</script>

<template>
  <div>
    <NuxtLink
        :to="`/products/${product.id}`"
        class="relative">
      <div class="relative h-72 w-full overflow-hidden rounded-lg">
        <img
            v-if="product.icon !== 'https://static.thenounproject.com/png/5191452-200.png'"
            :alt="product.name"
            :src="product.icon"
            class="h-full w-full object-contain object-center px-5"
        />
        <img
            v-else
            :alt="product.name"
            class="h-full w-full object-contain object-center px-5"
            src="@/assets/img/logos/mainVert.png"
        />
      </div>
      <div class="relative mt-4">
        <h3 class="text-sm font-medium text-gray-900 h-10 flex items-center">{{ product.name }}</h3>
        <p class="text-lg font-semibold my-1">{{ product.price }}₸</p>
        <p class="text-gray-500 text-xs">Вы можете указать кол-во товара в корзине</p>
      </div>
      <!--      <div class="absolute inset-x-0 top-0 left-0 flex w-full h-72 items-end justify-end overflow-hidden rounded-lg p-4">-->
      <!--        <div aria-hidden="true"-->
      <!--             class="absolute inset-x-0 bottom-0 left-0 h-36 bg-gradient-to-t from-black w-full opacity-50"></div>-->
      <!--        <p v-if="product.price > 0" class="relative text-lg font-semibold text-white">{{ product.price }}₸</p>-->
      <!--      </div>-->
    </NuxtLink>
    <div class="mt-6">
      <div
          v-if="product.quantity === 0"
          class="relative bg-gray-200 cursor-not-allowed flex transition-all items-center justify-center rounded-md border border-transparent px-3 py-2 text-sm font-medium text-gray-900"
      >
        Добавить в корзину
      </div>
      <div
          v-else
          :class="[
  'relative flex transition-all bg-mainColor items-center cursor-pointer justify-center rounded-md border border-transparent px-3 py-2 text-sm font-medium',
  isInCart ? '!bg-green-500 text-white' : 'bg-green-500 text-white'
]"
          v-bind="isInCart ? {} : { 'onClick': () => cart.addItem(addToCart) }"
      >
        {{ isInCart ? 'В корзине' : `Добавить в корзину` }}
      </div>
    </div>
  </div>
</template>