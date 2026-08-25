# Avatar

A user profile image component with fallback support and accessible image loading

> Import: `import { Avatar } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/avatar.json
> Tier: atom · Package: @slipstream-ui/core

## Design intent

The Avatar component displays user profile images with a circular frame. It includes fallback content when the image fails to load or is not provided, and follows accessibility best practices for user avatars.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| src | `string` | — | no | URL of the avatar image |
| alt | `string` | — | no | Alt text for the avatar image (for accessibility) |
| className | `string` | — | no | Additional CSS classes to apply to the avatar container |

## Examples

### Avatar with image

Avatar with image and fallback text

```tsx
<Avatar>
  <AvatarImage src="/avatar.jpg" alt="User" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

### Avatar with fallback only

Avatar showing only fallback initials

```tsx
<Avatar>
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

### Large avatar

Avatar with custom size

```tsx
<Avatar className="h-16 w-16">
  <AvatarImage src="/avatar.jpg" alt="User" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

### Avatar with colored fallback

Avatar with styled fallback background

```tsx
<Avatar>
  <AvatarImage src="/avatar.jpg" alt="User" />
  <AvatarFallback className="bg-primary text-primary-foreground">JD</AvatarFallback>
</Avatar>
```

## Anti-patterns

- **Don't forget alt text** — undefined
- **Don't use vague fallback text** — undefined
- **Don't use avatars for non-people** — undefined

## Accessibility

- **Screen reader support**: AvatarImage requires alt text. AvatarFallback content is announced when image fails
- **Image loading**: Radix Avatar handles image loading errors and displays fallback automatically
- **Focus indication**: Avatar can be focused and has visible focus ring when keyboard navigable

## Composition

- Compose with **Message** — Avatars are commonly used in Message components to identify the sender
  
  ```tsx
  Message component uses Avatar to show user or assistant identity
  ```
- Compose with **UserMenu** — Avatars are often used in user menus or profile headers
  
  ```tsx
  UserMenu displays current user's avatar for quick identification
  ```
- Related: Message, UserMenu, Button

