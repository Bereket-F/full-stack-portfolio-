'use client';

import { useEffect, useState } from 'react';
import { Archive, ArchiveRestore, Mail, MailOpen, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { adminApi } from '@/lib/admin-api';
import type { Message } from '@/lib/types';
import { formatDate } from '@/lib/utils';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState<Message | null>(null);
  const [deleting, setDeleting] = useState<Message | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await adminApi.messages.list();
    setMessages(res.data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openMessage = async (message: Message) => {
    setViewing(message);
    if (!message.read) {
      await adminApi.messages.markRead(message.id, true);
      load();
    }
  };

  const toggleArchive = async (message: Message) => {
    await adminApi.messages.archive(message.id, !message.archived);
    toast.success(message.archived ? 'Message unarchived' : 'Message archived');
    load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Messages</h1>
        <p className="text-sm text-muted-foreground">Submissions from your contact form.</p>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead />
                <TableHead>From</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Received</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.map((message) => (
                <TableRow
                  key={message.id}
                  className={message.read ? undefined : 'bg-primary/[0.03] font-medium'}
                >
                  <TableCell>
                    {message.read ? (
                      <MailOpen className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Mail className="h-4 w-4 text-primary" />
                    )}
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => openMessage(message)}
                      className="text-left hover:underline"
                    >
                      <p>{message.name}</p>
                      <p className="text-xs text-muted-foreground">{message.email}</p>
                    </button>
                  </TableCell>
                  <TableCell>
                    <button onClick={() => openMessage(message)} className="hover:underline">
                      {message.subject}
                    </button>
                    {message.archived && (
                      <Badge variant="secondary" className="ml-2">
                        Archived
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{formatDate(message.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => toggleArchive(message)}>
                      {message.archived ? (
                        <ArchiveRestore className="h-4 w-4" />
                      ) : (
                        <Archive className="h-4 w-4" />
                      )}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleting(message)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {messages.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No messages yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={!!viewing} onOpenChange={(open) => !open && setViewing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{viewing?.subject}</DialogTitle>
            <DialogDescription>
              {viewing?.name} · {viewing?.email} · {viewing && formatDate(viewing.createdAt)}
            </DialogDescription>
          </DialogHeader>
          <p className="whitespace-pre-wrap text-sm text-foreground">{viewing?.message}</p>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Delete message"
        description="Are you sure you want to permanently delete this message?"
        onConfirm={async () => {
          if (!deleting) return;
          await adminApi.messages.remove(deleting.id);
          toast.success('Message deleted');
          load();
        }}
      />
    </div>
  );
}
