import axios from 'axios';
import {useAuthStore} from "~/stores/auth.js";
import {storeToRefs} from 'pinia';
import {useUserStore} from "~/stores/user.js";

export async function api(url, method, options = {}, query = {}) {
    const auth = useAuthStore();
    await auth.initCookieToken();
    const {token} = storeToRefs(auth);
    const user = useUserStore()

    const defaultPage = query.page || 1;
    const defaultPerPage = query.perPage || 10;

    const params = {
        ...query,
        page: defaultPage,
        perPage: defaultPerPage,
        ...options.params,
    };

    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.value}`,
    };

    const queryString = Object.keys(params)
        .map(key => {
            const value = params[key];
            if (Array.isArray(value)) {
                return value.map(val => `${encodeURIComponent(key)}[]=${encodeURIComponent(val)}`).join('&');
            }
            return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
        })
        .join('&');

    try {
        const response = await axios({
            url: `${import.meta.env.VITE_APP_BASE_URL}${url}?${queryString}`,
            method: method,
            headers: headers,
            data: options.body ? options.body : undefined,
        });

        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            const authCookie = useCookie('token')
            authCookie.value = null
            user.userProfile = false
            window.location.replace('/')
        } else {
            throw new Error(error.response?.data?.message || 'Request failed');
        }
    }
}
