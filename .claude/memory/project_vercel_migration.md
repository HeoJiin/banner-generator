---
name: Vercel 이전 및 관리자 API 미복구
description: Railway 만료 → Vercel 이전 완료, 관리자 API(인사이트 로깅)는 아직 미복구 상태
type: project
---

Railway 트라이얼 만료로 배너 생성기 + 관리자 API 모두 서비스 중단됨.

**완료:**
- 배너 생성기 프론트엔드 → Vercel Hobby(무료)로 이전 완료
- GitHub 레포 Public 전환 완료

**미완료:**
- 관리자 API(banner-admin-api) 재배포 필요 — 인사이트 로깅 안 됨
- Railway SQLite 데이터는 Volume 미설정으로 유실 확정

**Why:** 사용자가 배너 생성기를 성과물로 쓰고 있어서 서비스 중단이 즉시 문제됨
**How to apply:** 다음 세션에서 관리자 API 재배포(Render + Turso) 우선 진행
