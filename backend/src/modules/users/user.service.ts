import bcrypt from "bcrypt";
import type { UserQuery } from "./user.repository.js";
import * as repo from "./user.repository.js";
import { ApiError } from "../../utils/ApiError.js";
import { generateUserId } from "../../utils/generateIds.js";

export const createAgent = async (payload: {
    name: string;
    email: string;
    password: string;
    role?: "agent" | "customer";
}) => {
    const existing = await repo.findByEmail(payload.email);
    if (existing) {
        throw new ApiError(409, "User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(payload.password, 10);

    const agent = await repo.createUser({
        userId: generateUserId(),
        name: payload.name,
        email: payload.email,
        password: hashedPassword,
        role: payload.role === "customer" ? "customer" : "agent",
        isActive: true,
    });

    const agentObj = agent.toObject() as Record<string, unknown>;
    delete agentObj["password"];

    return agentObj;
};

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

export const getUserById = async (id: string) => {
    const user = await repo.findById(id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return user;
};
