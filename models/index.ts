import { AttributesRepository } from "@/repositories/attributes";
import { ContentsRepository } from "@/repositories/contents";

export * from "./books";
export * from "./results";
export * from "./supaservice.types";
export * from "./users";

export type BooksAttributes = Awaited<
  ReturnType<AttributesRepository["getBookAttributes"]>
>[0];
export type AttritbutesList = Awaited<
  ReturnType<AttributesRepository["getAttributes"]>
>;

export type BookContentsLink = Awaited<
  ReturnType<ContentsRepository["getBookContents"]>
>[0];
export type ContentsLink = BookContentsLink["link"];
