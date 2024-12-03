import { createClient } from "@/lib/supaclient/server";

export const getAnswerSheet = async (id: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("answer_sheets")
    .select("*")
    .eq("uuid", id)
    .single();

  return data;
};
