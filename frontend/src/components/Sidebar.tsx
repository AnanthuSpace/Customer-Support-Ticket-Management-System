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
            {
                label: "Create Ticket",
                path: "/create-ticket",
            },
            {
                label: "Users",
                path: "/users",
            },
            {
                label: "Create Agent",
                path: "/users/create",
            },
        ],
    };

    const items = menus[user?.role || "customer"];

    return (
        <>
            <aside className="w-64 min-h-screen bg-slate-900 text-white p-4">
                <div>
                    <h2 className="text-xl font-bold mb-6">Ticket System</h2>

                    <nav className="flex flex-col gap-3">
                        {items.map((item) => (
                            <Link key={item.path} to={item.path} className="hover:text-slate-300">
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            </aside>

            <button
                onClick={logout}
                aria-label="Logout"
                className="fixed left-4 bottom-4 z-50 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
            >
                Logout
            </button>
        </>
    );
}
