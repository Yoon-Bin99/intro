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
        org: "KT AIVLE School 빅프로젝트 · Excellence상",
        myRole: "백엔드 · DB 설계 · 실시간 관제",
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
            "12개 테이블 ERD 설계 주도, PostgreSQL(정본) · Neo4j(경로 탐색) · Redis(실시간 로봇 상태) 역할 분리",
            "정본 데이터 커밋 후 이벤트로 Neo4j 그래프 동기화",
            "시나리오 CRUD와 생성/수정 페이지, 실행 조건(로봇 대수 · 초기 배터리 · 배속 · 충전 기준) 저장 구조, 코드 자동 채번",
            "시뮬레이션 실행 · 일시정지 · 정지 · 초기화, 실행 시점 스냅샷 구조 설계",
            "WebSocket(STOMP) 실시간 관제와 SockJS 폴백",
            "`requestAnimationFrame` 위치 보간, 상태 시그니처 비교로 불필요한 리렌더 차단"
        ],
        troubleshooting: [
            {
                title: "시연 직전 LLM 호출 장애",
                problem: "최종 발표를 앞두고 LLM 작업 계획 생성이 181,847ms 만에 시간 초과로 실패했습니다.",
                cause: "AI 서버를 직접 호출하니 3.6초 만에 정상 응답이 와서 AI 서버 문제는 아니었습니다. 실패 시간을 역산해 60초 타임아웃이 3회 재시도된 값임을 확인했고, 설정이 120초에서 60초로 바뀐 것을 발견했습니다. 근본 원인은 창고 지도가 커지면서 15.6MB까지 늘어난 요청 크기였습니다.",
                solution: "설정을 되돌리는 데서 멈추지 않고, 실행할 때마다 LLM을 다시 부르던 구조를 한 번 생성한 계획을 저장해 두고 재생하는 방식으로 바꿨습니다. 발표 당일 같은 조건에서 같은 결과를 시연했고, 불필요한 LLM 호출 비용과 대기 시간도 없앴습니다."
            },
            {
                title: "창고 지도 저장 시 간선 유실",
                problem: "에러 없이 성공 응답이 오는데, 요청 392건 중 390건만 저장되었습니다.",
                cause: "요청 · 저장 · 누락 건수와 누락 사유를 남기는 로그를 넣어 원인을 둘로 좁혔습니다. 하나는 노드 타입 매핑 표에 입출고구 진입 노드(`inbound_access` · `outbound_access`)가 빠져 해당 노드가 저장되지 않고, 거기 붙은 간선이 통째로 버려진 것이었습니다. 다른 하나는 프론트에서 간선 식별자가 중복 생성돼 뒤에 온 간선이 무시된 것이었습니다.",
                solution: "누락된 노드 타입을 매핑에 추가하고, 설비 코드가 없으면 노드 id로 채우는 규칙을 넣었습니다. 프론트는 출발 · 도착 노드 조합으로 식별자를 다시 만들도록 팀원과 함께 수정했고, 기존 지도 JSON은 변환 스크립트로 일괄 보정했습니다."
            },
            {
                title: "재계획 시 배터리 초기값 회귀",
                problem: "작업을 재계획할 때마다 로봇 배터리가 초기값으로 되돌아갔습니다.",
                cause: "재생을 시작할 때 배터리를 로봇 등록값(`robot.getBattery()`)에서 읽고 있었습니다. 이 값은 실행 중에 바뀌지 않아, 시나리오에서 초기 배터리를 80%로 잡아도 계획이 적용되는 순간 100%로 돌아가고 재계획마다 다시 차올랐습니다.",
                solution: "Redis 실시간 상태 → 시나리오 초기 배터리 → 로봇 등록값 순서로 값을 찾는 폴백 체인을 적용해, 실행 중에는 항상 마지막 실제 상태에서 이어지게 했습니다."
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
        period: "2025.10.15 ~ 2025.12.05",
        team: "8명",
        org: "NHN 아카데미 최종 프로젝트 · 최우수상",
        myRole: "도서 · 카테고리 · 좋아요 · 쿠폰 · 회원 등급",
        tags: ["Spring Boot", "Spring Cloud", "JPA", "MySQL", "Redis", "MSA", "Scheduler"],
        summary: "config-server, eureka, gateway, auth, api, front로 나뉜 MSA 구조의 온라인 서점",
        overview:
            "도서 탐색부터 위시리스트, 좋아요, 쿠폰, 회원 등급까지 온라인 서점의 핵심 기능을 MSA 구조로 구현한 팀 프로젝트입니다. 8명이 6개 서비스로 나눠 개발해 3개 팀 중 최우수상을 받았습니다.",
        stack: [
            { group: "구성 서비스", items: ["config-server", "eureka", "gateway", "auth", "api", "front"] },
            { group: "Backend", items: ["Java", "Spring Boot 3.5", "Spring Cloud(Eureka · Config · OpenFeign)", "JPA", "QueryDSL", "Redis", "RabbitMQ", "Elasticsearch"] },
            { group: "Data / Test", items: ["MySQL", "H2", "JUnit5", "Mockito", "JaCoCo"] }
        ],
        responsibilities: [
            "카테고리: CRUD, 재귀 구조의 Depth 처리, Redis 캐싱과 변경 시 캐시 무효화",
            "도서: 상세 · 추천 · 베스트셀러 · 신작 조회, 위시리스트",
            "좋아요: Redis에 누적 후 스케줄러로 주기적 DB 반영, AJAX 처리",
            "쿠폰: 적용 가능 쿠폰 표시, 도서 · 카테고리 쿠폰 다운로드, 관리자 CRUD, 상위 카테고리 쿠폰의 하위 카테고리 적용",
            "회원 등급: 매일 0시 스케줄러로 등급 갱신, 마이페이지 등급 · 적립률 표시",
            "담당 도메인 서비스 계층 JUnit5 · Mockito 테스트"
        ],
        troubleshooting: [
            {
                title: "모든 화면에 필요한 카테고리 메뉴",
                problem: "카테고리 메뉴가 모든 페이지에 표시되어야 해서, 요청마다 카테고리 조회가 발생했습니다.",
                cause: "카테고리는 대분류 · 중분류 · 소분류로 이어지는 재귀 구조라, 매번 DB에서 조회하면 페이지를 열 때마다 같은 트리를 다시 만들게 됩니다. 반면 카테고리는 관리자만 바꾸고 변경이 드물어 캐싱하기 좋은 데이터였습니다.",
                solution: "카테고리 트리를 `@Cacheable`로 Redis에 캐싱하고, 생성 · 수정 · 삭제 시 `@CacheEvict`로 캐시를 비워 변경 즉시 새 트리가 보이게 했습니다. 프론트에서는 `@ControllerAdvice`로 모든 화면 모델에 주입했습니다. AJAX와 리다이렉트처럼 화면이 없는 요청에도 조회가 발생하는 점은, 인터셉터 `postHandle`로 렌더링 요청에만 적용하는 방향으로 개선을 검토했습니다."
            },
            {
                title: "좋아요 요청의 DB 쓰기 부담",
                problem: "좋아요는 누르고 취소하는 일이 잦아서, 요청마다 DB에 쓰면 같은 행을 반복해서 갱신하게 됩니다.",
                cause: "좋아요 상태와 도서별 좋아요 수는 자주 바뀌지만, 실시간으로 DB와 일치해야 하는 데이터는 아니었습니다. 클릭마다 DB에 쓰면 쓰기 쿼리가 클릭 수만큼 발생합니다.",
                solution: "회원 · 도서별 최종 상태(`like:update`)와 도서별 좋아요 수(`like:count`)를 Redis Hash에 먼저 누적하고, 스케줄러가 30분 간격(`fixedDelay`)으로 최종 상태만 DB에 반영하도록 구성했습니다. 같은 회원이 여러 번 눌러도 마지막 상태 한 번만 저장되고, 반영에 성공한 키만 Redis에서 지워 실패한 건은 다음 주기에 다시 처리합니다."
            }
        ],
        links: [
            { label: "GitHub Organization", url: "https://github.com/nhnacademy-be11-bookscamp" },
            { label: "Backend Repository", url: "https://github.com/nhnacademy-be11-bookscamp/api" }
        ]
    },
    {
        id: "kickoff",
        title: "kick-off",
        subtitle: "동네 축구 팀 매칭 서비스",
        accent: "#ff8a3d",
        accent2: "#ff4d6d",
        period: "2026.08.23 ~ 진행중",
        team: "개인 프로젝트",
        org: "개인 프로젝트 · Claude Code 활용",
        myRole: "기획 · 풀스택 개발 · 배포",
        tags: ["Java 17", "Spring Boot 4", "Spring Security + JWT", "PostgreSQL", "Flyway", "React Native", "Expo", "Railway"],
        summary: "밴드에 글을 올려 상대팀을 구하던 과정을 앱으로 옮긴 축구 팀 매칭 서비스",
        overview:
            "직접 팀을 운영하며 밴드에 팀 실력과 예약한 운동장 정보를 올려 상대팀을 구하던 경험에서 출발했습니다. 자유 형식의 글 대신 지역 · 날짜 · 시간 · 실력 필터로 상대팀을 찾고, 매치 신청을 보내 수락하는 흐름으로 구조화했습니다. Claude Code를 총괄 · 백엔드 · 프론트 세션으로 나누고 API 계약서 하나를 기준으로 삼아 3주 만에 배포했습니다.",
        stack: [
            { group: "Backend", items: ["Java 17", "Spring Boot 4.1", "Spring Security + JWT", "JPA", "Flyway", "PostgreSQL", "H2"] },
            { group: "Frontend", items: ["React Native", "Expo"] },
            { group: "Test / Infra", items: ["JUnit5", "Testcontainers", "Docker", "Railway"] },
            { group: "외부 연동", items: ["카카오 · 네이버 OAuth", "카카오 장소 검색", "서울시 공공 체육시설 API", "문자 인증", "푸시 알림"] }
        ],
        responsibilities: [
            "팀 등록과 팀원 관리, 팀 실력 등급 설정",
            "지역 · 날짜 · 시간 · 실력 · 키워드 기준 모집글 검색",
            "매치 신청 · 수락 흐름: 한 건을 수락하면 같은 글의 나머지 신청은 자동 거절되고 글이 매칭완료로 전환, 수락된 상대에게만 연락처와 입금 계좌 공개",
            "경기 후 팀 리뷰와 평점, 매칭 상대와의 채팅, 푸시 알림",
            "이메일 가입 · 카카오 · 네이버 소셜 로그인(JWT), 문자 인증, 비밀번호 재설정, 회원 탈퇴",
            "서울시 공공 데이터를 하루 1회 동기화하는 구장 디렉터리, 카카오 장소 검색, 스쿼드 메이커",
            "Flyway 마이그레이션, Docker 이미지, `main` 푸시 시 Railway 자동 배포"
        ],
        troubleshooting: [
            {
                title: "테스트는 통과하는데 운영에서만 틀린 한글 정렬",
                problem: "구장 목록이 운영에서만 순서가 엉켰습니다. \"인천 서구\"가 맨 앞, \"인천 연수구\"가 맨 뒤로 가서 다른 지역 구장을 사이에 두고 갈라졌습니다.",
                cause: "운영 DB는 glibc의 `en_US.utf8` 콜레이션이라 한글이 상위 비교 단계에서 무시될 수 있었습니다. 테스트에 쓰던 H2와 `postgres:16-alpine`(musl libc)은 사실상 코드포인트 순서로 정렬해서, 양쪽 테스트가 모두 통과하는데 운영만 틀렸습니다.",
                solution: "PostgreSQL에서는 `collate \"C\"`를 붙이는 `sortkey()` HQL 함수를 등록해 한글 정렬 자리에 적용했습니다. 테스트 이미지도 운영과 같은 `postgres:16`(glibc)으로 바꾸고, 실제 운영 데이터 5건으로 회귀 테스트를 추가해 수정 전에 운영과 똑같이 실패하는 것을 확인한 뒤 고쳤습니다."
            },
            {
                title: "H2에서는 통과, PostgreSQL에서는 500",
                problem: "테스트가 전부 통과했는데 운영에서 모집글 목록 API가 500을 냈습니다.",
                cause: "`lower(concat('%', :region, '%'))`에서 `region`이 `null`이면 PostgreSQL은 타입을 `bytea`로 추론해 `function lower(bytea) does not exist`로 실패하는데, 테스트용 H2는 그냥 통과시켰습니다.",
                solution: "쿼리를 수정하고, Testcontainers로 같은 통합 테스트 클래스를 실제 PostgreSQL에서 한 번 더 돌리는 `postgresTest`를 추가했습니다. PG 전용 테스트를 따로 두지 않아 두 환경의 커버리지가 벌어지지 않게 했고, Flyway 마이그레이션도 함께 검증됩니다."
            },
            {
                title: "배포 후 AI 작성 코드 보안 · 개인정보 점검",
                problem: "AI 코딩 도구로 빠르게 만든 만큼, 배포 후 코드를 그대로 믿지 않고 보안 · 개인정보 관점에서 전체 점검을 진행했습니다.",
                cause: "문자 발송 실패 시 제공자 오류 본문에 전화번호가 그대로 남고, 로그에 이메일 · 전화번호가 찍히고, 운영에서도 CORS 자격증명이 허용되어 있었고, 검색어의 `%` · `_`가 와일드카드로 해석되는 문제를 찾았습니다.",
                solution: "전화번호 · 이메일 마스킹, 운영 CORS 자격증명 비활성화, LIKE 와일드카드 이스케이프, 문자 발송 요청자별 한도, 로그인 실패 반복 시 일시 잠금, 탈퇴 시 인증 이력 삭제와 보관 기간이 지난 이력의 매일 파기를 이슈별 커밋으로 적용했습니다."
            }
        ],
        links: [
            { label: "Backend Repository", url: "https://github.com/Yoon-Bin99/kickoff_be" }
        ]
    }
];