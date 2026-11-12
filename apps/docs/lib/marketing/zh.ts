import type { MarketingCopy } from './types';

export const zh: MarketingCopy = {
  home: {
    whatsNew: '最新动态 →',
    aiFirstBadge: 'AI 优先 · MIT',
    reactBadge: 'React 18+',
    heroTitleLead: '你的 AI 已经了解',
    heroTitleHighlight: '你的设计系统',
    heroDescription:
      'Slipstream UI 是为 AI 辅助开发打造的组件系统。每个组件都附带机器可读的规范、提供该规范的 MCP 服务器，以及让智能体保持准确的校验器。',
    getStarted: '开始使用',
    starOnGithub: '在 GitHub 上加星',
    copy: '复制',
    copied: '已复制',
    liveDemoNote: '实时演示 —— 完全由 Slipstream UI 构建',
    welcomeTitle: '询问关于 Slipstream',
    welcomeSuggestions: ['它有什么不同？', '清单是如何工作的？'],
    promptPlaceholder: '试一试…',
    send: '发送',
    agentStripLabel: '流畅对话',
    stats: ['个组件', '份机器可读规范', '个面向智能体的 MCP 工具', '个允许的臆造 prop'],
    featuresHeading: '为当下编写软件的方式而构建',
    featuresIntro:
      '你的一半界面由模型编写。Slipstream 给它们比从训练数据中抓取的文档更好的东西：可查询的规范，以及可自我检查的护栏。',
    features: [
      {
        title: '机器可读清单',
        body: '每个组件都附带 COMPONENT_MANIFEST：精确的 prop 模式、默认值、反模式、无障碍要求和组合规则。',
      },
      {
        title: 'validate_usage MCP 工具',
        body: '智能体在输出前依据清单校验生成的 JSX —— 臆造的 prop 和缺失的必填项可以在发布前被发现。',
      },
      {
        title: '兼容 shadcn 的注册表',
        body: '通过任何兼容 shadcn 的 CLI 安装真实源文件，或使用软件包。你的代码库，你的规则。',
      },
      {
        title: '完全无状态',
        body: '没有运行时锁定。可接入任何后端 —— Vercel AI SDK、LangGraph 或原始流。组件负责渲染；状态由你掌控。',
      },
      {
        title: '经过测试的无障碍',
        body: '每个组件都有 jest-axe 测试套件、aria-busy 流式状态、礼貌的完成播报以及减少动效变体。',
      },
      {
        title: '可细化到令牌的主题',
        body: '一次 createTheme() 调用即可输出所有 CSS 变量。圆角、深色模式、即时切换 —— 无需重建。',
      },
    ],
    howHeading: 'AI 如何使用它',
    howIntro: '三个步骤，无需微调，无需提示词咒语。',
    steps: [
      {
        title: '连接',
        body: '将 Claude Code 或 Cursor 指向 Slipstream MCP 服务器，或提供 llms.txt 与 /llm markdown 路由。',
      },
      {
        title: '查询规范',
        body: '智能体调用 get_component_manifest 和 get_usage_examples —— 精确的 prop、默认值和反模式。',
      },
      {
        title: '自我校验',
        body: '输出前，validate_usage 会依据清单检查生成的 JSX 并纠正臆造的 prop。',
      },
    ],
    validatorHeading: '捕获失败模式',
    validatorIntroBefore: '智能体会猜测',
    validatorIntroAfter: '然后校验清单，在写入之前拒绝该片段。',
    validatorCards: [
      { title: '1. 臆造用法', note: '该 prop 不存在，且缺少必需的 onSubmit。' },
      { title: '2. validate_usage 响应', note: '为展示已截断；该工具还会返回清单中的反模式。' },
      { title: '3. 正确用法', note: '依据文档、MCP 服务器和注册表提供的同一契约完成校验。' },
    ],
    themesHeading: '库自带主题',
    themesIntro: '包含 Default、Violet 和 Zinc 预设。在下方切换 —— 这是实时主题，不是截图。',
    comparisonHeading: '对比',
    comparisonIntro: '其他库为人类编写文档。Slipstream 为双方编写文档。',
    comparisonCapability: '能力',
    comparisonCapabilities: [
      '分发模式',
      '提供的组件',
      '每个组件的机器可读规范',
      'MCP 服务器',
      '依据规范校验生成的 JSX',
      'llms.txt',
      '每个组件/页面的标准 markdown',
      'AI 聊天组件',
      '状态与传输',
      '样式',
      '主题预设',
      '对等依赖',
      '许可证',
    ],
    comparisonFootnote:
      '反映截至 2026 年 11 月各项目的公开文档和已发布包 · ✅ 提供 · 🟡 部分提供或采用不同模式 · — 此用途未提供',
    comparisonCards: [
      {
        title: '选择 Slipstream',
        body: '当智能体必须生成符合设计系统的正确代码，并且你希望发布前有校验器把关。',
      },
      {
        title: '选择 shadcn/ui + AI Elements',
        body: '当生态系统规模和拥有超大基础组件代码库最重要时。',
      },
      {
        title: '选择 assistant-ui',
        body: '当你需要经过实战检验的聊天运行时：流式传输、工具和生成式 UI 作为核心产品。',
      },
    ],
    templatesHeading: '从模板开始',
    templatesIntro: '完全由 Slipstream 组件构建、可直接复制粘贴的完整模式。',
    browseTemplates: '浏览所有模板 →',
    templates: [
      { name: '流式聊天', body: 'Markdown 回复、停止生成、滚动固定、反馈操作。' },
      { name: '智能体仪表板', body: '带人工审批的工具调用、推理步骤和任务进度。' },
      { name: 'RAG 引用', body: '带内联引用标签和来源页脚的有依据答案。' },
    ],
    agentPathTitle: '面向智能体开发者 →',
    agentPathBody:
      '将 MCP 服务器接入 Claude Code 或 Cursor，在输出前运行 validate_usage，或提供 llms.txt 和 markdown 路由 —— 五个工具，三种使用方式。',
    productPathTitle: '面向产品团队 →',
    productPathBody:
      '用无状态组件、jest-axe 覆盖和你自己的后端，发布生产级聊天界面 —— 流式 markdown、停止生成、引用和审批。',
    ctaHeading: '更快发布 AI 界面',
    ctaBody: '{componentCount} 个组件 · {componentCount} 份机器可读规范 · 发布前校验生成的用法。',
    startBuilding: '开始构建',
  },
  about: {
    title: '关于 Slipstream UI',
    description:
      '一个小型开源项目，只有一个论点：编码智能体也是用户，它们理应获得机器可读的契约。',
    updated: '2026 年 11 月',
    sections: [
      {
        heading: '为什么存在',
        blocks: [
          {
            type: 'p',
            text: 'AI 编码助手擅长编写 React，却不擅长记住从未见过的设计系统的精确 prop 名称、必填字段和无障碍规则。常见的解决办法是增加提示上下文或写更长的 README —— 但组件一改，两者都会失效。',
          },
          {
            type: 'p',
            text: 'Slipstream UI 反转方向：事实来源随代码一起发布。{componentCount} 个组件中的每一个都携带 `COMPONENT_MANIFEST`；MCP 服务器提供这些清单，`validate_usage` 在代码进入编辑器之前依据清单校验生成的 JSX。',
          },
        ],
      },
      {
        heading: '原则',
        blocks: [
          {
            type: 'ul',
            items: [
              '**智能体是一等用户。** 智能体可查询的契约，与人类可读的 prop 表同样重要。',
              '**设计上无状态。** 组件负责渲染；状态、传输和数据由你掌控。没有运行时锁定，也没有隐藏的提供者。',
              '**无障碍不是变体。** 键盘行为、ARIA 连接和减少动效路径都是组件契约的一部分，并由 jest-axe 套件覆盖。',
              '**代码属于你。** 通过 npm 包或兼容 shadcn 的注册表安装，并将源码保留在你的仓库中。',
            ],
          },
        ],
      },
      {
        heading: '谁在维护',
        blocks: [
          {
            type: 'p',
            text: 'Slipstream UI 由 [Michael McShinsky]({githubProfile}) 公开构建和维护。欢迎在 [GitHub 仓库]({repo}) 提交 issue、参与讨论和发起 pull request。',
          },
          {
            type: 'p',
            text: '当前版本：`v{version}`。项目遵循语义化版本，并从 CI 发布并附带 npm 来源证明。',
          },
        ],
      },
      {
        heading: '如何验证这些说法',
        blocks: [
          {
            type: 'ul',
            items: [
              '[阅读清单](/docs/ai-manifests)并与组件源码对比。',
              '[运行 MCP 服务器](/docs/mcp)并对故意写坏的片段调用 `validate_usage`。',
              '[查看无障碍声明](/accessibility)与自动审计范围。',
              '[安全政策]({repo}/blob/main/SECURITY.md)和 [security.txt](/.well-known/security.txt)。',
            ],
          },
        ],
      },
    ],
  },
  contact: {
    title: '联系我们',
    description: '通过电子邮件、GitHub 或下方表单联系维护者。',
    emailHeading: '电子邮件',
    issuesHeading: '问题与讨论',
    issuesBody: '错误和功能请求最好提交到 [GitHub]({repo}/issues)。',
    addressHeading: '邮寄地址',
    formHeading: '发送消息',
    nameLabel: '姓名',
    emailLabel: '电子邮件',
    messageLabel: '消息',
    send: '发送消息',
    privacyNote: '我们仅使用你的消息进行回复。详情请参阅隐私政策。',
    honeypotLabel: '请勿填写此项：',
  },
  accessibility: {
    title: '无障碍声明',
    description: 'Slipstream UI 的组件库和本文档站点均以 WCAG 2.2 AA 级为目标。',
    updated: '2026 年 11 月',
    sections: [
      {
        heading: '合规目标',
        blocks: [
          {
            type: 'p',
            text: '组件库和本网站均依据 [WCAG 2.2 AA 级](https://www.w3.org/TR/WCAG22/)开发。无障碍回归被视为缺陷，而非增强。',
          },
          {
            type: 'p',
            text: '本声明涵盖自动合规证据和已知差距。它并非声称已完全通过人工合规：与真实用户进行的辅助技术测试仍在继续。',
          },
        ],
      },
      {
        heading: '组件库如何测试',
        blocks: [
          {
            type: 'ul',
            items: [
              '**jest-axe 套件**覆盖每个组件，并在每次 pull request 的 CI 中运行。',
              '**键盘行为**作为组件契约的一部分实现（复合控件中的漫游 tabindex、Escape/方向键处理、可见焦点环）。',
              '**减少动效**在流式指示器、抽屉、对话框和滚动行为中得到遵循。',
              '**ARIA 契约**记录在每个 COMPONENT_MANIFEST 中，并由智能体通过 MCP 看到的同一规则强制执行。',
            ],
          },
          {
            type: 'p',
            text: '每个组件的细节请参阅[面向 AI 生成界面的无障碍指南](/docs/guides/accessibility-ai)。',
          },
        ],
      },
      {
        heading: '本网站如何测试',
        blocks: [
          {
            type: 'p',
            text: '文档站点在发布检查清单中会对主要路由运行自动 axe-core 审计。审计覆盖 WCAG 2.0/2.1/2.2 的 A 和 AA 规则，并可从仓库复现：',
          },
          {
            type: 'code',
            text: 'pnpm --filter slipstream-ui-docs build\npnpm --filter slipstream-ui-docs start -- -p 3111\npnpm --filter slipstream-ui-docs audit:a11y -- http://localhost:3111',
          },
          {
            type: 'p',
            text: '覆盖路由：首页、文档索引、安装、代表性组件页、MCP、模板、更新日志、关于、本页、联系和法务页面。每条路由均在**浅色和深色模式**下审计。2026 年 11 月 4 日，套件在两种模式下通过了全部 13 条路由（26 次页面运行，0 违规），Lighthouse 在抽样路由上报告无障碍 100 分。',
          },
          {
            type: 'p',
            text: '自动化工具只能检测部分问题；它无法验证阅读顺序、任务完成或替代文本的质量。',
          },
        ],
      },
      {
        heading: '已知限制',
        blocks: [
          {
            type: 'ul',
            items: [
              '完整的屏幕阅读器人工审计（Windows 上的 NVDA、macOS/iOS 上的 VoiceOver）尚未完成。自动覆盖不能替代它。',
              '文档中链接的第三方内容（GitHub、外部标准页面）不在我们的控制范围内。',
              '部分交互式演示使用计时器模拟流式传输和智能体行为；它们仅用于说明且可键盘操作，但不是生产级传输。',
            ],
          },
        ],
      },
      {
        heading: '报告障碍',
        blocks: [
          {
            type: 'p',
            text: '如果有什么阻碍了你，请[提交 issue]({repo}/issues/new)，说明页面、使用的辅助技术以及你的预期。安全相关的报告应遵循[安全政策]({repo}/blob/main/SECURITY.md)。也可以发送邮件至 [{email}](mailto:{email})。',
          },
          { type: 'p', text: '我们力求在五个工作日内确认收到无障碍报告。' },
        ],
      },
    ],
  },
  privacy: {
    title: '隐私政策',
    description: '简要说明：我们保存你的主题偏好，仅在你接受 cookie 时统计流量，绝不投放广告或进行跨站跟踪。',
    updated: '2026 年 11 月',
    sections: [
      {
        heading: '我们在你的设备上保存什么',
        blocks: [
          {
            type: 'ul',
            items: [
              '`slipstream-theme` —— 你的浅色/深色偏好，避免站点闪出错误主题。',
              '`slipstream-consent` —— 你的 cookie 选择，避免重复询问。',
            ],
          },
          { type: 'p', text: '这两个值都不会发送到服务器。清除站点数据即可重置它们。' },
        ],
      },
      {
        heading: '分析',
        blocks: [
          {
            type: 'p',
            text: '分析**默认关闭**。如果你选择“全部接受”，我们会加载隐私友好的分析脚本，记录汇总的页面浏览（URL、来源、粗略的设备/浏览器信息）。我们不使用广告 cookie、指纹识别或跨站画像。',
          },
          {
            type: 'p',
            text: '你可以随时在浏览器中清除本站数据以撤回同意；下次访问时横幅会再次出现。',
          },
        ],
      },
      {
        heading: '联系消息',
        blocks: [
          {
            type: 'p',
            text: '当你使用联系表单时，我们会收到你提交的姓名、电子邮件地址和消息。表单提交由我们的托管服务商（Netlify Forms）处理，仅用于回复你。我们最多保留 24 个月。',
          },
        ],
      },
      {
        heading: '第三方请求',
        blocks: [
          {
            type: 'p',
            text: '首页会从你的浏览器请求公开的 GitHub API 以显示实时星标数。与任何对 github.com 的请求一样，这会依据其隐私政策向 GitHub 暴露你的 IP 地址和用户代理。该请求不设置 cookie，也不会加载其他第三方资源。',
          },
        ],
      },
      {
        heading: '托管日志',
        blocks: [
          {
            type: 'p',
            text: '我们的托管服务商为安全和防滥用记录标准请求日志（IP 地址、用户代理、请求的 URL），并按他们的政策保留。',
          },
        ],
      },
      {
        heading: '我们不做的事',
        blocks: [
          {
            type: 'ul',
            items: ['没有广告或再营销像素。', '不出售或出租个人数据。', '没有广告画像或跨站跟踪。'],
          },
        ],
      },
      {
        heading: '你的权利',
        blocks: [
          {
            type: 'p',
            text: '视你所在地区，你可能有权访问、更正、导出或删除我们持有的你的个人数据，并反对处理。发送邮件至 [{email}](mailto:{email})，我们将在 30 天内回复。你也可以向当地监管机构投诉。',
          },
        ],
      },
      {
        heading: '儿童',
        blocks: [{ type: 'p', text: '本站是开发者资源，不面向 16 岁以下儿童。' }],
      },
      {
        heading: '变更',
        blocks: [
          {
            type: 'p',
            text: '当做法发生变化时，我们会更新本页及其“最后更新”日期。另请参阅我们的[使用条款](/terms)。',
          },
        ],
      },
      {
        heading: '联系',
        blocks: [{ type: 'p', text: '关于本政策的问题：[{email}](mailto:{email})。' }],
      },
    ],
  },
  terms: {
    title: '使用条款',
    description: '适用于本网站和 Slipstream UI 软件包的通俗条款。',
    updated: '2026 年 11 月',
    sections: [
      {
        heading: '软件',
        blocks: [
          {
            type: 'p',
            text: 'Slipstream UI 软件包依据 [MIT 许可证]({repo}/blob/main/LICENSE)发布。你可以商业使用、修改和再分发，前提是包含版权声明和许可声明。若与本文冲突，以许可证文本为准。',
          },
        ],
      },
      {
        heading: '无担保',
        blocks: [
          {
            type: 'p',
            text: '本网站、文档、清单、MCP 工具和软件包均**按原样**提供，不作任何明示或暗示的担保，包括特定用途适用性。你有责任审查生成的代码并做出自己的产品决策。',
          },
        ],
      },
      {
        heading: '可接受的使用',
        blocks: [
          {
            type: 'ul',
            items: [
              '不得利用本站违法、侵权或传播恶意软件。',
              '不得试图干扰或使托管基础设施过载。',
              '不得将修改过的软件包版本冒充为官方发布。',
              '速率限制和合理使用期望适用于任何托管端点。',
            ],
          },
        ],
      },
      {
        heading: '责任限制',
        blocks: [
          {
            type: 'p',
            text: '在法律允许的最大范围内，维护者不对因使用本站或软件包而产生的间接、附带或后果性损害，或利润、数据损失承担责任。',
          },
        ],
      },
      {
        heading: '第三方链接和服务',
        blocks: [
          {
            type: 'p',
            text: '本站链接到 GitHub、npm 及其他第三方服务。你使用这些服务时适用其条款和隐私政策。',
          },
        ],
      },
      {
        heading: '变更',
        blocks: [
          {
            type: 'p',
            text: '我们可能会更新这些条款；“最后更新”日期也会随之变化。更新后继续使用即表示你接受修订后的条款。',
          },
        ],
      },
      {
        heading: '联系',
        blocks: [
          {
            type: 'p',
            text: '关于这些条款的问题：[{email}](mailto:{email})。另请参阅[隐私政策](/privacy)。',
          },
        ],
      },
    ],
  },
};
