import { ContentsRepository } from "@/repositories/contents";
import { z } from "zod";

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
      const urlPattern =
        /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
      if (data.type === "content")
        return data.targetUrl && urlPattern.test(data.targetUrl);
      return true;
    },
    {
      path: ["targetUrl"],
      message: "URL tidak valid",
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
