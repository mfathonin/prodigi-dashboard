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
    SORT_BY: "sortBy",
    ORDER_BY: "orderBy",
  } as const,
  // Dummy data
  books: [
    {
      id: "1",
      title: "Buku A",
    },
    {
      id: "2",
      title: "Buku B",
    },
    {
      id: "3",
      title: "Buku C",
    },
    {
      id: "4",
      title: "Buku D",
    },
    {
      id: "5",
      title: "Buku E",
    },
    {
      id: "6",
      title: "Buku F",
    },
    {
      id: "7",
      title: "Buku G",
    },
    {
      id: "8",
      title: "Buku H",
    },
    {
      id: "9",
      title: "Buku I",
    },
    {
      id: "10",
      title: "Buku J",
    },
    {
      id: "11",
      title: "Buku K",
    },
    {
      id: "12",
      title: "Buku L",
    },
    {
      id: "13",
      title: "Buku M",
    },
    {
      id: "14",
      title: "Buku N",
    },
    {
      id: "15",
      title: "Buku O",
    },
    {
      id: "16",
      title: "Buku P",
    },
    {
      id: "17",
      title: "Buku Q",
    },
    {
      id: "18",
      title: "Buku R",
    },
    {
      id: "19",
      title: "Buku S",
    },
    {
      id: "20",
      title: "Buku T",
    },
    {
      id: "21",
      title: "Buku U",
    },
    {
      id: "22",
      title: "Buku V",
    },
    {
      id: "23",
      title: "Buku W",
    },
    {
      id: "24",
      title: "Buku X",
    },
    {
      id: "25",
      title: "Buku Y",
    },
    {
      id: "26",
      title: "Buku Z",
    },
    {
      id: "27",
      title: "Buku AA",
    },
    {
      id: "28",
      title: "Buku AB",
    },
    {
      id: "29",
      title: "Buku AC",
    },
    {
      id: "30",
      title: "Buku AD",
    },
    {
      id: "31",
      title: "Buku AE",
    },
    {
      id: "32",
      title: "Buku AF",
    },
  ],
  bookAttributes: [
    { key: "Author", value: "John Doe" },
    { key: "Published", value: "2021" },
    { key: "ISBN", value: "1234567890" },
    { key: "Language", value: "English" },
  ],
  contents: [
    {
      id: "1",
      title: "Content A",
      link: {
        url: "generated-url-1",
        targetUrl: "https://youtube.com/watch?v=123456",
      },
    },
    {
      id: "2",
      title: "Content B",
      link: {
        url: "generated-url-2",
        targetUrl: "https://youtube.com/watch?v=123456",
      },
    },
  ],
};
