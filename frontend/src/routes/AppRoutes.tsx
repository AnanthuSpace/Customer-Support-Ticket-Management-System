import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";

import DashboardLayout from "../layouts/DashboardLayout";
import AuthLayout from "../layouts/AuthLayout";

import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Dashboard from "@/pages/Dashboard";
import TicketList from "@/pages/TicketList";
import TicketDetails from "@/pages/TicketDetails";
import CreateTicket from "@/pages/CreateTicket";
import UserList from "@/pages/UserList";
import UserDetails from "@/pages/UserDetails";
import CreateAgent from "@/pages/CreateAgent";

export default function AppRoutes() {
    return (
        <Routes>
            <Route element={<AuthLayout />}>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
            </Route>

            <Route
                element={
                    <ProtectedRoute>
                        <DashboardLayout />
                    </ProtectedRoute>
                }
            >
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/tickets" element={<TicketList />} />
                <Route path="/tickets/:id" element={<TicketDetails />} />
                <Route path="/create-ticket" element={<CreateTicket />} />
                <Route path="/users" element={<UserList />} />
                <Route path="/users/create" element={<CreateAgent />} />
                <Route path="/users/:id" element={<UserDetails />} />
            </Route>
        </Routes>
    );
}
