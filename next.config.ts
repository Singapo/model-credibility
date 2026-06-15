import type { NextConfig } from "next";
import { execSync } from "child_process";

function getGitCommitHash() {
  try {
    return execSync("git rev-parse --short HEAD").toString().trim();
  } catch {
    return process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || "dev";
  }
}

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_GIT_COMMIT_HASH: getGitCommitHash(),
  },
};

export default nextConfig;
