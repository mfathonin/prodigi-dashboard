import UpdatePasswordForm from "./form";

export default async function UpdatePasswordPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const token = searchParams["token"];
  const code = searchParams["code"];
  const tokenHash = searchParams["token_hash"];
  const error = searchParams["error"];
  const error_description = searchParams["error_description"];

  if (error) {
    return <div>{error_description}</div>;
  }

  const resolvedToken =
    (typeof token === "string" && token) ||
    (typeof code === "string" && code) ||
    (typeof tokenHash === "string" && tokenHash) ||
    null;

  return <UpdatePasswordForm initialToken={resolvedToken} />;
}
