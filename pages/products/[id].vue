<script setup>
import {StarIcon} from '@heroicons/vue/20/solid'
import {Tab, TabGroup, TabList, TabPanel, TabPanels} from '@headlessui/vue'
import {useProductsStore} from "~/stores/products.js";
import {computed} from "vue";
import ProductPreloader from "~/components/general/productPreloader.vue";

const products = useProductsStore()
const cart = useCartStore()
const {detailProduct, sameProducts} = storeToRefs(products)
const route = useRoute()

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

// const product = {
//   name: 'Набор иконок для интерфейса приложения',
//   version: {name: '1.0', date: '5 июня 2021', datetime: '2021-06-05'},
//   price: '220 долларов',
//   description:
//       'Набор иконок для интерфейса приложения включает более 200 иконок в 3 стилях: контурный, заливка и брендовый. Этот игривый набор иконок специально разработан для сложных пользовательских интерфейсов с дружелюбным и четким внешним видом.',
//   highlights: [
//     'Более 200 SVG иконок в 3 уникальных стилях',
//     'Совместим с Figma, Sketch и Adobe XD',
//     'Создан на сетке 24 x 24 пикселя',
//   ],
//   imageSrc: 'https://tailwindui.com/img/ecommerce-images/product-page-05-product-01.jpg',
//   imageAlt: 'Пример 30 иконок с дружелюбными и забавными деталями в контурном, заливочном и брендовых стилях.',
// }
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
    },
    // Больше отзывов...
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
            <!--            <img :src="detailProduct.data.icon" :alt="product.imageAlt" class="object-cover object-center"/>-->
            <img
                v-if="detailProduct.data.icon !== 'https://static.thenounproject.com/png/5191452-200.png'"
                :src="detailProduct.data.icon"
                :alt="detailProduct.data.name"
                class="h-full w-auto object-contain object-center px-5"
            />
            <img
                v-else
                src="@/assets/img/logos/mainVert.png"
                :alt="detailProduct.data.name"
                class="h-full w-full object-contain object-center px-5"
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

          <p class="mt-6 text-gray-500">{{ detailProduct.data.description }}</p>

          <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
            <button
                v-if="!isInCart"
                @click="cart.addItem(detailProduct.data)"
                type="button"
                class="flex w-full items-center justify-center rounded-md border border-transparent bg-mainColor px-8 py-3 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-mainColor focus:ring-offset-2 focus:ring-offset-gray-50">
              К оплате {{ detailProduct.data.price }}₸
            </button>
            <button
                v-else
                type="button"
                class="flex w-full items-center justify-center rounded-md border border-transparent bg-mainColor px-8 py-3 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-mainColor focus:ring-offset-2 focus:ring-offset-gray-50">
              В корзине
            </button>
          </div>

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

<!--          <div class="mt-10 border-t border-gray-200 pt-10">-->
<!--            <h3 class="text-sm font-medium text-gray-900">Лицензия</h3>-->
<!--            <p class="mt-4 text-sm text-gray-500">-->
<!--              {{ license.summary }}-->
<!--              <a :href="license.href"-->
<!--                 class="font-medium text-mainColor hover:text-mainColor">-->
<!--                Узнать больше-->
<!--              </a>-->
<!--            </p>-->
<!--          </div>-->

