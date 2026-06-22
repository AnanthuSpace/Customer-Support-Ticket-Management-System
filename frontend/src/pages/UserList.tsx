import { useEffect, useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { listUsers } from "@/api/user.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const roleOptions = [
  { value: "", label: "All Roles" },
  { value: "customer", label: "Customer" },
  { value: "agent", label: "Agent" },
  { value: "admin", label: "Admin" },
];

const activeOptions = [
  { value: "", label: "All Users" },
  { value: "true", label: "Active" },
  { value: "false", label: "Inactive" },
];

export default function UserList() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [isActive, setIsActive] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);

  const fetchUsers = async (
    searchQuery = "",
    roleQuery = "",
    activeQuery = "",
    currentPage = 1
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await listUsers({
        search: searchQuery || undefined,
        role: roleQuery || undefined,
        isActive: activeQuery || undefined,
        page: currentPage,
        limit: 10,
      });

      const data = response.data?.data;
      setUsers(data?.users || []);
      setPagination(data?.pagination || null);
      toast.success("Users loaded successfully");
    } catch (err: any) {
      const message = err.response?.data?.message || "Could not load users";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(search, role, isActive, page);
  }, [page]);

  const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPage(1);
    await fetchUsers(search, role, isActive, 1);
    toast.success("User search applied");
  };

  const handleReset = async () => {
    setSearch("");
    setRole("");
    setIsActive("");
    setPage(1);
    await fetchUsers("", "", "", 1);
    toast.success("User filters reset");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Users</h1>
          <p className="text-sm text-slate-600">Filter users by role, activity, and search by name or email.</p>
        </div>

        <Link to="/users/create">
          <Button>Create Agent</Button>
        </Link>
      </div>

      <form onSubmit={handleSearch} className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-4">
        <div className="space-y-2 sm:col-span-2">
          <Label>Search</Label>
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Name or email"
          />
        </div>

        <div className="space-y-2">
          <Label>Role</Label>
          <select
            value={role}
            onChange={(event) => setRole(event.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
          >
            {roleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label>Status</Label>
          <select
            value={isActive}
            onChange={(event) => setIsActive(event.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
          >
            {activeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end justify-end gap-2">
          <Button type="button" variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button type="submit">Apply</Button>
        </div>
      </form>

      {loading ? (
        <p>Loading users...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-slate-700">Name</th>
                  <th className="px-4 py-3 font-medium text-slate-700">Email</th>
                  <th className="px-4 py-3 font-medium text-slate-700">Role</th>
                  <th className="px-4 py-3 font-medium text-slate-700">Active</th>
                  <th className="px-4 py-3 font-medium text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">{user.name}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3 capitalize">{user.role}</td>
                    <td className="px-4 py-3">{user.isActive ? "Yes" : "No"}</td>
                    <td className="px-4 py-3">
                      <Link to={`/users/${user._id}`} className="text-blue-600 hover:underline">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination && (
            <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p>
                  Showing page <strong>{pagination.page}</strong> of <strong>{pagination.totalPages}</strong>
                </p>
                <p>{pagination.total} total users.</p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={pagination.page <= 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setPage((prev) => Math.min(pagination.totalPages, prev + 1))}
                  disabled={pagination.page >= pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
