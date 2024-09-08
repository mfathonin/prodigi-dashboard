import { User } from "@supabase/supabase-js";
import { formatDistanceToNow } from "date-fns";

type UserItemProps = {
  user: User;
};

export const UserItem = ({ user }: UserItemProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">{user.email}</h2>
          <p className="text-sm text-gray-500">ID: {user.id}</p>
        </div>
        <div className="text-right">
          <p className="text-sm">
            Created:{" "}
            {formatDistanceToNow(new Date(user.created_at), {
              addSuffix: true,
            })}
          </p>
          <p className="text-sm">
            Last Sign In:{" "}
            {user.last_sign_in_at
              ? formatDistanceToNow(new Date(user.last_sign_in_at), {
                  addSuffix: true,
                })
              : "Never"}
          </p>
        </div>
      </div>
    </div>
  );
};