<!--          <div class="mt-10 border-t border-gray-200 pt-10">-->
<!--            <h3 class="text-sm font-medium text-gray-900">Поделиться</h3>-->
<!--            <ul role="list" class="mt-4 flex items-center space-x-6">-->
<!--              <li>-->
<!--                <a href="#" class="flex h-6 w-6 items-center justify-center text-gray-400 hover:text-gray-500">-->
<!--                  <span class="sr-only">Share on Facebook</span>-->
<!--                  <svg class="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">-->
<!--                    <path fill-rule="evenodd"-->
<!--                          d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"-->
<!--                          clip-rule="evenodd"/>-->
<!--                  </svg>-->
<!--                </a>-->
<!--              </li>-->
<!--              <li>-->
<!--                <a href="#" class="flex h-6 w-6 items-center justify-center text-gray-400 hover:text-gray-500">-->
<!--                  <span class="sr-only">Share on Instagram</span>-->
<!--                  <svg class="h-6 w-6" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">-->
<!--                    <path fill-rule="evenodd"-->
<!--                          d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"-->
<!--                          clip-rule="evenodd"/>-->
<!--                  </svg>-->
<!--                </a>-->
<!--              </li>-->
<!--              <li>-->
<!--                <a href="#" class="flex h-6 w-6 items-center justify-center text-gray-400 hover:text-gray-500">-->
<!--                  <span class="sr-only">Share on X</span>-->
<!--                  <svg class="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">-->
<!--                    <path-->
<!--                        d="M11.4678 8.77491L17.2961 2H15.915L10.8543 7.88256L6.81232 2H2.15039L8.26263 10.8955L2.15039 18H3.53159L8.87581 11.7878L13.1444 18H17.8063L11.4675 8.77491H11.4678ZM9.57608 10.9738L8.95678 10.0881L4.02925 3.03974H6.15068L10.1273 8.72795L10.7466 9.61374L15.9156 17.0075H13.7942L9.57608 10.9742V10.9738Z"/>-->
<!--                  </svg>-->
<!--                </a>-->
<!--              </li>-->
<!--            </ul>-->
<!--          </div>-->
        </div>

        <div class="mx-auto mt-16 w-full max-w-2xl lg:col-span-4 lg:mt-0 lg:max-w-none">
          <TabGroup as="div">
            <div class="border-b border-gray-200">
              <TabList class="-mb-px flex space-x-8">
<!--                <Tab as="template" v-slot="{ selected }">-->
<!--                  <button-->
<!--                      :class="[selected ? 'border-mainColor text-mainColor' : 'border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-800', 'whitespace-nowrap border-b-2 py-6 text-sm font-medium']">-->
<!--                    Отзывы пользователей-->
<!--                  </button>-->
<!--                </Tab>-->
                <Tab as="template" v-slot="{ selected }">
                  <button
                      :class="[selected ? 'border-mainColor text-mainColor' : 'border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-800', 'whitespace-nowrap border-b-2 py-6 text-sm font-medium']">
                    FAQ
                  </button>
                </Tab>
<!--                <Tab as="template" v-slot="{ selected }">-->
<!--                  <button-->
<!--                      :class="[selected ? 'border-mainColor text-mainColor' : 'border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-800', 'whitespace-nowrap border-b-2 py-6 text-sm font-medium']">-->
<!--                    Лицензия-->
<!--                  </button>-->
<!--                </Tab>-->
              </TabList>
            </div>
            <TabPanels as="template">
<!--              <TabPanel class="-mb-10">-->
<!--                <h3 class="sr-only">Отзывы пользователей</h3>-->

<!--                <div v-for="(review, reviewIdx) in reviews.featured" :key="review.id"-->
<!--                     class="flex space-x-4 text-sm text-gray-500">-->
<!--                  <div class="flex-none py-10">-->
<!--                    <img :src="review.avatarSrc" alt="" class="h-10 w-10 rounded-full bg-gray-100"/>-->
<!--                  </div>-->
<!--                  <div :class="[reviewIdx === 0 ? '' : 'border-t border-gray-200', 'py-10']">-->
<!--                    <h3 class="font-medium text-gray-900">{{ review.author }}</h3>-->
<!--                    <p>-->
<!--                      <time :datetime="review.datetime">{{ review.date }}</time>-->
<!--                    </p>-->

<!--                    <div class="mt-4 flex items-center">-->
<!--                      <StarIcon v-for="rating in [0, 1, 2, 3, 4]" :key="rating"-->
<!--                                :class="[review.rating > rating ? 'text-yellow-400' : 'text-gray-300', 'h-5 w-5 flex-shrink-0']"-->
<!--                                aria-hidden="true"/>-->
<!--                    </div>-->
<!--                    <p class="sr-only">{{ review.rating }} из 5 звезд</p>-->

<!--                    <div class="prose prose-sm mt-4 max-w-none text-gray-500" v-html="review.content"/>-->
<!--                  </div>-->
<!--                </div>-->
<!--              </TabPanel>-->

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

<!--              <TabPanel class="pt-10">-->
<!--                <h3 class="sr-only">Лицензия</h3>-->

<!--                <div class="prose prose-sm max-w-none text-gray-500" v-html="license.content"/>-->
<!--              </TabPanel>-->
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