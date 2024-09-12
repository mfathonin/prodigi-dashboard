"use server";

import { createClient } from "@/lib/supaclient/server";
import { AttributesRepository } from "@/repositories/attributes";
import { revalidatePath } from "next/cache";

const attributesRepo = new AttributesRepository(createClient());

export async function addAttribute(formData: FormData) {
  const key = formData.get("key") as string;
  const value = formData.get("value") as string;

  if (!key || !value) {
    throw new Error("Key and value are required");
  }

  try {
    await attributesRepo.addAttribute(key, value);
    revalidatePath("/book-attributes");
  } catch (error) {
    console.error("Error adding attribute:", error);
    throw new Error(
      (error as Error)?.message ?? "Terjadi kesalahan dalam menambahkan atribut"
    );
  }
}

export async function deleteAttribute(uuid: string) {
  await attributesRepo.deleteAttribute(uuid);
  revalidatePath("/book-attributes");
}
