"use client";

import React, { createContext, useContext, useState } from "react";

interface BannerDialogContextType {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

const BannerDialogContext = createContext<BannerDialogContextType | undefined>(
  undefined
);

export const BannerDialogProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isOpen, setOpen] = useState(false);

  return (
    <BannerDialogContext.Provider value={{ isOpen, setOpen }}>
      {children}
    </BannerDialogContext.Provider>
  );
};

export const useBannerDialog = () => {
  const context = useContext(BannerDialogContext);
  if (context === undefined) {
    throw new Error(
      "useBannerDialog must be used within a BannerDialogProvider"
    );
  }
  return context;
};
