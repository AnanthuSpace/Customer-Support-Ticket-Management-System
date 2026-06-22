import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import DashboardCards from "../components/DashboardCards";
import { getDashboardSummary } from "../api/dashboard.api";

type DashboardSummary = {
    totalTickets: number;
    closedTickets: number;
    statuses: {
        open: number;
        in_progress: number;
        resolved: number;
        closed: number;
    };
};

const statusLabels: Record<string, string> = {
    open: "Open",
    in_progress: "In Progress",
    resolved: "Resolved",
    closed: "Closed",
};

const statusColors: Record<string, string> = {
    open: "bg-sky-500",
    in_progress: "bg-amber-500",
    resolved: "bg-violet-500",
    closed: "bg-emerald-500",
};

export default function Dashboard() {
    const { user } = useAuth();
    const [summary, setSummary] = useState<DashboardSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                setLoading(true);
                const response = await getDashboardSummary();
                setSummary(response.data.data);
            } catch (err: any) {
                setError(err.response?.data?.message || "Unable to load dashboard metrics");
            } finally {
                setLoading(false);
            }
        };

        fetchSummary();
    }, []);

    const total = summary?.totalTickets ?? 0;

    return (
        <>
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">Dashboard</h1>
                    <p className="text-sm text-slate-600">Quick insight into your ticket activity and status.</p>
                </div>
            </div>

            {loading ? (
                <p>Loading dashboard stats...</p>
            ) : error ? (
                <p className="text-red-600">{error}</p>
            ) : summary ? (
                <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                            <p className="text-sm uppercase text-slate-500">Total Tickets</p>
                            <p className="mt-3 text-3xl font-semibold text-slate-900">{summary.totalTickets}</p>
                        </div>
                        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                            <p className="text-sm uppercase text-slate-500">Closed Tickets</p>
                            <p className="mt-3 text-3xl font-semibold text-slate-900">{summary.closedTickets}</p>
                        </div>
                        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                            <p className="text-sm uppercase text-slate-500">Your Role</p>
                            <p className="mt-3 text-3xl font-semibold text-slate-900 capitalize">{user?.role}</p>
                        </div>
                    </div>

                    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center justify-between gap-3">
                            <div>
                                <h2 className="text-lg font-semibold">Ticket status overview</h2>
                                <p className="text-sm text-slate-600">Visual breakdown of ticket counts by status.</p>
                            </div>
                            <p className="text-sm text-slate-500">Total: {total}</p>
                        </div>

                        <div className="space-y-4">
                            {Object.entries(summary.statuses).map(([status, count]) => {
                                const percent = total > 0 ? Math.round((count / total) * 100) : 0;
                                return (
                                    <div key={status}>
                                        <div className="mb-2 flex items-center justify-between gap-2 text-sm text-slate-700">
                                            <span>{statusLabels[status] || status}</span>
                                            <span>{count} ({percent}%)</span>
                                        </div>
                                        <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                                            <div
                                                className={`${statusColors[status]} h-full rounded-full transition-all duration-300`}
                                                style={{ width: `${percent}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            ) : null}

            {user?.role === "customer" && <DashboardCards type="customer" />}
            {user?.role === "agent" && <DashboardCards type="agent" />}
            {user?.role === "admin" && <DashboardCards type="admin" />}
        </>
    );
}
