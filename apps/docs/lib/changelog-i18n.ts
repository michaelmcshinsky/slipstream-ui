import type { Locale } from '@slipstream-ui/i18n';

export type ChangelogUi = {
  title: string;
  intro: string;
  current: string;
  previous: string;
  archiveNote: string;
  installHeading: string;
  date05: string;
  release05: string[];
};

const en: ChangelogUi = {
  title: 'Changelog',
  intro: 'Release notes for Slipstream UI. Versions follow semver.',
  current: 'current',
  previous: 'previous',
  archiveNote: '',
  installHeading: 'Install',
  date05: 'November 2026',
  release05: [
    'Validation benchmark: 100 cases across 7 defect classes and 4 conditions, with a published baseline of 65.7% structural recall, 100% precision and 0 false positives on valid cases',
    'Tailwind CSS v4: a CSS-first theme contract in @slipstream-ui/themes plus a cross-platform compile fixture that verifies semantic utilities against the real component sources',
    'New @slipstream-ui/i18n 0.3.0: typed English/Arabic/Spanish/Korean/Japanese/Russian/Chinese catalogs, RTL direction, plural selection, Intl number/date formatters and a client-only React entry',
    'AI Chat Starter: streaming, reasoning, tool calls, human approvals, citations, local history and consent-gated analytics, fully localized in seven languages',
    'Localized labels for Button, Pagination, DataTable, Dialog, Drawer, Reasoning and ToolCall; no component is forced into a client boundary for i18n',
    'Manifest parity: 8 real TypeScript/manifest drifts fixed; a component coverage gate now verifies tests, examples, accessibility notes and docs for all 80 components',
    'Deterministic registry generation across Windows and Linux (sorted files, LF-normalized embedded content, no commit SHA) plus an LLM documentation audit',
    'MCP registry metadata: server.json, matching mcpName, and @slipstream-ui/mcp-server 0.3.0; registry payloads at 0.2.1',
    'Docs, dashboard and playground locale shells with a shared language switcher; compatibility matrix and Tailwind v4 migration guide',
    'Verified: typecheck 17/17, lint 10/10, tests 13/13, build 12/12, axe 26/26 page runs, and 7 installable package tarballs',
  ],
};

