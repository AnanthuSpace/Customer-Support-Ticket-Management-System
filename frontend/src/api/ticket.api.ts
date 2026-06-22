import api from "./axios";

export type TicketCreatePayload = {
  title: string;
  description: string;
};

export type TicketListQuery = {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
};

export const createTicket = (payload: TicketCreatePayload) =>
  api.post("/tickets", payload);

export const listTickets = (query?: TicketListQuery) =>
  api.get("/tickets", { params: query });

export const getTicketById = (id: string) => api.get(`/tickets/${id}`);

export const updateTicketStatus = (id: string, status: string) =>
  api.put(`/tickets/${id}`, { status });

export const deleteTicket = (id: string) => api.delete(`/tickets/${id}`);
