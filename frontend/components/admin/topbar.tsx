'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { AdminSidebar } from '@/components/admin/sidebar';
import { useAuth } from '@/hooks/use-auth';

export function AdminTopbar() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b border-border px-4 md:px-8">
      <div className="flex items-center gap-2 md:hidden">
        <Button variant="ghost" size="icon" onClick={() => setOpen(true)} aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </Button>
        <span className="font-mono text-sm">admin</span>
      </div>

      <div className="hidden md:block">
        <p className="text-sm text-muted-foreground">Signed in as {user?.email}</p>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="left-0 top-0 h-full max-w-xs translate-x-0 translate-y-0 rounded-none border-r p-0 sm:rounded-none">
          <DialogTitle className="sr-only">Admin navigation</DialogTitle>
          <AdminSidebar />
        </DialogContent>
      </Dialog>
    </header>
  );
}
