const metrika = {

    init () {
        useHead({
            script: {
                type: 'text/javascript',
                innerHTML: `
          (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
          m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
          (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym")

          ym(99520755, "init", {
                clickmap:true,
                trackLinks:true,
                accurateTrackBounce:true,
                webvisor:true
          })

          const noscript = document.createElement('noscript')
          noscript.innerHTML = '<div><img src="https://mc.yandex.ru/watch/99520755" style="position:absolute; left:-9999px;" alt="" /></div>'
          document.body.append(noscript)
        `
            }
        })
    },
}

export default () => {
    return metrika
}
