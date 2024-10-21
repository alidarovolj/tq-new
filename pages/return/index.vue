<script setup>
const { t } = useI18n();

useHead({
  title: t("headers.return.title"),
  meta: [
    {
      property: "description",
      content: t("headers.return.description"),
    },
    {
      property: "og:description",
      content: t("headers.return.description"),
    },
    {
      property: "og:title",
      content: t("headers.return.title"),
    },
    {
      property: "og:url",
      content: t("headers.return.og_url"),
    },
  ],
  link: [{ rel: "canonical", href: t("headers.return.canonical") }],
});
</script>

<template>
  <div class="container mx-auto px-4 md:px-0 py-12">
    <h1 class="text-3xl mb-10 font-bold">Гарантия и возврат</h1>
    <section class="mb-5">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">
        {{ $t("warranty_section.title") }}
      </h2>
      <p class="text-gray-700 mb-4">
        {{ $t("warranty_section.description1") }}
      </p>
      <p class="text-gray-700">{{ $t("warranty_section.description2") }}</p>
    </section>
    <section class="mb-5">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">
        {{ $t("return.title") }}
      </h2>
      <p class="text-gray-700 mb-4">
        {{ $t("return.description1") }}
      </p>
      <p class="text-gray-700">{{ $t("return.description2") }}</p>
    </section>
    <section>
      <h2 class="text-2xl font-bold text-gray-900 mb-4">
        Как оформить возврат
      </h2>
      <p class="text-gray-700 mb-4">
        Перед возвратом товара вам необходимо авторизоваться на сайте и иметь
        оформленные заказы.
      </p>
      <div class="flex items-start mb-10 gap-2">
        <p>1.</p>
        <div>
          <p>
            В верхнем меню вы можете увидеть свое имя, при клике на него, у вас
            откроется контекстное меню, в котором есть раздел
            <span class="font-semibold">"Мои заказы"</span>
          </p>
          <img
            class="w-full md:w-2/3"
            src="@/assets/img/instruction/1.png"
            alt=""
          />
        </div>
      </div>
      <div class="flex items-start mb-10 gap-2">
        <p>2.</p>
        <div>
          <p>
            После того как вы перешли в раздел "Мои заказы", вам необходимо
            найти заказ, который вы хотите вернуть и нажать на кнопку "Оформить
            возврат" (он будет доступна в течение 14 дней после покупки), после
            чего вам откроется форма для заполнения.
          </p>
          <img
            class="w-full md:w-2/3"
            src="@/assets/img/instruction/2.png"
            alt=""
          />
        </div>
      </div>
      <div class="flex items-start gap-2">
        <p>3.</p>
        <div>
          <p>
            После заполнения формы, вам необходимо отправить товар по адресу,
            который указан в форме, после чего вам необходимо будет дождаться
            подтверждения от администратора.
          </p>
          <img
            class="w-full md:w-2/3"
            src="@/assets/img/instruction/3.png"
            alt=""
          />
        </div>
      </div>
    </section>
  </div>
</template>
