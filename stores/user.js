import {defineStore} from "pinia";
import {useNotificationStore} from "~/stores/notifications.js";

export const useUserStore = defineStore("user", () => {
    const userProfile = ref(null);
    const bannersList = ref(null);
    const route = useRoute()
    const notifications = useNotificationStore()

    return {
        userProfile,
        bannersList,
        async getProfile() {
            try {
                const response = await api(`/auth/me`, "GET", {}, route.query);
                userProfile.value = response;
            } catch (e) {
                userProfile.value = false;
            }
        },
        async getBanners() {
            try {
                const response = await api(`/banners`, "GET", {}, route.query);
                bannersList.value = response;
            } catch (e) {
                bannersList.value = false;
            }
        },
    };
});