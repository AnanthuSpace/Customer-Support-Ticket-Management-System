import { Link } from "react-router-dom";

const cards = {
  customer: [
    {
      title: "My Tickets",
      description: "See and manage the tickets you have created.",
      route: "/tickets",
    },
    {
      title: "Create Ticket",
      description: "Open a new support ticket for your issue.",
      route: "/create-ticket",
    },
  ],
  agent: [
    {
      title: "Assigned Tickets",
      description: "Review the tickets assigned to you.",
      route: "/tickets",
    },
  ],
  admin: [
    {
      title: "All Tickets",
      description: "Manage every ticket in the system.",
      route: "/tickets",
    },
    {
      title: "Create Ticket",
      description: "Create tickets on behalf of users.",
      route: "/create-ticket",
    },
    {
      title: "Users",
      description: "View and manage user accounts.",
      route: "/users",
    },
  ],
};

type DashboardCardsProps = {
  type: "customer" | "agent" | "admin";
};

export default function DashboardCards({ type }: DashboardCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards[type].map((card) => (
        <Link key={card.route} to={card.route} className="block rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
          <h2 className="text-lg font-semibold">{card.title}</h2>
          <p className="mt-2 text-sm text-slate-600">{card.description}</p>
        </Link>
      ))}
    </div>
  );
}
