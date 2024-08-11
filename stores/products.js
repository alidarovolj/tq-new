import {defineStore} from "pinia";
import {useNotificationStore} from "~/stores/notifications.js";

export const useProductsStore = defineStore("products", () => {
    const categoryWithProducts = ref(null);
    const detailProduct = ref(null);
    const catalogList = ref(null);
    const productsByCategory = ref(null);
    const sameProducts = ref(null);
    const route = useRoute()
    const notifications = useNotificationStore()

    return {
        categoryWithProducts,
        detailProduct,
        catalogList,
        productsByCategory,
        sameProducts,
        async getCatalog() {
            try {
                const response = await api(`/catalog`, "GET", {}, route.query);
                catalogList.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async getCategoryWithEightProducts() {
            try {
                const response = await api(`/category-with-products`, "GET", {}, route.query);
                response.data = response.data.filter(category => category.products.length > 0);
                categoryWithProducts.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async getDetailProduct(id) {
            try {
                const response = await api(`/products/${id}`, "GET", {}, route.query);
                detailProduct.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async getProductsByCategory(id) {
            try {
                const response = await api(`/categories/${id}`, "GET", {}, route.query);
                response.data.sub_category_limitless = response.data.sub_category_limitless.filter(subCategory => subCategory.products_limitless.length > 0);
                productsByCategory.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async getSameProducts(id) {
            try {
                const response = await api(`/products/same-products/${id}`, "GET", {}, route.query);
                sameProducts.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        }
    };
});