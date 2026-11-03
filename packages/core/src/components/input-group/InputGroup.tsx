import * as React from 'react';
import { cn } from '../../utils/cn';
import { Input } from '../input/Input';
import { Textarea } from '../textarea/Textarea';
import { Select } from '../select/Select';

export type InputGroupProps = React.HTMLAttributes<HTMLDivElement>;

type CloneableProps = Record<string, unknown>;

const isNestedField = (child: React.ReactNode): child is React.ReactElement<CloneableProps> =>
  React.isValidElement(child) && (child.type === Input || child.type === Textarea || child.type === Select);

/**
 * Composite input shell: one outer outline wraps the addons and the
 * field itself. Nested inputs shed their own border/ring — focus and
 * the outline belong to the group, so left/right addons read as flush
 * parts of a single control (the outline doubles as the affordance).
 *
 * id / aria-describedby / aria-invalid arriving from FormField are
 * forwarded to the nested field, because a label's htmlFor must
 * resolve to the editable control, not the shell div.
 */
const InputGroup = React.forwardRef<HTMLDivElement, InputGroupProps>(
  ({ id, 'aria-describedby': describedBy, 'aria-invalid': invalid, className, children, ...props }, ref) => {
    let wiredChildren = children;

    if (id !== undefined || describedBy !== undefined || invalid !== undefined) {
      const items = React.Children.toArray(children);
      const fieldIndex = items.findIndex(isNestedField);
      if (fieldIndex !== -1) {
        const field = items[fieldIndex];
        items[fieldIndex] = isNestedField(field)
          ? React.cloneElement(field, {
              ...(id !== undefined && { id }),
              ...(describedBy !== undefined && { 'aria-describedby': describedBy }),
              ...(invalid !== undefined && { 'aria-invalid': invalid }),
            })
          : field;
        wiredChildren = items;
      } else {
        // No recognizable field (custom children) — keep the wiring on the shell.
        props = {
          ...props,
          ...(id !== undefined && { id }),
          ...(describedBy !== undefined && { 'aria-describedby': describedBy }),
          ...(invalid !== undefined && { 'aria-invalid': invalid }),
        };
      }
    }

    return (
      <div
        ref={ref}
        data-slot="input-group"
        className={cn(
          'flex h-10 w-full items-center overflow-hidden rounded-md border border-input bg-background',
          'ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
          // The group is the control: strip chrome from nested fields so
          // only the outer border shows. Literal variants survive purging.
          '[&_input]:min-w-0 [&_input]:flex-1 [&_input]:border-0 [&_input]:bg-transparent [&_input]:px-3 [&_input]:py-2 [&_input]:shadow-none',
          '[&_input]:focus-visible:ring-0 [&_input]:focus-visible:ring-offset-0',
          '[&_textarea]:border-0 [&_textarea]:bg-transparent [&_textarea]:shadow-none [&_textarea]:focus-visible:ring-0',
          '[&_select]:border-0 [&_select]:bg-transparent [&_select]:shadow-none [&_select]:focus-visible:ring-0',
          '[&_input:disabled]:cursor-not-allowed',
          className
        )}
        {...props}
      >
        {wiredChildren}
      </div>
    );
  }
);
InputGroup.displayName = 'InputGroup';

export type InputGroupAddonProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Edge the addon hugs (flush against the group outline). */
  side?: 'left' | 'right';
  /** 'muted' paints a light-gray surface; 'ghost' keeps the group background. */
  variant?: 'ghost' | 'muted';
};

/**
 * Flush icon/text/button slot inside an InputGroup. Addons carry their
 * own padding on the outer edge only — the nested field's padding
 * supplies the gap toward the middle, so content stays on one rhythm.
 */
const InputGroupAddon = React.forwardRef<HTMLDivElement, InputGroupAddonProps>(
  ({ side = 'left', variant = 'ghost', className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="input-group-addon"
      data-side={side}
      className={cn(
        'flex shrink-0 select-none items-center self-stretch px-3 text-sm text-muted-foreground',
        variant === 'muted' && 'bg-muted',
        className
      )}
      {...props}
    />
  )
);
InputGroupAddon.displayName = 'InputGroupAddon';

export { InputGroup, InputGroupAddon };
