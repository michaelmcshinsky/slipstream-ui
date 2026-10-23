import { Dispatch, forwardRef, ReactNode, SetStateAction } from 'react';
import { TDrawer, Drawer } from '../../';
import { useNav } from './NavContext';
import clsx from 'clsx';

export type TNavbarSidebar = Omit<TDrawer, 'setIsOpen' | 'isOpen'> & {
  children?: ReactNode;
  isOpen?: boolean;
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
};

export const NavbarSidebar = forwardRef<HTMLDivElement, TNavbarSidebar>(
  ({ children, className, custom, full, isOpen, setIsOpen, ...props }, ref) => {
    const nav = useNav();

    const classes = clsx('sui--navbar-sidebar', className);

    return (
      <div ref={ref} className={classes}>
        <Drawer
          custom={custom}
          full={full}
          isOpen={isOpen ?? nav?.isOpen ?? false}
          setIsOpen={setIsOpen ?? (() => undefined)}
          {...props}
        >
          {children}
        </Drawer>
      </div>
    );
  }
);

NavbarSidebar.displayName = 'NavbarSidebar';

export default NavbarSidebar;
