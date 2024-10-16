import {defineStore} from "pinia";
import {useNotificationStore} from "~/stores/notifications.js";

export const useOrdersStore = defineStore("orders", () => {
    const ordersList = ref(null);
    const madeReturn = ref(null);
    const route = useRoute()
    const notifications = useNotificationStore()

    return {
        ordersList,
        madeReturn,
        async getOrders() {
            try {
                const response = await api(`/orders/my-orders`, "GET", {}, route.query);
                ordersList.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async makeReturn(id, formData) {
            try {
              const response = await api(`/orders/my-orders/${id}/return`, "POST", {
                body: formData
              }, route.query);
              madeReturn.value = response;
            } catch (e) {
              notifications.showNotification("error", "Произошла ошибка", e);
            }
          }
    };
});