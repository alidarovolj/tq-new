import {defineStore} from "pinia";
import {useNotificationStore} from "~/stores/notifications.js";

export const useCartStore = defineStore("cart", () => {
    const cartList = ref(null);
    const removedItem = ref(null);
    const editedItem = ref(null);
    const removedCart = ref(null);
    const temporaryCode = ref(null);
    const cartPrice = ref(0);
    const route = useRoute()
    const notifications = useNotificationStore()
    const auth = useAuthStore()
    auth.initCookieToken()
    const { token } = storeToRefs(auth)
    const tempCode = useCookie('temporary_code', {
        sameSite: true,
        maxAge: 60 * 60 * 24,
    })

    return {
        cartList,
        removedItem,
        editedItem,
        removedCart,
        cartPrice,
        temporaryCode,
        async getCart() {
            try {
                const response = await api(`/carts/`, "GET", {}, route.query);
                cartList.value = response;
                if (response && response.data) {
                    cartPrice.value = 0;
                    response.data.forEach((item) => {
                        cartPrice.value += parseInt(item.price);
                    });
                }
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async addItem(product) {
            let body = null
            if(token.value) {
                body = {
                    product_id: product.id,
                    quantity: 1
                }
            } else {
                body = {
                    product_id: product.id,
                    quantity: 1,
                    temporary_code: tempCode.value
                }
            }
            try {
                const response = await api(`/carts/add`, "POST", {
                    body: JSON.stringify(body)
                }, route.query);
                removedItem.value = response;
                notifications.showNotification("success", "Успешно", "Продукт успешно добавлен");
                if(token.value) {
                    await this.getCart()
                } else {
                    await this.getTemporaryCart()
                }
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async removeItem(id) {
            try {
                const response = await api(`/carts/${id}`, "DELETE", {}, route.query);
                removedItem.value = response;
                notifications.showNotification("success", "Продукт успешно удален", "Продукт успешно удален из корзины");
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async editItem(id, form) {
            try {
                const response = await api(`/carts/${id}`, "PUT", {
                    body: JSON.stringify(form)
                }, route.query);
                editedItem.value = response;
                // notifications.showNotification("success", "Продукт успешно отредактирован", "Продукт успешно отредактирован");
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async removeCart() {
            try {
                const response = await api(`/carts/clear`, "POST", {}, route.query);
                removedCart.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async getTemporaryCode() {
            try {
                const response = await api(`/carts/temporary`, "GET", {}, route.query);
                temporaryCode.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async getTemporaryCart() {
            try {
                const response = await api(`/carts/`, "GET", {}, {
                    temporary_code: tempCode.value
                });
                cartList.value = response;
                if (response && response.data) {
                    cartPrice.value = 0;
                    response.data.forEach((item) => {
                        cartPrice.value += parseInt(item.price);
                    });
                }
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
    };
});