import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { mockTickets, mockUsers } from '@/data/mockData'
import { Ticket, Comment } from '@/types'
import {
  ArrowLeft,
  Calendar,
  MessageSquare,
  Paperclip,
  Shield,
  UserPlus,
  Tag as TagIcon,
  CheckCircle,
  Clock,
  Send,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { formatDistanceToNow } from 'date-fns'

export function TicketDetail() {
  const { id } = useParams<{ id: string }>()
  const [ticket, setTicket] = useState<Ticket | undefined>(
    mockTickets.find((t) => t.id === id)
  )
  const [commentText, setCommentText] = useState('')
  const [isInternal, setIsInternal] = useState(false)

  if (!ticket) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <h3 className="text-lg font-bold text-foreground">Ticket Not Found</h3>
        <p className="text-xs text-muted-foreground mt-1 mb-4">
          The ticket you are looking for does not exist or has been deleted.
        </p>
        <Link to="/tickets">
          <Button size="sm">Back to Tickets</Button>
        </Link>
      </div>
    )
  }

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim()) return

    const newComment: Comment = {
      id: `c-${Date.now()}`,
      ticketId: ticket.id,
      author: mockUsers.admin, // assuming current user is Sarah Connor (admin)
      content: commentText,
      isInternal: isInternal,
      createdAt: new Date().toISOString(),
    }

    setTicket({
      ...ticket,
      comments: [...ticket.comments, newComment],
      updatedAt: new Date().toISOString(),
    })

    setCommentText('')
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back Button & Ticket Title Header */}
      <div className="flex flex-col gap-3">
        <Link
          to="/tickets"
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Tickets
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono font-bold text-primary">
                {ticket.ticketNumber}
              </span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs font-semibold text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded">
                {ticket.category}
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">{ticket.title}</h2>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={ticket.status}>{ticket.status.replace('_', ' ')}</Badge>
            <Badge variant={ticket.priority}>{ticket.priority}</Badge>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Ticket Description and Discussion Thread */}
        <div className="md:col-span-2 space-y-6">
          {/* Main Description */}
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarFallback>
                  {ticket.createdBy.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xs font-semibold text-foreground">{ticket.createdBy.name}</p>
                <p className="text-[10px] text-muted-foreground">
                  Submitted {formatDistanceToNow(new Date(ticket.createdAt))} ago
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                {ticket.description}
              </p>

              {/* Attachments Section */}
              {ticket.attachments.length > 0 && (
                <div className="pt-4 border-t border-border/20">
                  <h4 className="text-xs font-semibold text-muted-foreground mb-2">
                    Attachments ({ticket.attachments.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {ticket.attachments.map((file) => (
                      <a
                        key={file.id}
                        href={file.url}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border/30 bg-secondary/20 hover:bg-secondary/40 transition-colors text-xs"
                      >
                        <Paperclip className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{file.fileName}</span>
                        <span className="text-[10px] text-muted-foreground">
                          ({(file.fileSize / 1024).toFixed(1)} KB)
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Conversation History */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Activity & Discussion ({ticket.comments.length})
            </h3>

            {ticket.comments.map((comment) => (
              <Card
                key={comment.id}
                className={`glass-card ${
                  comment.isInternal
                    ? 'border-yellow-500/20 bg-yellow-500/[0.02]'
                    : 'border-border/30'
                }`}
              >
                <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
                  <div className="flex items-center gap-2.5">
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={comment.author.avatar} />
                      <AvatarFallback className="text-[10px]">
                        {comment.author.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="text-xs font-semibold text-foreground">
                        {comment.author.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground ml-2">
                        {formatDistanceToNow(new Date(comment.createdAt))} ago
                      </span>
                    </div>
                  </div>
                  {comment.isInternal && (
                    <Badge variant="outline" className="text-[9px] border-yellow-500/40 text-yellow-400 gap-1 bg-yellow-500/10">
                      <Shield className="h-2.5 w-2.5" />
                      Internal Note
                    </Badge>
                  )}
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-xs text-foreground/95 leading-relaxed">
                    {comment.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Send Comment Input */}
          <form onSubmit={handleAddComment} className="glass-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground">Add Response</span>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant={isInternal ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setIsInternal(!isInternal)}
                  className={`h-7 px-2.5 text-[10px] gap-1 ${
                    isInternal ? 'bg-yellow-600 hover:bg-yellow-700 text-white' : ''
                  }`}
                >
                  <Shield className="h-3 w-3" />
                  Internal Note
                </Button>
              </div>
            </div>
            <Textarea
              placeholder={
                isInternal
                  ? 'Write a private internal note for agents...'
                  : 'Write a public response to send to customer...'
              }
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className={`text-xs min-h-[90px] focus-visible:ring-1 ${
                isInternal ? 'border-yellow-500/30 focus-visible:ring-yellow-500' : ''
              }`}
            />
            <div className="flex justify-end">
              <Button type="submit" size="sm" className="h-8 gap-1.5 text-xs">
                <Send className="h-3 w-3" />
                Submit
              </Button>
            </div>
          </form>
        </div>

        {/* Ticket Metadata / Action Sidebar */}
        <div className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Ticket Details</CardTitle>
              <CardDescription>System properties and metadata.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Assignee */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Assignee
                </label>
                <div className="flex items-center gap-2.5 rounded-lg border border-border/30 p-2 bg-secondary/10">
                  {ticket.assignedTo ? (
                    <>
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={ticket.assignedTo.avatar} />
                        <AvatarFallback className="text-[10px]">
                          {ticket.assignedTo.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-foreground">
                          {ticket.assignedTo.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {ticket.assignedTo.department}
                        </p>
                      </div>
                    </>
                  ) : (
                    <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <UserPlus className="h-4 w-4 text-amber-500" />
                      Unassigned
                    </span>
                  )}
                </div>
              </div>

              {/* Due Date */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Due Date
                </label>
                <div className="flex items-center gap-2 text-xs text-foreground font-semibold">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {ticket.dueDate
                    ? new Date(ticket.dueDate).toLocaleString()
                    : 'No due date set'}
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Tags
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {ticket.tags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant="outline"
                      className="text-[10px] font-semibold border-transparent"
                      style={{
                        backgroundColor: `${tag.color}15`,
                        color: tag.color,
                      }}
                    >
                      <TagIcon className="h-2.5 w-2.5 mr-1" />
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Service Level Agreement */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  SLA Timeline
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle className="h-4 w-4" />
                    <span>Response SLA Met</span>
                  </div>
                  <div className="flex items-center gap-2 text-amber-400">
                    <Clock className="h-4 w-4" />
                    <span>Resolution Due in 4 hrs</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
