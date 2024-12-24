import { BookUpdateForm, ContentUpdateForm } from "@/models";

export const constants = {
  CONTENT: {
    LABEL: {
      content: "URL",
      quiz: "Kuis",
    },
    OPTIONS_LABEL: ["A", "B", "C", "D", "E"],
  },
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
    type: "content",
  } satisfies ContentUpdateForm,
  validation: {
    uuid: {
      pattern:
        /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
      message: "UUID tidak valid",
    },
    url: {
      pattern: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
      message: "URL tidak valid",
    },
  },
};
