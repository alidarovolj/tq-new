<template>
  <div class="bg-white">
    <div class="mx-auto max-w-7xl px-6 lg:px-8 py-10 md:py-20">
      <div class="mx-auto max-w-4xl divide-y divide-gray-900/10">
        <h2 class="text-2xl font-bold leading-10 tracking-tight text-gray-900">
          {{ $t("where-to-buy.title") }}
        </h2>
        <client-only>
          <dl class="mt-10 space-y-6 divide-y divide-gray-900/10">
            <Disclosure as="div" class="pt-6" v-slot="{ open }">
              <dt>
                <DisclosureButton
                  class="flex w-full items-start justify-between text-left text-gray-900"
                >
                  <span class="text-2xl font-semibold leading-7">
                    {{ $t("where-to-buy.wholesale") }}
                  </span>
                  <span class="ml-6 flex h-7 items-center">
                    <PlusSmallIcon
                      v-if="!open"
                      class="h-6 w-6"
                      aria-hidden="true"
                    />
                    <MinusSmallIcon v-else class="h-6 w-6" aria-hidden="true" />
                  </span>
                </DisclosureButton>
              </dt>
              <DisclosurePanel as="dd" class="mt-2">
                <div class="text-base leading-7 text-gray-600">
                  <p class="text-xl font-semibold mb-5">Car City</p>
                  <iframe
                    src="https://yandex.ru/map-widget/v1/?um=constructor%3A52159c2c9681052a1c1581836d4a9450f56f30d29673b11848be5884f95479e3&amp;source=constructor"
                    width="100%"
                    height="530"
                    frameborder="0"
                  ></iframe>
                </div>
              </DisclosurePanel>
            </Disclosure>
            <Disclosure as="div" class="pt-6" v-slot="{ open }">
              <dt>
                <DisclosureButton
                  class="flex w-full items-start justify-between text-left text-gray-900"
                >
                  <span class="text-2xl font-semibold leading-7">
                    {{ $t("where-to-buy.retail") }}
                  </span>
                  <span class="ml-6 flex h-7 items-center">
                    <PlusSmallIcon
                      v-if="!open"
                      class="h-6 w-6"
                      aria-hidden="true"
                    />
                    <MinusSmallIcon v-else class="h-6 w-6" aria-hidden="true" />
                  </span>
                </DisclosureButton>
              </dt>
              <DisclosurePanel as="dd" class="mt-2">
                <div class="text-base leading-7 text-gray-600">
                  <p class="text-xl font-semibold mb-5">
                    {{ $t("where-to-buy.first") }}
                  </p>
                  <iframe
                    src="https://yandex.ru/map-widget/v1/?um=constructor%3A1119cebb0423bf5327d4e6d4176832aa858110f56c41a75260868f260d273f65&amp;source=constructor"
                    width="100%"
                    height="530"
                    frameborder="0"
                  ></iframe>
                </div>
              </DisclosurePanel>
            </Disclosure>
            <Disclosure as="div" class="pt-6" v-slot="{ open }">
              <dt class="mb-5">
                <DisclosureButton
                  class="flex w-full items-start justify-between text-left text-gray-900"
                >
                  <span class="text-2xl font-semibold leading-7">
                    {{ $t("where-to-buy.marketplace") }}
                  </span>
                  <span class="ml-6 flex h-7 items-center">
                    <PlusSmallIcon
                      v-if="!open"
                      class="h-6 w-6"
                      aria-hidden="true"
                    />
                    <MinusSmallIcon v-else class="h-6 w-6" aria-hidden="true" />
                  </span>
                </DisclosureButton>
              </dt>
              <DisclosurePanel as="dd" class="mt-2">
                <div class="text-base leading-7 text-gray-600">
                  <a
                    target="_blank"
                    href="https://kaspi.kz/shop/search/?text=TQ&q=%3AavailableInZones%3AMagnum_ZONE1&sort=relevance&filteredByCategory=false&sc="
                    class="flex items-center gap-3"
                  >
                    <img
                      class="w-10 h-10"
                      src="@/assets/img/logos/kaspi.png"
                      alt=""
                    />
                    <p class="text-xl font-semibold">Kaspi</p>
                  </a>
                </div>
              </DisclosurePanel>
            </Disclosure>
          </dl>
        </client-only>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { MinusSmallIcon, PlusSmallIcon } from "@heroicons/vue/24/outline";

const { t } = useI18n();

useHead({
  title: t("headers.where-to-buy.title"),
  meta: [
    {
      property: "description",
      content: t("headers.where-to-buy.description"),
    },
    {
      property: "og:description",
      content: t("headers.where-to-buy.description"),
    },
    {
      property: "og:title",
      content: t("headers.where-to-buy.title"),
    },
    {
      property: "og:url",
      content: t("headers.where-to-buy.og_url"),
    },
  ],
  link: [{ rel: "canonical", href: t("headers.where-to-buy.canonical") }],
});
</script>
