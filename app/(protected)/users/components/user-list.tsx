import { User } from "@supabase/supabase-js";
import { UserItem } from "./user-item";

type UserListProps = {
  users: User[];
};

export const UserList = ({ users }: UserListProps) => {
  return (
    <div className="space-y-4">
      {users.map((user) => (
        <UserItem key={user.id} user={user} />
      ))}
    </div>
  );
};
