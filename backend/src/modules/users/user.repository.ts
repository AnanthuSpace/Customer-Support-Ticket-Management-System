import User from "../../models/user.model.js";

export interface UserQuery {
    search?: string;
    role?: string;
    isActive?: string;
    page?: number;
    limit?: number;
}

export const findAllUsers = async (options: UserQuery = {}) => {
    const {
        search,
        role,
        isActive,
        page = 1,
        limit = 10,
    } = options;

    const query: Record<string, unknown> = {};

    // Search by name or email (case-insensitive)
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
        ];
    }

    // Filter by role: customer | agent | admin
    if (role) {
        query.role = role;
    }

    // Filter by active status
    if (isActive !== undefined && isActive !== "") {
        query.isActive = isActive === "true";
    }

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
        User.find(query)
            .select("-password")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        User.countDocuments(query),
    ]);

    return {
        users,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            hasNext: page * limit < total,
            hasPrev: page > 1,
        },
    };
};
