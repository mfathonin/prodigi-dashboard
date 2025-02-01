import { z } from "zod";

import { constants } from "@/lib/constants";
import { ContentsRepository } from "@/repositories/contents";

const urlValidation: { pattern: RegExp; message: string } =
  constants.validation.url;

export type ContentType = "quiz" | "content";

export const contentSchema = z
  .object({
    bookId: z
      .string()
      .min(1, "Buku belum dipilih")
      .uuid("Kode buku tidak valid"),
    path: z.string().min(1, "Link konten tidak boleh kosong"),
    uuid: z.string().optional(),
    linkId: z.number().optional(),
    id: z.number().optional(),
    type: z.enum(["quiz", "content"]),
    title: z.string().min(1, "Judul tidak boleh kosong"),

    nQuestion: z.number().min(1, "Jumlah soal tidak boleh kosong").optional(),
    nOptions: z
      .number()
      .min(2, "Jumlah opsi harus lebih dari 1")
      .max(5, "Jumlah opsi tidak boleh lebih dari 5")
      .optional(),

    targetUrl: z.string().optional(),
  })
  .refine((data) => (data.type === "quiz" ? data.nQuestion : true), {
    path: ["nQuestion"],
    message: "Jumlah soal tidak valid",
  })
  .refine((data) => (data.type === "quiz" ? data.nOptions : true), {
    path: ["nOptions"],
    message: "Jumlah opsi tidak valid",
  })
  .refine(
    (data) => {
      if (data.type === "content")
        return data.targetUrl && urlValidation.pattern.test(data.targetUrl);
      return true;
    },
    {
      path: ["targetUrl"],
      message: urlValidation.message,
    }
  );

export type ContentUpdateForm = z.infer<typeof contentSchema>;

// for content we don't need nQuestion and nOptions but need targetUrl not optional
export type ExternalContentUpdateForm = Omit<
  ContentUpdateForm,
  "nQuestion" | "nOptions"
> & {
  targetUrl: string;
};

// for quiz we don't need targetUrl but need nQuestion and nOptions required
export type QuizUpdateForm = Omit<ContentUpdateForm, "targetUrl"> & {
  nQuestion: number;
  nOptions: number;
};

export type BookContentsLink = Awaited<
  ReturnType<ContentsRepository["getBookContents"]>
>[0];

export type ContentsLink = BookContentsLink["link"];

export function isExternalContent(
  content: ContentUpdateForm
): content is ExternalContentUpdateForm {
  return content.type === "content" && !!content.targetUrl;
}

export function validateExternalContent(
  content: ContentUpdateForm
): content is ExternalContentUpdateForm {
  const requiredFields = {
    targetUrl: "Target URL is required",
    title: "Title is required",
    bookId: "Book ID is required",
  };

  const missingFields = Object.entries(requiredFields)
    .filter(([field]) => !content[field as keyof ContentUpdateForm])
    .map(([, message]) => message);

  if (missingFields.length > 0) {
    throw new Error(`Validation failed: ${missingFields.join(", ")}`);
  }

  return true;
}

export function isQuizContent(
  content: ContentUpdateForm
): content is QuizUpdateForm {
  return (
    content.type === "quiz" &&
    typeof content.nQuestion === "number" &&
    typeof content.nOptions === "number"
  );
}

export function validateQuizContent(
  content: ContentUpdateForm
): content is QuizUpdateForm {
  return (
    isQuizContent(content) && content.nQuestion > 0 && content.nOptions > 0
  );
}

export type CollectionLinkResponse = {
  id: number | string;
  title: string;
  type: string;
  collectionId: string;
  link: {
    targetUrl: string;
    url: string;
  };
  collection: {
    id: number | string;
    createdAt: string;
    name: string;
    updatedAt: string;
  };
  createdAt: string;
  updatedAt: string;
};
