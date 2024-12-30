/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./components/**/*.{js,vue,ts}",
        "./layouts/**/*.vue",
        "./pages/**/*.vue",
        "./plugins/**/*.{js,ts}",
        "./app.vue",
        "./error.vue",
    ],
    theme: {
        extend: {
            colors: {
                mainColor: "#d62d2d"
            },
            width: {
              sixth: '15.5%',
              third: '32%',
              fourth: '24%',
              fifth: '19%',
              half: '49%'
            }
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography'),
        // require('@tailwindcss/aspect-ratio'),
    ],
}

