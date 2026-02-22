import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // @react-pdf/renderer는 Node.js 전용 패키지로 webpack 번들링에서 제외합니다.
  // API Route에 `export const runtime = 'nodejs'`가 선언되어 있어도,
  // App Router 빌드 과정에서 패키지를 번들링하려 할 수 있으므로 명시적으로 제외합니다.
  serverExternalPackages: ['@react-pdf/renderer'],
  experimental: {
    // 시스템 TLS 인증서 사용 (Google Fonts 등 외부 리소스 연결 문제 해결)
    turbopackUseSystemTlsCerts: true,
  },
}

export default nextConfig
