import { redirect } from "next/navigation";
export default function LoadingRedirectHomePage() {
  redirect("/books");
}
