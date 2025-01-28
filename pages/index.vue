<script lang="ts" setup>
import Hero from "~/components/mainPage/hero.vue";
import ContactForm from "~/components/mainPage/contactForm.vue";
import Catalog from "~/components/mainPage/catalog.vue";
import LiquidationsBlock from "~/components/mainPage/LiquidationsBlock.vue";

const { t } = useI18n();

useHead({
  title: t("headers.mainPage.title"),
  meta: [
    {
      property: "description",
      content: t("headers.mainPage.description"),
    },
    {
      property: "og:description",
      content: t("headers.mainPage.description"),
    },
    {
      property: "og:title",
      content: t("headers.mainPage.title"),
    },
    {
      property: "og:url",
      content: t("headers.mainPage.og_url"),
    },
  ],
  link: [{ rel: "canonical", href: t("headers.mainPage.canonical") }],
});
</script>

<template>
  <div>
    <Hero />
<!--     <InfoGrid />-->
    <Catalog />
   <LiquidationsBlock/>
<!--    <Timeline />-->
<!--     <Cta />-->
<!--        <Products />-->
<!--     <Testimonials />-->
    <!--    <News />-->
    <ContactForm />
  </div>
</template>
