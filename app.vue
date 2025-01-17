<script setup>
import Notifications from "~/components/general/notifications.vue";
import ModalDialog from "~/components/general/modalDialog.vue";
import useMetrika from "~/composables/useMetrika.js";

const metrika = useMetrika()

onMounted( async () => {
  await nextTick()

  // if (useRuntimeConfig.public.mode !== 'production') return

  metrika.init()
})
</script>

<template>
  <div>
    <NuxtLayout name="default">
      <NuxtPage/>
    </NuxtLayout>
    <Notifications/>
    <ModalDialog/>
  </div>
</template>
