<script setup>
import {CheckIcon} from "@heroicons/vue/24/outline";
import Breadcrumbs from "~/components/general/breadcrumbs.vue";

const localePath = useLocalePath();
const {t} = useI18n();

const links = computed(() => [
  {
    title: t('breadcrumbs.home'),
    link: localePath("/"),
  },
  {
    title: t('breadcrumbs.payment_success'),
    link: localePath("/payment-success"),
  },
]);
</script>

<template>
  <div>
    <Breadcrumbs :links="links"/>
    <div class="container mx-auto px-4 md:px-0">
      <div class="flex md:flex-row flex-col justify-between items-start py-36">
        <div class="text-center w-full md:w-half md:mb-0 mb-8">
          <div class="mx-auto p-2 rounded-full border-2 w-max border-green-500 mb-6">
            <CheckIcon class="!text-green-500 w-10 h-10"/>
          </div>
          <h1 class="text-3xl font-bold text-gray-900">
            {{ $t('payment_success.title') }}
          </h1>
          <p class="my-6 text-gray-700">
            {{ $t('payment_success.description') }}
          </p>
          <NuxtLink
              :to="localePath('/')"
              class="border px-6 py-3 rounded-full bg-mainColor text-white"
          >
            {{ $t('payment_success.back_to_home') }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
