import { BookRepository } from "@/repositories/books";
import { z } from "zod";
import { Tables } from "./supaservice.types";

export const bookSchema = z.object({
  title: z.string().min(1, "Judul tidak boleh kosong"),
  id: z.number().optional(),
  uuid: z.string().optional(),
  attributes: z
    .array(
      z.string().uuid("Lengkapi pilihan atributnya atau hapus atribut ini")
    )
    .optional(),
  deleted_attributes: z.array(z.string()).optional(),
});

export type BookUpdateForm = z.infer<typeof bookSchema>;

export type Books = Tables<"books">;
export type BooksContentsCount = Awaited<
  ReturnType<BookRepository["getBooks"]>
>[0];

export type QueryOptions = {
  search: string | undefined;
  filter: string[] | ["none"] | undefined;
  sortBy: string;
  orderBy: string;
};
