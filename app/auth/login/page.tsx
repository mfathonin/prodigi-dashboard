import { redirectIfAuthenticated } from "@/lib/auth-helpers";
import LoginForm from "./form";

export default async function LoginPage() {
  await redirectIfAuthenticated();

  return <LoginForm />;
}
