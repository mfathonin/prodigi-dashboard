import { BookUpdateForm, ContentUpdateForm } from "@/models";
export type ErrorCodes = {
  message: string;
  code: string;
  status: number;
};

export const constants = {
  CONTENT: {
    LABEL: {
      content: "URL",
      exercise: "Kuis",
      answer_sheet: "Lembar jawab",
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
    content: {
      CONTENT_NOT_FOUND: {
        message: "Content tidak ditemukan",
        code: "CONTENT_NOT_FOUND",
        status: 404,
      },
    } as Record<string, ErrorCodes>,
    link: {
      LINK_NOT_FOUND: {
        message: "Link tidak ditemukan",
        code: "LINK_NOT_FOUND",
        status: 404,
      },
      LINK_MISSING_SIGNATURE: {
        message: "App signature is required",
        code: "LINK_MISSING_SIGNATURE",
        status: 400,
      },
      LINK_PATH_REQUIRED: {
        message: "Link path is required",
        code: "LINK_PATH_REQUIRED",
        status: 400,
      },
    } as Record<string, ErrorCodes>,
    quiz: {
      QUIZ_MISSING_FIELDS: {
        message: "Missing required fields",
        code: "QUIZ_MISSING_FIELDS",
        status: 400,
      },
      QUIZ_ANSWERS_NOT_ARRAY: {
        message: "Answers must be an array of numbers",
        code: "QUIZ_ANSWERS_NOT_ARRAY",
        status: 400,
      },
      QUIZ_NOT_FOUND: {
        message: "Answer sheet not found",
        code: "QUIZ_NOT_FOUND",
        status: 404,
      },
      QUIZ_ANSWERS_LENGTH: {
        message: "Number of submitted answers must match the quiz length",
        code: "QUIZ_ANSWERS_LENGTH",
        status: 400,
      },
    } as Record<string, ErrorCodes>,
    general: {
      INVALID_JSON: {
        message: "Invalid Data format",
        code: "INVALID_JSON",
        status: 400,
      },
      INVALID_UUID: {
        message: "Invalid ID format",
        code: "INVALID_UUID",
        status: 400,
      },
      UNKNOWN: {
        message: "Terjadi kesalahan dari server",
        code: "UNKNOWN",
        status: 500,
      },
    } as Record<string, ErrorCodes>,
  },
  quizConfig: {
    MIN_OPTIONS: 2,
    MAX_OPTIONS: 5,
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
      pattern:
        /^(https?:\/\/)?([\w.-]+(?:\.[\w.-]+)+)(\/[\w\-._~:\/#\[\]@!$&'()*+,;=]*)?(\?([\w\-._~:%\/?#\[\]@!$&'()*+,;=]*))?$/,
      message: "URL tidak valid",
    },
  },
};
