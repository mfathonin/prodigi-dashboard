"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { InviteUserModal } from "./invite-user-modal";

export function InviteUserButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button className="rounded-full" onClick={() => setIsModalOpen(true)}>
        <i className="bx bx-plus mr-2" />
        Tambah
      </Button>
      <InviteUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          window.location.reload();
          setIsModalOpen(false);
        }}
      />
    </>
  );
}
