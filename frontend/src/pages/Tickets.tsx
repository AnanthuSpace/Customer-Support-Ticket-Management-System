import { useState } from 'react'
import { mockTickets } from '@/data/mockData'
import { Ticket, TicketStatus, TicketPriority } from '@/types'
import { Search, Filter, RefreshCw, Calendar, MessageSquare, Paperclip } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatDistanceToNow } from 'date-fns'

export function Tickets() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')

  const filteredTickets = mockTickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(search.toLowerCase()) ||
      ticket.ticketNumber.toLowerCase().includes(search.toLowerCase()) ||
      ticket.description.toLowerCase().includes(search.toLowerCase())

    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Support Tickets</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage, filter, and respond to incoming customer issues.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </Button>
          <Button size="sm" className="h-8 gap-1.5 text-xs">
            Create Ticket
          </Button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            id="ticket-search"
            placeholder="Search by ID, title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-9 bg-secondary/35 text-xs"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 rounded-lg border border-border/50 bg-secondary/20 px-2.5 py-1">
            <Filter className="h-3 w-3 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs font-medium text-foreground focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-background">All Statuses</option>
              <option value="open" className="bg-background">Open</option>
              <option value="in_progress" className="bg-background">In Progress</option>
              <option value="resolved" className="bg-background">Resolved</option>
              <option value="closed" className="bg-background">Closed</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-1.5 rounded-lg border border-border/50 bg-secondary/20 px-2.5 py-1">
            <Filter className="h-3 w-3 text-muted-foreground" />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-transparent text-xs font-medium text-foreground focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-background">All Priorities</option>
              <option value="low" className="bg-background">Low</option>
              <option value="medium" className="bg-background">Medium</option>
              <option value="high" className="bg-background">High</option>
              <option value="urgent" className="bg-background">Urgent</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tickets List */}
      <Card className="glass-card overflow-hidden">
        <CardContent className="p-0 divide-y divide-border/40">
          {filteredTickets.length > 0 ? (
            filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 hover:bg-accent/5 transition-all duration-200 group"
              >
                <div className="min-w-0 space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-bold text-primary">
                      {ticket.ticketNumber}
                    </span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">
                      Created {formatDistanceToNow(new Date(ticket.createdAt))} ago
                    </span>
                    <span className="text-xs text-muted-foreground">by</span>
                    <span className="text-xs font-semibold text-foreground">
                      {ticket.createdBy.name}
                    </span>
                  </div>

                  <Link
                    to={`/tickets/${ticket.id}`}
                    className="block text-sm font-semibold text-foreground group-hover:text-primary transition-colors hover:underline"
                  >
                    {ticket.title}
                  </Link>

                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs font-medium text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded">
                      {ticket.category}
                    </span>
                    {ticket.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded border"
                        style={{
                          backgroundColor: `${tag.color}15`,
                          color: tag.color,
                          borderColor: `${tag.color}30`,
                        }}
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Status/Priority & Metadata */}
                <div className="flex items-center justify-between sm:justify-end gap-6 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-border/20">
                  {/* Commments/Attachments Count */}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {ticket.comments.length > 0 && (
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3.5 w-3.5" />
                        {ticket.comments.length}
                      </span>
                    )}
                    {ticket.attachments.length > 0 && (
                      <span className="flex items-center gap-1">
                        <Paperclip className="h-3.5 w-3.5" />
                        {ticket.attachments.length}
                      </span>
                    )}
                    {ticket.dueDate && (
                      <span className="flex items-center gap-1 text-orange-400 font-medium">
                        <Calendar className="h-3.5 w-3.5" />
                        Due Soon
                      </span>
                    )}
                  </div>

                  {/* Assignee */}
                  <div className="flex items-center gap-2 text-xs">
                    {ticket.assignedTo ? (
                      <>
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={ticket.assignedTo.avatar} />
                          <AvatarFallback className="text-[9px]">
                            {ticket.assignedTo.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-muted-foreground hidden md:inline">
                          {ticket.assignedTo.name}
                        </span>
                      </>
                    ) : (
                      <span className="text-xs text-amber-500 font-semibold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        Unassigned
                      </span>
                    )}
                  </div>

                  {/* Badges */}
                  <div className="flex items-center gap-2">
                    <Badge variant={ticket.status}>{ticket.status.replace('_', ' ')}</Badge>
                    <Badge variant={ticket.priority}>{ticket.priority}</Badge>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <p className="text-sm font-semibold text-foreground">No tickets found</p>
              <p className="text-xs text-muted-foreground mt-1">
                Try adjusting your search query or filters.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
