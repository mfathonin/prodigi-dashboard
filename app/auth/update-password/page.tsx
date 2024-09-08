import { redirectIfUnauthenticated } from "@/lib/auth-helpers";
import UpdatePasswordForm from "./form";

export default async function UpdatePasswordPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // server component
  // check url params for code or the code is expired
  const code = searchParams["code"];
  const token_hash = searchParams["token_hash"];
  const error = searchParams["error"];
  const error_description = searchParams["error_description"];

  if (error) {
    return <div>{error_description}</div>;
  }

  return <UpdatePasswordForm />;
}
