"use client";

import { handleSingOut } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";

export const LogoutButton = () => {
  return (
    <Button
      onClick={() => {
        handleSingOut();
      }}
      className="flex gap-2 items-center"
    >
      <i className="bx bx-log-out-circle bx-sm" />
      <span>Logout</span>
    </Button>
  );
};
