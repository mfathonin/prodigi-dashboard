"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { inviteUser } from "@/lib/auth-helpers";
import { useState } from "react";
import { toast } from "sonner";

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function InviteUserModal({
  isOpen,
  onClose,
  onSuccess,
}: InviteUserModalProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await inviteUser(email);
      toast.success("Undangan terkirim", {
        description: `Undangan telah dikirim ke ${email}`,
      });
      onClose();
      onSuccess();
    } catch (error) {
      toast.error("Gagal mengirim undangan", {
        description:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan yang tidak diketahui",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Undang Pengguna Baru</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleInvite} className="flex flex-col gap-y-6">
          <div className="flex flex-col gap-y-3 mt-6">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan email pengguna"
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Mengirim..." : "Kirim"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
