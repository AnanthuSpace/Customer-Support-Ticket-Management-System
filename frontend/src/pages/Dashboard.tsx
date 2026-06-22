export default function Dashboard() {
    const { user } = useAuth();

    return (
        <>
            <h1>Dashboard</h1>

            {user.role === "customer" && (
                <DashboardCards type="customer" />
            )}

            {user.role === "agent" && (
                <DashboardCards type="agent" />
            )}

            {user.role === "admin" && (
                <DashboardCards type="admin" />
            )}
        </>
    );
}