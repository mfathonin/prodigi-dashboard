import dotenvExpand from "dotenv-expand";

/** @type {{ [key: string]: string; NODE_ENV: "development" | "production" | "test"; }} */
// @ts-ignore
const processEnv = process.env;

dotenvExpand.expand({ parsed: { ...processEnv } });

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;
