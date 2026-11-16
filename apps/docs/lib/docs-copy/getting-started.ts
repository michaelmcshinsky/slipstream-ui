import type { DocsCopyByLocale } from './types';

/**
 * Code samples are identifiers and sample values — English in every locale.
 * Only the surrounding prose is translated.
 */
const CLI_CODE = `npx @slipstream-ui/cli@latest init`;

const PACKAGE_CODE = `# Package imports
pnpm add @slipstream-ui/core @slipstream-ui/ai @slipstream-ui/themes

# Copy one component's source into your own tree
npx @slipstream-ui/cli@latest add message

# Or use the shadcn-compatible registry
npx shadcn@latest add https://slipstreamui.com/registry/message.json`;

const TAILWIND3_CODE = `// tailwind.config.js - Tailwind 3
module.exports = {
  presets: [require('@slipstream-ui/themes/tailwind-preset')],
  content: [
    './src/**/*.{ts,tsx}',
    './node_modules/@slipstream-ui/**/*.{js,ts,tsx}',
  ],
};`;

const TAILWIND4_CODE = `/* Tailwind 4 */
@import "tailwindcss";
@import "@slipstream-ui/themes/tailwind-v4.css";

@source "../../node_modules/@slipstream-ui/core/dist";
@source "../../node_modules/@slipstream-ui/ai/dist";`;

const PREBUILT_CODE = `import '@slipstream-ui/themes/styles.css';
import '@slipstream-ui/core/styles.css';`;

const HERO_CODE = `import { Button, Card, CardContent, Hero, Section } from '@slipstream-ui/core';

export function Home() {
  return (
    <Section tone="inverse" padding="lg">
      <Hero
        badge="Now booking"
        title="Find your next dance"
        description="Competitions, socials, and studios across Utah."
        actions={<Button>Browse events</Button>}
        media={<Card><CardContent>Season line-up</CardContent></Card>}
      />
    </Section>
  );
}`;

const MCP_CODE = `pnpm add -D @slipstream-ui/mcp-server

# .mcp.json (Claude Code) or your client's MCP settings
{
  "mcpServers": {
    "slipstream-ui": {
      "command": "npx",
      "args": ["-y", "@slipstream-ui/mcp-server"]
    }
  }
}`;

const LOOP_CODE = `search_components("chat input")
  -> Conversation, PromptInput, Response

get_component_manifest("prompt-input")
  -> exact props, defaults, required flags

validate_usage({
  componentId: "prompt-input",
  code: "<PromptInput onSubmit={send} isLoading={busy} onStop={stop} />"
})
  -> { valid: true, issues: [] }`;

const cliCode = { kind: 'code', language: 'bash', code: CLI_CODE } as const;
const packageCode = { kind: 'code', language: 'bash', code: PACKAGE_CODE } as const;
const tailwind3Code = { kind: 'code', language: 'js', code: TAILWIND3_CODE } as const;
const tailwind4Code = { kind: 'code', language: 'css', code: TAILWIND4_CODE } as const;
const prebuiltCode = { kind: 'code', language: 'tsx', code: PREBUILT_CODE } as const;
const heroCode = { kind: 'code', language: 'tsx', code: HERO_CODE } as const;
const mcpCode = { kind: 'code', language: 'bash', code: MCP_CODE } as const;
const loopCode = { kind: 'code', language: 'text', code: LOOP_CODE } as const;

