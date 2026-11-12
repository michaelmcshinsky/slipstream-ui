import type { MarketingCopy } from './types';

export const ja: MarketingCopy = {
  home: {
    whatsNew: '新着情報 →',
    aiFirstBadge: 'AI ファースト · MIT',
    reactBadge: 'React 18+',
    heroTitleLead: 'あなたの AI はすでに',
    heroTitleHighlight: 'デザインシステムを知っています',
    heroDescription:
      'Slipstream UI は AI 支援開発のために作られたコンポーネントシステムです。すべてのコンポーネントに機械可読な仕様、それを配信する MCP サーバー、エージェントを正確に保つバリデータが付属します。',
    getStarted: 'はじめる',
    starOnGithub: 'GitHub でスター',
    copy: 'コピー',
    copied: 'コピーしました',
    liveDemoNote: 'ライブデモ — すべて Slipstream UI で構築',
    welcomeTitle: 'Slipstream について質問',
    welcomeSuggestions: ['何が違うの？', 'マニフェストはどう動く？'],
    promptPlaceholder: '試してみる…',
    send: '送信',
    agentStripLabel: 'スムーズに連携',
    stats: ['コンポーネント', '機械可読な仕様', 'エージェント向け MCP ツール', '許可される幻覚プロパティ'],
    featuresHeading: 'いまのソフトウェア開発の進め方に合わせて',
    featuresIntro:
      'UI の半分はモデルが書きます。Slipstream は学習データから拾った文書より良いものを渡します。問い合わせできる仕様と、自己検証できるガードレールです。',
    features: [
      {
        title: '機械可読なマニフェスト',
        body: 'すべてのコンポーネントに COMPONENT_MANIFEST が付属します。正確なプロパティスキーマ、既定値、アンチパターン、アクセシビリティ要件、コンポジション規約。',
      },
      {
        title: 'validate_usage MCP ツール',
        body: 'エージェントは出力前に生成した JSX をマニフェストで検証します。幻覚プロパティや必須項目の欠落を出荷前に検出できます。',
      },
      {
        title: 'shadcn 互換レジストリ',
        body: 'shadcn 互換の CLI で実際のソースファイルを導入するか、パッケージを使います。あなたのコードベースにあなたのルール。',
      },
      {
        title: '完全にステートレス',
        body: 'ランタイム依存はありません。Vercel AI SDK、LangGraph、生のストリームなど任意のバックエンドを利用できます。描画はコンポーネント、状態はあなたのものです。',
      },
      {
        title: 'テスト済みのアクセシビリティ',
        body: 'すべてのコンポーネントに jest-axe スイート、aria-busy のストリーミング状態、丁寧な完了通知、モーション低減のバリエーション。',
      },
      {
        title: 'トークン単位でテーマ化',
        body: 'createTheme() を1回呼ぶだけで全 CSS 変数を出力します。角丸、ダークモード、即時切り替え、再ビルド不要。',
      },
    ],
    howHeading: 'AI が使う流れ',
    howIntro: '3 ステップ。ファインチューニングもプロンプトの呪文も不要。',
    steps: [
      {
        title: '接続',
        body: 'Claude Code や Cursor を Slipstream MCP サーバーに向けるか、llms.txt と /llm の markdown ルートを配信します。',
      },
      {
        title: '仕様を問い合わせる',
        body: 'エージェントは get_component_manifest と get_usage_examples を呼びます。正確なプロパティ、既定値、アンチパターン。',
      },
      {
        title: '自己検証',
        body: '出力前に validate_usage が生成した JSX をマニフェストと照合し、幻覚プロパティを修正します。',
      },
    ],
    validatorHeading: '失敗パターンを捕捉',
    validatorIntroBefore: 'エージェントが',
    validatorIntroAfter: 'と推測しますが、マニフェストを確認して書き込まれる前に拒否します。',
    validatorCards: [
      { title: '1. 幻覚された使用法', note: 'そのプロパティは存在せず、必須の onSubmit も欠けています。' },
      { title: '2. validate_usage の応答', note: '表示用に短縮しています。ツールはマニフェストのアンチパターンも返します。' },
      { title: '3. 正しい使用法', note: 'ドキュメント、MCP サーバー、レジストリが配信する同じ契約で検証済みです。' },
    ],
    themesHeading: 'ライブラリに同梱のテーマ',
    themesIntro: 'Default、Violet、Zinc のプリセット付き。下で切り替えられます。スクリーンショットではなくライブのテーマです。',
    comparisonHeading: '比較',
    comparisonIntro: '他のライブラリは人間のために文書化します。Slipstream は両方のために文書化します。',
    comparisonCapability: '機能',
    comparisonCapabilities: [
      '配布モデル',
      '同梱コンポーネント',
      'コンポーネントごとの機械可読仕様',
      'MCP サーバー',
      '生成 JSX を仕様で検証',
      'llms.txt',
      'コンポーネント／ページごとの正規 markdown',
      'AI チャットコンポーネント',
      '状態とトランスポート',
      'スタイリング',
      'テーマプリセット',
      'ピア依存',
      'ライセンス',
    ],
    comparisonFootnote:
      '2026年11月時点の各プロジェクトの公開ドキュメントと公開パッケージを反映 · ✅ 対応 · 🟡 一部対応または別モデル · — この目的では未対応',
    comparisonCards: [
      {
        title: 'Slipstream を選ぶ',
        body: 'エージェントがデザインシステム準拠の正しいコードを生成する必要があり、出荷前にバリデータを挟みたいとき。',
      },
      {
        title: 'shadcn/ui + AI Elements を選ぶ',
        body: 'エコシステムの規模と、非常に大きなプリミティブ基盤をコピーして所有することを最優先するとき。',
      },
      {
        title: 'assistant-ui を選ぶ',
        body: '実績あるチャットランタイム（ストリーミング、ツール、生成 UI）を製品の中心に据えたいとき。',
      },
    ],
    templatesHeading: 'テンプレートから始める',
    templatesIntro: 'Slipstream コンポーネントだけで作られた、コピー＆ペースト可能な完全なパターン。',
    browseTemplates: 'すべてのテンプレートを見る →',
    templates: [
      { name: 'ストリーミングチャット', body: 'Markdown 応答、生成停止、スクロール固定、フィードバック操作。' },
      { name: 'エージェントダッシュボード', body: '人間の承認を伴うツール呼び出し、推論ステップ、タスク進捗。' },
      { name: 'RAG 引用', body: 'インライン引用チップとソースフッターを備えた根拠ある回答。' },
    ],
    agentPathTitle: 'エージェント開発者へ →',
    agentPathBody:
      'MCP サーバーを Claude Code や Cursor に接続し、出力前に validate_usage を実行するか、llms.txt と markdown ルートを配信します。5 つのツール、3 つの利用経路。',
    productPathTitle: 'プロダクトチームへ →',
    productPathBody:
      '本番のチャット面（ストリーミング Markdown、生成停止、引用、承認）を、ステートレスなコンポーネントと jest-axe カバレッジ、自前のバックエンドで出荷できます。',
    ctaHeading: 'AI インターフェースをより速く出荷',
    ctaBody:
      '{componentCount} コンポーネント · {componentCount} の機械可読仕様 · 出荷前に生成された使用法を検証。',
    startBuilding: '構築を始める',
  },
  about: {
    title: 'Slipstream UI について',
    description:
      'ひとつの主張だけを持つ小さなオープンソースプロジェクトです。コーディングエージェントもユーザーであり、機械可読な契約に値します。',
    updated: '2026年11月',
    sections: [
      {
        heading: 'なぜ存在するのか',
        blocks: [
          {
            type: 'p',
            text: 'AI コーディングアシスタントは React を書くのは得意ですが、見たことのないデザインシステムの正確なプロパティ名、必須項目、アクセシビリティ規則を覚えておくのは苦手です。よくある対処はプロンプトの文脈を増やすか README を大きくすることですが、どちらもコンポーネントが変わった瞬間にずれます。',
          },
          {
            type: 'p',
            text: 'Slipstream UI は方向を逆にします。真実の源をコードと一緒に配布します。{componentCount} 個のコンポーネントすべてが `COMPONENT_MANIFEST` を持ち、MCP サーバーがそれを配信し、`validate_usage` がエディタに届く前に生成 JSX を検証します。',
          },
        ],
      },
      {
        heading: '原則',
        blocks: [
          {
            type: 'ul',
            items: [
              '**エージェントは一級のユーザー。** エージェントが問い合わせられる契約は、人間が読めるプロパティ表と同じくらい重要です。',
              '**設計からステートレス。** コンポーネントは描画し、状態・トランスポート・データはあなたが持ちます。ランタイムの囲い込みも隠れたプロバイダもありません。',
              '**アクセシビリティはバリエーションではない。** キーボード操作、ARIA の配線、モーション低減の経路はコンポーネント契約の一部で、jest-axe スイートが網羅します。',
              '**コードはあなたのもの。** npm パッケージか shadcn 互換レジストリで導入し、ソースをリポジトリに置けます。',
            ],
          },
        ],
      },
      {
        heading: '誰が維持しているか',
        blocks: [
          {
            type: 'p',
            text: 'Slipstream UI は [Michael McShinsky]({githubProfile}) によってオープンに構築・維持されています。Issue、ディスカッション、プルリクエストは [GitHub リポジトリ]({repo}) で歓迎します。',
          },
          {
            type: 'p',
            text: '現在のバージョン: `v{version}`。セマンティックバージョニングに従い、CI から npm provenance 付きで公開しています。',
          },
        ],
      },
      {
        heading: '主張の確かめ方',
        blocks: [
          {
            type: 'ul',
            items: [
              '[マニフェストを読む](/docs/ai-manifests) とコンポーネントのソースを比較してください。',
              '[MCP サーバーを実行する](/docs/mcp) と、わざと壊したスニペットで `validate_usage` を呼べます。',
              '[アクセシビリティ声明](/accessibility) と自動監査の範囲を確認してください。',
              '[セキュリティポリシー]({repo}/blob/main/SECURITY.md) と [security.txt](/.well-known/security.txt)。',
            ],
          },
        ],
      },
    ],
  },
  contact: {
    title: 'お問い合わせ',
    description: 'メール、GitHub、または下のフォームでメンテナーに連絡できます。',
    emailHeading: 'メール',
    issuesHeading: 'Issue とディスカッション',
    issuesBody: 'バグや機能要望は [GitHub]({repo}/issues) に登録するのが最適です。',
    addressHeading: '郵送先',
    formHeading: 'メッセージを送る',
    nameLabel: '名前',
    emailLabel: 'メール',
    messageLabel: 'メッセージ',
    send: 'メッセージを送信',
    privacyNote: 'メッセージは返信のみに使用します。詳細はプライバシーポリシーをご覧ください。',
    honeypotLabel: 'ここには入力しないでください:',
  },
  accessibility: {
    title: 'アクセシビリティ声明',
    description:
      'Slipstream UI はコンポーネントライブラリとこのドキュメントサイトの両方で WCAG 2.2 レベル AA を目標としています。',
    updated: '2026年11月',
    sections: [
      {
        heading: '適合目標',
        blocks: [
          {
            type: 'p',
            text: 'コンポーネントライブラリとこのサイトは [WCAG 2.2 レベル AA](https://www.w3.org/TR/WCAG22/) に沿って開発されています。アクセシビリティの退行は改善ではなくバグとして扱います。',
          },
          {
            type: 'p',
            text: 'この声明は自動適合の証拠と既知の不足を扱います。完全な手動適合を主張するものではありません。実際のユーザーによる支援技術のテストは継続中です。',
          },
        ],
      },
      {
        heading: 'ライブラリのテスト方法',
        blocks: [
          {
            type: 'ul',
            items: [
              '**jest-axe スイート** を全コンポーネントに用意し、各プルリクエストで CI 実行します。',
              '**キーボード操作** をコンポーネント契約の一部として実装します（複合ウィジェットの roving tabindex、Escape/矢印キー処理、可視フォーカスリング）。',
              '**モーション低減** をストリーミングインジケーター、ドロワー、ダイアログ、スクロール挙動で尊重します。',
              '**ARIA 契約** を各 COMPONENT_MANIFEST に記述し、エージェントが MCP で見るのと同じ規則で強制します。',
            ],
          },
          {
            type: 'p',
            text: 'コンポーネント別の詳細は [AI 生成 UI のアクセシビリティガイド](/docs/guides/accessibility-ai) をご覧ください。',
          },
        ],
      },
      {
        heading: 'このサイトのテスト方法',
        blocks: [
          {
            type: 'p',
            text: 'ドキュメントサイトはリリースチェックリストの一部として主要ルートで axe-core の自動監査を実行します。監査は WCAG 2.0/2.1/2.2 の A および AA 規則を対象とし、リポジトリから再現できます:',
          },
          {
            type: 'code',
            text: 'pnpm --filter slipstream-ui-docs build\npnpm --filter slipstream-ui-docs start -- -p 3111\npnpm --filter slipstream-ui-docs audit:a11y -- http://localhost:3111',
          },
          {
            type: 'p',
            text: '対象ルート: ホーム、ドキュメント索引、インストール、代表的なコンポーネントページ、MCP、テンプレート、変更履歴、概要、このページ、お問い合わせ、法務ページ。各ルートは **ライトとダークの両モード** で監査されます。2026年11月4日、スイートは両モードで 13 ルートすべてに合格し（26 ページ実行、違反 0）、Lighthouse はサンプルルートでアクセシビリティ 100 を報告しました。',
          },
          {
            type: 'p',
            text: '自動ツールは問題の一部しか検出できません。読み順、タスク完了、代替テキストの品質は検証できません。',
          },
        ],
      },
      {
        heading: '既知の制限',
        blocks: [
          {
            type: 'ul',
            items: [
              '完全な手動スクリーンリーダー監査（Windows の NVDA、macOS/iOS の VoiceOver）はまだ完了していません。自動カバレッジは代替ではありません。',
              'ドキュメントからリンクされた第三者コンテンツ（GitHub、外部標準ページ）は当方の管理外です。',
              '一部のインタラクティブデモはタイマーでストリーミングとエージェント挙動を模擬します。例示用でキーボード操作可能ですが、本番のトランスポートではありません。',
            ],
          },
        ],
      },
      {
        heading: '障壁の報告',
        blocks: [
          {
            type: 'p',
            text: '何かに阻まれた場合は、ページ、使用した支援技術、期待した動作を添えて [Issue を開いてください]({repo}/issues/new)。セキュリティに関わる報告は [セキュリティポリシー]({repo}/blob/main/SECURITY.md) に従ってください。[{email}](mailto:{email}) へのメールも可能です。',
          },
          { type: 'p', text: 'アクセシビリティ報告は 5 営業日以内の受領連絡を目指します。' },
        ],
      },
    ],
  },
  privacy: {
    title: 'プライバシーポリシー',
    description:
      '要約: テーマ設定を保存し、Cookie に同意した場合のみアクセスを計測し、広告やクロスサイト追跡は一切行いません。',
    updated: '2026年11月',
    sections: [
      {
        heading: '端末に保存するもの',
        blocks: [
          {
            type: 'ul',
            items: [
              '`slipstream-theme` — ライト/ダークの設定。誤ったテーマが一瞬表示されないようにします。',
              '`slipstream-consent` — Cookie の選択。再度尋ねないようにします。',
            ],
          },
          { type: 'p', text: 'どちらもサーバーへ送信されません。サイトデータを消去すると両方リセットされます。' },
        ],
      },
      {
        heading: '分析',
        blocks: [
          {
            type: 'p',
            text: '分析は **既定でオフ** です。「すべて許可」を選ぶと、プライバシーに配慮した分析スクリプトを読み込み、集計されたページビュー（URL、参照元、粗い端末/ブラウザ情報）を記録します。広告 Cookie、フィンガープリント、クロスサイトプロファイルは使用しません。',
          },
          {
            type: 'p',
            text: 'ブラウザでこのサイトのデータを消去すれば、いつでも同意を撤回できます。次回訪問時にバナーが再表示されます。',
          },
        ],
      },
      {
        heading: 'お問い合わせメッセージ',
        blocks: [
          {
            type: 'p',
            text: 'お問い合わせフォームを使うと、送信された名前、メールアドレス、メッセージを受け取ります。送信内容はホスティング事業者（Netlify Forms）が処理し、返信のみに使用します。最大 24 か月保管します。',
          },
        ],
      },
      {
        heading: '第三者へのリクエスト',
        blocks: [
          {
            type: 'p',
            text: 'ホームページはブラウザから公開 GitHub API を呼び出してスター数の実値を表示します。github.com への他のリクエストと同様、IP アドレスとユーザーエージェントが GitHub のポリシーに従って開示されます。このリクエストで Cookie は設定されず、他の第三者リソースも読み込みません。',
          },
        ],
      },
      {
        heading: 'ホスティングログ',
        blocks: [
          {
            type: 'p',
            text: 'ホスティング事業者はセキュリティと不正防止のため標準的なリクエストログ（IP アドレス、ユーザーエージェント、要求 URL）を記録し、そのポリシーに従って保管します。',
          },
        ],
      },
      {
        heading: '行わないこと',
        blocks: [
          {
            type: 'ul',
            items: [
              '広告やリターゲティングのピクセルは使いません。',
              '個人データの販売や貸与は行いません。',
              '広告プロファイルやクロスサイト追跡は行いません。',
            ],
          },
        ],
      },
      {
        heading: 'あなたの権利',
        blocks: [
          {
            type: 'p',
            text: 'お住まいの地域によっては、当方が保有する個人データへのアクセス、訂正、エクスポート、削除、および処理への異議申立ての権利があります。[{email}](mailto:{email}) へご連絡いただければ 30 日以内に回答します。地域の監督機関に苦情を申し立てることもできます。',
          },
        ],
      },
      {
        heading: '子ども',
        blocks: [{ type: 'p', text: '本サイトは開発者向けリソースであり、16 歳未満の子どもを対象としていません。' }],
      },
      {
        heading: '変更',
        blocks: [
          {
            type: 'p',
            text: '慣行が変わった場合はこのページと「最終更新」日を更新します。[利用規約](/terms) もご覧ください。',
          },
        ],
      },
      {
        heading: 'お問い合わせ',
        blocks: [{ type: 'p', text: 'このポリシーに関する質問: [{email}](mailto:{email})。' }],
      },
    ],
  },
  terms: {
    title: '利用規約',
    description: 'このサイトと Slipstream UI パッケージに関する平易な規約です。',
    updated: '2026年11月',
    sections: [
      {
        heading: 'ソフトウェア',
        blocks: [
          {
            type: 'p',
            text: 'Slipstream UI パッケージは [MIT ライセンス]({repo}/blob/main/LICENSE) で公開されています。著作権表示と許諾表示を含めれば、商用利用、改変、再配布が可能です。本ページと競合する場合はライセンス本文が優先します。',
          },
        ],
      },
      {
        heading: '無保証',
        blocks: [
          {
            type: 'p',
            text: '本サイト、ドキュメント、マニフェスト、MCP ツール、パッケージは **現状のまま** 提供され、特定目的への適合性を含め明示・黙示を問わずいかなる保証もありません。生成コードの確認と製品判断はあなたの責任です。',
          },
        ],
      },
      {
        heading: '許容される利用',
        blocks: [
          {
            type: 'ul',
            items: [
              '法律違反、権利侵害、マルウェア配布に本サイトを使用しないでください。',
              'ホスティング基盤を妨害または過負荷にしないでください。',
              '改変したパッケージを公式リリースと偽らないでください。',
              'ホストされたエンドポイントにはレート制限と公正利用の期待が適用されます。',
            ],
          },
        ],
      },
      {
        heading: '責任の制限',
        blocks: [
          {
            type: 'p',
            text: '法律で許される最大限の範囲で、メンテナーは本サイトやパッケージの利用に起因する間接的、偶発的、結果的損害、または利益やデータの損失について責任を負いません。',
          },
        ],
      },
      {
        heading: '第三者のリンクとサービス',
        blocks: [
          {
            type: 'p',
            text: '本サイトは GitHub、npm、その他の第三者サービスへリンクします。それらの利用には各社の規約とプライバシーポリシーが適用されます。',
          },
        ],
      },
      {
        heading: '変更',
        blocks: [
          {
            type: 'p',
            text: '本規約を更新することがあり、「最終更新」日もそれに応じて変わります。更新後も利用を続ける場合、改訂された規約に同意したものとみなします。',
          },
        ],
      },
      {
        heading: 'お問い合わせ',
        blocks: [
          {
            type: 'p',
            text: '本規約に関する質問: [{email}](mailto:{email})。[プライバシーポリシー](/privacy) もご覧ください。',
          },
        ],
      },
    ],
  },
};
