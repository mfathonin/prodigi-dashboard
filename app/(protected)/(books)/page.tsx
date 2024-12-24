import { redirect } from "next/navigation";

export default function EmptyHomePage() {
  redirect("/books");
}
