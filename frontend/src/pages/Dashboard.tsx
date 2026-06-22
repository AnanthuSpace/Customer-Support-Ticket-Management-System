import { mockMetrics, mockTickets } from '@/data/mockData'
import {
  Ticket,
  Clock,
  AlertTriangle,
  Smile,
  ArrowUpRight,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function Dashboard() {
  const stats = [
    {
      label: 'Open Tickets',
      value: mockMetrics.open,
      change: '+12% from yesterday',
      icon: Ticket,
      color: 'text-amber-400 bg-amber-400/10',
    },
    {
      label: 'Avg Resolution Time',
      value: `${mockMetrics.avgResolutionTimeHours} hrs`,
      change: '-0.5 hrs from last week',
      icon: Clock,
      color: 'text-blue-400 bg-blue-400/10',
    },
    {
      label: 'SLA Breach Rate',
      value: `${mockMetrics.slaBreachRate}%`,
      change: '-1.2% from last month',
      icon: AlertTriangle,
      color: 'text-red-400 bg-red-400/10',
    },
    {
      label: 'Customer CSAT',
      value: `${mockMetrics.satisfactionScore} / 5`,
      change: '+0.1 this week',
      icon: Smile,
      color: 'text-emerald-400 bg-emerald-400/10',
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
        <div>
          <h2 className="text-xl font-bold tracking-tight">System Status Overview</h2>
          <p className="text-xs text-muted-foreground mt-1">
            All services are operational. You have {mockMetrics.open} pending tickets requiring attention.
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-xs bg-background/50 py-1 px-3">
            SLA Target: 95%
          </Badge>
          <Badge variant="resolved" className="text-xs py-1 px-3">
            Current CSAT: 94%
          </Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="metric-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 pb-2">
              <span className="text-xs font-medium text-muted-foreground">{stat.label}</span>
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-emerald-400" />
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Recent Tickets */}
        <Card className="glass-card md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Urgent Attention Required</CardTitle>
              <CardDescription>Highest priority and SLA-sensitive tickets.</CardDescription>
            </div>
            <Link to="/tickets" className="text-xs text-primary hover:underline flex items-center gap-0.5">
              View all <ArrowUpRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="flex items-center justify-between gap-4 p-3 rounded-lg border border-border/30 hover:border-border transition-colors group cursor-pointer"
              >
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-semibold text-muted-foreground">
                      {ticket.ticketNumber}
                    </span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs font-medium text-foreground">{ticket.category}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                    {ticket.title}
                  </h4>
                  <p className="text-xs text-muted-foreground truncate max-w-md">
                    {ticket.description}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Badge variant={ticket.status}>{ticket.status.replace('_', ' ')}</Badge>
                  <Badge variant={ticket.priority}>{ticket.priority}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* SLA Status & Performance */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>SLA Compliance Status</CardTitle>
            <CardDescription>Response and resolution target metrics.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">First Response SLA</span>
                <span className="font-semibold text-foreground">93.8%</span>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '93.8%' }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Resolution SLA</span>
                <span className="font-semibold text-foreground">89.5%</span>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '89.5%' }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">First Contact Resolution (FCR)</span>
                <span className="font-semibold text-foreground">67.2%</span>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '67.2%' }}></div>
              </div>
            </div>

            <Separator />

            {/* System Info */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Agent Workload
              </h4>
              <div className="space-y-2">
                {[
                  { name: 'John Doe', tickets: 5, active: true },
                  { name: 'Alice Johnson', tickets: 8, active: true },
                  { name: 'Sarah Connor', tickets: 2, active: false },
                ].map((agent) => (
                  <div key={agent.name} className="flex items-center justify-between text-xs">
                    <span className="text-foreground flex items-center gap-1.5">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          agent.active ? 'bg-emerald-500' : 'bg-slate-500'
                        }`}
                      ></span>
                      {agent.name}
                    </span>
                    <span className="text-muted-foreground font-semibold">
                      {agent.tickets} active tickets
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
