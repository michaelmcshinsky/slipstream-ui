import type { MarketingCopy } from './types';

export const ko: MarketingCopy = {
  home: {
    whatsNew: '새 소식 →',
    aiFirstBadge: 'AI 우선 · MIT',
    reactBadge: 'React 18+',
    heroTitleLead: '당신의 AI는 이미',
    heroTitleHighlight: '디자인 시스템을 알고 있습니다',
    heroDescription:
      'Slipstream UI는 AI 지원 개발을 위해 만든 컴포넌트 시스템입니다. 모든 컴포넌트에 기계 판독 가능한 명세, 이를 제공하는 MCP 서버, 에이전트를 정확하게 유지하는 검증기가 함께 제공됩니다.',
    getStarted: '시작하기',
    starOnGithub: 'GitHub에서 스타 주기',
    copy: '복사',
    copied: '복사됨',
    liveDemoNote: '라이브 데모 — 전부 Slipstream UI로 제작',
    welcomeTitle: 'Slipstream에 대해 물어보기',
    welcomeSuggestions: ['무엇이 다른가요?', '매니페스트는 어떻게 동작하나요?'],
    promptPlaceholder: '직접 사용해 보세요…',
    send: '보내기',
    agentStripLabel: '원활하게 연동',
    stats: ['컴포넌트', '기계 판독 명세', '에이전트용 MCP 도구', '허용되는 환각 prop'],
    featuresHeading: '지금의 소프트웨어 개발 방식에 맞춰',
    featuresIntro:
      'UI의 절반은 모델이 작성합니다. Slipstream은 학습 데이터에서 긁어온 문서보다 나은 것을 제공합니다. 질의할 수 있는 명세와 스스로 검증할 수 있는 가드레일입니다.',
    features: [
      {
        title: '기계 판독 매니페스트',
        body: '모든 컴포넌트에 COMPONENT_MANIFEST가 있습니다. 정확한 prop 스키마, 기본값, 안티패턴, 접근성 요구 사항, 구성 규칙.',
      },
      {
        title: 'validate_usage MCP 도구',
        body: '에이전트는 출력 전에 생성한 JSX를 매니페스트로 검증합니다. 환각 prop과 누락된 필수 항목을 배포 전에 잡을 수 있습니다.',
      },
      {
        title: 'shadcn 호환 레지스트리',
        body: 'shadcn 호환 CLI로 실제 소스 파일을 설치하거나 패키지를 사용하세요. 당신의 코드베이스, 당신의 규칙.',
      },
      {
        title: '완전한 무상태',
        body: '런타임 종속이 없습니다. Vercel AI SDK, LangGraph 또는 원시 스트림 등 어떤 백엔드도 사용하세요. 컴포넌트는 렌더링하고 상태는 당신이 소유합니다.',
      },
      {
        title: '테스트된 접근성',
        body: '모든 컴포넌트에 jest-axe 스위트, aria-busy 스트리밍 상태, 정중한 완료 알림, 동작 감소 변형.',
      },
      {
        title: '토큰까지 테마 적용',
        body: 'createTheme() 한 번으로 모든 CSS 변수를 생성합니다. 반경, 다크 모드, 즉시 전환, 재빌드 없음.',
      },
    ],
    howHeading: 'AI가 사용하는 방법',
    howIntro: '세 단계, 파인튜닝도 프롬프트 주문도 없습니다.',
    steps: [
      {
        title: '연결',
        body: 'Claude Code나 Cursor를 Slipstream MCP 서버로 연결하거나 llms.txt와 /llm markdown 경로를 제공하세요.',
      },
      {
        title: '명세 질의',
        body: '에이전트가 get_component_manifest와 get_usage_examples를 호출합니다. 정확한 prop, 기본값, 안티패턴.',
      },
      {
        title: '자체 검증',
        body: '출력 전에 validate_usage가 생성된 JSX를 매니페스트와 대조하고 환각 prop을 수정합니다.',
      },
    ],
    validatorHeading: '실패 패턴을 잡아냅니다',
    validatorIntroBefore: '에이전트가',
    validatorIntroAfter: '라고 추측하지만, 매니페스트를 확인해 작성되기 전에 거부합니다.',
    validatorCards: [
      { title: '1. 환각된 사용법', note: '해당 prop은 존재하지 않으며 필수 onSubmit이 빠졌습니다.' },
      { title: '2. validate_usage 응답', note: '표시를 위해 줄였습니다. 도구는 매니페스트 안티패턴도 반환합니다.' },
      { title: '3. 올바른 사용법', note: '문서, MCP 서버, 레지스트리가 제공하는 동일한 계약으로 검증되었습니다.' },
    ],
    themesHeading: '라이브러리에 포함된 테마',
    themesIntro: 'Default, Violet, Zinc 프리셋이 포함됩니다. 아래에서 전환하세요. 스크린샷이 아닌 실제 테마입니다.',
    comparisonHeading: '비교',
    comparisonIntro: '다른 라이브러리는 사람을 위해 문서화합니다. Slipstream은 둘 모두를 위해 문서화합니다.',
    comparisonCapability: '기능',
    comparisonCapabilities: [
      '배포 모델',
      '제공 컴포넌트',
      '컴포넌트별 기계 판독 명세',
      'MCP 서버',
      '생성된 JSX를 명세로 검증',
      'llms.txt',
      '컴포넌트/페이지별 표준 markdown',
      'AI 채팅 컴포넌트',
      '상태 및 전송',
      '스타일링',
      '테마 프리셋',
      '피어 의존성',
      '라이선스',
    ],
    comparisonFootnote:
      '2026년 11월 기준 각 프로젝트의 공개 문서와 공개 패키지를 반영 · ✅ 제공 · 🟡 부분 제공 또는 다른 모델 · — 이 목적에는 미제공',
    comparisonCards: [
      {
        title: 'Slipstream 선택',
        body: '에이전트가 디자인 시스템을 준수하는 올바른 코드를 생성해야 하고 배포 전에 검증기를 두고 싶을 때.',
      },
      {
        title: 'shadcn/ui + AI Elements 선택',
        body: '생태계 규모와 매우 큰 프리미티브 기반의 코드 소유권이 가장 중요할 때.',
      },
      {
        title: 'assistant-ui 선택',
        body: '스트리밍, 도구, 생성 UI를 핵심 제품으로 하는 검증된 채팅 런타임이 필요할 때.',
      },
    ],
    templatesHeading: '템플릿에서 시작',
    templatesIntro: 'Slipstream 컴포넌트만으로 만든 복사해 붙여넣을 수 있는 완전한 패턴.',
    browseTemplates: '모든 템플릿 보기 →',
    templates: [
      { name: '스트리밍 채팅', body: 'Markdown 응답, 생성 중지, 스크롤 고정, 피드백 동작.' },
      { name: '에이전트 대시보드', body: '사람 승인이 있는 도구 호출, 추론 단계, 작업 진행.' },
      { name: 'RAG 인용', body: '인라인 인용 칩과 출처 푸터가 있는 근거 기반 답변.' },
    ],
    agentPathTitle: '에이전트 개발자에게 →',
    agentPathBody:
      'MCP 서버를 Claude Code나 Cursor에 연결하고, 출력 전에 validate_usage를 실행하거나 llms.txt와 markdown 경로를 제공하세요. 다섯 도구, 세 가지 사용 경로.',
    productPathTitle: '제품 팀에게 →',
    productPathBody:
      '스트리밍 Markdown, 생성 중지, 인용, 승인을 갖춘 프로덕션 채팅 화면을 무상태 컴포넌트, jest-axe 커버리지, 자체 백엔드로 출시하세요.',
    ctaHeading: 'AI 인터페이스를 더 빠르게 출시',
    ctaBody:
      '{componentCount}개 컴포넌트 · {componentCount}개 기계 판독 명세 · 출시 전에 생성된 사용법을 검증하세요.',
    startBuilding: '빌드 시작',
  },
  about: {
    title: 'Slipstream UI 소개',
    description:
      '하나의 주장을 가진 작은 오픈소스 프로젝트입니다. 코딩 에이전트도 사용자이며 기계 판독 가능한 계약을 받을 자격이 있습니다.',
    updated: '2026년 11월',
    sections: [
      {
        heading: '왜 존재하는가',
        blocks: [
          {
            type: 'p',
            text: 'AI 코딩 어시스턴트는 React 작성은 잘하지만, 한 번도 본 적 없는 디자인 시스템의 정확한 prop 이름, 필수 필드, 접근성 규칙을 기억하는 데는 약합니다. 흔한 해결책은 더 많은 프롬프트 문맥이나 더 큰 README이지만, 둘 다 컴포넌트가 바뀌는 순간 어긋납니다.',
          },
          {
            type: 'p',
            text: 'Slipstream UI는 방향을 뒤집습니다. 진실의 원천이 코드와 함께 배포됩니다. {componentCount}개 컴포넌트 모두 `COMPONENT_MANIFEST`를 가지며, MCP 서버가 이를 제공하고 `validate_usage`가 편집기에 도달하기 전에 생성된 JSX를 검증합니다.',
          },
        ],
      },
      {
        heading: '원칙',
        blocks: [
          {
            type: 'ul',
            items: [
              '**에이전트는 일급 사용자입니다.** 에이전트가 질의할 수 있는 계약은 사람이 읽는 prop 표만큼 중요합니다.',
              '**설계부터 무상태.** 컴포넌트는 렌더링하고 상태, 전송, 데이터는 당신이 소유합니다. 런타임 종속도 숨은 프로바이더도 없습니다.',
              '**접근성은 변형이 아닙니다.** 키보드 동작, ARIA 연결, 동작 감소 경로는 컴포넌트 계약의 일부이며 jest-axe 스위트가 이를 다룹니다.',
              '**코드는 당신의 것입니다.** npm 패키지나 shadcn 호환 레지스트리로 설치하고 소스를 저장소에 두세요.',
            ],
          },
        ],
      },
      {
        heading: '누가 유지하는가',
        blocks: [
          {
            type: 'p',
            text: 'Slipstream UI는 [Michael McShinsky]({githubProfile})가 공개적으로 만들고 유지합니다. 이슈, 토론, 풀 리퀘스트는 [GitHub 저장소]({repo})에서 환영합니다.',
          },
          {
            type: 'p',
            text: '현재 버전: `v{version}`. 시맨틱 버전 관리를 따르며 CI에서 npm provenance와 함께 배포합니다.',
          },
        ],
      },
      {
        heading: '주장을 확인하는 방법',
        blocks: [
          {
            type: 'ul',
            items: [
              '[매니페스트를 읽고](/docs/ai-manifests) 컴포넌트 소스와 비교하세요.',
              '[MCP 서버를 실행하고](/docs/mcp) 일부러 망가뜨린 스니펫에 `validate_usage`를 호출하세요.',
              '[접근성 선언](/accessibility)과 자동 감사 범위를 검토하세요.',
              '[보안 정책]({repo}/blob/main/SECURITY.md)과 [security.txt](/.well-known/security.txt).',
            ],
          },
        ],
      },
    ],
  },
  contact: {
    title: '문의',
    description: '이메일, GitHub 또는 아래 양식으로 유지 관리자에게 연락하세요.',
    emailHeading: '이메일',
    issuesHeading: '이슈 및 토론',
    issuesBody: '버그와 기능 요청은 [GitHub]({repo}/issues)에 등록하는 것이 가장 좋습니다.',
    addressHeading: '우편 주소',
    formHeading: '메시지 보내기',
    nameLabel: '이름',
    emailLabel: '이메일',
    messageLabel: '메시지',
    send: '메시지 보내기',
    privacyNote: '메시지는 답변에만 사용합니다. 자세한 내용은 개인정보 처리방침을 참고하세요.',
    honeypotLabel: '이곳은 채우지 마세요:',
  },
  accessibility: {
    title: '접근성 선언',
    description:
      'Slipstream UI는 컴포넌트 라이브러리와 이 문서 사이트 모두 WCAG 2.2 레벨 AA를 목표로 합니다.',
    updated: '2026년 11월',
    sections: [
      {
        heading: '적합성 목표',
        blocks: [
          {
            type: 'p',
            text: '컴포넌트 라이브러리와 이 사이트는 [WCAG 2.2 레벨 AA](https://www.w3.org/TR/WCAG22/)에 맞춰 개발됩니다. 접근성 회귀는 개선이 아니라 버그로 취급합니다.',
          },
          {
            type: 'p',
            text: '이 선언은 자동 적합성 증거와 알려진 격차를 다룹니다. 완전한 수동 적합성을 주장하지 않습니다. 실제 사용자와의 보조 기술 테스트는 계속 진행 중입니다.',
          },
        ],
      },
      {
        heading: '라이브러리 테스트 방법',
        blocks: [
          {
            type: 'ul',
            items: [
              '**jest-axe 스위트**를 모든 컴포넌트에 두고 각 풀 리퀘스트에서 CI로 실행합니다.',
              '**키보드 동작**을 컴포넌트 계약의 일부로 구현합니다(복합 위젯의 roving tabindex, Escape/화살표 처리, 보이는 포커스 링).',
              '**동작 감소**를 스트리밍 표시기, 드로어, 대화상자, 스크롤 동작에서 존중합니다.',
              '**ARIA 계약**을 각 COMPONENT_MANIFEST에 문서화하고 에이전트가 MCP에서 보는 동일한 규칙으로 강제합니다.',
            ],
          },
          {
            type: 'p',
            text: '컴포넌트별 세부 내용은 [AI 생성 UI 접근성 가이드](/docs/guides/accessibility-ai)를 참고하세요.',
          },
        ],
      },
      {
        heading: '이 사이트의 테스트 방법',
        blocks: [
          {
            type: 'p',
            text: '문서 사이트는 릴리스 체크리스트의 일부로 주요 경로에 axe-core 자동 감사를 실행합니다. 감사는 WCAG 2.0/2.1/2.2 A 및 AA 규칙을 다루며 저장소에서 재현할 수 있습니다:',
          },
          {
            type: 'code',
            text: 'pnpm --filter slipstream-ui-docs build\npnpm --filter slipstream-ui-docs start -- -p 3111\npnpm --filter slipstream-ui-docs audit:a11y -- http://localhost:3111',
          },
          {
            type: 'p',
            text: '대상 경로: 홈, 문서 색인, 설치, 대표 컴포넌트 페이지, MCP, 템플릿, 변경 로그, 소개, 이 페이지, 문의, 법적 페이지. 각 경로는 **라이트와 다크 모드 모두**에서 감사됩니다. 2026년 11월 4일 스위트는 두 모드의 13개 경로를 모두 통과했고(26회 페이지 실행, 위반 0), Lighthouse는 샘플 경로에서 접근성 100을 보고했습니다.',
          },
          {
            type: 'p',
            text: '자동 도구는 일부 문제만 감지합니다. 읽기 순서, 작업 완료, 대체 텍스트 품질은 검증할 수 없습니다.',
          },
        ],
      },
      {
        heading: '알려진 제한',
        blocks: [
          {
            type: 'ul',
            items: [
              '완전한 수동 스크린리더 감사(Windows의 NVDA, macOS/iOS의 VoiceOver)는 아직 완료되지 않았습니다. 자동 커버리지는 대체물이 아닙니다.',
              '문서에서 링크된 타사 콘텐츠(GitHub, 외부 표준 페이지)는 당사 통제 밖입니다.',
              '일부 대화형 데모는 타이머로 스트리밍과 에이전트 동작을 흉내 냅니다. 설명용이며 키보드로 조작할 수 있지만 프로덕션 전송이 아닙니다.',
            ],
          },
        ],
      },
      {
        heading: '장벽 신고',
        blocks: [
          {
            type: 'p',
            text: '무언가 막힌다면 페이지, 사용한 보조 기술, 기대한 동작을 포함해 [이슈를 열어 주세요]({repo}/issues/new). 보안에 민감한 신고는 [보안 정책]({repo}/blob/main/SECURITY.md)을 따르세요. [{email}](mailto:{email})로 이메일도 가능합니다.',
          },
          { type: 'p', text: '접근성 신고는 영업일 기준 5일 이내에 접수 확인을 목표로 합니다.' },
        ],
      },
    ],
  },
  privacy: {
    title: '개인정보 처리방침',
    description:
      '요약: 테마 설정을 저장하고, 쿠키에 동의한 경우에만 트래픽을 측정하며, 광고나 교차 사이트 추적은 하지 않습니다.',
    updated: '2026년 11월',
    sections: [
      {
        heading: '기기에 저장하는 항목',
        blocks: [
          {
            type: 'ul',
            items: [
              '`slipstream-theme` — 라이트/다크 설정. 잘못된 테마가 깜빡이지 않게 합니다.',
              '`slipstream-consent` — 쿠키 선택. 다시 묻지 않게 합니다.',
            ],
          },
          { type: 'p', text: '두 값 모두 서버로 전송되지 않습니다. 사이트 데이터를 지우면 둘 다 초기화됩니다.' },
        ],
      },
      {
        heading: '분석',
        blocks: [
          {
            type: 'p',
            text: '분석은 **기본적으로 꺼져 있습니다**. “모두 허용”을 선택하면 개인정보 친화적 분석 스크립트를 불러와 집계된 페이지 조회(URL, 참조자, 대략적 기기/브라우저 정보)를 기록합니다. 광고 쿠키, 핑거프린팅, 교차 사이트 프로필은 사용하지 않습니다.',
          },
          {
            type: 'p',
            text: '브라우저에서 이 사이트의 데이터를 지우면 언제든 동의를 철회할 수 있습니다. 다음 방문 시 배너가 다시 나타납니다.',
          },
        ],
      },
      {
        heading: '문의 메시지',
        blocks: [
          {
            type: 'p',
            text: '문의 양식을 사용하면 제출한 이름, 이메일 주소, 메시지를 받습니다. 제출물은 호스팅 제공업체(Netlify Forms)가 처리하며 답변에만 사용합니다. 최대 24개월 보관합니다.',
          },
        ],
      },
      {
        heading: '타사 요청',
        blocks: [
          {
            type: 'p',
            text: '홈페이지는 브라우저에서 공개 GitHub API를 호출해 실시간 스타 수를 표시합니다. github.com에 대한 다른 요청과 마찬가지로 IP 주소와 사용자 에이전트가 GitHub의 정책에 따라 노출됩니다. 이 요청은 쿠키를 설정하지 않으며 다른 타사 리소스도 불러오지 않습니다.',
          },
        ],
      },
      {
        heading: '호스팅 로그',
        blocks: [
          {
            type: 'p',
            text: '호스팅 제공업체는 보안과 남용 방지를 위해 표준 요청 로그(IP 주소, 사용자 에이전트, 요청 URL)를 기록하며 자체 정책에 따라 보관합니다.',
          },
        ],
      },
      {
        heading: '하지 않는 일',
        blocks: [
          {
            type: 'ul',
            items: ['광고 또는 리타기팅 픽셀을 사용하지 않습니다.', '개인 데이터를 판매하거나 임대하지 않습니다.', '광고 프로필이나 교차 사이트 추적을 하지 않습니다.'],
          },
        ],
      },
      {
        heading: '당신의 권리',
        blocks: [
          {
            type: 'p',
            text: '거주 지역에 따라 당사가 보유한 개인 데이터에 접근, 정정, 내보내기, 삭제할 권리와 처리에 반대할 권리가 있을 수 있습니다. [{email}](mailto:{email})로 연락하면 30일 이내에 답변합니다. 지역 감독 기관에 불만을 제기할 수도 있습니다.',
          },
        ],
      },
      {
        heading: '아동',
        blocks: [{ type: 'p', text: '이 사이트는 개발자 리소스이며 16세 미만 아동을 대상으로 하지 않습니다.' }],
      },
      {
        heading: '변경',
        blocks: [
          {
            type: 'p',
            text: '관행이 바뀌면 이 페이지와 “최종 업데이트” 날짜를 갱신합니다. [이용 약관](/terms)도 참고하세요.',
          },
        ],
      },
      {
        heading: '문의',
        blocks: [{ type: 'p', text: '이 방침에 대한 질문: [{email}](mailto:{email}).' }],
      },
    ],
  },
  terms: {
    title: '이용 약관',
    description: '이 사이트와 Slipstream UI 패키지에 대한 알기 쉬운 약관입니다.',
    updated: '2026년 11월',
    sections: [
      {
        heading: '소프트웨어',
        blocks: [
          {
            type: 'p',
            text: 'Slipstream UI 패키지는 [MIT 라이선스]({repo}/blob/main/LICENSE)로 배포됩니다. 저작권 고지와 허가 고지를 포함하면 상업적으로 사용, 수정, 재배포할 수 있습니다. 이 페이지와 충돌하면 라이선스 본문이 우선합니다.',
          },
        ],
      },
      {
        heading: '보증 없음',
        blocks: [
          {
            type: 'p',
            text: '사이트, 문서, 매니페스트, MCP 도구, 패키지는 **있는 그대로** 제공되며 특정 목적 적합성을 포함해 명시적이든 묵시적이든 어떠한 보증도 없습니다. 생성된 코드 검토와 제품 결정은 당신의 책임입니다.',
          },
        ],
      },
      {
        heading: '허용되는 사용',
        blocks: [
          {
            type: 'ul',
            items: [
              '법을 위반하거나 권리를 침해하거나 악성코드를 배포하는 데 사이트를 사용하지 마세요.',
              '호스팅 인프라를 방해하거나 과부하시키지 마세요.',
              '수정한 패키지를 공식 릴리스로 가장하지 마세요.',
              '호스팅되는 모든 엔드포인트에는 속도 제한과 공정 사용 기대가 적용됩니다.',
            ],
          },
        ],
      },
      {
        heading: '책임 제한',
        blocks: [
          {
            type: 'p',
            text: '법이 허용하는 최대 범위에서 유지 관리자는 사이트나 패키지 사용으로 인한 간접적, 우발적, 결과적 손해 또는 이익이나 데이터 손실에 대해 책임지지 않습니다.',
          },
        ],
      },
      {
        heading: '타사 링크 및 서비스',
        blocks: [
          {
            type: 'p',
            text: '사이트는 GitHub, npm 및 기타 타사 서비스로 연결됩니다. 해당 서비스 이용에는 그들의 약관과 개인정보 방침이 적용됩니다.',
          },
        ],
      },
      {
        heading: '변경',
        blocks: [
          {
            type: 'p',
            text: '이 약관을 갱신할 수 있으며 “최종 업데이트” 날짜도 그에 따라 바뀝니다. 갱신 후 계속 사용하면 개정된 약관에 동의한 것으로 간주합니다.',
          },
        ],
      },
      {
        heading: '문의',
        blocks: [
          {
            type: 'p',
            text: '이 약관에 대한 질문: [{email}](mailto:{email}). [개인정보 처리방침](/privacy)도 참고하세요.',
          },
        ],
      },
    ],
  },
};
