/*
 * 프로젝트 데이터
 * - 카드와 팝업은 모두 이 배열을 기준으로 그려집니다.
 * - 프로젝트를 추가하려면 객체 하나를 더 넣으면 됩니다.
 * - [ ] 로 감싼 부분은 아직 채우지 않은 내용입니다. 화면에 노란색으로 표시됩니다.
 * - `코드` 처럼 백틱으로 감싸면 코드 스타일로 표시됩니다.
 *
 * JSON 파일이 아니라 JS 파일로 둔 이유:
 * fetch로 JSON을 불러오면 HTML을 더블클릭해서 열 때(file://) 동작하지 않기 때문입니다.
 */
const Projects = [
    {
        id: "laro",
        title: "LARO",
        subtitle: "AI 디지털 트윈 창고 로봇 관제 시뮬레이터",
        accent: "#5b8cff",
        accent2: "#9b6bff",
        period: "2026.06.30 ~ 2026.08.21",
        team: "6명",
        org: "KT AIVLE School 빅프로젝트",
        myRole: "백엔드 · 실시간 관제",
        tags: ["Java 17", "Spring Boot", "WebSocket(STOMP)", "PostgreSQL", "Neo4j", "Redis", "React"],
        summary: "운영관리자와 소통하고 로봇을 지휘하는 AI 기반 디지털 트윈 시뮬레이터",
        overview:
            "LLM이 창고 로봇의 하루 작업을 계획하고, 시뮬레이터에서 실행해 보는 서비스입니다. 운영관리자는 시나리오를 만들고 실행하면서 로봇의 상태와 위치를 실시간으로 관제합니다.",
        stack: [
            { group: "Backend", items: ["Java 17", "Spring Boot", "Spring Security + JWT", "JPA", "Spring Data Neo4j", "Spring Data Redis", "WebSocket(STOMP)", "Actuator", "AWS S3"] },
            { group: "Frontend", items: ["React 19", "Vite", "SockJS"] },
            { group: "AI", items: ["FastAPI", "LangGraph", "OpenAI", "NVIDIA cuOpt"] },
            { group: "Data / Infra", items: ["PostgreSQL", "Neo4j", "Redis", "Docker", "AWS"] }
        ],
        responsibilities: [
            "12개 테이블 ERD 설계 주도, PostgreSQL · Neo4j · Redis 역할 분리",
            "정본 데이터 커밋 후 이벤트로 Neo4j 그래프 동기화",
            "시나리오 CRUD와 생성/수정 페이지, 실행 조건(로봇 대수 · 초기 배터리 · 배속 · 충전 기준) 저장 구조, 코드 자동 채번",
            "시뮬레이션 실행 · 일시정지 · 정지 · 초기화, 실행 시점 스냅샷 구조 설계",
            "WebSocket(STOMP) 실시간 관제와 SockJS 폴백",
            "`requestAnimationFrame` 위치 보간, 상태 시그니처 비교로 불필요한 리렌더 차단"
        ],
        troubleshooting: [
            {
                title: "시연 직전 LLM 호출 장애",
                problem: "LLM 호출이 181,847ms 만에 실패했습니다.",
                cause: "실패 시간을 역산해 60초 타임아웃이 3회 재시도된 값임을 확인했고, 설정이 120초에서 60초로 바뀐 것을 발견했습니다. 근본 원인은 15.6MB에 달하는 요청 크기였습니다.",
                solution: "[요청 크기를 줄이기 위해 적용한 방법과 결과]"
            },
            {
                title: "창고 지도 저장 시 간선 유실",
                problem: "요청 392건 중 390건만 저장되었습니다.",
                cause: "로그 계측으로 유실 지점을 추적했습니다. [유실이 발생한 구체적인 원인]",
                solution: "백엔드 저장 로직과 함께 프론트의 식별자 체계를 수정했습니다."
            },
            {
                title: "재계획 시 배터리 초기값 회귀",
                problem: "5분 주기로 작업을 재계획할 때 로봇 배터리가 초기값으로 되돌아갔습니다.",
                cause: "[재계획 시 배터리 값을 어디서 읽어 오고 있었는지]",
                solution: "실시간 상태 → 실행 초기값 → 마스터 데이터 순서로 값을 찾는 폴백 체인을 적용했습니다."
            }
        ],
        links: [
            { label: "GitHub Organization", url: "https://github.com/kt-aivle-big-project" },
            { label: "Backend Repository", url: "https://github.com/kt-aivle-big-project/BE" }
        ]
    },
    {
        id: "bookscamp",
        title: "bookscamp",
        subtitle: "MSA 기반 온라인 서점",
        accent: "#2fd3a5",
        accent2: "#1aa0c8",
        period: "[기간]",
        team: "[인원]",
        org: "NHN 아카데미 최종 프로젝트",
        myRole: "도서 · 카테고리 · 쿠폰 · 회원 등급",
        tags: ["Spring Boot", "JPA", "Redis", "MSA", "Scheduler", "AJAX"],
        summary: "config-server, eureka, gateway, auth, api, front로 나뉜 MSA 구조의 온라인 서점",
        overview:
            "도서 탐색부터 위시리스트, 좋아요, 쿠폰, 회원 등급까지 온라인 서점의 핵심 기능을 MSA 구조로 구현한 팀 프로젝트입니다. [서비스를 한 문장으로 소개]",
        stack: [
            { group: "구성 서비스", items: ["config-server", "eureka", "gateway", "auth", "api", "front"] },
            { group: "Backend", items: ["Spring Boot", "JPA", "Redis", "[DB]", "[그 외 사용 기술]"] }
        ],
        responsibilities: [
            "카테고리: CRUD, 재귀 구조의 Depth 처리, Redis 캐싱",
            "도서: 상세 · 추천 · 베스트셀러 · 신작 조회, 위시리스트",
            "좋아요: Redis에 누적 후 스케줄러로 주기적 DB 반영, AJAX 처리",
            "쿠폰: 적용 가능 쿠폰 표시, 도서 · 카테고리 쿠폰 다운로드, 관리자 CRUD, 상위 카테고리 쿠폰의 하위 카테고리 적용",
            "회원 등급: 매일 0시 스케줄러로 등급 갱신, 마이페이지 등급 · 적립률 표시"
        ],
        troubleshooting: [
            {
                title: "모든 화면에 필요한 카테고리 메뉴",
                problem: "카테고리 메뉴가 모든 페이지에 표시되어야 해서, 요청마다 카테고리 조회가 발생했습니다.",
                cause: "카테고리 트리를 매번 DB에서 조회하면 [응답 시간 또는 쿼리 수 등 수치]",
                solution: "카테고리를 Redis에 캐싱하고 `@ControllerAdvice`로 모든 화면 모델에 주입했습니다. AJAX와 리다이렉트처럼 화면이 없는 요청에도 조회가 발생하는 점은, 인터셉터 `postHandle`로 렌더링 요청에만 적용하는 방향으로 개선을 검토했습니다."
            },
            {
                title: "좋아요 요청의 DB 쓰기 부담",
                problem: "[좋아요를 Redis + 스케줄러 구조로 설계한 배경]",
                cause: "[문제의 원인]",
                solution: "좋아요는 Redis에 먼저 누적하고, 스케줄러가 주기적으로 DB에 반영하도록 구성했습니다. [반영 주기와 효과]"
            },
            {
                title: "정량 검증",
                problem: "[JMeter 등 부하 테스트 대상과 시나리오]",
                cause: "[측정 결과]",
                solution: "[개선 후 결과]"
            }
        ],
        links: [
            { label: "GitHub Organization", url: "https://github.com/nhnacademy-be11-bookscamp" }
        ]
    },
    {
        id: "kickoff",
        title: "킥오프",
        subtitle: "동네 축구 팀 매칭 서비스",
        accent: "#ff8a3d",
        accent2: "#ff4d6d",
        period: "[기간]",
        team: "개인 프로젝트",
        org: "Side Project",
        myRole: "[담당 범위]",
        tags: ["[기술 스택]"],
        summary: "밴드에 글을 올려 상대팀을 구하던 과정을 앱으로 옮긴 축구 팀 매칭 서비스",
        overview:
            "직접 팀을 운영하며 밴드에 팀 실력과 예약한 운동장 정보를 올려 상대팀을 구하던 경험에서 출발했습니다. 자유 형식의 글 대신 지역 · 시간 · 실력 필터로 상대팀을 찾고, 매치 요청을 보내 수락하는 흐름으로 구조화합니다.",
        stack: [
            { group: "Backend", items: ["[기술 스택]"] },
            { group: "Frontend", items: ["[기술 스택]"] }
        ],
        responsibilities: [
            "팀 등록과 팀 정보 관리 [구현 여부]",
            "지역 · 시간 · 실력 기준 상대팀 검색 [구현 여부]",
            "매치 요청 · 수락 흐름 [구현 여부]",
            "[그 외 기능]"
        ],
        troubleshooting: [
            {
                title: "[트러블슈팅 제목]",
                problem: "[문제 상황]",
                cause: "[원인]",
                solution: "[해결 방법]"
            }
        ],
        links: [
            { label: "GitHub Repository", url: "" }
        ]
    }
];