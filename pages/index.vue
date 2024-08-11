<script setup lang="ts">
import Hero from "~/components/mainPage/hero.vue";
import Cta from "~/components/mainPage/cta.vue";
import News from "~/components/general/news.vue";
import ContactForm from "~/components/mainPage/contactForm.vue";
import Testimonials from "~/components/mainPage/testimonials.vue";
import Catalog from "~/components/mainPage/catalog.vue";
</script>

<template>
  <div>
    <Hero />
    <Cta />
    <Catalog />
<!--    <Products />-->
    <Testimonials />
    <News />
    <ContactForm />
  </div>
</template>
