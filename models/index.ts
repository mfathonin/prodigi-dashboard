import { AttributesRepository } from "@/repositories/attributes";

import { Tables } from "./supaservice.types";

export * from "./books";
export * from "./contents";
export * from "./filter-sort";
export * from "./results";
export * from "./supaservice.types";
export * from "./users";

export type BooksAttributes = Awaited<
  ReturnType<AttributesRepository["getBookAttributes"]>
>[0];
export type AttritbutesList = Awaited<
  ReturnType<AttributesRepository["getAttributes"]>
>;
export type AnswerSheet = Tables<"answer_sheets">;
