import { AppUser } from "@/lib/auth/types";
import { UserItem } from "./user-item";

type UserListProps = {
  users: AppUser[];
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
