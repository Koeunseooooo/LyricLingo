# LyricLingo TRD (Technical Requirement Document)

## 1. 프로젝트 개요

- **프로젝트명**: LyricLingo
- **버전**: MVP (Minimum Viable Product)
- **목표**:
  - K-POP 가사를 기반으로 외국인 학습자가 언어·문화적 맥락을 학습할 수 있도록 하는 서비스
  - MVP 단계에서는 **회원가입 없이 바로 사용 가능한 가사 기반 학습 경험 제공**에 초점

## 2. 아키텍처 개요

### 2.1 전체 구조 (MVP 기준)

<aside>
➡️

[Client: React/Next.js]
↓ REST API

[Backend: Node.js or Spring Boot]
↓

[AI Layer: Claude API]

↓

[DB: Firebase Firestore or PostgreSQL (후보)]

↓

[Infra: Vercel or Firebase Hosting (FE), AWS or Firebase Functions (BE)]

</aside>

## 3. 기술 스택 선정 근거

### 3.1 Frontend

| 항목       | 기술                             | 이유                                              |
| ---------- | -------------------------------- | ------------------------------------------------- |
| Framework  | **Next.js (React + TypeScript)** | SEO, SSR, API Route 활용 가능, Vercel과 궁합 좋음 |
| Styling    | **TailwindCSS**                  | 빠른 UI 프로토타이핑에 최적                       |
| State 관리 | **React Query / Zustand**        | API 캐싱 및 상태관리 단순화                       |
| 배포       | **Vercel**                       | Git 연동 및 즉시 배포, 빠른 미리보기 환경         |

### 3.2 Backend

| 항목      | 기술                                                     | 이유                                           |
| --------- | -------------------------------------------------------- | ---------------------------------------------- |
| Framework | **Node.js (Express or NestJS)**                          | REST API 구성에 용이, AI 요청/응답 라우팅 중심 |
| Auth      | MVP 단계에서는 제외                                      | 로그인/회원 기능은 추후 확장                   |
| API 관리  | Axios or Fetch                                           | AI 응답 캐싱 및 로깅 지원                      |
| 배포      | **Firebase Functions** 또는 **AWS Lambda + API Gateway** | 서버리스 구조로 초기 유지보수 부담 최소화      |

**→ 추천 조합 (MVP 기준): Node.js + Firebase Functions**

- BE를 Firebase Functions로 배포하면 서버관리 부담이 적고
- AI 요청/응답 캐싱도 Firestore로 바로 연결 가능

### 3.3 Database

| 후보                   | 장점                                   | 단점                              | MVP 적합도    |
| ---------------------- | -------------------------------------- | --------------------------------- | ------------- |
| **PostgreSQL**         | SQL 기반 구조, 관계형 모델 명확        | 초기 스키마 설계 필요             | 중            |
| **Firebase Firestore** | 서버리스, 실시간 동기화, 빠른 MVP 구축 | SQL 쿼리 한계, 데이터 정합성 약함 | **상 (추천)** |

**→ MVP에서는 Firebase Firestore 권장.**

로그인/유저 세션 기능이 없고 데이터 구조가 단순(가사/카드/아카이브 중심)이므로 RDB보다 Firestore가 관리 편함.

추후 사용자 관리, 학습 이력 분석이 본격화되면 PostgreSQL로 이전 고려.

### 3.4 AI 구성

### 역할 구분

| 구분 | 역할                                      | 사용 API                                   |
| ---- | ----------------------------------------- | ------------------------------------------ |
| 1    | **가사 분석 및 문장 추출**                | GPT-4o-mini 또는 Claude 3.5 Sonnet         |
| 2    | **문장별 학습카드 생성 (의미/문화/예문)** | Claude 3.5 Sonnet (자연스러운 설명에 강점) |
| 3    | **퀴즈 자동 생성**                        | GPT-4o-mini (문장 기반 객관식/주관식 생성) |

### 추천 조합

- **Claude 3.5 Sonnet** → 해석, 뉘앙스, 문화적 맥락 처리에 탁월
- **OpenAI GPT-4o-mini** → 빠르고 저렴한 퀴즈 생성용
- 두 모델을 혼합 사용 가능 (LangChain 또는 직접 API 라우팅으로 조합)

