import api from "./axios";

export type UserListQuery = {
  search?: string;
  role?: string;
  isActive?: string;
  page?: number;
  limit?: number;
};

export const listUsers = (query?: UserListQuery) =>
  api.get("/users", { params: query });

export const getUserById = (id: string) => api.get(`/users/${id}`);
export const createAgent = (payload: {
  name: string;
  email: string;
  password: string;
  role?: "agent" | "customer";
}) => api.post("/users", payload);
