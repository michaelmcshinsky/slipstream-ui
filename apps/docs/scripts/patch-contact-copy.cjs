const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'lib', 'marketing');

// Translated channel copy per locale. {repo} is substituted at render time.
const channels = {
  en: [
    {
      heading: 'Bug reports',
      body: 'Something broken or behaving unexpectedly? [Open an issue]({repo}/issues/new) with the page, the assistive technology or agent you used, and what you expected.',
      ctaLabel: 'Open an issue',
      ctaHref: '{repo}/issues/new',
    },
    {
      heading: 'Questions & ideas',
      body: 'Usage questions, feature ideas, and "does this exist?" all belong in [GitHub Discussions]({repo}/discussions).',
      ctaLabel: 'Start a discussion',
      ctaHref: '{repo}/discussions',
    },
    {
      heading: 'Security',
      body: 'Please do not file security vulnerabilities publicly. Follow the [security policy]({repo}/blob/main/SECURITY.md) for private reporting.',
      ctaLabel: 'Read SECURITY.md',
      ctaHref: '{repo}/blob/main/SECURITY.md',
    },
  ],
  es: [
    {
      heading: 'Informes de errores',
      body: '¿Algo roto o con comportamiento inesperado? [Abre un issue]({repo}/issues/new) con la página, la tecnología de asistencia o el agente que usaste y lo que esperabas.',
      ctaLabel: 'Abrir un issue',
      ctaHref: '{repo}/issues/new',
    },
    {
      heading: 'Preguntas e ideas',
      body: 'Las preguntas de uso, las ideas de funciones y los «¿existe esto?» van en [GitHub Discussions]({repo}/discussions).',
      ctaLabel: 'Iniciar una discusión',
      ctaHref: '{repo}/discussions',
    },
    {
      heading: 'Seguridad',
      body: 'No publiques vulnerabilidades de seguridad. Sigue la [política de seguridad]({repo}/blob/main/SECURITY.md) para reportes privados.',
      ctaLabel: 'Leer SECURITY.md',
      ctaHref: '{repo}/blob/main/SECURITY.md',
    },
  ],
  ja: [
    {
      heading: 'バグ報告',
      body: '不具合や予期しない動作がある場合は、ページ、使用した支援技術やエージェント、期待した動作を添えて [issue を作成]({repo}/issues/new) してください。',
      ctaLabel: 'issue を作成',
      ctaHref: '{repo}/issues/new',
    },
    {
      heading: '質問とアイデア',
      body: '使い方の質問、機能の提案、「これはありますか？」は [GitHub Discussions]({repo}/discussions) へ。',
      ctaLabel: 'ディスカッションを開始',
      ctaHref: '{repo}/discussions',
    },
    {
      heading: 'セキュリティ',
      body: 'セキュリティ脆弱性を公開 issue に投稿しないでください。[セキュリティポリシー]({repo}/blob/main/SECURITY.md) に従って非公開で報告してください。',
      ctaLabel: 'SECURITY.md を読む',
      ctaHref: '{repo}/blob/main/SECURITY.md',
    },
  ],
  ko: [
    {
      heading: '버그 신고',
      body: '오류나 예상치 못한 동작이 있으면 페이지, 사용한 보조 기술이나 에이전트, 기대한 동작을 포함해 [이슈를 열어]({repo}/issues/new) 주세요.',
      ctaLabel: '이슈 열기',
      ctaHref: '{repo}/issues/new',
    },
    {
      heading: '질문 및 아이디어',
      body: '사용법 질문, 기능 제안, "이게 있나요?"는 [GitHub Discussions]({repo}/discussions)에 올려 주세요.',
      ctaLabel: '토론 시작',
      ctaHref: '{repo}/discussions',
    },
    {
      heading: '보안',
      body: '보안 취약점을 공개적으로 제기하지 마세요. [보안 정책]({repo}/blob/main/SECURITY.md)에 따라 비공개로 신고해 주세요.',
      ctaLabel: 'SECURITY.md 읽기',
      ctaHref: '{repo}/blob/main/SECURITY.md',
    },
  ],
  ru: [
    {
      heading: 'Сообщения об ошибках',
      body: 'Что-то сломалось или работает не так? [Создайте issue]({repo}/issues/new) со страницей, использованной вспомогательной технологией или агентом и ожидаемым результатом.',
      ctaLabel: 'Создать issue',
      ctaHref: '{repo}/issues/new',
    },
    {
      heading: 'Вопросы и идеи',
      body: 'Вопросы по использованию, идеи функций и «а есть ли это?» — в [GitHub Discussions]({repo}/discussions).',
      ctaLabel: 'Начать обсуждение',
      ctaHref: '{repo}/discussions',
    },
    {
      heading: 'Безопасность',
      body: 'Не публикуйте уязвимости в открытом доступе. Следуйте [политике безопасности]({repo}/blob/main/SECURITY.md) для закрытых сообщений.',
      ctaLabel: 'Читать SECURITY.md',
      ctaHref: '{repo}/blob/main/SECURITY.md',
    },
  ],
  zh: [
    {
      heading: '错误报告',
      body: '遇到故障或异常行为？请[提交 issue]({repo}/issues/new)，并附上页面、所用的辅助技术或代理以及预期行为。',
      ctaLabel: '提交 issue',
      ctaHref: '{repo}/issues/new',
    },
    {
      heading: '问题与想法',
      body: '使用问题、功能建议和「是否有这个功能？」请到 [GitHub Discussions]({repo}/discussions)。',
      ctaLabel: '发起讨论',
      ctaHref: '{repo}/discussions',
    },
    {
      heading: '安全',
      body: '请勿公开提交安全漏洞。请遵循[安全政策]({repo}/blob/main/SECURITY.md)进行私密报告。',
      ctaLabel: '阅读 SECURITY.md',
      ctaHref: '{repo}/blob/main/SECURITY.md',
    },
  ],
  ar: [
    {
      heading: 'بلاغات الأخطاء',
      body: 'هل يوجد خلل أو سلوك غير متوقع؟ [افتح بلاغًا]({repo}/issues/new) مع الصفحة وتقنية المساعدة أو الوكيل الذي استخدمته وما توقعته.',
      ctaLabel: 'افتح بلاغًا',
      ctaHref: '{repo}/issues/new',
    },
    {
      heading: 'الأسئلة والأفكار',
      body: 'أسئلة الاستخدام وأفكار الميزات و«هل يوجد هذا؟» مكانها [مناقشات GitHub]({repo}/discussions).',
      ctaLabel: 'ابدأ مناقشة',
      ctaHref: '{repo}/discussions',
    },
    {
      heading: 'الأمان',
      body: 'لا تنشر الثغرات الأمنية علنًا. اتبع [سياسة الأمان]({repo}/blob/main/SECURITY.md) للإبلاغ الخاص.',
      ctaLabel: 'اقرأ SECURITY.md',
      ctaHref: '{repo}/blob/main/SECURITY.md',
    },
  ],
};

