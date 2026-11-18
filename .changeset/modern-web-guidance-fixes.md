---
"@slipstream-ui/ai": patch
"@slipstream-ui/cli": patch
---

Modern Web Guidance modernization fixes across the repository:

- **Dark mode toggles**: Updated all apps (app, playground, ai-chat starter, docs) to use `<meta name="color-scheme">` with CSS `:has()` selector mapping instead of toggling `.dark` class on `<html>`. This follows the modern-web-guidance `dark-mode-toggle` guide for proper color-scheme synchronization.

- **Form field auto-sizing**: Updated `PromptInput` to use CSS `field-sizing: content` with progressive enhancement fallback instead of imperative scrollHeight resizing.

- **IME-safe enter-to-submit**: Added composition checks (`event.nativeEvent.isComposing` and `keyCode === 229`) to all Enter handlers in PromptInput and Message components to prevent premature submission during CJK input.

- **Modern array methods**: Replaced `[...messages].reverse().find()` with `messages.findLast()` in ai-chat starter.

- **Error cause chaining**: Updated CLI config to use `{ cause: error }` option when throwing errors.

Updated documentation in docs app to reflect the new dark mode approach.