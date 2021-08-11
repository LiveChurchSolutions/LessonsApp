module.exports = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_ACCESS_API: process.env.NEXT_PUBLIC_ACCESS_API,
    NEXT_PUBLIC_LESSONS_API: process.env.NEXT_PUBLIC_LESSONS_API,
    NEXT_PUBLIC_CONTENT_ROOT: process.env.NEXT_PUBLIC_CONTENT_ROOT,
    NEXT_PUBLIC_ACCOUNTS_APP_URL: process.env.NEXT_PUBLIC_ACCOUNTS_APP_URL,
    NEXT_PUBLIC_CHURCH_APPS_URL: process.env.NEXT_PUBLIC_CHURCH_APPS_URL,
    NEXT_PUBLIC_GOOGLE_ANALYTICS: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS,
  },
  images: {
    domains: [process.env.NEXT_PUBLIC_CONTENT_ROOT.replace("https://", "")],
  },
};