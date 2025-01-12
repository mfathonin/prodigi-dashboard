import { z } from "zod";

export const filterSortSchema = z.object({
  filter: z
    .array(z.string().min(4, "Pilih salah satu atau hapus atribut"))
    .optional(),
  sort: z
    .object({
      field: z.string(),
      order: z.enum(["asc", "desc"]),
    })
    .optional(),
});

export type FilterSort = z.infer<typeof filterSortSchema>;
