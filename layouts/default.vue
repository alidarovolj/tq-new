<template>
  <div class="flex flex-col justify-between min-h-screen">
    <Header />
    <NuxtPage />
    <Footer />
  </div>
</template>

<script lang="ts" setup>
import Header from "~/components/layout/header.vue";
import Footer from "~/components/layout/footer.vue";
</script>
