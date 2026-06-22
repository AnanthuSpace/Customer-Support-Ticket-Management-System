import { v4 as uuidv4 } from "uuid";

export const generateUserId = () => {
    return `USR-${uuidv4()}`;
};

export const generateTicketId = () => {
    return `TKT-${uuidv4()}`;
};