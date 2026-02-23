import dotenvExpand from "dotenv-expand";

/** @type {{ [key: string]: string; NODE_ENV: "development" | "production" | "test"; }} */
// @ts-ignore
const processEnv = process.env;

dotenvExpand.expand({ parsed: { ...processEnv } });

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3013",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "3013",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
