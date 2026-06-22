import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { getUserById } from "@/api/user.api";
import { Button } from "@/components/ui/button";

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);

    try {
      const response = await getUserById(id);
      setUser(response.data?.data);
      toast.success("User details loaded");
    } catch (err: any) {
      const message = err.response?.data?.message || "Could not load user";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  if (loading) {
    return <p>Loading user...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  if (!user) {
    return <p>User not found.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">User Details</h1>
          <p className="text-sm text-slate-600">Review account details for this user.</p>
        </div>

        <Button variant="outline" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div>
          <p className="text-sm text-slate-500">Name</p>
          <p className="mt-1 text-lg font-medium">{user.name}</p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Email</p>
          <p className="mt-1 text-lg font-medium">{user.email}</p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Role</p>
          <p className="mt-1 text-lg font-medium capitalize">{user.role}</p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Active</p>
          <p className="mt-1 text-lg font-medium">{user.isActive ? "Yes" : "No"}</p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Created At</p>
          <p className="mt-1 text-lg font-medium">{new Date(user.createdAt).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
