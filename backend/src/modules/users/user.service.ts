import type { UserQuery } from "./user.repository.js";
import * as repo from "./user.repository.js";

export const listUsers = async (query: {
    search?: string;
    role?: string;
    isActive?: string;
    page?: string;
    limit?: string;
}) => {
    const page = query.page ? Math.max(1, Number(query.page)) : 1;
    const limit = query.limit
        ? Math.min(100, Math.max(1, Number(query.limit)))
        : 10;

    const options: UserQuery = {
        search: query.search,
        role: query.role,
        isActive: query.isActive,
        page,
        limit,
    };

    return repo.findAllUsers(options);
};