const descriptions = {
  en: 'Reach the maintainers on GitHub — bug reports, questions, and security reports each have a dedicated channel.',
  es: 'Contacta con los mantenedores en GitHub: errores, preguntas y reportes de seguridad tienen un canal dedicado.',
  ja: 'メンテナーへの連絡は GitHub で — バグ報告、質問、セキュリティ報告それぞれに専用チャンネルがあります。',
  ko: '메인테이너에게는 GitHub으로 문의하세요 — 버그 신고, 질문, 보안 신고 각각 전용 채널이 있습니다.',
  ru: 'Свяжитесь с мейнтейнерами в GitHub — для ошибок, вопросов и сообщений о безопасности есть отдельные каналы.',
  zh: '通过 GitHub 联系维护者——错误报告、问题和安全报告各有专门渠道。',
  ar: 'تواصل مع القائمين على الصيانة عبر GitHub — بلاغات الأخطاء والأسئلة وبلاغات الأمان لكل منها قناة مخصصة.',
};

function q(str) {
  // Single-quote and escape for TS source.
  return `'${str.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
}

function extract(block, key) {
  const m = new RegExp(`${key}:\\s*'((?:[^'\\\\]|\\\\.)*)'`).exec(block);
  return m ? m[1] : null;
}

for (const locale of Object.keys(channels)) {
  const file = path.join(dir, `${locale}.ts`);
  let s = fs.readFileSync(file, 'utf8');
  const start = s.indexOf('  contact: {');
  if (start === -1) throw new Error(`contact block not found in ${locale}`);
  // Find the matching close: the block ends at the first '\n  },' after start.
  const endRel = s.indexOf('\n  },', start);
  if (endRel === -1) throw new Error(`contact block end not found in ${locale}`);
  const block = s.slice(start, endRel);

  const title = extract(block, 'title');
  const addressHeading = extract(block, 'addressHeading');
  if (!title || !addressHeading) throw new Error(`missing title/addressHeading in ${locale}`);

  const lines = [];
  lines.push('  contact: {');
  lines.push(`    title: ${q(title)},`);
  lines.push(`    description: ${q(descriptions[locale])},`);
  lines.push('    channels: [');
  for (const ch of channels[locale]) {
    lines.push('      {');
    lines.push(`        heading: ${q(ch.heading)},`);
    lines.push(`        body: ${q(ch.body)},`);
    if (ch.ctaLabel) lines.push(`        ctaLabel: ${q(ch.ctaLabel)},`);
    if (ch.ctaHref) lines.push(`        ctaHref: ${q(ch.ctaHref)},`);
    lines.push('      },');
  }
  lines.push('    ],');
  lines.push(`    addressHeading: ${q(addressHeading)},`);
  lines.push('  },');

  s = s.slice(0, start) + lines.join('\n') + s.slice(endRel + '\n  },'.length);
  fs.writeFileSync(file, s);
  console.log(locale, 'ok');
}
console.log('done');
