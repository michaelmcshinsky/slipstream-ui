import { Avatar, AvatarFallback, AvatarImage } from '@slipstream-ui/core';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

export default function AvatarPage() {
  return (
    <ComponentPage
      id="avatar"
      title="Avatar"
      description="A user profile image component with fallback support and accessible image loading."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'Avatar', type: 'className', description: 'Additional CSS classes' },
        { name: 'AvatarImage', type: 'src, alt', description: 'Image URL and alt text' },
        { name: 'AvatarFallback', type: 'children, className', description: 'Fallback content and styling' },
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
                <AvatarImage src="/avatar.jpg" alt="User" />
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
  <AvatarImage src="/avatar.jpg" alt="User" />
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
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
            </Avatar>
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
            </Avatar>
          </div>
        }
        code={`<Avatar className="h-12 w-12">
  <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
</Avatar>

<Avatar className="h-16 w-16">
  <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
</Avatar>`}
      />
    </ComponentPage>
  );
}
