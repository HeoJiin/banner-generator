---
name: 배포 서비스 매핑 (Vercel 이전 완료)
description: 배너 생성기 호스팅 정보 — Railway → Vercel 이전 완료, 관리자 API는 미복구
type: reference
---

## 현재 배포 상태 (2026-05-18 기준)

### 배너 생성기 (프론트엔드)
- **호스팅**: Vercel Hobby (무료)
- **URL**: https://banner-generator-omega.vercel.app
- **Vercel 프로젝트**: hushs-projects-2296d80a/banner-generator
- **GitHub**: HeoJiin/banner-generator (Public 전환 완료)
- **배포 방식**: `vercel --yes --scope hushs-projects-2296d80a`

### 관리자 API (banner-admin-api)
- **상태**: ❌ 미배포 — Railway 만료로 서비스 중단
- **이전 데이터**: Railway에 Volume 없이 SQLite 사용 → 데이터 유실
- **로컬 코드**: /Users/hush.52/workspaces/kakaostyle/banner-admin-api
- **TODO**: Render(무료) + Turso(무료 SQLite 호스팅)로 재배포 필요

## 이전 Railway 정보 (만료됨)
- 프로젝트: `miraculous-empathy` (트라이얼 만료)
- 배너 생성기: miraculous-empathy-production.up.railway.app
- 관리자 API: banner-admin-api (서비스 오프라인)
