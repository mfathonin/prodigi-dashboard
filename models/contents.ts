import { ContentsRepository } from "@/repositories/contents";
import { z } from "zod";

export const contentSchema = z.object({
  bookId: z.string().min(1, "Buku belum dipilih").uuid("Kode buku tidak valid"),
  title: z.string().min(1, "Judul konten tidak boleh kosong"),
  targetUrl: z
    .string()
    .url("URL tidak valid")
    .regex(
      /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})(\/\S*)?$/i,
      "URL tidak valid"
    ),
  path: z.string().min(1, "Link konten tidak boleh kosong"),
  uuid: z.string().optional(),
  linkId: z.number().optional(),
  id: z.number().optional(),
});

export type ContentUpdateForm = z.infer<typeof contentSchema>;

export type BookContentsLink = Awaited<
  ReturnType<ContentsRepository["getBookContents"]>
>[0];

export type ContentsLink = BookContentsLink["link"];
