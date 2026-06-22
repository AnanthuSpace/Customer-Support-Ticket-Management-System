import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
    const { user, logout } = useAuth();

    const menus = {
        customer: [
            {
                label: "Dashboard",
                path: "/dashboard",
            },
            {
                label: "Tickets",
                path: "/tickets",
            },
            {
                label: "Create Ticket",
                path: "/create-ticket",
            },
        ],

        agent: [
            {
                label: "Dashboard",
                path: "/dashboard",
            },
            {
                label: "Assigned Tickets",
                path: "/tickets",
            },
        ],

        admin: [
            {
                label: "Dashboard",
                path: "/dashboard",
            },
            {
                label: "All Tickets",
                path: "/tickets",
            },
        ],
    };

    const items =
        menus[user?.role || "customer"];

    return (
        <aside className="w-64 min-h-screen bg-slate-900 text-white p-4">
            <h2 className="text-xl font-bold mb-6">
                Ticket System
            </h2>

            <nav className="flex flex-col gap-3">
                {items.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className="hover:text-slate-300"
                    >
                        {item.label}
                    </Link>
                ))}
            </nav>

            <button
                onClick={logout}
                className="mt-10 bg-red-500 px-4 py-2 rounded"
            >
                Logout
            </button>
        </aside>
    );
}