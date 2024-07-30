import { Database } from "@/models";
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
  );
}
