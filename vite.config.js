import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const GITHUB_PAGES_REPO = "luma-flow-landing";
const isGitHubPagesBuild = process.env.DEPLOY_TARGET === "github-pages";

// https://vite.dev/config/
export default defineConfig({
  base: isGitHubPagesBuild ? `/${GITHUB_PAGES_REPO}/` : "/",
  plugins: [react()],
})
