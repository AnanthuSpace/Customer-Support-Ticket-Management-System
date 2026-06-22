import { Outlet } from "react-router-dom";

export default function AuthLayout() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-100 px-4">
            <Outlet />
        </div>
    );
}