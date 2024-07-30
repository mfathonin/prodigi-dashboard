import { Tables } from "./supaservice.types";

export * from "./results";
export * from "./supaservice.types";
export * from "./users";

export type Books = Tables<"books">;
export type BooksContentsCount = Tables<"books_contents_view">;
export type BooksAttritbutes = Tables<"attributes">;
export type BooksAttritbutesMap = Tables<"books_attributes_view">;
export type BookContents = Tables<"contents">;
export type BookContentsLink = Tables<"contents_link">;
export type ContentsLink = {
  id: string;
  path: string;
  targetUrl: string;
};
