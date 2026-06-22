import { useAuth } from "../context/AuthContext";
import DashboardCards from "../components/DashboardCards";

export default function Dashboard() {
    const { user } = useAuth();

    return (
        <>
            <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>

            {user?.role === "customer" && (
                <DashboardCards type="customer" />
            )}

            {user?.role === "agent" && (
                <DashboardCards type="agent" />
            )}

            {user?.role === "admin" && (
                <DashboardCards type="admin" />
            )}
        </>
    );
}
