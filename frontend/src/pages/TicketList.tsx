import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Eye, Trash2 } from "lucide-react";

import { listTickets, deleteTicket } from "@/api/ticket.api";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const statusOptions = [
  { value: "", label: "All Statuses" },
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
];

export default function TicketList() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState<string | null>(null);

  const fetchTickets = async (
    searchQuery = "",
    statusQuery = "",
    currentPage = 1
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await listTickets({
        search: searchQuery || undefined,
        status: statusQuery || undefined,
        page: currentPage,
        limit: 10,
      });

      const ticketData = response.data?.data;
      setTickets(ticketData?.tickets || []);
      setPagination(ticketData?.pagination || null);
      toast.success("Tickets loaded successfully");
    } catch (err: any) {
      const message = err.response?.data?.message || "Could not load tickets";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets(search, status, page);
  }, [page]);

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPage(1);
    await fetchTickets(search, status, 1);
    toast.success("Ticket search applied");
  };

  const handleReset = async () => {
    setSearch("");
    setStatus("");
    setPage(1);
    await fetchTickets("", "", 1);
    toast.success("Ticket filters reset");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Tickets</h1>
          <p className="text-sm text-slate-600">Search, filter, and review support tickets.</p>
        </div>

        <Link to="/create-ticket">
          <Button>Create Ticket</Button>
        </Link>
      </div>

      <form onSubmit={handleSearch} className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-3">
        <div className="space-y-2">
          <Label>Search</Label>
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Title or description"
          />
        </div>

        <div className="space-y-2">
          <Label>Status</Label>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
          >
            {statusOptions.map((option) => (
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
        <p>Loading tickets...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : tickets.length === 0 ? (
        <p>No tickets found.</p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-slate-700">Title</th>
                  <th className="px-4 py-3 font-medium text-slate-700">Status</th>
                  <th className="px-4 py-3 font-medium text-slate-700">Created By</th>
                  <th className="px-4 py-3 font-medium text-slate-700">Assigned To</th>
                  <th className="px-4 py-3 font-medium text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {tickets.map((ticket) => (
                  <tr key={ticket._id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">{ticket.title}</td>
                    <td className="px-4 py-3 capitalize">{ticket.status?.replaceAll("_", " ")}</td>
                    <td className="px-4 py-3">{ticket.createdBy?.name || "-"}</td>
                    <td className="px-4 py-3">{ticket.assignedTo?.name || "Unassigned"}</td>
                    <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Link
                            to={`/tickets/${ticket._id}`}
                            className="inline-flex items-center gap-2 text-blue-600 hover:underline"
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </Link>

                          <button
                            onClick={() => {
                              setToDeleteId(ticket._id);
                              setConfirmOpen(true);
                            }}
                            className="inline-flex items-center gap-2 text-red-600 hover:underline"
                            aria-label={`Delete ticket ${ticket.title}`}
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </button>
                        </div>
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
                  Showing page <strong>{pagination.page}</strong> of <strong>{pagination.totalPages}</strong>.
                </p>
                <p>{pagination.total} total tickets found.</p>
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

      <ConfirmModal
        open={confirmOpen}
        title="Delete ticket"
        message="Are you sure you want to delete this ticket? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={async () => {
          if (!toDeleteId) return;
          try {
            await deleteTicket(toDeleteId);
            toast.success("Ticket deleted");
            setToDeleteId(null);
            await fetchTickets(search, status, page);
          } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to delete ticket");
          } finally {
            setConfirmOpen(false);
          }
        }}
        onCancel={() => {
          setConfirmOpen(false);
          setToDeleteId(null);
        }}
      />
        </>
      )}
    </div>
  );
}
