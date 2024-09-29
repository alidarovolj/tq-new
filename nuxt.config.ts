export default defineNuxtConfig({
    app: {
        head: {
            link: [
                { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
                { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
                { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
                { rel: 'manifest', href: '/site.webmanifest' }
            ],
            meta: [
                { name: 'msapplication-TileColor', content: '#da532c' },
                { name: 'theme-color', content: '#ffffff' }
            ]
        }
    },
    devtools: {enabled: true},
    css: ['~/assets/css/main.css'],

    i18n: {
        lazy: true,
        langDir: "locales/",
        strategy: "prefix_except_default",
        defaultLocale: "ru-RU",
        locales: [
            {
                code: "en-US",
                iso: "en-US",
                name: "English",
                sh_name: "en",
                file: "en-US.json",
            },
            {
                code: "kz-KZ",
                iso: "kz-KZ",
                name: "Қазақ",
                sh_name: "kk",
                file: "kz-KZ.json",
            },
            {
                code: "ru-RU",
                iso: "ru-RU",
                name: "Русский",
                sh_name: "ru",
                file: "ru-RU.json",
            },
        ],
        detectBrowserLanguage: false,
        vueI18n: "./i18n.config.ts",
    },

    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },

    compatibilityDate: '2024-07-14',

    imports: {
        dirs: [
            "stores",
            "composables",
            "composables/*/index.{ts,js,mjs,mts}",
            "composables/**",
        ],
    },

    modules: [
        "vue3-carousel-nuxt",
        "@nuxtjs/i18n",
        "@pinia/nuxt"
    ],
    carousel: {
        prefix: 'my-carousel',
    }
})