'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { deleteJournal } from '@/app/(admin)/journal/actions';

export function JournalDeleteButton({ id, title }: { id: string; title: string }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function onConfirm() {
    startTransition(async () => {
      try {
        await deleteJournal(id);
        toast.success('삭제됨');
        setOpen(false);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        toast.error('삭제 실패: ' + msg);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
        <Trash2 className="h-4 w-4" />
        <span className="sr-only">삭제</span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>저널 글 삭제</DialogTitle>
          <DialogDescription>
            <span className="font-medium text-foreground">{title}</span> 글을 삭제할까요?
            되돌릴 수 없습니다.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={pending}>
            취소
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={pending}>
            {pending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            삭제
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
