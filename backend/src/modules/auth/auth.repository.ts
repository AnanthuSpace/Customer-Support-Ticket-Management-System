import User from "../../models/user.model.js";

export const findByEmail = (
    email: string
) => {
    return User.findOne({ email }).select(
        "+password"
    );
};

export const createUser = (
    payload: any
) => {
    return User.create(payload);
};