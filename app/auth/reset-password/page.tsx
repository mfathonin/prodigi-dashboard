import { redirectIfAuthenticated } from "@/lib/auth-helpers";
import ResetPasswordForm from "./form";

export default async function ResetPasswordPage() {
  await redirectIfAuthenticated();

  return <ResetPasswordForm />;
}
