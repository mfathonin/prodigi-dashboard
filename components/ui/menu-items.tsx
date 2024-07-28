import { MouseEvent } from "react";
import { DropdownMenuItem } from "./dropdown-menu";

export const MenuItems = ({
  onClick,
  label,
  icon,
}: {
  onClick?: (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => void;
  label: string;
  icon: string;
}) => {
  return (
    <DropdownMenuItem
      onClick={(e) => {
        e.stopPropagation();
        onClick && onClick(e);
      }}
    >
      <i
        className={`${icon} text-lg text-slate-900 dark:text-slate-100 mr-2`}
      />
      <span className="text-sm">{label}</span>
    </DropdownMenuItem>
  );
};
