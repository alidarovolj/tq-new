import {defineStore} from "pinia";
import {useNotificationStore} from "~/stores/notifications.js";

export const useOrdersStore = defineStore("orders", () => {
    const ordersList = ref(null);
    const madeReturn = ref(null);
    const refunds = ref(null)
    const route = useRoute()
    const notifications = useNotificationStore()

    return {
        ordersList,
        madeReturn,
        refunds,
        async getOrders() {
            try {
              ordersList.value = await api(`/orders/my-orders`, "GET", {}, route.query);
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async makeReturn(id, formData) {
            try {
              madeReturn.value = await api(`/orders/my-orders/${id}/return`, "POST", {
                body: formData
              }, route.query);
            } catch (e) {
              notifications.showNotification("error", "Произошла ошибка", e);
            }
          },
      async getRefunds() {
        const { data, error } = await useApi('/orders/returned')

        if(error.value) return

        refunds.value = data.value
      }
    };
});