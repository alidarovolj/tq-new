<template>
  <div class="flex flex-col justify-between min-h-screen">
    <Header />
    <NuxtPage />
    <Footer />
  </div>
</template>

<script setup>
import Header from "~/components/layout/header.vue";
import Footer from "~/components/layout/footer.vue";
import {useAuthStore} from "~/stores/auth";
import {useUserStore} from "~/stores/user";

const auth = useAuthStore()
const user = useUserStore()
const cart = useCartStore()

if(auth.token) {
 user.getProfile()
 cart.getCart()
}
</script>
