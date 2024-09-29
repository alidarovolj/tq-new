<script setup>
import {MinusIcon, PlusIcon, StarIcon} from '@heroicons/vue/20/solid'
import {Tab, TabGroup, TabList, TabPanel, TabPanels} from '@headlessui/vue'
import {useProductsStore} from "~/stores/products.js";
import {computed} from "vue";
import ProductPreloader from "~/components/general/productPreloader.vue";

const products = useProductsStore()
const cart = useCartStore()
const {detailProduct, sameProducts} = storeToRefs(products)
const route = useRoute()

const addToCart = ref({
  product_id: route.params.id,
  quantity: 1
})

const isInCart = computed(() => cart.cartList && Array.isArray(cart.cartList.data) && cart.cartList.data.some(item => item.product.id === detailProduct.value.data.id));

const breakpoints = ref({
  0: {
    itemsToShow: 1,
    snapAlign: "center",
  },
  700: {
    itemsToShow: 5,
    snapAlign: "start",
  },
});

onMounted(async () => {
  await nextTick()
  await products.getDetailProduct(route.params.id)
  await products.getSameProducts(route.params.id)
})

const reviews = {
  average: 4,
  featured: [
    {
      id: 1,
      rating: 5,
      content: `
        <p>Этот набор иконок - именно то, что мне нужно для моего последнего проекта. Здесь есть иконка практически для всего, что мне может понадобиться. Мне нравится игривый вид!</p>
      `,
      date: '16 июля 2021',
      datetime: '2021-07-16',
      author: 'Эмили Селман',
      avatarSrc:
          'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80',
    },
    {
      id: 2,
      rating: 5,
      content: `
        <p>Я потрясен, насколько качественным является этот набор иконок. Все выглядит так последовательно, и каждая SVG иконка оптимизирована изначально, так что я могу использовать их сразу с уверенностью. Мне бы потребовалось несколько часов, чтобы создать одну такую хорошую иконку, так что это настоящая находка по такой цене.</p>
      `,
      date: '12 июля 2021',
      datetime: '2021-07-12',
      author: 'Гектор Гиббонс',
      avatarSrc:
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80',
    }
  ],
}
const faqs = [
  {
    question: 'Какие способы оплаты вы принимаете?',
    answer: 'Мы принимаем Visa, Mastercard и American Express. Вы также можете оплатить через наличными по прибытию вашего заказа.',
  },
  {
    question: 'Сколько времени занимает доставка?',
    answer: 'Ваш заказ будет доставлен в течение 2-4 рабочих дней после его подтверждения.',
  },
  {
    question: 'Могу ли я вернуть товар?',
    answer: 'Извините, но мы не принимаем возврат товаров, за исключением случаев, когда товар был поврежден.',
  },
  {
    question: 'Каки образом я могу оформить заказ?',
    answer: 'Вы можете перейти на страницу продукта и нажать кнопку "Купить". После этого вы сможете оплатить ваш заказ в вашей корзине.',
  },
]
</script>

