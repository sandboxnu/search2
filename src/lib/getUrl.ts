export function getBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://" + process.env.NEXT_PUBLIC_VERCEL_URL
  );
}
