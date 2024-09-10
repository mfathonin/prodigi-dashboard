import { InviteUserButton } from "./components/invite-user-button";

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl md:text-2xl lg:text-3xl">Kelola User</h1>
          <p className="text-sm text-gray-500">
            Kelola user Prodigi dan akses mereka ke aplikasi.
          </p>
        </div>
        <InviteUserButton />
      </div>
      {children}
    </div>
  );
}
