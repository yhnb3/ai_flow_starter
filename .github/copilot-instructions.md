
<!-- AI 에이전트를 위한 자동 생성 스타터 문서 — 프로젝트별 값으로 수정하세요. -->
# Copilot 지침 — 워크스페이스 스타터

목적: AI 코딩 에이전트가 이 저장소에서 추측하지 않고 바로 생산적으로 작업할 수 있도록 핵심 정보를 제공합니다.

주의: 이 파일이 생성될 당시 저장소 내에 기존 에이전트 지침 파일이 발견되지 않았습니다. 아래 항목을 실제 리포지토리 값으로 채워주세요(예시는 템플릿입니다).

1) 빠른 저장소 요약
- 언어: 예: `node`, `python`, `go` — 반드시 명시하세요.
- 빌드: 정확한 빌드 명령어(예: `npm run build`, `poetry build`).
- 테스트: 정확한 테스트 명령어(예: `npm test`, `pytest`).

2) 작업 방식(선호하는 행동 양식)
- 큰 구조 변경 전에는 명확한 확인 질문을 하세요.
- 작은 버그 수정은 집중된 커밋을 만들고 관련 테스트를 갱신하세요.
- 런타임 동작이 불확실하면 재현되는 짧은 실패 테스트를 추가하세요.

3) 아키텍처 요약 (저장소에서 채우기)
- 서비스 경계: 예: `frontend/`(React) vs `api/`(Express) vs `worker/`(백그라운드 작업).
- 데이터 흐름: 주요 입력/출력과 영속성(예: `api/src/db/`를 통한 PostgreSQL) 설명.
- 구조 선택 이유: 모노레포, 성능 분리, 레거시 어댑터 등 의사결정 배경을 기록하세요.

4) 핵심 파일 및 확인 위치(예시 교체)
- 앱 진입점: `./src/index.ts` 또는 `./server/main.py`.
- 설정: `./config/*`, `./.env.example`.
- 테스트: `./tests/` 또는 `./__tests__/`.
- CI: `.github/workflows/*`.

5) 자주 사용하는 개발 명령(프로젝트의 정확한 명령으로 교체하세요)
```bash
# 예시 — 프로젝트의 실제 명령으로 바꿔주세요
npm install
npm run build
npm test
# 또는 Python
pip install -r requirements.txt
pytest -q
```

6) 프로젝트 특유의 규칙 및 패턴
- 네이밍: 라우트는 `kebab-case`, React 컴포넌트는 `PascalCase` 등 프로젝트 규칙을 명시하세요.
- 에러 처리: 로그 위치와 형식(예: `logger.ts`에서 구조화된 JSON 로그)을 기록하세요.
- DB 마이그레이션: 마이그레이션 파일 위치와 실행 방식(예: `alembic upgrade head`)을 적어주세요.

7) 통합 지점 및 외부 의존성
- 외부 API와 자격증명이 저장된 위치(예: `services/payments`는 `STRIPE_*` 환경변수 사용).
- 백그라운드 작업/큐(예: `worker/`가 Redis 큐 `jobs`로 게시).

8) PR 및 커밋 가이드
- 커밋은 작고 목적에 집중하세요. 접두사로 `feat/`, `fix/`, `chore/` 사용 권장.
- 공개 API에 영향이 있을 경우 CHANGELOG 또는 릴리스 노트를 업데이트하세요.

9) 저장소 탐색용 빠른 명령
```bash
ls -la
git status --porcelain
rg --hidden --glob '!node_modules' "package.json|pyproject.toml|go.mod|Cargo.toml" || true
rg --hidden --glob '!node_modules' "main\(|app\.listen|if __name__ == '__main__'" || true
```

10) 수정 후 기대사항
- 변경사항은 집중된 커밋으로 만들고 PR 설명에 컨텍스트, 변경내용, 테스트 결과를 포함하세요.
- 프로젝트 테스트를 실행하고 결과(성공/실패)를 PR에 첨부하세요.

---
원하시면 다음 작업을 진행할 수 있습니다: (a) 저장소에서 패키지 매니페스트와 CI 설정을 자동으로 스캔, 또는 (b) 주요 파일들을 알려주시면 본문 예시를 해당 코드로 채워 문서를 업데이트하겠습니다.

