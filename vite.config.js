import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import process from 'node:process'

const GITHUB_PAGES_REPO = process.env.GITHUB_PAGES_REPO || "luma-flow-landing";
const isGitHubPagesBuild = process.env.DEPLOY_TARGET === "github-pages";

// https://vite.dev/config/
export default defineConfig({
  base: isGitHubPagesBuild ? `/${GITHUB_PAGES_REPO}/` : "/",
  plugins: [react()],
  server: {
    // 원본 이미지·작업 폴더는 개발 서버가 감시하지 않게 합니다.
    // (큰 파일을 복사하는 순간 "EBUSY" 오류로 서버가 꺼지는 문제 방지)
    watch: { ignored: ['**/assets-src/**', '**/_workspace/**', '**/_archive/**', '**/apps/**', '**/.claude/**', '**/dist/**'] },
  },
})
