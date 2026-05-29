# 작업 재개 메모 (RESUME)

> 이 파일은 작업 이어가기용 메모입니다. (feature 브랜치에만 둠 — main/운영엔 안 올라감)

## 지금 상태

- **작업 브랜치**: `claude/start-funnel` (전부 커밋·푸시됨)
- **프리뷰 URL**: https://fatept-git-claude-start-funnel-gina-s-projects4.vercel.app
- **운영(main, fatept.vercel.app)**: 세계관 개편 + 7개 프로그램 + 무료키트 + 무통장입금까지 **이미 배포됨**.
  단, `/start` 퍼널·PAS 업셀·헤더 정리는 **아직 운영 미반영**(이 브랜치에만 있음).

## 운영에 이미 반영된 것 (main)

- 운명PT "인생 트레이닝" 세계관 (랜딩/카피/결과지 톤)
- 프로그램 7종: free-taste(무료) / inbody(4,900) / crush-kit(14,900) / love-session(19,900) / reunion-check(39,000) / reunion-program(99,000 BEST) / life-master(149,000)
- 결제: 토스 + 무통장입금(신한 110-387-832895 장진아) + 무료(하루1회)
- DB 마이그레이션 0004(payment_method), 0005(free) 적용 완료 + 상품 seed SQL 실행 완료

## 이 브랜치(claude/start-funnel)에서 한 것 — 운영 배포 대기 중

1. `/start` 가이드 퍼널: 후크(1분 무료 운명 인바디) → 고민 선택 → 생년월일 입력 → 무료 결과. 가격/그리드 비노출
2. 결과지 PAS 업셀: 무료 결과 → "OO 신호 보임 → 이대로 두면 ~ → [맞춤 프로그램]로 바로잡기 → 네, 해볼게요" (고민별 매핑: `RECO_BY_CONCERN`, `PAS_BY_CONCERN` in `src/app/results/[resultId]/page.tsx`)
3. 헤더: "무료 진단"(/start) 강조 + "리포트→프로그램"
4. 랜딩 Hero/CTA 메인 버튼 → /start

배포하려면: `git checkout main && git merge claude/start-funnel && git push origin main` (추가 마이그레이션 없음). 단, 퍼널 실작동(로그인+무료생성)은 운영에서 직접 확인 필요.

## 다음 할 일 (미결정/진행 예정)

- [x] **시네마틱 세로(3:4) 카드** 완성 — `src/components/products/CinematicCard.tsx`.
      /products·랜딩 ProductLineup 에 적용. 지금은 슬러그별 테마 그라데이션 placeholder.
      → 남은 것: AI 웹툰 이미지 받아서 `PRODUCT_COPY[slug].image` 에 경로 넣기(`--ar 3:4` 세로).
- [ ] 상품 **상세페이지(/products/[slug])** 도 시네마틱 헤더로 (아직 Ollama 미니멀) — 다음 차례
- [ ] 퍼널 `/start` 후크 화면도 시네마틱 다크로
- [ ] 디자인 토큰 정리(색/타이포/간격 중앙화) — 이후 일관 수정 쉽게
- [ ] (보류) 넛지: 첫구매 쿠폰(할인 시스템 필요) / 후기 시 추가질문(추가질문 기능 필요)
- [ ] (보류) 결과 미리보기 페이월
- [ ] CLAUDE.md는 별도 브랜치 `claude/claude-md-docs-HFGZx`에만 있음(main 미반영) — 최신화 필요

## 주의

- 운영 배포는 사용자 확인 후. 비주얼은 사용자가 폰/프리뷰로 직접 확인(나는 렌더링 못 봄).
- "N명 참여" 같은 수치는 실제 아니면 표기 금지(과장광고 리스크).
