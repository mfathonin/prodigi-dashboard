import { MouseEvent } from "react";
import { DropdownMenuItem } from "./dropdown-menu";

export const MenuItems = ({
  onClick,
  label,
  icon,
  disabled,
}: {
  onClick?: (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => void;
  label: string;
  icon: string;
  disabled?: boolean;
}) => {
  return (
    <DropdownMenuItem
      disabled={disabled}
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
