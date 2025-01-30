export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    VERIFY_EMAIL: "/auth/verify-email",
    VERIFY_PHONE: "/auth/verify-phone",
    CHECK_USER: "/auth/check-user",
  },
  PRODUCTS: {
    LIST: "/products",
    DETAIL: (id) => `/products/${id}`,
    CATEGORIES: "/categories",
  },
  ORDERS: {
    CREATE: "/orders",
    LIST: "/orders",
    DETAIL: (id) => `/orders/${id}`,
  },
  USER: {
    PROFILE: "/user/profile",
    UPDATE: "/user/update",
  },
};