<template>
  <div class="bg-white">
    <div class="mx-auto container px-4 md:px-0 py-16 sm:py-24">

      <div
          v-if="detailProduct"
          class="lg:grid lg:grid-cols-7 lg:grid-rows-1 lg:gap-x-8 lg:gap-y-10 xl:gap-x-16">

        <div class="lg:col-span-4 lg:row-end-1">
          <div class="h-[400px] w-full flex items-center justify-center overflow-hidden rounded-lg bg-gray-100">
            <img
                v-if="detailProduct.data.icon !== 'https://static.thenounproject.com/png/5191452-200.png'"
                :alt="detailProduct.data.name"
                :src="detailProduct.data.icon"
                class="h-full w-auto object-contain object-center px-5"
            />
            <img
                v-else
                :alt="detailProduct.data.name"
                class="h-full w-full object-contain object-center px-5"
                src="@/assets/img/logos/mainVert.png"
            />
          </div>
        </div>

        <div class="mx-auto mt-14 max-w-2xl sm:mt-16 lg:col-span-3 lg:row-span-2 lg:row-end-2 lg:mt-0 lg:max-w-none">
          <div class="flex flex-col-reverse">
            <div class="mt-4">
              <p class="text-gray-400">Категория: {{ detailProduct.data.category.name }}</p>
              <h1 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{{ detailProduct.data.name }}</h1>

              <h2 id="information-heading" class="sr-only">Информация о продукте</h2>
            </div>

            <div>
              <h3 class="sr-only">Отзывы</h3>
              <div class="flex items-center">
                <StarIcon v-for="rating in [0, 1, 2, 3, 4]" :key="rating"
                          :class="[reviews.average > rating ? 'text-yellow-400' : 'text-gray-300', 'h-5 w-5 flex-shrink-0']"
                          aria-hidden="true"/>
              </div>
              <p class="sr-only">{{ reviews.average }} из 5 звезд</p>
            </div>
          </div>

          <div class="mt-10 mb-5 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
            <button
                class="flex w-full items-center justify-center rounded-md border border-transparent bg-mainColor px-8 py-3 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-mainColor focus:ring-offset-2 focus:ring-offset-gray-50"
                type="button">
              {{ detailProduct.data.price }}₸ / шт.
            </button>
          </div>
          <div>
            <p class="mb-2">
              Количество
            </p>
            <div class="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-2">
              <div class="w-full">
                <div class=" flex border-[#F0DFDF] border px-5 py-3 rounded-lg justify-between">
                  <button
                      :class="{ 'text-mainColor' : addToCart.quantity !== 1 }"
                      class="text-[#7B7B7B]"
                      @click="addToCart.quantity > 1 && (addToCart.quantity = addToCart.quantity - 1)"
                  >
                    <MinusIcon class="w-5 h-5"/>
                  </button>
                  <p class="text-[#7B7B7B] text-xl">
                    {{ addToCart.quantity }}
                  </p>
                  <button
                      class="text-mainColor"
                      @click="addToCart.quantity = addToCart.quantity + 1"
                  >
                    <PlusIcon class="w-5 h-5"/>
                  </button>
                </div>
              </div>
              <button
                  class="flex w-full items-center justify-center rounded-md border border-transparent bg-mainColor px-8 py-3 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-mainColor focus:ring-offset-2 focus:ring-offset-gray-50"
                  type="button"
                  @click="cart.addItem(addToCart)">
                Добавить в корзину
              </button>
            </div>
          </div>

          <p class="mt-6 text-gray-500">{{ detailProduct.data.description }}</p>

          <div class="mt-10 border-t border-gray-200 pt-10">
            <h3 class="text-sm font-medium text-gray-900">Характеристики</h3>
            <div class="prose prose-sm mt-4 text-gray-500">
              <ul role="list">
                <li
                    v-for="(item, index) in detailProduct.data.characteristics"
                    :key="index">
                  {{ item }}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="mx-auto mt-16 w-full max-w-2xl lg:col-span-4 lg:mt-0 lg:max-w-none">
          <TabGroup as="div">
            <div class="border-b border-gray-200">
              <TabList class="-mb-px flex space-x-8">
                <Tab v-slot="{ selected }" as="template">
                  <button
                      :class="[selected ? 'border-mainColor text-mainColor' : 'border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-800', 'whitespace-nowrap border-b-2 py-6 text-sm font-medium']">
                    FAQ
                  </button>
                </Tab>
                <Tab v-slot="{ selected }" as="template">
                  <button
                      :class="[selected ? 'border-mainColor text-mainColor' : 'border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-800', 'whitespace-nowrap border-b-2 py-6 text-sm font-medium']">
                    Отзывы пользователей
                  </button>
                </Tab>
              </TabList>
            </div>
            <TabPanels as="template">

              <TabPanel class="text-sm text-gray-500">
                <h3 class="sr-only">Часто задаваемые вопросы</h3>

                <dl>
                  <template v-for="faq in faqs" :key="faq.question">
                    <dt class="mt-10 font-medium text-gray-900">{{ faq.question }}</dt>
                    <dd class="prose prose-sm mt-2 max-w-none text-gray-500">
                      <p>{{ faq.answer }}</p>
                    </dd>
                  </template>
                </dl>
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </div>
      </div>
      <div v-if="sameProducts">
        <client-only>
          <my-carousel-carousel
              :breakpoints="breakpoints"
              :mouse-drag="true"
              :touch-drag="true"
          >
            <my-carousel-slide
                v-for="(item, index) of sameProducts.data"
                :key="index"
                class="px-3"
            >
              <CardsProduct :product="item"/>
            </my-carousel-slide>
            <template #addons>
              <my-carousel-navigation/>
              <my-carousel-pagination/>
            </template>
          </my-carousel-carousel>
        </client-only>
      </div>
      <ProductPreloader v-else/>
    </div>
  </div>
</template>