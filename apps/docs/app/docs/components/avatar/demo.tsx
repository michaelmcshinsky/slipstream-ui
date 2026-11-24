import { Avatar, AvatarFallback, AvatarImage } from '@slipstream-ui/core';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

// Inline SVG so the "with image" state works without a binary asset.
const avatarSrc = `data:image/svg+xml;utf8,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96'><rect width='96' height='96' rx='48' fill='%234f46e5'/><text x='48' y='64' font-size='44' text-anchor='middle' fill='white' font-family='system-ui, sans-serif'>JD</text></svg>"
)}`;

export default function AvatarPage() {
  return (
    <ComponentPage
      id="avatar"
      title="Avatar"
      description="A user profile image component with fallback support and accessible image loading. Compose Avatar + AvatarImage + AvatarFallback."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'Avatar', type: 'Root props', description: 'Circular container (h-10 w-10 by default); override the size with className.' },
        { name: 'AvatarImage', type: 'Image props', description: 'Requires src + alt; renders only after the image loads.' },
        { name: 'AvatarFallback', type: 'Fallback props', description: 'Shown while the image loads and after it fails; put initials or an icon as children.' },
        { name: 'className', type: 'string', description: 'Escape hatch on each part (size, colors, shape).' },
      ]}
      accessibility={[
        'AvatarImage requires alt text for accessibility',
        'AvatarFallback content is announced when image fails',
        'Radix Avatar handles image loading errors automatically',
        'Use meaningful alt text describing the person',
      ]}
    >
      <DemoCard
        title="Variants"
        preview={
          <div className="flex flex-wrap gap-6">
            <div className="text-center">
              <Avatar>
                <AvatarImage src={avatarSrc} alt="User" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <p className="text-xs text-muted-foreground mt-2">With image</p>
            </div>
            <div className="text-center">
              <Avatar>
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <p className="text-xs text-muted-foreground mt-2">Fallback only</p>
            </div>
            <div className="text-center">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
              </Avatar>
              <p className="text-xs text-muted-foreground mt-2">Custom size</p>
            </div>
          </div>
        }
        code={`import { Avatar, AvatarImage, AvatarFallback } from '@slipstream-ui/core'

<Avatar>
  <AvatarImage src="/path/to/photo.jpg" alt="User name" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>

<Avatar className="h-16 w-16">
  <AvatarFallback className="bg-primary text-primary-foreground">
    AI
  </AvatarFallback>
</Avatar>`}
      />
      <DemoCard
        title="Sizes"
        preview={
          <div className="flex flex-wrap items-center gap-6">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">AI</AvatarFallback>
            </Avatar>
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
            </Avatar>
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
            </Avatar>
          </div>
        }
        code={`<Avatar className="h-8 w-8">
  <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
</Avatar>

<Avatar className="h-12 w-12">
  <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
</Avatar>

<Avatar className="h-16 w-16">
  <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
</Avatar>`}
        usage={`// There is no size prop: scale with className (h-*/w-*).
// Keep AvatarImage + AvatarFallback as siblings — the fallback shows
// automatically while the image loads or if it fails.`}
      />
    </ComponentPage>
  );
}
