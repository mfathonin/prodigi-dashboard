import { BookUpdateForm, ContentUpdateForm } from "@/models";

export const constants = {
  CANVAS_QR_PREFIX_ID: "canvas-qr-",
  errors: {
    auth: {
      INVALID_CREDENTIALS: "Email atau password salah",
      USER_NOT_FOUND: "User tidak ditemukan",
      USER_EXISTS: "User sudah terdaftar",
      UNKNOWN: "Terjadi kesalahan dari server",
    },
  },
  searchParams: {
    BOOK_QUERY: "book",
    CONTENT_QUERY: "content",
    FILTER: "filter",
    SORT_BY: "sortBy",
    ORDER_BY: "orderBy",
  } as const,
  EMPTY_BOOK_TEMPLATE: {
    title: "",
    uuid: "",
    id: -1,
  } satisfies BookUpdateForm,
  EMPTY_CONTENT_TEMPLATE: {
    bookId: "",
    title: "",
    targetUrl: "",
    path: "",
    linkId: -1,
    id: -1,
    uuid: "",
  } satisfies ContentUpdateForm,
};
