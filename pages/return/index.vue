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
    <section>
      <h2 class="text-2xl font-bold text-gray-900 mb-4">
        {{ $t("return.title") }}
      </h2>
      <p class="text-gray-700 mb-4">
        {{ $t("return.description1") }}
      </p>
      <p class="text-gray-700">{{ $t("return.description2") }}</p>
    </section>
  </div>
</template>