export const CHANGELOG_UI: Record<Locale, ChangelogUi> = {
  en,
  ar: {
    title: 'سجل التغييرات',
    intro: 'ملاحظات الإصدار لـ Slipstream UI. تتبع الإصدارات semver.',
    current: 'الحالي',
    previous: 'السابق',
    archiveNote: 'تُعرض إدخالات الإصدارات الأقدم بالإنجليزية.',
    installHeading: 'التثبيت',
    date05: 'نوفمبر 2026',
    release05: [
      'مقياس التحقق: 100 حالة عبر 7 فئات أخطاء و4 شروط، مع خط أساس منشور بدقة استدعاء هيكلية 65.7% ودقة 100% و0 إيجابيات كاذبة في الحالات الصحيحة',
      'Tailwind CSS v4: عقد سمة CSS-first في @slipstream-ui/themes مع أداة تحقق متعددة المنصات تتحقق من الأدوات الدلالية مقابل مصادر المكوّنات الفعلية',
      'حزمة @slipstream-ui/i18n 0.3.0 الجديدة: قوائم إنجليزية/عربية/إسبانية/كورية/يابانية/روسية/صينية، اتجاه RTL، صيغ الجمع، منسّقات Intl للأرقام والتواريخ، ونقطة دخول React للعميل فقط',
      'AI Chat Starter: بث، استدلال، استدعاءات أدوات، موافقات بشرية، اقتباسات، سجل محلي وتحليلات بموافقة، مترجم بالكامل إلى سبع لغات',
      'تسميات مترجمة لـ Button وPagination وDataTable وDialog وDrawer وReasoning وToolCall؛ لا يُجبر أي مكوّن على حدود العميل بسبب i18n',
      'تطابق البيانات الوصفية: إصلاح 8 انحرافات حقيقية بين TypeScript والبيان؛ وبوابة تغطية تتحقق من الاختبارات والأمثلة وملاحظات الوصول والتوثيق لجميع المكوّنات الثمانين',
      'توليد سجل حتمي عبر Windows وLinux (ملفات مرتبة، محتوى LF موحّد، بلا SHA للالتزام) بالإضافة إلى تدقيق توثيق LLM',
      'بيانات سجل MCP: server.json وmcpName متطابق و@slipstream-ui/mcp-server 0.3.0؛ حِزم السجل 0.2.1',
      'قشور لغات لموقع المستندات ولوحة التحكم والملعب مع مبدّل لغة مشترك؛ مصفوفة توافق ودليل ترحيل Tailwind v4',
      'تم التحقق: typecheck 17/17، lint 10/10، tests 13/13، build 12/12، axe 26/26، و7 حزم قابلة للتثبيت',
    ],
  },
  es: {
    title: 'Registro de cambios',
    intro: 'Notas de versión de Slipstream UI. Las versiones siguen semver.',
    current: 'actual',
    previous: 'anterior',
    archiveNote: 'Las entradas de versiones anteriores se muestran en inglés.',
    installHeading: 'Instalar',
    date05: 'noviembre de 2026',
    release05: [
      'Evaluación de validación: 100 casos en 7 clases de defectos y 4 condiciones, con una línea base publicada de 65,7% de recall estructural, 100% de precisión y 0 falsos positivos en casos válidos',
      'Tailwind CSS v4: contrato de tema CSS-first en @slipstream-ui/themes y una prueba de compilación multiplataforma que verifica las utilidades semánticas contra las fuentes reales',
      'Nuevo @slipstream-ui/i18n 0.3.0: catálogos tipados en inglés/árabe/español/coreano/japonés/ruso/chino, dirección RTL, plurales, formateadores Intl y entrada React solo-cliente',
      'AI Chat Starter: streaming, razonamiento, herramientas, aprobaciones humanas, citas, historial local y analítica con consentimiento, totalmente localizado en siete idiomas',
      'Etiquetas localizadas para Button, Pagination, DataTable, Dialog, Drawer, Reasoning y ToolCall; ningún componente se fuerza a cliente por i18n',
      'Paridad de manifiestos: 8 desviaciones reales corregidas; una puerta de cobertura verifica pruebas, ejemplos, accesibilidad y documentación de los 80 componentes',
      'Generación de registro determinista en Windows y Linux (archivos ordenados, contenido LF, sin SHA de commit) y auditoría de documentación LLM',
      'Metadatos del registro MCP: server.json, mcpName coincidente y @slipstream-ui/mcp-server 0.3.0; payloads de registro 0.2.1',
      'Shells de idioma en docs, dashboard y playground con selector compartido; matriz de compatibilidad y guía de migración a Tailwind v4',
      'Verificado: typecheck 17/17, lint 10/10, tests 13/13, build 12/12, axe 26/26 y 7 paquetes instalables',
    ],
  },
  ko: {
    title: '변경 로그',
    intro: 'Slipstream UI 릴리스 노트입니다. 버전은 semver를 따릅니다.',
    current: '현재',
    previous: '이전',
    archiveNote: '이전 릴리스 항목은 영어로 표시됩니다.',
    installHeading: '설치',
    date05: '2026년 11월',
    release05: [
      '검증 벤치마크: 7개 결함 클래스와 4개 조건에 걸친 100개 사례, 구조적 재현율 65.7%, 정밀도 100%, 유효 사례 오탐 0의 공개 기준선',
      'Tailwind CSS v4: @slipstream-ui/themes의 CSS 우선 테마 계약과 실제 컴포넌트 소스에 대해 의미 유틸리티를 검증하는 크로스 플랫폼 컴파일 픽스처',
      '새 @slipstream-ui/i18n 0.3.0: 영어/아랍어/스페인어/한국어/일본어/러시아어/중국어 타입 카탈로그, RTL 방향, 복수형, Intl 숫자/날짜 포맷터, 클라이언트 전용 React 진입점',
      'AI Chat Starter: 스트리밍, 추론, 도구 호출, 인간 승인, 인용, 로컬 기록, 동의 기반 분석을 7개 언어로 완전히 현지화',
      'Button, Pagination, DataTable, Dialog, Drawer, Reasoning, ToolCall의 현지화 레이블; i18n 때문에 클라이언트 경계로 강제되는 컴포넌트 없음',
      '매니페스트 동등성: 실제 TypeScript/매니페스트 드리프트 8건 수정; 80개 컴포넌트의 테스트, 예제, 접근성, 문서를 검증하는 커버리지 게이트',
      'Windows와 Linux에서 결정적인 레지스트리 생성(정렬된 파일, LF 정규화, 커밋 SHA 제거)과 LLM 문서 감사',
      'MCP 레지스트리 메타데이터: server.json, 일치하는 mcpName, @slipstream-ui/mcp-server 0.3.0; 레지스트리 페이로드 0.2.1',
      '문서, 대시보드, 플레이그라운드의 로케일 셸과 공유 언어 전환기; 호환성 매트릭스와 Tailwind v4 마이그레이션 가이드',
      '검증: typecheck 17/17, lint 10/10, tests 13/13, build 12/12, axe 26/26, 설치 가능한 패키지 7개',
    ],
  },
  ja: {
    title: '変更履歴',
    intro: 'Slipstream UI のリリースノート。バージョンは semver に従います。',
    current: '最新',
    previous: '以前',
    archiveNote: '以前のリリース項目は英語で表示されます。',
    installHeading: 'インストール',
    date05: '2026年11月',
    release05: [
      '検証ベンチマーク: 7つの欠陥クラスと4つの条件にわたる100ケース。構造的再現率65.7%、適合率100%、有効ケースの誤検出0という公開ベースライン',
      'Tailwind CSS v4: @slipstream-ui/themes のCSSファーストテーマ契約と、実際のコンポーネントソースに対してセマンティックユーティリティを検証するクロスプラットフォームコンパイルフィクスチャ',
      '新しい @slipstream-ui/i18n 0.3.0: 英語/アラビア語/スペイン語/韓国語/日本語/ロシア語/中国語の型付きカタログ、RTL、複数形、Intl数値/日付フォーマッター、クライアント専用Reactエントリー',
      'AI Chat Starter: ストリーミング、推論、ツール呼び出し、人間の承認、引用、ローカル履歴、同意ベースの分析を7言語に完全ローカライズ',
      'Button、Pagination、DataTable、Dialog、Drawer、Reasoning、ToolCall のローカライズされたラベル。i18nのためにクライアント境界を強制されるコンポーネントはありません',
      'マニフェスト整合性: 実際のTypeScript/マニフェストのドリフト8件を修正。80コンポーネントのテスト、例、アクセシビリティ、ドキュメントを検証するカバレッジゲート',
      'WindowsとLinuxで決定論的なレジストリ生成(ファイルソート、LF正規化、コミットSHA削除)とLLMドキュメント監査',
      'MCPレジストリメタデータ: server.json、一致するmcpName、@slipstream-ui/mcp-server 0.3.0、レジストリペイロード0.2.1',
      'ドキュメント、ダッシュボード、プレイグラウンドのロケールシェルと共有言語スイッチャー。互換性マトリックスとTailwind v4移行ガイド',
      '検証済み: typecheck 17/17、lint 10/10、tests 13/13、build 12/12、axe 26/26、インストール可能なパッケージ7件',
    ],
  },
  ru: {
    title: 'История изменений',
    intro: 'Примечания к выпускам Slipstream UI. Версии следуют semver.',
    current: 'текущий',
    previous: 'предыдущий',
    archiveNote: 'Записи о предыдущих выпусках показаны на английском.',
    installHeading: 'Установка',
    date05: 'ноябрь 2026 г.',
    release05: [
      'Бенчмарк валидации: 100 кейсов по 7 классам дефектов и 4 условиям; опубликованная база — 65,7% структурной полноты, 100% точности и 0 ложных срабатываний на валидных кейсах',
      'Tailwind CSS v4: CSS-first контракт темы в @slipstream-ui/themes и кросс-платформенная компиляционная проверка семантических утилит на реальных исходниках компонентов',
      'Новый @slipstream-ui/i18n 0.3.0: типизированные каталоги en/ar/es/ko/ja/ru/zh, RTL, множественные формы, форматтеры Intl и клиентская точка входа React',
      'AI Chat Starter: потоковая передача, рассуждения, вызовы инструментов, подтверждения, цитаты, локальная история и аналитика с согласием — полностью локализован на 7 языков',
      'Локализованные подписи для Button, Pagination, DataTable, Dialog, Drawer, Reasoning и ToolCall; ни один компонент не переводится в клиентский только из-за i18n',
      'Соответствие манифестов: исправлено 8 реальных расхождений TypeScript/манифест; проверка покрытия тестами, примерами, доступностью и документацией для всех 80 компонентов',
      'Детерминированная генерация реестра в Windows и Linux (сортировка файлов, нормализация LF, без SHA коммита) и аудит LLM-документации',
      'Метаданные реестра MCP: server.json, совпадающий mcpName и @slipstream-ui/mcp-server 0.3.0; полезные нагрузки реестра 0.2.1',
      'Языковые оболочки docs, dashboard и playground с общим переключателем; матрица совместимости и руководство по миграции на Tailwind v4',
      'Проверено: typecheck 17/17, lint 10/10, tests 13/13, build 12/12, axe 26/26, 7 устанавливаемых пакетов',
    ],
  },
  zh: {
    title: '更新日志',
    intro: 'Slipstream UI 发布说明。版本遵循 semver。',
    current: '当前',
    previous: '以前',
    archiveNote: '较早的发布条目以英文显示。',
    installHeading: '安装',
    date05: '2026年11月',
    release05: [
      '验证基准：覆盖 7 类缺陷和 4 种条件的 100 个用例，公布基线为结构召回率 65.7%、精确率 100%、有效用例 0 误报',
      'Tailwind CSS v4：@slipstream-ui/themes 中的 CSS-first 主题契约，以及针对真实组件源码验证语义工具类的跨平台编译夹具',
      '全新 @slipstream-ui/i18n 0.3.0：英/阿/西/韩/日/俄/中类型化词典、RTL 方向、复数、Intl 数字/日期格式化器以及仅客户端 React 入口',
      'AI Chat Starter：流式传输、推理、工具调用、人工审批、引用、本地历史和同意式分析，已完整本地化为 7 种语言',
      'Button、Pagination、DataTable、Dialog、Drawer、Reasoning 和 ToolCall 的本地化标签；没有组件因 i18n 被迫进入客户端边界',
      '清单一致性：修复 8 处真实的 TypeScript/清单偏差；覆盖门禁验证全部 80 个组件的测试、示例、可访问性和文档',
      'Windows 与 Linux 上的确定性注册表生成（文件排序、LF 规范化、移除提交 SHA）以及 LLM 文档审计',
      'MCP 注册表元数据：server.json、匹配的 mcpName 和 @slipstream-ui/mcp-server 0.3.0；注册表载荷 0.2.1',
      '文档、仪表板和演练场的语言外壳与共享语言切换器；兼容性矩阵和 Tailwind v4 迁移指南',
      '已验证：typecheck 17/17、lint 10/10、tests 13/13、build 12/12、axe 26/26，以及 7 个可安装包',
    ],
  },
};

export function getChangelogUi(locale: Locale): ChangelogUi {
  return CHANGELOG_UI[locale] ?? en;
}
