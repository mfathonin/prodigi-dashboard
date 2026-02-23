export function getServerAppBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_LINKS_APP ??
    (process.env.NEXT_PUBLIC_VERCEL_URL
      ? `http://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : "http://localhost:3013")
  );
}
