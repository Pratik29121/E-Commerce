import client from "./client";

export const authApi = {
  register: (data) => client.post("/api/auth/register", data),
  login: (data) => client.post("/api/auth/login", data),
  me: () => client.get("/api/users/me"),
};

export const productApi = {
  search: (params) => client.get("/api/products", { params }),
  getById: (id) => client.get(`/api/products/${id}`),
};

export const orderApi = {
  place: (data) => client.post("/api/orders", data),
  getByUser: (userId) => client.get(`/api/orders/user/${userId}`),
  getById: (id) => client.get(`/api/orders/${id}`),
};
