import { ADMIN_CREDENTIALS } from "../../config/admin.js";

export const login = async (
    email: string,
    password: string
) => {
    if (
        email === ADMIN_CREDENTIALS.email &&
        password === ADMIN_CREDENTIALS.password
    ) {
        return {
            id: "admin-id",
            name: "Admin",
            email,
            role: "admin",
        };
    }

    // continue with customer login
};