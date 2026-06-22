import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import ConfirmModal from "@/components/ui/ConfirmModal";

import { getTicketById, updateTicketStatus, deleteTicket } from "@/api/ticket.api";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

const statusOptions = [
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
];

export default function TicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [ticket, setTicket] = useState<any>(null);
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const fetchTicket = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const response = await getTicketById(id);
      const ticketData = response.data?.data;
      setTicket(ticketData);
      setStatus(ticketData?.status || "");
    } catch (err: any) {
      const message = err.response?.data?.message || "Could not load ticket";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const handleStatusUpdate = async () => {
    if (!id || !status) return;
    setUpdating(true);
    try {
      const response = await updateTicketStatus(id, status);
      setTicket(response.data.data);
      toast.success("Ticket status updated");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <p>Loading ticket...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  if (!ticket) {
    return <p>Ticket not found.</p>;
  }

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteTicket(id);
      toast.success("Ticket deleted successfully");
      navigate("/tickets");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete ticket");
    } finally {
      setConfirmOpen(false);
    }
  };

  const canUpdateStatus = user?.role === "admin" || user?.role === "agent";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Ticket Details</h1>
          <p className="text-sm text-slate-600">Review the details for this ticket.</p>
        </div>

        <Button variant="outline" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">{ticket.title}</h2>
            <p className="text-sm text-slate-500">{ticket.description}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Status</p>
              <p className="mt-2 text-base font-medium capitalize">{ticket.status?.replaceAll("_", " ")}</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Created By</p>
              <p className="mt-2 text-base font-medium">{ticket.createdBy?.name || "Unknown"}</p>
              <p className="text-sm text-slate-500">{ticket.createdBy?.email}</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Assigned To</p>
              <p className="mt-2 text-base font-medium">{ticket.assignedTo?.name || "Unassigned"}</p>
              <p className="text-sm text-slate-500">{ticket.assignedTo?.email || ""}</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Created At</p>
              <p className="mt-2 text-base font-medium">{new Date(ticket.createdAt).toLocaleString()}</p>
            </div>
          </div>
        </div>

        {canUpdateStatus && (
          <div className="mt-6 space-y-3">
            <label className="block text-sm font-medium text-slate-700">Update status</label>
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
            <Button onClick={handleStatusUpdate} disabled={updating}>
              {updating ? "Updating..." : "Update Status"}
            </Button>
            <Button
              variant="destructive"
                onClick={() => setConfirmOpen(true)}
              disabled={updating}
              className="w-full"
            >
              Delete Ticket
            </Button>
          </div>
        )}
      </div>

        <ConfirmModal
          open={confirmOpen}
          title="Delete ticket"
          message="Are you sure you want to delete this ticket? This action cannot be undone."
          confirmLabel="Delete"
          cancelLabel="Cancel"
          onConfirm={handleDelete}
          onCancel={() => setConfirmOpen(false)}
        />
    </div>
  );
}
