<script setup>
const { t } = useI18n();

useHead({
  title: t("headers.delivery.title"),
  meta: [
    {
      property: "description",
      content: t("headers.delivery.description"),
    },
    {
      property: "og:description",
      content: t("headers.delivery.description"),
    },
    {
      property: "og:title",
      content: t("headers.delivery.title"),
    },
    {
      property: "og:url",
      content: t("headers.delivery.og_url"),
    },
  ],
  link: [{ rel: "canonical", href: t("headers.delivery.canonical") }],
});
</script>

<template>
  <div class="container mx-auto px-4 md:px-0 py-12">
    <h1 class="text-3xl mb-10 font-bold">
      {{ $t("delivery_section.title_full") }}
    </h1>
    <section class="mb-12">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">
        {{ $t("payment_section.title") }}
      </h2>
      <p class="text-gray-700 mb-4">{{ $t("payment_section.description") }}</p>
      <ul class="list-disc list-inside text-gray-700 mb-4">
        <li>{{ $t("payment_section.payment_methods.method1") }}</li>
        <li>{{ $t("payment_section.payment_methods.method2") }}</li>
      </ul>
    </section>

    <section class="mb-12">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">
        {{ $t("delivery_section.title") }}
      </h2>
      <p class="text-gray-700 mb-4">{{ $t("delivery_section.description") }}</p>
      <ul class="list-disc list-inside text-gray-700 mb-4">
        <li>{{ $t("delivery_section.delivery_methods.method1") }}</li>
        <li>{{ $t("delivery_section.delivery_methods.method2") }}</li>
        <li>{{ $t("delivery_section.delivery_methods.method3") }}</li>
        <li>{{ $t("delivery_section.delivery_methods.method4") }}</li>
      </ul>
      <p class="text-gray-700">{{ $t("delivery_section.additional_info") }}</p>
    </section>
  </div>
</template>
