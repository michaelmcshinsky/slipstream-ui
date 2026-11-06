export const en = {
  app: {
    title: 'AI Chat Starter',
    subtitle: 'Streaming, reasoning, tool calls, approvals and citations. Bring your own backend.',
    stateless: 'stateless',
    buyLicence: 'Buy licence',
    newChat: 'New chat',
    emptyTitle: 'Ask anything',
    emptyDescription: 'The mock backend streams a complete response. Set OPENAI_API_KEY to use a real model.',
    placeholder: 'Ask the agent to build, search, or deploy...',
    generating: 'Generating...',
    activityTitle: 'Agent activity',
    activityDescription: 'Reasoning, tool calls, approvals and citations from the latest response.',
    noActivity: 'No activity yet.',
    sources: 'Sources',
    backendTitle: 'Backend',
    backendDescription: 'The client speaks one SSE protocol. The server chooses the backend.',
    backendMock: 'deterministic streamed response.',
    backendOpenAI: 'raw SSE via OPENAI_API_KEY.',
    backendCustom: 'Point createFetchAdapter at any endpoint that emits the same events.',
    analyticsConsent: 'Share anonymous usage events (no message content, no identifiers).',
    attachmentsTitle: 'Attachments',
    attachmentsDescription: 'PromptInput manages its own attachment queue; wire uploads to your storage.',
    approve: 'Approve',
    reject: 'Reject',
    approved: 'Approved',
    rejected: 'Rejected',
    language: 'Language',
  },
  chat: {
    you: 'You',
    assistant: 'Assistant',
    retry: 'Retry',
    edit: 'Edit',
    saveResend: 'Save & resend',
    cancel: 'Cancel',
    editMessage: 'Edit message',
  },
  reasoning: {
    title: 'Reasoning',
    step_one: '{count} step',
    step_other: '{count} steps',
    stepLabel: 'Step {index}',
    thinking: 'thinking…',
  },
  tools: {
    pending: 'Pending',
    running: 'Running',
    completed: 'Completed',
    failed: 'Failed',
  },
  prompt: {
    send: 'Send',
    stop: 'Stop',
  },
  citations: {
    sources: 'Sources',
  },
  actions: {
    copy: 'Copy',
    copied: 'Copied',
    helpful: 'Helpful',
    notHelpful: 'Not helpful',
    regenerate: 'Regenerate',
  },
  tool: {
    arguments: 'Arguments',
    result: 'Result',
    error: 'Error',
  },
  mock: {
    reasoning1: 'Reading the request.',
    reasoning2: 'Selecting a response shape and checking the component contract.',
    answer:
      'This is the mock backend. You asked: "{prompt}". Replace it with your own adapter by setting OPENAI_API_KEY or pointing the SSE adapter at your endpoint. The surface is stateless: streaming, reasoning, tool calls, approvals and citations are all rendered from events.',
    toolName: 'search_docs',
    toolResult: 'Slipstream UI manifests and validation',
    citationTitle: 'Slipstream UI manifests',
    citationSnippet: 'Every component ships a machine-readable manifest with props, anti-patterns and accessibility requirements.',
    approvalTitle: 'Deploy to production?',
    approvalDescription: 'The mock agent wants to run a production deployment. Approval is required before the action continues.',
  },
  errors: {
    requestFailed: 'Chat request failed: HTTP {status}',
    checkoutMissing:
      'Checkout is not configured. Set NEXT_PUBLIC_CHECKOUT_URL to your Stripe Payment Link or hosted checkout URL.',
  },
} as const;


type DeepString<T> = {
  [K in keyof T]: T[K] extends string ? string : DeepString<T[K]>;
};

export type Messages = DeepString<typeof en>;
