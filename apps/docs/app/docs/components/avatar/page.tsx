'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@slipstream-ui/core';

export default function AvatarPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-2">Avatar</h1>
      <p className="text-lg text-muted-foreground mb-8">
        A user profile image component with fallback support and accessible image loading.
      </p>

      {/* Live Preview */}
      <div className="mb-8 p-6 border rounded-lg bg-card">
        <h2 className="text-sm font-semibold mb-4">Live Preview</h2>
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
      </div>

      {/* Installation */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Installation</h2>
        <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
          <code>npx slipstream-ui add avatar</code>
        </pre>
        <p className="text-sm text-muted-foreground mt-2">Or import manually:</p>
        <pre className="bg-muted p-4 rounded text-sm overflow-x-auto mt-2">
          <code>{`import { Avatar, AvatarImage, AvatarFallback } from '@slipstream-ui/core'`}</code>
        </pre>
      </div>

      {/* Usage */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Usage</h2>
        <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
          <code>{`<Avatar>
  <AvatarImage src="/avatar.jpg" alt="User" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>

<Avatar className="h-16 w-16">
  <AvatarFallback className="bg-primary text-primary-foreground">
    AI
  </AvatarFallback>
</Avatar>`}</code>
        </pre>
      </div>

      {/* Props */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Props</h2>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3">Component</th>
                <th className="text-left p-3">Props</th>
                <th className="text-left p-3">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="p-3 font-mono text-xs">Avatar</td>
                <td className="p-3 text-xs">className</td>
                <td className="p-3 text-xs">Additional CSS classes</td>
              </tr>
              <tr className="border-t">
                <td className="p-3 font-mono text-xs">AvatarImage</td>
                <td className="p-3 text-xs">src, alt</td>
                <td className="p-3 text-xs">Image URL and alt text</td>
              </tr>
              <tr className="border-t">
                <td className="p-3 font-mono text-xs">AvatarFallback</td>
                <td className="p-3 text-xs">children, className</td>
                <td className="p-3 text-xs">Fallback content and styling</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Examples */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Examples</h2>
        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">User avatar</h3>
            <Avatar>
              <AvatarImage src="/avatar.jpg" alt="John Doe" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">Initials only</h3>
            <Avatar>
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">Large avatar</h3>
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary text-primary-foreground">
                AI
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      {/* Accessibility */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Accessibility</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>AvatarImage requires alt text for accessibility</li>
          <li>AvatarFallback content is announced when image fails</li>
          <li>Radix Avatar handles image loading errors automatically</li>
          <li>Use meaningful alt text describing the person</li>
        </ul>
      </div>
    </div>
  );
}
