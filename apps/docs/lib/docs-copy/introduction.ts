import type { DocsCopyByLocale } from './types';

/** Code blocks are identifiers and comments — identical in every locale. */
const ARCHITECTURE_CODE = `source + manifest + tests
      │
      ├─ pnpm validate:manifests   # schema + TypeScript↔manifest drift
      ├─ pnpm generate:registry    # /registry/*.json (shadcn-compatible)
      ├─ pnpm generate:llm-docs    # /llm/*.md, llms.txt, README stats
      └─ MCP server                # queries the same manifests at runtime`;

const QUICKSTART_CODE = `# Packages
pnpm add @slipstream-ui/core @slipstream-ui/ai

# Or install source copies via the registry
npx shadcn@latest add https://slipstreamui.com/registry/message.json`;

const architectureCode = { kind: 'code', language: 'text', code: ARCHITECTURE_CODE } as const;
const quickstartCode = { kind: 'code', language: 'bash', code: QUICKSTART_CODE } as const;

export const introduction: DocsCopyByLocale = {
  en: {
    banner: [
      '{componentCount} components, MCP ',
      { code: 'validate_usage' },
      ', streaming-safe Response, and a shadcn-compatible registry.',
    ],
    whatsNew: "What's new →",
    title: 'Introduction',
    lead: [
      'Slipstream UI is an AI-first React component library. Every component ships with a ',
      { code: 'COMPONENT_MANIFEST' },
      ' — a machine-readable specification that lets coding agents like Claude, Cursor, and Copilot generate correct UI the first time.',
    ],
    blocks: [
      { kind: 'h2', text: 'What makes it different?' },
      {
        kind: 'p',
        parts: [
          'Traditional libraries document for humans and hope models figure it out from training data — which is where hallucinated props come from. Slipstream documents for both of you: humans get this site, agents get manifests over MCP, canonical markdown routes, and a ',
          { code: 'validate_usage' },
          ' tool that checks their output before it ships.',
        ],
      },
      { kind: 'h2', text: 'Architecture' },
      {
        kind: 'p',
        parts: [
          'One monorepo ships seven published packages and two reference apps. Components live in ',
          { code: 'packages/core' },
          ' and ',
          { code: 'packages/ai' },
          '; theming lives in ',
          { code: '@slipstream-ui/themes' },
          '. Every component flows through the same pipeline, and CI enforces it:',
        ],
      },
      architectureCode,
      {
        kind: 'ul',
        items: [
          [
            { code: '@slipstream-ui/core' },
            ' — {coreComponentCount} components: atoms, molecules, overlays, forms, data display, app/marketing chrome, content typography',
          ],
          [
            { code: '@slipstream-ui/ai' },
            ' — {aiComponentCount} AI chat and agent components (stateless; you own state and transport)',
          ],
          [
            { code: '@slipstream-ui/themes' },
            ' — createTheme() and presets over a CSS-variable token contract',
          ],
          [
            { code: '@slipstream-ui/cli' },
            ', ',
            { code: '@slipstream-ui/registry' },
            ', ',
            { code: '@slipstream-ui/mcp-server' },
            ', ',
            { code: '@slipstream-ui/i18n' },
            ' — install, registry, agent, and locale helpers sharing the same manifests',
          ],
          [
            { strong: 'apps/docs · apps/app · apps/playground' },
            ' — the docs you are reading and a reference dashboard, both built with this library',
          ],
        ],
      },
      { kind: 'h2', text: 'Start here' },
      {
        kind: 'ol',
        items: [
          [
            { strong: '1. Install.' },
            ' Follow the five-step ',
            { link: { href: '/docs/getting-started', text: 'quickstart' } },
            ' for a themed screen, or read the ',
            { link: { href: '/docs/installation', text: 'installation guide' } },
            ' for packages, CLI, and registry tradeoffs.',
          ],
          [
            { strong: '2. Read one manifest.' },
            ' Open ',
            { link: { href: '/docs/ai-manifests', text: 'COMPONENT_MANIFEST' } },
            ' to see the prop schema, anti-patterns, and accessibility rules your agent will read.',
          ],
          [
            { strong: '3. Wire up the agent loop.' },
            ' Connect the ',
            { link: { href: '/docs/mcp', text: 'MCP server' } },
            ' and call ',
            { code: 'validate_usage' },
            ' before generated JSX reaches your editor.',
          ],
        ],
      },
      { kind: 'h2', text: 'Quick start' },
      quickstartCode,
      {
        kind: 'p',
        parts: [
          'Full setup instructions live under ',
          { link: { href: '/docs/installation', text: 'Installation' } },
          '.',
        ],
      },
      { kind: 'h2', text: 'Explore' },
      {
        kind: 'cards',
        items: [
          {
            href: '/docs/installation',
            title: 'Installation',
            body: 'Packages, CLI, or shadcn-compatible registry — pick your workflow.',
            index: '01',
          },
          {
            href: '/docs/ai-manifests',
            title: 'COMPONENT_MANIFEST',
            body: 'The machine-readable spec behind every component: props, anti-patterns, a11y.',
            index: '02',
          },
          {
            href: '/docs/components',
            title: 'Components',
            body: '{componentCount} components across core and AI interaction surfaces.',
            index: '03',
          },
          {
            href: '/docs/templates',
            title: 'Templates',
            body: 'Complete copy-paste patterns: streaming chat, agent dashboard, RAG citations.',
            index: '04',
          },
        ],
      },
      { kind: 'h2', text: 'Versioning & Stability' },
      {
        kind: 'p',
        parts: [
          'Slipstream UI follows ',
          { strong: 'semantic versioning' },
          '. The current major version is ',
          { strong: '0.x' },
          ', meaning the API may change between minor releases as the library matures toward 1.0.',
        ],
      },
      {
        kind: 'ul',
        items: [
          [
            { strong: 'Patch (0.x.y):' },
            ' Bug fixes, accessibility improvements, documentation updates. No API changes.',
          ],
          [
            { strong: 'Minor (0.x.0):' },
            ' New components, new props, new tokens. Existing props and components remain backward-compatible unless marked deprecated.',
          ],
          [
            { strong: 'Major (1.0.0):' },
            ' Stable API guarantee. After 1.0, breaking changes only in major releases with a migration guide.',
          ],
        ],
      },
      {
        kind: 'p',
        parts: [
          'Every component ships a ',
          { code: 'COMPONENT_MANIFEST' },
          ' with a ',
          { code: 'version' },
          ' field. The manifest schema is validated in CI — prop schemas, TypeScript types, and manifests are checked for drift on every commit.',
        ],
      },
      {
        kind: 'p',
        parts: [
          { strong: 'Accessibility:' },
          ' All components pass ',
          { code: 'jest-axe' },
          ' automated checks and support keyboard navigation, screen readers, and reduced-motion preferences. Accessibility regressions are treated as bugs.',
        ],
      },
      { kind: 'h2', text: 'For agent builders' },
      {
        kind: 'p',
        parts: [
          'If you are wiring an agent into Slipstream, start with ',
          { link: { href: '/docs/mcp', text: 'the MCP server' } },
          ', the ',
          { link: { href: '/llm/index.md', text: 'canonical markdown index' } },
          ', or ',
          { link: { href: '/docs/ai-manifests', text: 'the manifest schema' } },
          '. Every component page also links its own markdown reference in the header.',
        ],
      },
    ],
  },

  es: {
    banner: [
      '{componentCount} componentes, ',
      { code: 'validate_usage' },
      ' por MCP, Response seguro en streaming y un registro compatible con shadcn.',
    ],
    whatsNew: 'Novedades →',
    title: 'Introducción',
    lead: [
      'Slipstream UI es una biblioteca de componentes React pensada para la IA. Cada componente incluye un ',
      { code: 'COMPONENT_MANIFEST' },
      ' — una especificación legible por máquina que permite a agentes de código como Claude, Cursor y Copilot generar la interfaz correcta a la primera.',
    ],
    blocks: [
      { kind: 'h2', text: '¿Qué la hace diferente?' },
      {
        kind: 'p',
        parts: [
          'Las bibliotecas tradicionales documentan para humanos y esperan que los modelos lo deduzcan de los datos de entrenamiento: de ahí vienen las props inventadas. Slipstream documenta para ambos: los humanos tienen este sitio, y los agentes tienen manifiestos por MCP, rutas markdown canónicas y la herramienta ',
          { code: 'validate_usage' },
          ' que comprueba su salida antes de publicarse.',
        ],
      },
      { kind: 'h2', text: 'Arquitectura' },
      {
        kind: 'p',
        parts: [
          'Un monorepo publica siete paquetes y dos aplicaciones de referencia. Los componentes viven en ',
          { code: 'packages/core' },
          ' y ',
          { code: 'packages/ai' },
          '; el tematizado vive en ',
          { code: '@slipstream-ui/themes' },
          '. Cada componente pasa por la misma tubería y CI la hace cumplir:',
        ],
      },
      architectureCode,
      {
        kind: 'ul',
        items: [
          [
            { code: '@slipstream-ui/core' },
            ' — {coreComponentCount} componentes: átomos, moléculas, superposiciones, formularios, visualización de datos, chrome de aplicación y marketing, tipografía de contenido',
          ],
          [
            { code: '@slipstream-ui/ai' },
            ' — {aiComponentCount} componentes de chat y agentes de IA (sin estado; tú controlas el estado y el transporte)',
          ],
          [
            { code: '@slipstream-ui/themes' },
            ' — createTheme() y presets sobre un contrato de tokens con variables CSS',
          ],
          [
            { code: '@slipstream-ui/cli' },
            ', ',
            { code: '@slipstream-ui/registry' },
            ', ',
            { code: '@slipstream-ui/mcp-server' },
            ', ',
            { code: '@slipstream-ui/i18n' },
            ' — helpers de instalación, registro, agentes e idioma que comparten los mismos manifiestos',
          ],
          [
            { strong: 'apps/docs · apps/app · apps/playground' },
            ' — la documentación que estás leyendo y un panel de referencia, ambos construidos con esta biblioteca',
          ],
        ],
      },
      { kind: 'h2', text: 'Empieza aquí' },
      {
        kind: 'ol',
        items: [
          [
            { strong: '1. Instala.' },
            ' Sigue el ',
            { link: { href: '/docs/getting-started', text: 'inicio rápido' } },
            ' de cinco pasos para una pantalla tematizada, o lee la ',
            { link: { href: '/docs/installation', text: 'guía de instalación' } },
            ' para conocer los paquetes, la CLI y las ventajas del registro.',
          ],
          [
            { strong: '2. Lee un manifiesto.' },
            ' Abre ',
            { link: { href: '/docs/ai-manifests', text: 'COMPONENT_MANIFEST' } },
            ' para ver el esquema de props, los antipatrones y las reglas de accesibilidad que leerá tu agente.',
          ],
          [
            { strong: '3. Conecta el bucle del agente.' },
            ' Conecta el ',
            { link: { href: '/docs/mcp', text: 'servidor MCP' } },
            ' y llama a ',
            { code: 'validate_usage' },
            ' antes de que el JSX generado llegue a tu editor.',
          ],
        ],
      },
      { kind: 'h2', text: 'Inicio rápido' },
      quickstartCode,
      {
        kind: 'p',
        parts: [
          'Las instrucciones completas de configuración están en ',
          { link: { href: '/docs/installation', text: 'Instalación' } },
          '.',
        ],
      },
      { kind: 'h2', text: 'Explora' },
      {
        kind: 'cards',
        items: [
          {
            href: '/docs/installation',
            title: 'Instalación',
            body: 'Paquetes, CLI o registro compatible con shadcn: elige tu flujo de trabajo.',
            index: '01',
          },
          {
            href: '/docs/ai-manifests',
            title: 'COMPONENT_MANIFEST',
            body: 'La especificación legible por máquina detrás de cada componente: props, antipatrones, a11y.',
            index: '02',
          },
          {
            href: '/docs/components',
            title: 'Componentes',
            body: '{componentCount} componentes entre las superficies del núcleo y de interacción con IA.',
            index: '03',
          },
          {
            href: '/docs/templates',
            title: 'Plantillas',
            body: 'Patrones completos para copiar y pegar: chat en streaming, panel de agentes, citas RAG.',
            index: '04',
          },
        ],
      },
      { kind: 'h2', text: 'Versionado y estabilidad' },
      {
        kind: 'p',
        parts: [
          'Slipstream UI sigue el ',
          { strong: 'versionado semántico' },
          '. La versión mayor actual es ',
          { strong: '0.x' },
          ', lo que significa que la API puede cambiar entre versiones menores mientras la biblioteca madura hacia la 1.0.',
        ],
      },
      {
        kind: 'ul',
        items: [
          [
            { strong: 'Patch (0.x.y):' },
            ' Corrección de errores, mejoras de accesibilidad y actualizaciones de la documentación. Sin cambios de API.',
          ],
          [
            { strong: 'Minor (0.x.0):' },
            ' Nuevos componentes, props y tokens. Las props y los componentes existentes siguen siendo compatibles hacia atrás salvo que se marquen como obsoletos.',
          ],
          [
            { strong: 'Major (1.0.0):' },
            ' Garantía de API estable. A partir de la 1.0, los cambios incompatibles solo llegan en versiones mayores y con una guía de migración.',
          ],
        ],
      },
      {
        kind: 'p',
        parts: [
          'Cada componente incluye un ',
          { code: 'COMPONENT_MANIFEST' },
          ' con un campo ',
          { code: 'version' },
          '. El esquema del manifiesto se valida en CI: los esquemas de props, los tipos de TypeScript y los manifiestos se comprueban en busca de divergencias en cada commit.',
        ],
      },
      {
        kind: 'p',
        parts: [
          { strong: 'Accesibilidad:' },
          ' Todos los componentes pasan las comprobaciones automáticas de ',
          { code: 'jest-axe' },
          ' y admiten navegación por teclado, lectores de pantalla y preferencias de movimiento reducido. Las regresiones de accesibilidad se tratan como errores.',
        ],
      },
      { kind: 'h2', text: 'Para quienes construyen agentes' },
      {
        kind: 'p',
        parts: [
          'Si estás conectando un agente a Slipstream, empieza por ',
          { link: { href: '/docs/mcp', text: 'el servidor MCP' } },
          ', el ',
          { link: { href: '/llm/index.md', text: 'índice markdown canónico' } },
          ' o ',
          { link: { href: '/docs/ai-manifests', text: 'el esquema del manifiesto' } },
          '. Cada página de componente también enlaza su propia referencia markdown en el encabezado.',
        ],
      },
    ],
  },

  zh: {
    banner: [
      '{componentCount} 个组件、MCP ',
      { code: 'validate_usage' },
      '、支持流式输出的 Response，以及兼容 shadcn 的 registry。',
    ],
    whatsNew: '最新动态 →',
    title: '简介',
    lead: [
      'Slipstream UI 是一个面向 AI 的 React 组件库。每个组件都附带 ',
      { code: 'COMPONENT_MANIFEST' },
      ' —— 一份机器可读的规范，让 Claude、Cursor、Copilot 等编码代理第一次就能生成正确的 UI。',
    ],
    blocks: [
      { kind: 'h2', text: '有何不同？' },
      {
        kind: 'p',
        parts: [
          '传统库为人类编写文档，然后指望模型从训练数据中自行推断 —— 幻觉 props 正是由此而来。Slipstream 同时为两者编写文档：人类获得本站点，代理通过 MCP 获得 manifest、规范的 markdown 路由，以及在输出上线前进行检查的 ',
          { code: 'validate_usage' },
          ' 工具。',
        ],
      },
      { kind: 'h2', text: '架构' },
      {
        kind: 'p',
        parts: [
          '一个 monorepo 发布七个包和两个参考应用。组件位于 ',
          { code: 'packages/core' },
          ' 和 ',
          { code: 'packages/ai' },
          '；主题位于 ',
          { code: '@slipstream-ui/themes' },
          '。每个组件都经过同一条流水线，并由 CI 强制执行：',
        ],
      },
      architectureCode,
      {
        kind: 'ul',
        items: [
          [
            { code: '@slipstream-ui/core' },
            ' — {coreComponentCount} 个组件：原子、分子、浮层、表单、数据展示、应用/营销 chrome、内容排版',
          ],
          [
            { code: '@slipstream-ui/ai' },
            ' — {aiComponentCount} 个 AI 聊天与代理组件（无状态；状态与传输由你掌控）',
          ],
          [
            { code: '@slipstream-ui/themes' },
            ' — createTheme() 以及基于 CSS 变量令牌契约的预设',
          ],
          [
            { code: '@slipstream-ui/cli' },
            '、',
            { code: '@slipstream-ui/registry' },
            '、',
            { code: '@slipstream-ui/mcp-server' },
            '、',
            { code: '@slipstream-ui/i18n' },
            ' — 共享同一套 manifest 的安装、注册表、代理与本地化辅助工具',
          ],
          [
            { strong: 'apps/docs · apps/app · apps/playground' },
            ' — 你正在阅读的文档站与参考仪表盘，两者都用这个库构建',
          ],
        ],
      },
      { kind: 'h2', text: '从这里开始' },
      {
        kind: 'ol',
        items: [
          [
            { strong: '1. 安装。' },
            ' 按照五步',
            { link: { href: '/docs/getting-started', text: '快速入门' } },
            '获得带主题的页面，或阅读',
            { link: { href: '/docs/installation', text: '安装指南' } },
            '了解包、CLI 与 registry 的取舍。',
          ],
          [
            { strong: '2. 阅读一个 manifest。' },
            ' 打开 ',
            { link: { href: '/docs/ai-manifests', text: 'COMPONENT_MANIFEST' } },
            '，查看代理将读取的 prop 模式、反模式和可访问性规则。',
          ],
          [
            { strong: '3. 接入代理循环。' },
            ' 连接',
            { link: { href: '/docs/mcp', text: 'MCP 服务器' } },
            '，并在生成的 JSX 进入编辑器之前调用 ',
            { code: 'validate_usage' },
            '。',
          ],
        ],
      },
      { kind: 'h2', text: '快速开始' },
      quickstartCode,
      {
        kind: 'p',
        parts: [
          '完整设置说明见 ',
          { link: { href: '/docs/installation', text: '安装' } },
          '。',
        ],
      },
      { kind: 'h2', text: '探索' },
      {
        kind: 'cards',
        items: [
          {
            href: '/docs/installation',
            title: '安装',
            body: '包、CLI 或兼容 shadcn 的 registry —— 选择你的工作流。',
            index: '01',
          },
          {
            href: '/docs/ai-manifests',
            title: 'COMPONENT_MANIFEST',
            body: '每个组件背后的机器可读规范：props、反模式、可访问性。',
            index: '02',
          },
          {
            href: '/docs/components',
            title: '组件',
            body: '核心与 AI 交互表面共 {componentCount} 个组件。',
            index: '03',
          },
          {
            href: '/docs/templates',
            title: '模板',
            body: '完整可复制模式：流式聊天、代理仪表盘、RAG 引用。',
            index: '04',
          },
        ],
      },
      { kind: 'h2', text: '版本与稳定性' },
      {
        kind: 'p',
        parts: [
          'Slipstream UI 遵循',
          { strong: '语义化版本' },
          '。当前主版本为 ',
          { strong: '0.x' },
          '，意味着在库走向 1.0 的过程中，API 可能在次要版本之间发生变化。',
        ],
      },
      {
        kind: 'ul',
        items: [
          [
            { strong: 'Patch (0.x.y)：' },
            ' 错误修复、可访问性改进、文档更新。无 API 变更。',
          ],
          [
            { strong: 'Minor (0.x.0)：' },
            ' 新组件、新 props、新令牌。现有 props 和组件保持向后兼容，除非标记为弃用。',
          ],
          [
            { strong: 'Major (1.0.0)：' },
            ' 稳定 API 保证。1.0 之后，破坏性变更仅出现在主版本中，并附带迁移指南。',
          ],
        ],
      },
      {
        kind: 'p',
        parts: [
          '每个组件都附带带有 ',
          { code: 'version' },
          ' 字段的 ',
          { code: 'COMPONENT_MANIFEST' },
          '。manifest 模式在 CI 中验证 —— prop 模式、TypeScript 类型和 manifest 在每次提交时检查漂移。',
        ],
      },
      {
        kind: 'p',
        parts: [
          { strong: '可访问性：' },
          ' 所有组件都通过 ',
          { code: 'jest-axe' },
          ' 自动检查，并支持键盘导航、屏幕阅读器和减少动画偏好。可访问性回归被视为缺陷。',
        ],
      },
      { kind: 'h2', text: '面向代理构建者' },
      {
        kind: 'p',
        parts: [
          '如果你正在将代理接入 Slipstream，请从',
          { link: { href: '/docs/mcp', text: 'MCP 服务器' } },
          '、',
          { link: { href: '/llm/index.md', text: '规范的 markdown 索引' } },
          '或',
          { link: { href: '/docs/ai-manifests', text: 'manifest 模式' } },
          '开始。每个组件页面的页眉也链接了自己的 markdown 参考。',
        ],
      },
    ],
  },

  ja: {
    banner: [
      '{componentCount} コンポーネント、MCP の ',
      { code: 'validate_usage' },
      '、ストリーミング対応の Response、shadcn 互換レジストリ。',
    ],
    whatsNew: '新着情報 →',
    title: 'はじめに',
    lead: [
      'Slipstream UI は AI ファーストの React コンポーネントライブラリです。すべてのコンポーネントには ',
      { code: 'COMPONENT_MANIFEST' },
      ' が付属します — コーディングエージェント(Claude、Cursor、Copilot など)が最初から正しい UI を生成できるようにする機械可読な仕様です。',
    ],
    blocks: [
      { kind: 'h2', text: '何が違うのか？' },
      {
        kind: 'p',
        parts: [
          '従来のライブラリは人間向けにドキュメントを書き、モデルが訓練データから推測することを期待します — それが幻覚 props の原因です。Slipstream は両方のためにドキュメントを書きます。人間にはこのサイトを、エージェントには MCP 経由の manifest、正規の markdown ルート、そして出力を出荷前にチェックする ',
          { code: 'validate_usage' },
          ' ツールを提供します。',
        ],
      },
      { kind: 'h2', text: 'アーキテクチャ' },
      {
        kind: 'p',
        parts: [
          '1 つの monorepo が 7 つの公開パッケージと 2 つの参照アプリを出荷します。コンポーネントは ',
          { code: 'packages/core' },
          ' と ',
          { code: 'packages/ai' },
          ' に、テーマは ',
          { code: '@slipstream-ui/themes' },
          ' にあります。すべてのコンポーネントは同じパイプラインを通り、CI がそれを強制します。',
        ],
      },
      architectureCode,
      {
        kind: 'ul',
        items: [
          [
            { code: '@slipstream-ui/core' },
            ' — {coreComponentCount} コンポーネント:原子、分子、オーバーレイ、フォーム、データ表示、アプリ/マーケティング chrome、コンテンツタイポグラフィ',
          ],
          [
            { code: '@slipstream-ui/ai' },
            ' — {aiComponentCount} 個の AI チャットおよびエージェントコンポーネント(ステートレス。状態と転送はあなたが管理)',
          ],
          [
            { code: '@slipstream-ui/themes' },
            ' — createTheme() と、CSS 変数トークン契約に基づくプリセット',
          ],
          [
            { code: '@slipstream-ui/cli' },
            '、',
            { code: '@slipstream-ui/registry' },
            '、',
            { code: '@slipstream-ui/mcp-server' },
            '、',
            { code: '@slipstream-ui/i18n' },
            ' — 同じ manifest を共有するインストール、レジストリ、エージェント、ロケールのヘルパー',
          ],
          [
            { strong: 'apps/docs · apps/app · apps/playground' },
            ' — いま読んでいるドキュメントと参照ダッシュボード。どちらもこのライブラリで構築されています',
          ],
        ],
      },
      { kind: 'h2', text: 'ここから始める' },
      {
        kind: 'ol',
        items: [
          [
            { strong: '1. インストール。' },
            ' 5 ステップの',
            { link: { href: '/docs/getting-started', text: 'クイックスタート' } },
            'でテーマ付き画面を作るか、パッケージ・CLI・レジストリのトレードオフについては',
            { link: { href: '/docs/installation', text: 'インストールガイド' } },
            'をお読みください。',
          ],
          [
            { strong: '2. manifest を 1 つ読む。' },
            ' ',
            { link: { href: '/docs/ai-manifests', text: 'COMPONENT_MANIFEST' } },
            ' を開き、エージェントが読む prop スキーマ、アンチパターン、アクセシビリティルールを確認します。',
          ],
          [
            { strong: '3. エージェントループを接続する。' },
            ' ',
            { link: { href: '/docs/mcp', text: 'MCP サーバー' } },
            'を接続し、生成された JSX がエディタに届く前に ',
            { code: 'validate_usage' },
            ' を呼び出します。',
          ],
        ],
      },
      { kind: 'h2', text: 'クイックスタート' },
      quickstartCode,
      {
        kind: 'p',
        parts: [
          '詳細なセットアップ手順は',
          { link: { href: '/docs/installation', text: 'インストール' } },
          'にあります。',
        ],
      },
      { kind: 'h2', text: '探索' },
      {
        kind: 'cards',
        items: [
          {
            href: '/docs/installation',
            title: 'インストール',
            body: 'パッケージ、CLI、または shadcn 互換レジストリ — ワークフローを選ぶ。',
            index: '01',
          },
          {
            href: '/docs/ai-manifests',
            title: 'COMPONENT_MANIFEST',
            body: 'すべてのコンポーネントの背後にある機械可読仕様:props、アンチパターン、a11y。',
            index: '02',
          },
          {
            href: '/docs/components',
            title: 'コンポーネント',
            body: 'コアと AI インタラクションを合わせて {componentCount} コンポーネント。',
            index: '03',
          },
          {
            href: '/docs/templates',
            title: 'テンプレート',
            body: '完全なコピーペーストパターン:ストリーミングチャット、エージェントダッシュボード、RAG 引用。',
            index: '04',
          },
        ],
      },
      { kind: 'h2', text: 'バージョニングと安定性' },
      {
        kind: 'p',
        parts: [
          'Slipstream UI は',
          { strong: 'セマンティックバージョニング' },
          'に従います。現在のメジャーバージョンは ',
          { strong: '0.x' },
          ' で、ライブラリが 1.0 に成熟するまでマイナーリリース間で API が変わる可能性があります。',
        ],
      },
      {
        kind: 'ul',
        items: [
          [
            { strong: 'Patch (0.x.y):' },
            ' バグ修正、アクセシビリティ改善、ドキュメント更新。API 変更なし。',
          ],
          [
            { strong: 'Minor (0.x.0):' },
            ' 新しいコンポーネント、新しい props、新しいトークン。既存の props とコンポーネントは非推奨とマークされない限り後方互換です。',
          ],
          [
            { strong: 'Major (1.0.0):' },
            ' 安定した API 保証。1.0 以降、破壊的変更はメジャーリリースのみで移行ガイド付きです。',
          ],
        ],
      },
      {
        kind: 'p',
        parts: [
          'すべてのコンポーネントは ',
          { code: 'version' },
          ' フィールド付きの ',
          { code: 'COMPONENT_MANIFEST' },
          ' を出荷します。manifest スキーマは CI で検証され、prop スキーマ、TypeScript 型、manifest のドリフトが毎コミットでチェックされます。',
        ],
      },
      {
        kind: 'p',
        parts: [
          { strong: 'アクセシビリティ:' },
          ' すべてのコンポーネントは ',
          { code: 'jest-axe' },
          ' 自動チェックに合格し、キーボードナビゲーション、スクリーンリーダー、reduced-motion 設定をサポートします。アクセシビリティの退行はバグとして扱われます。',
        ],
      },
      { kind: 'h2', text: 'エージェントビルダー向け' },
      {
        kind: 'p',
        parts: [
          'Slipstream にエージェントを接続する場合は、',
          { link: { href: '/docs/mcp', text: 'MCP サーバー' } },
          '、',
          { link: { href: '/llm/index.md', text: '正規の markdown インデックス' } },
          '、または',
          { link: { href: '/docs/ai-manifests', text: 'manifest スキーマ' } },
          'から始めてください。各コンポーネントページのヘッダーにも独自の markdown リファレンスへのリンクがあります。',
        ],
      },
    ],
  },

  ko: {
    banner: [
      '{componentCount}개 컴포넌트, MCP ',
      { code: 'validate_usage' },
      ', 스트리밍 지원 Response, shadcn 호환 레지스트리.',
    ],
    whatsNew: '새 소식 →',
    title: '소개',
    lead: [
      'Slipstream UI는 AI 우선 React 컴포넌트 라이브러리입니다. 모든 컴포넌트에 ',
      { code: 'COMPONENT_MANIFEST' },
      '가 제공됩니다. Claude, Cursor, Copilot 같은 코딩 에이전트가 처음부터 올바른 UI를 생성하도록 돕는 기계 판독 가능한 명세입니다.',
    ],
    blocks: [
      { kind: 'h2', text: '무엇이 다른가요?' },
      {
        kind: 'p',
        parts: [
          '기존 라이브러리는 사람을 위해 문서를 쓰고 모델이 학습 데이터에서 추론하기를 기대합니다. 그래서 환각 props가 생깁니다. Slipstream은 둘 모두를 위해 문서를 씁니다. 사람에게는 이 사이트를, 에이전트에게는 MCP 기반 매니페스트와 표준 markdown 경로, 그리고 출력을 출시 전에 검사하는 ',
          { code: 'validate_usage' },
          ' 도구를 제공합니다.',
        ],
      },
      { kind: 'h2', text: '아키텍처' },
      {
        kind: 'p',
        parts: [
          '하나의 monorepo가 일곱 개의 패키지와 두 개의 참조 앱을 배포합니다. 컴포넌트는 ',
          { code: 'packages/core' },
          '와 ',
          { code: 'packages/ai' },
          '에, 테마는 ',
          { code: '@slipstream-ui/themes' },
          '에 있습니다. 모든 컴포넌트는 같은 파이프라인을 거치고 CI가 이를 강제합니다.',
        ],
      },
      architectureCode,
      {
        kind: 'ul',
        items: [
          [
            { code: '@slipstream-ui/core' },
            ' — {coreComponentCount}개 컴포넌트: 아톰, 분자, 오버레이, 폼, 데이터 표시, 앱/마케팅 크롬, 콘텐츠 타이포그래피',
          ],
          [
            { code: '@slipstream-ui/ai' },
            ' — {aiComponentCount}개 AI 채팅 및 에이전트 컴포넌트(무상태; 상태와 전송은 직접 관리)',
          ],
          [
            { code: '@slipstream-ui/themes' },
            ' — createTheme()와 CSS 변수 토큰 계약 기반 프리셋',
          ],
          [
            { code: '@slipstream-ui/cli' },
            ', ',
            { code: '@slipstream-ui/registry' },
            ', ',
            { code: '@slipstream-ui/mcp-server' },
            ', ',
            { code: '@slipstream-ui/i18n' },
            ' — 같은 매니페스트를 공유하는 설치, 레지스트리, 에이전트, 로캘 헬퍼',
          ],
          [
            { strong: 'apps/docs · apps/app · apps/playground' },
            ' — 지금 읽고 있는 문서와 참조 대시보드로, 둘 다 이 라이브러리로 만들어졌습니다',
          ],
        ],
      },
      { kind: 'h2', text: '여기서 시작하세요' },
      {
        kind: 'ol',
        items: [
          [
            { strong: '1. 설치.' },
            ' 5단계 ',
            { link: { href: '/docs/getting-started', text: '빠른 시작' } },
            '으로 테마가 적용된 화면을 만들거나, 패키지·CLI·레지스트리의 장단점은 ',
            { link: { href: '/docs/installation', text: '설치 가이드' } },
            '에서 확인하세요.',
          ],
          [
            { strong: '2. 매니페스트 하나 읽기.' },
            ' ',
            { link: { href: '/docs/ai-manifests', text: 'COMPONENT_MANIFEST' } },
            '를 열어 에이전트가 읽을 prop 스키마, 안티패턴, 접근성 규칙을 확인합니다.',
          ],
          [
            { strong: '3. 에이전트 루프 연결하기.' },
            ' ',
            { link: { href: '/docs/mcp', text: 'MCP 서버' } },
            '를 연결하고 생성된 JSX가 편집기에 도달하기 전에 ',
            { code: 'validate_usage' },
            '를 호출합니다.',
          ],
        ],
      },
      { kind: 'h2', text: '빠른 시작' },
      quickstartCode,
      {
        kind: 'p',
        parts: [
          '전체 설정 방법은 ',
          { link: { href: '/docs/installation', text: '설치' } },
          ' 문서에 있습니다.',
        ],
      },
      { kind: 'h2', text: '살펴보기' },
      {
        kind: 'cards',
        items: [
          {
            href: '/docs/installation',
            title: '설치',
            body: '패키지, CLI 또는 shadcn 호환 레지스트리 — 워크플로를 선택하세요.',
            index: '01',
          },
          {
            href: '/docs/ai-manifests',
            title: 'COMPONENT_MANIFEST',
            body: '모든 컴포넌트 뒤에 있는 기계 판독 명세: props, 안티패턴, 접근성.',
            index: '02',
          },
          {
            href: '/docs/components',
            title: '컴포넌트',
            body: '코어와 AI 인터랙션 표면에 걸쳐 {componentCount}개 컴포넌트.',
            index: '03',
          },
          {
            href: '/docs/templates',
            title: '템플릿',
            body: '완전한 복사-붙여넣기 패턴: 스트리밍 채팅, 에이전트 대시보드, RAG 인용.',
            index: '04',
          },
        ],
      },
      { kind: 'h2', text: '버전과 안정성' },
      {
        kind: 'p',
        parts: [
          'Slipstream UI는 ',
          { strong: '시맨틱 버전 관리' },
          '를 따릅니다. 현재 주 버전은 ',
          { strong: '0.x' },
          '이며, 라이브러리가 1.0으로 성숙하는 동안 마이너 릴리스 사이에 API가 바뀔 수 있습니다.',
        ],
      },
      {
        kind: 'ul',
        items: [
          [
            { strong: 'Patch (0.x.y):' },
            ' 버그 수정, 접근성 개선, 문서 업데이트. API 변경 없음.',
          ],
          [
            { strong: 'Minor (0.x.0):' },
            ' 새 컴포넌트, 새 props, 새 토큰. 기존 props와 컴포넌트는 더 이상 사용되지 않음으로 표시되지 않는 한 하위 호환을 유지합니다.',
          ],
          [
            { strong: 'Major (1.0.0):' },
            ' 안정적인 API 보장. 1.0 이후에는 호환되지 않는 변경이 주 버전에서만, 마이그레이션 가이드와 함께 제공됩니다.',
          ],
        ],
      },
      {
        kind: 'p',
        parts: [
          '모든 컴포넌트는 ',
          { code: 'version' },
          ' 필드가 있는 ',
          { code: 'COMPONENT_MANIFEST' },
          '를 포함합니다. 매니페스트 스키마는 CI에서 검증되며, prop 스키마·TypeScript 타입·매니페스트의 불일치를 매 커밋마다 확인합니다.',
        ],
      },
      {
        kind: 'p',
        parts: [
          { strong: '접근성:' },
          ' 모든 컴포넌트는 ',
          { code: 'jest-axe' },
          ' 자동 검사를 통과하고 키보드 탐색, 스크린 리더, 동작 줄이기 설정을 지원합니다. 접근성 회귀는 버그로 취급합니다.',
        ],
      },
      { kind: 'h2', text: '에이전트 빌더를 위해' },
      {
        kind: 'p',
        parts: [
          'Slipstream에 에이전트를 연결한다면 ',
          { link: { href: '/docs/mcp', text: 'MCP 서버' } },
          ', ',
          { link: { href: '/llm/index.md', text: '표준 markdown 인덱스' } },
          ', ',
          { link: { href: '/docs/ai-manifests', text: '매니페스트 스키마' } },
          '부터 시작하세요. 각 컴포넌트 페이지 헤더에도 해당 markdown 참조 링크가 있습니다.',
        ],
      },
    ],
  },

  ru: {
    banner: [
      '{componentCount} компонентов, MCP-инструмент ',
      { code: 'validate_usage' },
      ', Response с поддержкой стриминга и реестр, совместимый с shadcn.',
    ],
    whatsNew: 'Что нового →',
    title: 'Введение',
    lead: [
      'Slipstream UI — React-библиотека компонентов, созданная для ИИ. Каждый компонент поставляется с ',
      { code: 'COMPONENT_MANIFEST' },
      ' — машиночитаемой спецификацией, которая позволяет агентам вроде Claude, Cursor и Copilot генерировать правильный интерфейс с первого раза.',
    ],
    blocks: [
      { kind: 'h2', text: 'Чем это отличается?' },
      {
        kind: 'p',
        parts: [
          'Традиционные библиотеки пишут документацию для людей и надеются, что модели разберутся по обучающим данным — отсюда и берутся выдуманные props. Slipstream документирует для обоих: людям достаётся этот сайт, агентам — манифесты по MCP, канонические markdown-маршруты и инструмент ',
          { code: 'validate_usage' },
          ', который проверяет результат до публикации.',
        ],
      },
      { kind: 'h2', text: 'Архитектура' },
      {
        kind: 'p',
        parts: [
          'Один monorepo публикует семь пакетов и два эталонных приложения. Компоненты находятся в ',
          { code: 'packages/core' },
          ' и ',
          { code: 'packages/ai' },
          ', темы — в ',
          { code: '@slipstream-ui/themes' },
          '. Каждый компонент проходит один и тот же конвейер, и CI это обеспечивает:',
        ],
      },
      architectureCode,
      {
        kind: 'ul',
        items: [
          [
            { code: '@slipstream-ui/core' },
            ' — {coreComponentCount} компонентов: атомы, молекулы, оверлеи, формы, отображение данных, chrome приложений и маркетинга, типографика контента',
          ],
          [
            { code: '@slipstream-ui/ai' },
            ' — {aiComponentCount} компонентов чата и ИИ-агентов (без состояния; состояние и транспорт — на вашей стороне)',
          ],
          [
            { code: '@slipstream-ui/themes' },
            ' — createTheme() и пресеты на основе контракта токенов CSS-переменных',
          ],
          [
            { code: '@slipstream-ui/cli' },
            ', ',
            { code: '@slipstream-ui/registry' },
            ', ',
            { code: '@slipstream-ui/mcp-server' },
            ', ',
            { code: '@slipstream-ui/i18n' },
            ' — помощники для установки, реестра, агентов и локалей, использующие те же манифесты',
          ],
          [
            { strong: 'apps/docs · apps/app · apps/playground' },
            ' — документация, которую вы читаете, и эталонная панель, обе собраны на этой библиотеке',
          ],
        ],
      },
      { kind: 'h2', text: 'Начните здесь' },
      {
        kind: 'ol',
        items: [
          [
            { strong: '1. Установите.' },
            ' Пройдите пятишаговый ',
            { link: { href: '/docs/getting-started', text: 'быстрый старт' } },
            ' для экрана с темой или прочитайте ',
            { link: { href: '/docs/installation', text: 'руководство по установке' } },
            ' о пакетах, CLI и компромиссах реестра.',
          ],
          [
            { strong: '2. Прочитайте один манифест.' },
            ' Откройте ',
            { link: { href: '/docs/ai-manifests', text: 'COMPONENT_MANIFEST' } },
            ', чтобы увидеть схему props, антипаттерны и правила доступности, которые прочитает ваш агент.',
          ],
          [
            { strong: '3. Замкните цикл агента.' },
            ' Подключите ',
            { link: { href: '/docs/mcp', text: 'MCP-сервер' } },
            ' и вызывайте ',
            { code: 'validate_usage' },
            ', прежде чем сгенерированный JSX попадёт в редактор.',
          ],
        ],
      },
      { kind: 'h2', text: 'Быстрый старт' },
      quickstartCode,
      {
        kind: 'p',
        parts: [
          'Полные инструкции по настройке — в разделе ',
          { link: { href: '/docs/installation', text: 'Установка' } },
          '.',
        ],
      },
      { kind: 'h2', text: 'Изучите' },
      {
        kind: 'cards',
        items: [
          {
            href: '/docs/installation',
            title: 'Установка',
            body: 'Пакеты, CLI или реестр, совместимый с shadcn, — выберите свой сценарий.',
            index: '01',
          },
          {
            href: '/docs/ai-manifests',
            title: 'COMPONENT_MANIFEST',
            body: 'Машиночитаемая спецификация каждого компонента: props, антипаттерны, доступность.',
            index: '02',
          },
          {
            href: '/docs/components',
            title: 'Компоненты',
            body: '{componentCount} компонентов на основных и AI-поверхностях.',
            index: '03',
          },
          {
            href: '/docs/templates',
            title: 'Шаблоны',
            body: 'Готовые шаблоны для копирования: стриминговый чат, панель агентов, цитаты RAG.',
            index: '04',
          },
        ],
      },
      { kind: 'h2', text: 'Версионирование и стабильность' },
      {
        kind: 'p',
        parts: [
          'Slipstream UI следует ',
          { strong: 'семантическому версионированию' },
          '. Текущая мажорная версия — ',
          { strong: '0.x' },
          ', поэтому API может меняться между минорными релизами, пока библиотека движется к 1.0.',
        ],
      },
      {
        kind: 'ul',
        items: [
          [
            { strong: 'Patch (0.x.y):' },
            ' Исправления ошибок, улучшения доступности, обновления документации. Без изменений API.',
          ],
          [
            { strong: 'Minor (0.x.0):' },
            ' Новые компоненты, props и токены. Существующие props и компоненты остаются обратно совместимыми, если не помечены как устаревшие.',
          ],
          [
            { strong: 'Major (1.0.0):' },
            ' Гарантия стабильного API. После 1.0 несовместимые изменения только в мажорных релизах и с руководством по миграции.',
          ],
        ],
      },
      {
        kind: 'p',
        parts: [
          'Каждый компонент поставляется с ',
          { code: 'COMPONENT_MANIFEST' },
          ', содержащим поле ',
          { code: 'version' },
          '. Схема манифеста проверяется в CI: схемы props, типы TypeScript и манифесты сверяются при каждом коммите.',
        ],
      },
      {
        kind: 'p',
        parts: [
          { strong: 'Доступность:' },
          ' Все компоненты проходят автоматические проверки ',
          { code: 'jest-axe' },
          ' и поддерживают навигацию с клавиатуры, скринридеры и настройки уменьшенного движения. Регрессии доступности считаются ошибками.',
        ],
      },
      { kind: 'h2', text: 'Для тех, кто создаёт агентов' },
      {
        kind: 'p',
        parts: [
          'Если вы подключаете агента к Slipstream, начните с ',
          { link: { href: '/docs/mcp', text: 'MCP-сервера' } },
          ', ',
          { link: { href: '/llm/index.md', text: 'канонического markdown-индекса' } },
          ' или ',
          { link: { href: '/docs/ai-manifests', text: 'схемы манифеста' } },
          '. Каждая страница компонента также ссылается на свою markdown-справку в заголовке.',
        ],
      },
    ],
  },

  ar: {
    banner: [
      '{componentCount} مكوّنًا، وأداة MCP ',
      { code: 'validate_usage' },
      '، ومكوّن Response يدعم البث، وسجل متوافق مع shadcn.',
    ],
    whatsNew: 'ما الجديد →',
    title: 'مقدمة',
    lead: [
      'Slipstream UI مكتبة مكونات React موجهة للذكاء الاصطناعي. يأتي كل مكوّن مع ',
      { code: 'COMPONENT_MANIFEST' },
      ' — مواصفة قابلة للقراءة آليًا تتيح لوكلاء البرمجة مثل Claude وCursor وCopilot توليد واجهة صحيحة من المرة الأولى.',
    ],
    blocks: [
      { kind: 'h2', text: 'ما الذي يميزها؟' },
      {
        kind: 'p',
        parts: [
          'توثّق المكتبات التقليدية للبشر وتأمل أن يستنتج النماذج من بيانات التدريب — ومن هنا تأتي الخصائص المتوهمة. أما Slipstream فتوثّق لكليهما: يحصل البشر على هذا الموقع، ويحصل الوكلاء على المواصفات عبر MCP ومسارات markdown المعتمدة وأداة ',
          { code: 'validate_usage' },
          ' التي تتحقق من مخرجاتهم قبل النشر.',
        ],
      },
      { kind: 'h2', text: 'البنية' },
      {
        kind: 'p',
        parts: [
          'يصدر مستودع monorepo واحد سبع حزم وتطبيقين مرجعيين. توجد المكونات في ',
          { code: 'packages/core' },
          ' و',
          { code: 'packages/ai' },
          '، ويوجد نظام السمات في ',
          { code: '@slipstream-ui/themes' },
          '. يمر كل مكوّن في المسار نفسه، ويفرض CI ذلك:',
        ],
      },
      architectureCode,
      {
        kind: 'ul',
        items: [
          [
            { code: '@slipstream-ui/core' },
            ' — {coreComponentCount} مكوّنًا: الذرات والجزيئات والطبقات والنماذج وعرض البيانات وهيكل التطبيقات والتسويق وتنسيق المحتوى',
          ],
          [
            { code: '@slipstream-ui/ai' },
            ' — {aiComponentCount} مكوّنًا للدردشة ووكلاء الذكاء الاصطناعي (بلا حالة؛ الحالة والنقل مسؤوليتك)',
          ],
          [
            { code: '@slipstream-ui/themes' },
            ' — createTheme() وإعدادات مسبقة على عقد رموز بمتغيرات CSS',
          ],
          [
            { code: '@slipstream-ui/cli' },
            ' و',
            { code: '@slipstream-ui/registry' },
            ' و',
            { code: '@slipstream-ui/mcp-server' },
            ' و',
            { code: '@slipstream-ui/i18n' },
            ' — أدوات مساعدة للتثبيت والسجل والوكلاء واللغات تشترك في المواصفات نفسها',
          ],
          [
            { strong: 'apps/docs · apps/app · apps/playground' },
            ' — الوثائق التي تقرأها ولوحة مرجعية، وكلتاهما مبنية بهذه المكتبة',
          ],
        ],
      },
      { kind: 'h2', text: 'ابدأ من هنا' },
      {
        kind: 'ol',
        items: [
          [
            { strong: '1. ثبّت.' },
            ' اتبع ',
            { link: { href: '/docs/getting-started', text: 'البدء السريع' } },
            ' المكوّن من خمس خطوات للحصول على شاشة بسمة، أو اقرأ ',
            { link: { href: '/docs/installation', text: 'دليل التثبيت' } },
            ' لمعرفة الحزم وCLI ومقايضات السجل.',
          ],
          [
            { strong: '2. اقرأ مواصفة واحدة.' },
            ' افتح ',
            { link: { href: '/docs/ai-manifests', text: 'COMPONENT_MANIFEST' } },
            ' لترى مخطط الخصائص والأنماط المضادة وقواعد الوصول التي سيقرأها وكيلك.',
          ],
          [
            { strong: '3. وصّل حلقة الوكيل.' },
            ' وصّل ',
            { link: { href: '/docs/mcp', text: 'خادم MCP' } },
            ' واستدعِ ',
            { code: 'validate_usage' },
            ' قبل أن يصل JSX المولّد إلى محررك.',
          ],
        ],
      },
      { kind: 'h2', text: 'البدء السريع' },
      quickstartCode,
      {
        kind: 'p',
        parts: [
          'تجد تعليمات الإعداد الكاملة في ',
          { link: { href: '/docs/installation', text: 'التثبيت' } },
          '.',
        ],
      },
      { kind: 'h2', text: 'استكشف' },
      {
        kind: 'cards',
        items: [
          {
            href: '/docs/installation',
            title: 'التثبيت',
            body: 'حزم أو CLI أو سجل متوافق مع shadcn — اختر سير عملك.',
            index: '01',
          },
          {
            href: '/docs/ai-manifests',
            title: 'COMPONENT_MANIFEST',
            body: 'المواصفة القابلة للقراءة آليًا خلف كل مكوّن: الخصائص والأنماط المضادة وإمكانية الوصول.',
            index: '02',
          },
          {
            href: '/docs/components',
            title: 'المكونات',
            body: '{componentCount} مكوّنًا بين الأسطح الأساسية وتفاعل الذكاء الاصطناعي.',
            index: '03',
          },
          {
            href: '/docs/templates',
            title: 'القوالب',
            body: 'أنماط كاملة جاهزة للنسخ: دردشة بالبث، لوحة وكلاء، اقتباسات RAG.',
            index: '04',
          },
        ],
      },
      { kind: 'h2', text: 'الإصدارات والاستقرار' },
      {
        kind: 'p',
        parts: [
          'تتبع Slipstream UI ',
          { strong: 'النسخ الدلالي' },
          '. الإصدار الرئيسي الحالي هو ',
          { strong: '0.x' },
          '، أي أن الواجهة البرمجية قد تتغير بين الإصدارات الفرعية حتى تنضج المكتبة نحو 1.0.',
        ],
      },
      {
        kind: 'ul',
        items: [
          [
            { strong: 'Patch (0.x.y):' },
            ' إصلاح الأخطاء وتحسينات الوصول وتحديثات التوثيق. دون تغيير في الواجهة.',
          ],
          [
            { strong: 'Minor (0.x.0):' },
            ' مكونات وخصائص ورموز جديدة. تبقى الخصائص والمكونات الحالية متوافقة مع الإصدارات السابقة ما لم تُعلَّم كمهملة.',
          ],
          [
            { strong: 'Major (1.0.0):' },
            ' ضمان واجهة مستقرة. بعد 1.0، لن تأتي التغييرات غير المتوافقة إلا في الإصدارات الرئيسية ومعها دليل ترحيل.',
          ],
        ],
      },
      {
        kind: 'p',
        parts: [
          'يأتي كل مكوّن مع ',
          { code: 'COMPONENT_MANIFEST' },
          ' يحوي حقل ',
          { code: 'version' },
          '. يُتحقق من مخطط المواصفة في CI — تُفحص مخططات الخصائص وأنواع TypeScript والمواصفات بحثًا عن أي انحراف في كل إيداع.',
        ],
      },
      {
        kind: 'p',
        parts: [
          { strong: 'إمكانية الوصول:' },
          ' تجتاز جميع المكونات فحوصات ',
          { code: 'jest-axe' },
          ' الآلية وتدعم التنقل بلوحة المفاتيح وقارئات الشاشة وتفضيل تقليل الحركة. تُعامل أي تراجعات في الوصول كأخطاء.',
        ],
      },
      { kind: 'h2', text: 'لمن يبني الوكلاء' },
      {
        kind: 'p',
        parts: [
          'إذا كنت توصل وكيلًا بـ Slipstream، فابدأ بـ',
          { link: { href: '/docs/mcp', text: 'خادم MCP' } },
          ' أو ',
          { link: { href: '/llm/index.md', text: 'فهرس markdown المعتمد' } },
          ' أو ',
          { link: { href: '/docs/ai-manifests', text: 'مخطط المواصفة' } },
          '. كل صفحة مكوّن تربط أيضًا مرجع markdown الخاص بها في رأس الصفحة.',
        ],
      },
    ],
  },
};