export const gettingStarted: DocsCopyByLocale = {
  en: {
    title: 'Quickstart',
    lead: [
      'Five steps from an empty React app to a themed screen and a working agent loop. Slipstream ships {componentCount} components; this page wires one, then shows where the rest live.',
    ],
    blocks: [
      {
        kind: 'chips',
        items: [
          { href: '/docs/installation', text: 'Full installation reference →' },
          { href: '/docs/ai-first', text: 'Why the manifest matters →' },
          { href: '/docs/components', text: 'Browse components →' },
        ],
      },
      { kind: 'h2', text: '1. Check the requirements' },
      {
        kind: 'ul',
        items: [
          ['Node.js 20.9 or newer, and pnpm 8 or newer (npm and yarn also work).'],
          ['React 18 or 19.'],
          [
            'Tailwind CSS 3.4 or 4.x, or the prebuilt stylesheets when the app does not run Tailwind.',
          ],
          ['TypeScript is recommended; every package ships types.'],
        ],
      },
      { kind: 'h2', text: '2. Install' },
      {
        kind: 'p',
        parts: [
          'The CLI is the shortest path: it detects Next.js or Vite, writes ',
          { code: 'slipstream.config.json' },
          ', creates the component directory, and injects the theme variables.',
        ],
      },
      cliCode,
      {
        kind: 'p',
        parts: [
          'Prefer package imports or want to copy source into your repository? Both paths are supported and can coexist:',
        ],
      },
      packageCode,
      {
        kind: 'p',
        parts: [
          'Use package imports for a quick client-side integration. Use registry or CLI copies when the host renders server components or needs editable source. The ',
          { link: { href: '/docs/installation', text: 'installation guide' } },
          ' has the full comparison, including the server-component boundary behavior.',
        ],
      },
      { kind: 'h2', text: '3. Add the theme' },
      {
        kind: 'p',
        parts: [
          'Tailwind 3 users can use the published preset; Tailwind 4 users import the CSS-first theme contract. Both map the same semantic tokens, and both support a custom ',
          { code: 'createTheme()' },
          '.',
        ],
      },
      tailwind3Code,
      tailwind4Code,
      { kind: 'p', parts: ['Not running Tailwind? Import the prebuilt sheets instead:'] },
      prebuiltCode,
      {
        kind: 'p',
        parts: [
          'To brand the components, pass your colors to ',
          { code: 'createTheme()' },
          ' and emit the CSS variables once. The ',
          { link: { href: '/docs/theming', text: 'theming guide' } },
          ' covers presets, dark mode, and radius.',
        ],
      },
      { kind: 'h2', text: '4. Compose a screen' },
      {
        kind: 'p',
        parts: [
          'Start with a page structure: a Section owns the band, a Hero owns the headline, and Card plus Button handle the content. No providers or global state are required.',
        ],
      },
      heroCode,
      {
        kind: 'p',
        parts: [
          'Need a different shape? Hero has split, centered, stacked, and overlay layouts; see the ',
          { link: { href: '/docs/components/hero', text: 'Hero page' } },
          ' for live previews. Every component page follows the same Preview / Code / Usage / Types structure.',
        ],
      },
      { kind: 'h2', text: '5. Verify, then connect your agent' },
      {
        kind: 'p',
        parts: [
          'Run your normal checks first: ',
          { code: 'typecheck' },
          ', ',
          { code: 'lint' },
          ', and a production build. Then give your coding agent the same source of truth:',
        ],
      },
      mcpCode,
      {
        kind: 'p',
        parts: [
          'The loop is ',
          { em: 'search, read the manifest, write JSX, validate' },
          '. The validator catches hallucinated props, invalid enum values, and missing required props before the diff reaches your editor.',
        ],
      },
      loopCode,
      { kind: 'h2', text: 'Troubleshooting' },
      {
        kind: 'callouts',
        items: [
          {
            title: 'Components render unstyled',
            body: 'Tailwind did not scan the package output, or the CSS variables are missing. Add the @slipstream-ui dist folders to your content/@source paths and load the theme variables. See Installation and Tailwind v4.',
          },
          {
            title: 'Theme variables apply to the whole document',
            body: 'Do not set theme variables on document.documentElement from a demo or component. Scope them to your app root or a wrapper. The ThemeShowcase component is the reference for scoped previews.',
          },
          {
            title: 'A client hook errors in a server component',
            body: 'Interactive components (RangeSlider, TableOfContents, Stepper with onStepClick) are client components. Put them in a file with "use client" or import them from a client boundary.',
          },
          {
            title: 'The agent still invents props',
            body: 'Confirm the MCP server is running and expose its five tools. Add a rules-file instruction that requires get_component_manifest and validate_usage before emitting JSX.',
          },
          {
            title: 'Dark mode flashes the wrong theme',
            body: 'Add a pre-paint theme script in the document head that reads the stored preference and toggles the dark class before React hydrates.',
          },
        ],
      },
      { kind: 'h2', text: 'Next' },
      {
        kind: 'cards',
        items: [
          {
            href: '/docs/components',
            title: 'Components',
            body: 'Browse every component with live previews and prop tables.',
          },
          {
            href: '/docs/guides/react-hook-form',
            title: 'Forms',
            body: 'Wire FormField and validation with React Hook Form.',
          },
          {
            href: '/docs/guides/ai-chat-ui',
            title: 'AI chat UI',
            body: 'Build a streaming assistant surface end to end.',
          },
          {
            href: '/docs/ai-first',
            title: 'AI-first model',
            body: 'How manifests, MCP, and validation fit together.',
          },
        ],
      },
    ],
  },

  es: {
    title: 'Inicio rápido',
    lead: [
      'Cinco pasos desde una aplicación React vacía hasta una pantalla tematizada y un bucle de agente en funcionamiento. Slipstream incluye {componentCount} componentes; esta página conecta uno y muestra dónde están los demás.',
    ],
    blocks: [
      {
        kind: 'chips',
        items: [
          { href: '/docs/installation', text: 'Referencia completa de instalación →' },
          { href: '/docs/ai-first', text: 'Por qué importa el manifiesto →' },
          { href: '/docs/components', text: 'Explorar componentes →' },
        ],
      },
      { kind: 'h2', text: '1. Comprueba los requisitos' },
      {
        kind: 'ul',
        items: [
          ['Node.js 20.9 o superior y pnpm 8 o superior (npm y yarn también funcionan).'],
          ['React 18 o 19.'],
          [
            'Tailwind CSS 3.4 o 4.x, o las hojas de estilo precompiladas cuando la aplicación no usa Tailwind.',
          ],
          ['Se recomienda TypeScript; todos los paquetes incluyen tipos.'],
        ],
      },
      { kind: 'h2', text: '2. Instala' },
      {
        kind: 'p',
        parts: [
          'La CLI es el camino más corto: detecta Next.js o Vite, escribe ',
          { code: 'slipstream.config.json' },
          ', crea el directorio de componentes e inyecta las variables de tema.',
        ],
      },
      cliCode,
      {
        kind: 'p',
        parts: [
          '¿Prefieres importar paquetes o quieres copiar el código fuente a tu repositorio? Ambos caminos están soportados y pueden convivir:',
        ],
      },
      packageCode,
      {
        kind: 'p',
        parts: [
          'Usa importaciones de paquetes para una integración rápida en el cliente. Usa copias del registro o de la CLI cuando el host renderice componentes de servidor o necesite código editable. La ',
          { link: { href: '/docs/installation', text: 'guía de instalación' } },
          ' tiene la comparación completa, incluido el comportamiento en la frontera de componentes de servidor.',
        ],
      },
      { kind: 'h2', text: '3. Añade el tema' },
      {
        kind: 'p',
        parts: [
          'Quienes usan Tailwind 3 pueden usar el preset publicado; quienes usan Tailwind 4 importan el contrato de tema CSS-first. Ambos asignan los mismos tokens semánticos y ambos admiten un ',
          { code: 'createTheme()' },
          ' personalizado.',
        ],
      },
      tailwind3Code,
      tailwind4Code,
      { kind: 'p', parts: ['¿No usas Tailwind? Importa las hojas precompiladas:'] },
      prebuiltCode,
      {
        kind: 'p',
        parts: [
          'Para dar identidad a los componentes, pasa tus colores a ',
          { code: 'createTheme()' },
          ' y emite las variables CSS una sola vez. La ',
          { link: { href: '/docs/theming', text: 'guía de tematización' } },
          ' cubre presets, modo oscuro y radio.',
        ],
      },
      { kind: 'h2', text: '4. Compón una pantalla' },
      {
        kind: 'p',
        parts: [
          'Empieza por la estructura de la página: Section se encarga de la banda, Hero del titular, y Card y Button del contenido. No hacen falta providers ni estado global.',
        ],
      },
      heroCode,
      {
        kind: 'p',
        parts: [
          '¿Necesitas otra forma? Hero tiene diseños divididos, centrados, apilados y superpuestos; consulta la ',
          { link: { href: '/docs/components/hero', text: 'página de Hero' } },
          ' para ver vistas previas en vivo. Cada página de componente sigue la misma estructura: Vista previa / Código / Uso / Tipos.',
        ],
      },
      { kind: 'h2', text: '5. Verifica y conecta tu agente' },
      {
        kind: 'p',
        parts: [
          'Ejecuta primero tus comprobaciones habituales: ',
          { code: 'typecheck' },
          ', ',
          { code: 'lint' },
          ' y una compilación de producción. Después da a tu agente de código la misma fuente de verdad:',
        ],
      },
      mcpCode,
      {
        kind: 'p',
        parts: [
          'El bucle es ',
          { em: 'buscar, leer el manifiesto, escribir JSX, validar' },
          '. El validador detecta props inventadas, valores de enum inválidos y props obligatorias ausentes antes de que el diff llegue a tu editor.',
        ],
      },
      loopCode,
      { kind: 'h2', text: 'Solución de problemas' },
      {
        kind: 'callouts',
        items: [
          {
            title: 'Los componentes se renderizan sin estilos',
            body: 'Tailwind no analizó la salida del paquete o faltan las variables CSS. Añade las carpetas dist de @slipstream-ui a tus rutas content/@source y carga las variables de tema. Consulta Instalación y Tailwind v4.',
          },
          {
            title: 'Las variables de tema se aplican a todo el documento',
            body: 'No establezcas variables de tema en document.documentElement desde una demo o un componente. Limítalas a la raíz de tu aplicación o a un contenedor. El componente ThemeShowcase es la referencia para vistas previas acotadas.',
          },
          {
            title: 'Un hook de cliente falla en un componente de servidor',
            body: 'Los componentes interactivos (RangeSlider, TableOfContents, Stepper con onStepClick) son componentes de cliente. Colócalos en un archivo con "use client" o impórtalos desde una frontera de cliente.',
          },
          {
            title: 'El agente sigue inventando props',
            body: 'Confirma que el servidor MCP está en marcha y expone sus cinco herramientas. Añade al archivo de reglas una instrucción que exija get_component_manifest y validate_usage antes de emitir JSX.',
          },
          {
            title: 'El modo oscuro parpadea con el tema equivocado',
            body: 'Añade en el head del documento un script de tema previo al pintado que lea la preferencia guardada y active la clase dark antes de que React hidrate.',
          },
        ],
      },
      { kind: 'h2', text: 'Siguiente' },
      {
        kind: 'cards',
        items: [
          {
            href: '/docs/components',
            title: 'Componentes',
            body: 'Explora cada componente con vistas previas en vivo y tablas de props.',
          },
          {
            href: '/docs/guides/react-hook-form',
            title: 'Formularios',
            body: 'Conecta FormField y la validación con React Hook Form.',
          },
          {
            href: '/docs/guides/ai-chat-ui',
            title: 'Interfaz de chat con IA',
            body: 'Crea una superficie de asistente en streaming de principio a fin.',
          },
          {
            href: '/docs/ai-first',
            title: 'Modelo AI-first',
            body: 'Cómo encajan manifiestos, MCP y validación.',
          },
        ],
      },
    ],
  },

  zh: {
    title: '快速入门',
    lead: [
      '从空白 React 应用到带主题的页面和可工作的代理循环，只需五步。Slipstream 提供 {componentCount} 个组件；本页连接其中一个，并展示其余组件的位置。',
    ],
    blocks: [
      {
        kind: 'chips',
        items: [
          { href: '/docs/installation', text: '完整安装参考 →' },
          { href: '/docs/ai-first', text: '为什么 manifest 很重要 →' },
          { href: '/docs/components', text: '浏览组件 →' },
        ],
      },
      { kind: 'h2', text: '1. 检查环境要求' },
      {
        kind: 'ul',
        items: [
          ['Node.js 20.9 或更高版本，以及 pnpm 8 或更高版本（npm 和 yarn 也可用）。'],
          ['React 18 或 19。'],
          [
            'Tailwind CSS 3.4 或 4.x；如果应用不使用 Tailwind，可使用预构建样式表。',
          ],
          ['推荐使用 TypeScript；所有包都附带类型。'],
        ],
      },
      { kind: 'h2', text: '2. 安装' },
      {
        kind: 'p',
        parts: [
          'CLI 是最短的路径：它会检测 Next.js 或 Vite，写入 ',
          { code: 'slipstream.config.json' },
          '，创建组件目录，并注入主题变量。',
        ],
      },
      cliCode,
      {
        kind: 'p',
        parts: [
          '更喜欢包导入，还是想把源码复制到仓库？两种方式都受支持，并且可以共存：',
        ],
      },
      packageCode,
      {
        kind: 'p',
        parts: [
          '包导入适合快速的客户端集成。当宿主渲染服务端组件或需要可编辑源码时，使用 registry 或 CLI 复制。',
          { link: { href: '/docs/installation', text: '安装指南' } },
          '有完整对比，包括服务端组件边界行为。',
        ],
      },
      { kind: 'h2', text: '3. 添加主题' },
      {
        kind: 'p',
        parts: [
          'Tailwind 3 用户可以使用发布的 preset；Tailwind 4 用户导入 CSS-first 主题契约。两者映射相同的语义令牌，并且都支持自定义 ',
          { code: 'createTheme()' },
          '。',
        ],
      },
      tailwind3Code,
      tailwind4Code,
      { kind: 'p', parts: ['不使用 Tailwind？改为导入预构建样式表：'] },
      prebuiltCode,
      {
        kind: 'p',
        parts: [
          '要为组件打造品牌形象，把你的颜色传给 ',
          { code: 'createTheme()' },
          ' 并一次性输出 CSS 变量。',
          { link: { href: '/docs/theming', text: '主题指南' } },
          '涵盖预设、深色模式和圆角。',
        ],
      },
      { kind: 'h2', text: '4. 组合页面' },
      {
        kind: 'p',
        parts: [
          '从页面结构开始：Section 负责区块，Hero 负责主标题，Card 和 Button 负责内容。无需 provider 或全局状态。',
        ],
      },
      heroCode,
      {
        kind: 'p',
        parts: [
          '需要不同的形态？Hero 提供分栏、居中、堆叠和叠加布局；查看',
          { link: { href: '/docs/components/hero', text: 'Hero 页面' } },
          '了解实时预览。每个组件页面都遵循相同的预览 / 代码 / 用法 / 类型结构。',
        ],
      },
      { kind: 'h2', text: '5. 验证，然后接入代理' },
      {
        kind: 'p',
        parts: [
          '先运行常规检查：',
          { code: 'typecheck' },
          '、',
          { code: 'lint' },
          '和生产构建。然后给你的编码代理同样的真实来源：',
        ],
      },
      mcpCode,
      {
        kind: 'p',
        parts: [
          '循环是',
          { em: '搜索、阅读 manifest、编写 JSX、验证' },
          '。校验器会在 diff 到达编辑器之前捕获幻觉 props、无效枚举值和缺失的必填 props。',
        ],
      },
      loopCode,
      { kind: 'h2', text: '故障排查' },
      {
        kind: 'callouts',
        items: [
          {
            title: '组件渲染时没有样式',
            body: 'Tailwind 未扫描包输出，或缺少 CSS 变量。把 @slipstream-ui 的 dist 目录加入 content/@source 路径，并加载主题变量。参见安装和 Tailwind v4。',
          },
          {
            title: '主题变量作用到整个文档',
            body: '不要在 demo 或组件中把主题变量设置到 document.documentElement。把它们限制在应用根节点或包装容器上。ThemeShowcase 组件是局部预览的参考。',
          },
          {
            title: '客户端 hook 在服务端组件中报错',
            body: '交互组件（RangeSlider、TableOfContents、带 onStepClick 的 Stepper）是客户端组件。把它们放进带 "use client" 的文件，或从客户端边界导入。',
          },
          {
            title: '代理仍然编造 props',
            body: '确认 MCP 服务器正在运行并暴露其五个工具。在规则文件中添加指令，要求在输出 JSX 前调用 get_component_manifest 和 validate_usage。',
          },
          {
            title: '深色模式闪现错误的主题',
            body: '在文档 head 中添加预绘制主题脚本，读取已保存的偏好，并在 React 水合前切换 dark 类。',
          },
        ],
      },
      { kind: 'h2', text: '下一步' },
      {
        kind: 'cards',
        items: [
          {
            href: '/docs/components',
            title: '组件',
            body: '通过实时预览和 props 表浏览每个组件。',
          },
          {
            href: '/docs/guides/react-hook-form',
            title: '表单',
            body: '用 React Hook Form 连接 FormField 和校验。',
          },
          {
            href: '/docs/guides/ai-chat-ui',
            title: 'AI 聊天界面',
            body: '端到端构建流式助手界面。',
          },
          {
            href: '/docs/ai-first',
            title: 'AI 优先模型',
            body: 'manifest、MCP 和校验如何协同。',
          },
        ],
      },
    ],
  },

  ja: {
    title: 'クイックスタート',
    lead: [
      '空の React アプリから、テーマ付きの画面と動作するエージェントループまで 5 ステップ。Slipstream は {componentCount} コンポーネントを提供します。このページでは 1 つを接続し、残りの場所を示します。',
    ],
    blocks: [
      {
        kind: 'chips',
        items: [
          { href: '/docs/installation', text: 'インストールの詳細リファレンス →' },
          { href: '/docs/ai-first', text: 'manifest が重要な理由 →' },
          { href: '/docs/components', text: 'コンポーネントを見る →' },
        ],
      },
      { kind: 'h2', text: '1. 要件を確認する' },
      {
        kind: 'ul',
        items: [
          ['Node.js 20.9 以降、pnpm 8 以降（npm と yarn も可）。'],
          ['React 18 または 19。'],
          [
            'Tailwind CSS 3.4 または 4.x、または Tailwind を使わない場合はプリビルドのスタイルシート。',
          ],
          ['TypeScript を推奨します。すべてのパッケージに型が付属します。'],
        ],
      },
      { kind: 'h2', text: '2. インストール' },
      {
        kind: 'p',
        parts: [
          '最短は CLI です。Next.js か Vite を検出し、',
          { code: 'slipstream.config.json' },
          ' を書き込み、コンポーネントディレクトリを作成してテーマ変数を注入します。',
        ],
      },
      cliCode,
      {
        kind: 'p',
        parts: [
          'パッケージ import を好む場合も、ソースをリポジトリにコピーしたい場合も、両方サポートされ共存できます。',
        ],
      },
      packageCode,
      {
        kind: 'p',
        parts: [
          'パッケージ import は手早いクライアント側統合に向いています。ホストがサーバーコンポーネントを描画する場合や編集可能なソースが必要な場合は、レジストリまたは CLI のコピーを使ってください。',
          { link: { href: '/docs/installation', text: 'インストールガイド' } },
          'に、サーバーコンポーネント境界の挙動を含む完全な比較があります。',
        ],
      },
      { kind: 'h2', text: '3. テーマを追加する' },
      {
        kind: 'p',
        parts: [
          'Tailwind 3 では公開 preset を使えます。Tailwind 4 では CSS ファーストのテーマ契約を import します。どちらも同じセマンティックトークンに対応し、カスタムの ',
          { code: 'createTheme()' },
          ' もサポートします。',
        ],
      },
      tailwind3Code,
      tailwind4Code,
      { kind: 'p', parts: ['Tailwind を使っていませんか。代わりにプリビルドのスタイルシートを import してください。'] },
      prebuiltCode,
      {
        kind: 'p',
        parts: [
          'コンポーネントをブランド化するには、色を ',
          { code: 'createTheme()' },
          ' に渡し、CSS 変数を一度出力します。',
          { link: { href: '/docs/theming', text: 'テーマガイド' } },
          'でプリセット、ダークモード、角丸を扱っています。',
        ],
      },
      { kind: 'h2', text: '4. 画面を組み立てる' },
      {
        kind: 'p',
        parts: [
          'ページ構造から始めます。Section が帯を、Hero が主見出しを担当し、Card と Button がコンテンツを扱います。プロバイダーやグローバル状態は不要です。',
        ],
      },
      heroCode,
      {
        kind: 'p',
        parts: [
          '別の形が必要ですか。Hero には分割、中央寄せ、スタック、オーバーレイのレイアウトがあります。ライブプレビューは',
          { link: { href: '/docs/components/hero', text: 'Hero ページ' } },
          'をご覧ください。各コンポーネントページは同じプレビュー / コード / 使い方 / 型の構成です。',
        ],
      },
      { kind: 'h2', text: '5. 検証してからエージェントを接続する' },
      {
        kind: 'p',
        parts: [
          'まず通常のチェックを実行します:',
          { code: 'typecheck' },
          '、',
          { code: 'lint' },
          '、本番ビルド。その後、コーディングエージェントに同じ信頼できる情報源を渡します。',
        ],
      },
      mcpCode,
      {
        kind: 'p',
        parts: [
          'ループは ',
          { em: '検索、manifest を読む、JSX を書く、検証' },
          ' です。バリデータは diff がエディタに届く前に、幻覚 props、無効な enum 値、必須 props の欠落を検出します。',
        ],
      },
      loopCode,
      { kind: 'h2', text: 'トラブルシューティング' },
      {
        kind: 'callouts',
        items: [
          {
            title: 'コンポーネントがスタイルなしで表示される',
            body: 'Tailwind がパッケージ出力をスキャンしていないか、CSS 変数がありません。@slipstream-ui の dist フォルダーを content/@source パスに追加し、テーマ変数を読み込んでください。インストールと Tailwind v4 を参照してください。',
          },
          {
            title: 'テーマ変数がドキュメント全体に適用される',
            body: 'デモやコンポーネントから document.documentElement にテーマ変数を設定しないでください。アプリのルートまたはラッパーにスコープしてください。スコープ付きプレビューの参考は ThemeShowcase コンポーネントです。',
          },
          {
            title: 'サーバーコンポーネントでクライアントフックがエラーになる',
            body: 'インタラクティブなコンポーネント（RangeSlider、TableOfContents、onStepClick 付きの Stepper）はクライアントコンポーネントです。"use client" のあるファイルに置くか、クライアント境界から import してください。',
          },
          {
            title: 'エージェントが props を発明し続ける',
            body: 'MCP サーバーが動作し、5 つのツールを公開していることを確認します。JSX を出力する前に get_component_manifest と validate_usage を必須とする指示をルールファイルに追加してください。',
          },
          {
            title: 'ダークモードで誤ったテーマが一瞬表示される',
            body: '保存された設定を読み、React のハイドレーション前に dark クラスを切り替えるプリペイントのテーマスクリプトを head に追加してください。',
          },
        ],
      },
      { kind: 'h2', text: '次へ' },
      {
        kind: 'cards',
        items: [
          {
            href: '/docs/components',
            title: 'コンポーネント',
            body: 'ライブプレビューと prop テーブルですべてのコンポーネントを見る。',
          },
          {
            href: '/docs/guides/react-hook-form',
            title: 'フォーム',
            body: 'React Hook Form で FormField とバリデーションを接続する。',
          },
          {
            href: '/docs/guides/ai-chat-ui',
            title: 'AI チャット UI',
            body: 'ストリーミングするアシスタント画面を一気通貫で作る。',
          },
          {
            href: '/docs/ai-first',
            title: 'AI ファーストモデル',
            body: 'manifest、MCP、検証の関係。',
          },
        ],
      },
    ],
  },

  ko: {
    title: '빠른 시작',
    lead: [
      '빈 React 앱에서 테마가 적용된 화면과 작동하는 에이전트 루프까지 다섯 단계. Slipstream은 {componentCount}개 컴포넌트를 제공합니다. 이 페이지는 그중 하나를 연결하고 나머지가 어디 있는지 보여줍니다.',
    ],
    blocks: [
      {
        kind: 'chips',
        items: [
          { href: '/docs/installation', text: '전체 설치 참고 →' },
          { href: '/docs/ai-first', text: '매니페스트가 중요한 이유 →' },
          { href: '/docs/components', text: '컴포넌트 둘러보기 →' },
        ],
      },
      { kind: 'h2', text: '1. 요구 사항 확인' },
      {
        kind: 'ul',
        items: [
          ['Node.js 20.9 이상, pnpm 8 이상(npm과 yarn도 동작).'],
          ['React 18 또는 19.'],
          [
            'Tailwind CSS 3.4 또는 4.x, 또는 Tailwind를 사용하지 않는 경우 미리 빌드된 스타일시트.',
          ],
          ['TypeScript를 권장합니다. 모든 패키지에 타입이 포함됩니다.'],
        ],
      },
      { kind: 'h2', text: '2. 설치' },
      {
        kind: 'p',
        parts: [
          '가장 짧은 경로는 CLI입니다. Next.js 또는 Vite를 감지하고 ',
          { code: 'slipstream.config.json' },
          '을 작성하며 컴포넌트 디렉터리를 만들고 테마 변수를 주입합니다.',
        ],
      },
      cliCode,
      {
        kind: 'p',
        parts: [
          '패키지 import를 선호하거나 소스를 저장소로 복사하고 싶으신가요? 두 방식 모두 지원되며 함께 사용할 수 있습니다.',
        ],
      },
      packageCode,
      {
        kind: 'p',
        parts: [
          '패키지 import는 빠른 클라이언트 통합에 적합합니다. 호스트가 서버 컴포넌트를 렌더링하거나 편집 가능한 소스가 필요하면 레지스트리나 CLI 복사를 사용하세요. ',
          { link: { href: '/docs/installation', text: '설치 가이드' } },
          '에 서버 컴포넌트 경계 동작을 포함한 전체 비교가 있습니다.',
        ],
      },
      { kind: 'h2', text: '3. 테마 추가' },
      {
        kind: 'p',
        parts: [
          'Tailwind 3 사용자는 공개된 preset을 사용할 수 있고, Tailwind 4 사용자는 CSS 우선 테마 계약을 import합니다. 둘 다 같은 시맨틱 토큰을 매핑하며 사용자 정의 ',
          { code: 'createTheme()' },
          '도 지원합니다.',
        ],
      },
      tailwind3Code,
      tailwind4Code,
      { kind: 'p', parts: ['Tailwind를 사용하지 않으시나요? 대신 미리 빌드된 스타일시트를 import하세요.'] },
      prebuiltCode,
      {
        kind: 'p',
        parts: [
          '컴포넌트에 브랜드를 입히려면 색상을 ',
          { code: 'createTheme()' },
          '에 전달하고 CSS 변수를 한 번 출력하세요. ',
          { link: { href: '/docs/theming', text: '테마 가이드' } },
          '에서 프리셋, 다크 모드, 라운드를 다룹니다.',
        ],
      },
      { kind: 'h2', text: '4. 화면 구성' },
      {
        kind: 'p',
        parts: [
          '페이지 구조부터 시작하세요. Section이 밴드를, Hero가 헤드라인을 담당하고 Card와 Button이 콘텐츠를 처리합니다. provider나 전역 상태는 필요 없습니다.',
        ],
      },
      heroCode,
      {
        kind: 'p',
        parts: [
          '다른 형태가 필요한가요? Hero에는 분할, 중앙 정렬, 스택, 오버레이 레이아웃이 있습니다. 라이브 미리보기는 ',
          { link: { href: '/docs/components/hero', text: 'Hero 페이지' } },
          '를 보세요. 모든 컴포넌트 페이지는 미리보기 / 코드 / 사용법 / 타입 구조를 따릅니다.',
        ],
      },
      { kind: 'h2', text: '5. 검증한 뒤 에이전트 연결' },
      {
        kind: 'p',
        parts: [
          '먼저 평소 검사를 실행하세요: ',
          { code: 'typecheck' },
          ', ',
          { code: 'lint' },
          ', 프로덕션 빌드. 그다음 코딩 에이전트에게 같은 단일 진실 공급원을 제공하세요.',
        ],
      },
      mcpCode,
      {
        kind: 'p',
        parts: [
          '루프는 ',
          { em: '검색, 매니페스트 읽기, JSX 작성, 검증' },
          '입니다. 검증기는 diff가 편집기에 도달하기 전에 환각 props, 잘못된 enum 값, 누락된 필수 props를 잡아냅니다.',
        ],
      },
      loopCode,
      { kind: 'h2', text: '문제 해결' },
      {
        kind: 'callouts',
        items: [
          {
            title: '컴포넌트가 스타일 없이 렌더링됨',
            body: 'Tailwind가 패키지 출력을 스캔하지 않았거나 CSS 변수가 없습니다. @slipstream-ui dist 폴더를 content/@source 경로에 추가하고 테마 변수를 로드하세요. 설치와 Tailwind v4를 참고하세요.',
          },
          {
            title: '테마 변수가 문서 전체에 적용됨',
            body: '데모나 컴포넌트에서 document.documentElement에 테마 변수를 설정하지 마세요. 앱 루트나 래퍼에 범위를 한정하세요. 범위가 지정된 미리보기의 기준은 ThemeShowcase 컴포넌트입니다.',
          },
          {
            title: '서버 컴포넌트에서 클라이언트 훅 오류',
            body: '인터랙티브 컴포넌트(RangeSlider, TableOfContents, onStepClick이 있는 Stepper)는 클라이언트 컴포넌트입니다. "use client"가 있는 파일에 두거나 클라이언트 경계에서 import하세요.',
          },
          {
            title: '에이전트가 계속 props를 지어냄',
            body: 'MCP 서버가 실행 중이고 다섯 도구를 노출하는지 확인하세요. JSX를 내보내기 전에 get_component_manifest와 validate_usage를 요구하는 지침을 규칙 파일에 추가하세요.',
          },
          {
            title: '다크 모드에서 잘못된 테마가 깜박임',
            body: '저장된 설정을 읽고 React 수화 전에 dark 클래스를 전환하는 사전 페인트 테마 스크립트를 문서 head에 추가하세요.',
          },
        ],
      },
      { kind: 'h2', text: '다음' },
      {
        kind: 'cards',
        items: [
          {
            href: '/docs/components',
            title: '컴포넌트',
            body: '라이브 미리보기와 prop 표로 모든 컴포넌트를 둘러보세요.',
          },
          {
            href: '/docs/guides/react-hook-form',
            title: '폼',
            body: 'React Hook Form으로 FormField와 검증을 연결하세요.',
          },
          {
            href: '/docs/guides/ai-chat-ui',
            title: 'AI 채팅 UI',
            body: '스트리밍 어시스턴트 화면을 처음부터 끝까지 만드세요.',
          },
          {
            href: '/docs/ai-first',
            title: 'AI 우선 모델',
            body: '매니페스트, MCP, 검증이 어떻게 맞물리는지.',
          },
        ],
      },
    ],
  },

  ru: {
    title: 'Быстрый старт',
    lead: [
      'Пять шагов от пустого React-приложения до экрана с темой и работающего цикла агента. Slipstream поставляет {componentCount} компонентов; эта страница подключает один и показывает, где искать остальные.',
    ],
    blocks: [
      {
        kind: 'chips',
        items: [
          { href: '/docs/installation', text: 'Полный справочник по установке →' },
          { href: '/docs/ai-first', text: 'Почему манифест важен →' },
          { href: '/docs/components', text: 'Посмотреть компоненты →' },
        ],
      },
      { kind: 'h2', text: '1. Проверьте требования' },
      {
        kind: 'ul',
        items: [
          ['Node.js 20.9 или новее и pnpm 8 или новее (npm и yarn тоже работают).'],
          ['React 18 или 19.'],
          [
            'Tailwind CSS 3.4 или 4.x, либо готовые таблицы стилей, если приложение не использует Tailwind.',
          ],
          ['Рекомендуется TypeScript; каждый пакет поставляется с типами.'],
        ],
      },
      { kind: 'h2', text: '2. Установка' },
      {
        kind: 'p',
        parts: [
          'Самый короткий путь — CLI: он определяет Next.js или Vite, создаёт ',
          { code: 'slipstream.config.json' },
          ', каталог компонентов и внедряет переменные темы.',
        ],
      },
      cliCode,
      {
        kind: 'p',
        parts: [
          'Предпочитаете импорт пакетов или хотите скопировать исходники в свой репозиторий? Поддерживаются оба пути, и они могут сосуществовать:',
        ],
      },
      packageCode,
      {
        kind: 'p',
        parts: [
          'Импорт пакетов подходит для быстрой клиентской интеграции. Копии из реестра или CLI используйте, когда хост рендерит серверные компоненты или нужен редактируемый исходник. В ',
          { link: { href: '/docs/installation', text: 'руководстве по установке' } },
          ' есть полное сравнение, включая поведение на границе серверных компонентов.',
        ],
      },
      { kind: 'h2', text: '3. Добавьте тему' },
      {
        kind: 'p',
        parts: [
          'Пользователи Tailwind 3 могут взять опубликованный preset; пользователи Tailwind 4 импортируют CSS-first контракт темы. Оба варианта используют одни и те же семантические токены и поддерживают собственный ',
          { code: 'createTheme()' },
          '.',
        ],
      },
      tailwind3Code,
      tailwind4Code,
      { kind: 'p', parts: ['Не используете Tailwind? Импортируйте готовые таблицы стилей:'] },
      prebuiltCode,
      {
        kind: 'p',
        parts: [
          'Чтобы брендировать компоненты, передайте цвета в ',
          { code: 'createTheme()' },
          ' и один раз выведите CSS-переменные. ',
          { link: { href: '/docs/theming', text: 'Руководство по темам' } },
          ' описывает пресеты, тёмный режим и радиус.',
        ],
      },
      { kind: 'h2', text: '4. Соберите экран' },
      {
        kind: 'p',
        parts: [
          'Начните со структуры страницы: Section отвечает за полосу, Hero — за заголовок, а Card и Button — за контент. Провайдеры и глобальное состояние не нужны.',
        ],
      },
      heroCode,
      {
        kind: 'p',
        parts: [
          'Нужна другая форма? У Hero есть раздельные, центрированные, стековые и наложенные макеты; живые примеры — на ',
          { link: { href: '/docs/components/hero', text: 'странице Hero' } },
          '. Каждая страница компонента следует одной структуре: превью / код / использование / типы.',
        ],
      },
      { kind: 'h2', text: '5. Проверьте и подключите агента' },
      {
        kind: 'p',
        parts: [
          'Сначала выполните обычные проверки: ',
          { code: 'typecheck' },
          ', ',
          { code: 'lint' },
          ' и продакшен-сборку. Затем дайте своему агенту тот же источник истины:',
        ],
      },
      mcpCode,
      {
        kind: 'p',
        parts: [
          'Цикл: ',
          { em: 'поиск, чтение манифеста, написание JSX, проверка' },
          '. Валидатор ловит выдуманные props, недопустимые значения enum и отсутствующие обязательные props до того, как диф попадёт в редактор.',
        ],
      },
      loopCode,
      { kind: 'h2', text: 'Решение проблем' },
      {
        kind: 'callouts',
        items: [
          {
            title: 'Компоненты рендерятся без стилей',
            body: 'Tailwind не просканировал вывод пакета или отсутствуют CSS-переменные. Добавьте каталоги dist из @slipstream-ui в пути content/@source и загрузите переменные темы. См. «Установка» и «Tailwind v4».',
          },
          {
            title: 'Переменные темы применяются ко всему документу',
            body: 'Не задавайте переменные темы на document.documentElement из демо или компонента. Ограничьте их корнем приложения или обёрткой. Компонент ThemeShowcase — эталон для ограниченных превью.',
          },
          {
            title: 'Клиентский хук падает в серверном компоненте',
            body: 'Интерактивные компоненты (RangeSlider, TableOfContents, Stepper с onStepClick) — клиентские. Поместите их в файл с "use client" или импортируйте через клиентскую границу.',
          },
          {
            title: 'Агент по-прежнему выдумывает props',
            body: 'Убедитесь, что MCP-сервер запущен и предоставляет пять инструментов. Добавьте в файл правил требование вызывать get_component_manifest и validate_usage перед выводом JSX.',
          },
          {
            title: 'В тёмном режиме мелькает неверная тема',
            body: 'Добавьте в head скрипт темы, выполняемый до отрисовки: он читает сохранённую настройку и переключает класс dark до гидратации React.',
          },
        ],
      },
      { kind: 'h2', text: 'Далее' },
      {
        kind: 'cards',
        items: [
          {
            href: '/docs/components',
            title: 'Компоненты',
            body: 'Просматривайте каждый компонент с живыми превью и таблицами props.',
          },
          {
            href: '/docs/guides/react-hook-form',
            title: 'Формы',
            body: 'Свяжите FormField и валидацию с React Hook Form.',
          },
          {
            href: '/docs/guides/ai-chat-ui',
            title: 'Чат-интерфейс ИИ',
            body: 'Соберите стриминговую поверхность ассистента от начала до конца.',
          },
          {
            href: '/docs/ai-first',
            title: 'AI-first модель',
            body: 'Как связаны манифесты, MCP и валидация.',
          },
        ],
      },
    ],
  },

  ar: {
    title: 'البدء السريع',
    lead: [
      'خمس خطوات من تطبيق React فارغ إلى شاشة بسمة وحلقة وكيل تعمل. يوفّر Slipstream {componentCount} مكوّنًا؛ توصل هذه الصفحة واحدًا ثم تُظهر أين توجد البقية.',
    ],
    blocks: [
      {
        kind: 'chips',
        items: [
          { href: '/docs/installation', text: 'مرجع التثبيت الكامل →' },
          { href: '/docs/ai-first', text: 'لماذا تهم المواصفة →' },
          { href: '/docs/components', text: 'تصفح المكونات →' },
        ],
      },
      { kind: 'h2', text: '1. تحقّق من المتطلبات' },
      {
        kind: 'ul',
        items: [
          ['Node.js 20.9 أو أحدث، وpnpm 8 أو أحدث (npm وyarn يعملان أيضًا).'],
          ['React 18 أو 19.'],
          [
            'Tailwind CSS 3.4 أو 4.x، أو أوراق الأنماط المبنية مسبقًا عندما لا يستخدم التطبيق Tailwind.',
          ],
          ['يُوصى بـ TypeScript؛ كل حزمة تأتي مع أنواعها.'],
        ],
      },
      { kind: 'h2', text: '2. التثبيت' },
      {
        kind: 'p',
        parts: [
          'أقصر طريق هو CLI: يكتشف Next.js أو Vite، ويكتب ',
          { code: 'slipstream.config.json' },
          '، وينشئ مجلد المكونات، ويحقن متغيرات السمة.',
        ],
      },
      cliCode,
      {
        kind: 'p',
        parts: [
          'تفضّل استيراد الحزم أم نسخ الشيفرة إلى مستودعك؟ المساران مدعومان ويمكن أن يتعايشا:',
        ],
      },
      packageCode,
      {
        kind: 'p',
        parts: [
          'استخدم استيراد الحزم لتكامل سريع في العميل، ونسخ السجل أو CLI عندما يعرض المضيف مكونات خادم أو يحتاج شيفرة قابلة للتحرير. يتضمن ',
          { link: { href: '/docs/installation', text: 'دليل التثبيت' } },
          ' المقارنة الكاملة، بما في ذلك سلوك حدود مكونات الخادم.',
        ],
      },
      { kind: 'h2', text: '3. أضف السمة' },
      {
        kind: 'p',
        parts: [
          'يمكن لمستخدمي Tailwind 3 استخدام الإعداد المسبق المنشور، ويستورد مستخدمو Tailwind 4 عقد السمة CSS-first. كلاهما يعيّن الرموز الدلالية نفسها، وكلاهما يدعم ',
          { code: 'createTheme()' },
          ' مخصصًا.',
        ],
      },
      tailwind3Code,
      tailwind4Code,
      { kind: 'p', parts: ['لا تستخدم Tailwind؟ استورد أوراق الأنماط المبنية مسبقًا بدلًا من ذلك:'] },
      prebuiltCode,
      {
        kind: 'p',
        parts: [
          'لتطبيق هويتك على المكونات، مرّر ألوانك إلى ',
          { code: 'createTheme()' },
          ' وأصدر متغيرات CSS مرة واحدة. يغطي ',
          { link: { href: '/docs/theming', text: 'دليل السمات' } },
          ' الإعدادات المسبقة والوضع الداكن ونصف القطر.',
        ],
      },
      { kind: 'h2', text: '4. ركّب شاشة' },
      {
        kind: 'p',
        parts: [
          'ابدأ ببنية الصفحة: Section يتولى الشريط، وHero يتولى العنوان، وCard وButton يتوليان المحتوى. لا حاجة إلى مزوّدات أو حالة عامة.',
        ],
      },
      heroCode,
      {
        kind: 'p',
        parts: [
          'تحتاج شكلًا مختلفًا؟ يوفر Hero تخطيطات منقسمة ومركزة ومكدسة ومتراكبة؛ راجع ',
          { link: { href: '/docs/components/hero', text: 'صفحة Hero' } },
          ' للمعاينات الحية. كل صفحة مكوّن تتبع البنية نفسها: معاينة / شيفرة / استخدام / أنواع.',
        ],
      },
      { kind: 'h2', text: '5. تحقّق ثم وصّل وكيلك' },
      {
        kind: 'p',
        parts: [
          'شغّل فحوصاتك المعتادة أولًا: ',
          { code: 'typecheck' },
          ' و',
          { code: 'lint' },
          ' وبناء الإنتاج. ثم امنح وكيل البرمجة المصدر نفسه للحقيقة:',
        ],
      },
      mcpCode,
      {
        kind: 'p',
        parts: [
          'الحلقة هي ',
          { em: 'البحث، وقراءة المواصفة، وكتابة JSX، والتحقق' },
          '. يلتقط المدقق الخصائص المتوهمة وقيم enum غير الصالحة والخصائص المطلوبة الناقصة قبل أن يصل الفرق إلى محررك.',
        ],
      },
      loopCode,
      { kind: 'h2', text: 'استكشاف الأخطاء' },
      {
        kind: 'callouts',
        items: [
          {
            title: 'تظهر المكونات بلا أنماط',
            body: 'لم يفحص Tailwind مخرجات الحزمة، أو أن متغيرات CSS مفقودة. أضف مجلدات dist الخاصة بـ @slipstream-ui إلى مسارات content/@source وحمّل متغيرات السمة. راجع التثبيت وTailwind v4.',
          },
          {
            title: 'متغيرات السمة تُطبَّق على المستند كله',
            body: 'لا تضبط متغيرات السمة على document.documentElement من عرض تجريبي أو مكوّن. احصرها في جذر تطبيقك أو في غلاف. مكوّن ThemeShowcase هو المرجع للمعاينات المحصورة.',
          },
          {
            title: 'خطأ في خطاف عميل داخل مكوّن خادم',
            body: 'المكونات التفاعلية (RangeSlider وTableOfContents وStepper مع onStepClick) مكونات عميل. ضعها في ملف يحتوي "use client" أو استوردها من حدود العميل.',
          },
          {
            title: 'الوكيل لا يزال يختلق الخصائص',
            body: 'تأكد من تشغيل خادم MCP وأنه يعرض أدواته الخمس. أضف إلى ملف القواعد تعليمة تفرض get_component_manifest وvalidate_usage قبل إخراج JSX.',
          },
          {
            title: 'الوضع الداكن يعرض السمة الخاطئة لحظة',
            body: 'أضف في head المستند سكربت سمة يعمل قبل الرسم، يقرأ التفضيل المحفوظ ويبدّل الفئة dark قبل ترطيب React.',
          },
        ],
      },
      { kind: 'h2', text: 'التالي' },
      {
        kind: 'cards',
        items: [
          {
            href: '/docs/components',
            title: 'المكونات',
            body: 'تصفح كل مكوّن مع معاينات حية وجداول خصائص.',
          },
          {
            href: '/docs/guides/react-hook-form',
            title: 'النماذج',
            body: 'وصّل FormField والتحقق عبر React Hook Form.',
          },
          {
            href: '/docs/guides/ai-chat-ui',
            title: 'واجهة دردشة الذكاء الاصطناعي',
            body: 'ابنِ سطح مساعد بالبث من البداية إلى النهاية.',
          },
          {
            href: '/docs/ai-first',
            title: 'نموذج AI-first',
            body: 'كيف تتكامل المواصفات وMCP والتحقق.',
          },
        ],
      },
    ],
  },
};
