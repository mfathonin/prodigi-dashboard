import { z } from "zod";
import { Tables } from "./supaservice.types";
import { BookRepository } from "@/repositories/books";

export const bookSchema = z.object({
  title: z.string().min(1),
  id: z.number().optional(),
  uuid: z.string().optional(),
  attributes: z.array(z.string()).optional(),
  deleted_attributes: z.array(z.string()).optional(),
});

export type BookUpdateForm = z.infer<typeof bookSchema>;

export type Books = Tables<"books">;
export type BooksContentsCount = Awaited<
  ReturnType<BookRepository["getBooks"]>
>[0];