### AI 워크플로우

1. 사용자가 노래 검색 → 가사 텍스트 확보
2. `AI_Extractor` 모듈이 문장 단위로 의미 있는 부분 추출
3. `AI_CardBuilder` 모듈이 각 문장에 대해:
   - 번역
   - 뉘앙스/비유/밈 설명
   - 예문 생성
   - 유사 외국어 표현
4. 생성된 결과를 JSON 형태로 반환 및 Firestore에 캐싱

## 4. 데이터 모델 설계 (초안)

### 4.1 Firestore 컬렉션 구조

`/songs`

- id
- title
- artist
- lyrics (text)
- createdAt

`/cards`

- id
- songId (ref)
- line (string)
- meaning (string)
- culture (string)
- example (string)
- relatedExpression (string)
- createdAt

`/quiz`

- id
- songId (ref)
- question
- options[]
- answer
- createdAt

(추후 `/users`, `/favorites`, `/learningLogs` 컬렉션 추가 예정)

---

## 5. API 명세 (MVP 버전)

| Endpoint             | Method | 설명                                           |
| -------------------- | ------ | ---------------------------------------------- |
| `/api/song/search`   | GET    | 노래 제목으로 검색 및 가사 로드                |
| `/api/song/:id`      | GET    | 특정 노래의 상세 정보 및 가사 반환             |
| `/api/analyze`       | POST   | 가사 입력 → AI 문장 추출 및 카드 생성          |
| `/api/quiz/generate` | POST   | 카드 기반 퀴즈 자동 생성                       |
| `/api/cards/save`    | POST   | 카드북 저장 (MVP에서는 로컬 저장 or Firestore) |

---

## 6. 배포 및 운영 환경

| 구성     | 서비스                             | 설명                                      |
| -------- | ---------------------------------- | ----------------------------------------- |
| Frontend | **Vercel** or **Firebase Hosting** | Git push 자동 배포                        |
| Backend  | **Firebase Functions**             | AI 연동 중심 서버리스                     |
| AI       | **Claude API**, **OpenAI API**     | 텍스트 분석 및 학습카드 생성              |
| DB       | **Firebase Firestore**             | 무스키마 NoSQL, 빠른 개발                 |
| Storage  | Firebase Storage                   | 이미지 또는 카드 썸네일 보관용 (선택사항) |

---

## 7. 보안 및 성능 고려사항

- API Key는 Firebase Functions 환경변수로 관리
- AI 응답은 캐싱하여 중복 요청 최소화
- 가사 데이터는 외부 API(예: Genius, Melon API 대체) 사용 또는 사용자 입력 방식으로 시작
- CORS 설정: Vercel 도메인만 허용

---

## 8. 향후 확장 포인트

- 로그인 추가 → 사용자별 학습 히스토리 관리
- PostgreSQL 전환 → 학습 데이터 정형 분석
- AI 모델 파인튜닝 → K-POP 표현 특화
- Speech-to-Text / 발음 피드백 기능
- 소셜 카드북 공유 및 커뮤니티화

---

## 10. 개발 로드맵 (예상)

| 단계 | 기간 | 주요 작업                          |
| ---- | ---- | ---------------------------------- |
| 1    | day1 | FE 환경 세팅, 기본 UI (가사 보기)  |
| 2    | day2 | AI 연동 (문장 추출 + 카드 생성)    |
| 3    | day3 | 퀴즈 모듈 및 아카이브 UI 구축      |
| 4    | day4 | Firestore 연동, 전체 플로우 검증   |
| 5    | day5 | 배포 및 테스트 (Vercel + Firebase) |

---

## 11. 결론

- **MVP 핵심**: “AI가 가사 속 표현을 뽑고, 학습카드로 해석 및 퀴즈를 통한 학습 경험”
- **추천 스택 조합**:
  - FE: Next.js + TypeScript + Vercel
  - BE: Node.js + Firebase Functions
  - DB: Firestore
  - AI: Claude 3.5 Sonnet + GPT-4o-mini 조합
- 로그인·레벨·추천 시스템은 추후 확장 시점에서 PostgreSQL 및 AWS 혹은 네이버 클라우드로 이전 고려
