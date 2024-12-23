import { createClient } from "@/lib/supaclient/server";

export const getAnswerSheet = async (id: string) => {
  if (!id) throw new Error("Answer sheet ID is required");

  const supabase = createClient();
  const { data, error } = await supabase
    .from("answer_sheets")
    .select("*")
    .eq("uuid", id)
    .single();

  if (error) throw error;

  return data;
};
