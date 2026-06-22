import api from "./axios";

export const loginUser = async (data: {
    email: string;
    password: string;
}) => {
    return api.post("/auth/login", data);
};

export const registerCustomer = async (data: {
    name: string;
    email: string;
    password: string;
}) => {
    return api.post("/auth/register", data);
};