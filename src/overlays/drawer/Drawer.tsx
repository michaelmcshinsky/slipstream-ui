import clsx from 'clsx';
import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Button } from '../../general';

type TDrawer = {
  title?: string;
  description?: string;
  from?: 'top' | 'right' | 'bottom' | 'left';
  full?: boolean;
  custom?: boolean;
  children: React.ReactNode;
  className?: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export function Drawer({
  title = '',
  description = '',
  from = 'left',
  full = false,
  custom = false,
  children,
  className,
  isOpen,
  setIsOpen,
}: TDrawer) {
  const [isMounted, setIsMounted] = React.useState(isOpen)
  
  const classes = clsx(
    'sui--offcanvas--menu',
    'fixed z-30',
    full && ['h-full w-full'],
    from === 'top' && ['top-0 right-0 left-0'],
    from === 'right' && ['top-0 right-0 bottom-0'],
    from === 'bottom' && ['right-0 bottom-0 left-0'],
    from === 'left' && ['top-0 bottom-0 left-0'],
    className
  );

  const bodyClasses = clsx(
    'relative h-full w-full z-50',
    'flex flex-col flex-start',
    !custom && ['bg-white']
  );

  const enterFromClasses = clsx(
    'opacity-0',
    from === 'top' && ['-translate-y-full'],
    from === 'right' && ['translate-x-full'],
    from === 'bottom' && ['translate-y-full'],
    from === 'left' && ['-translate-x-full']
  );

  const enterToClasses = clsx(
    from === 'top' && 'translate-y-0',
    from === 'right' && 'translate-x-100',
    from === 'bottom' && '-translate-y-0',
    from === 'left' && 'translate-x-0'
  );

  return (
    <Transition show={isOpen} as={React.Fragment}>
      <Dialog
        unmount={false}
        onClose={() => setIsOpen(false)}
        className={classes}
      >
        <Transition.Child
          as={React.Fragment}
          enter="transition-opacity ease-in duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-30"
          leave="transition-opacity ease-out duration-500"
          leaveFrom="opacity-30"
          leaveTo="opacity-0"
        >
          <Dialog.Overlay className="z-40 fixed inset-0 bg-black" />
        </Transition.Child>

        <Transition.Child
          as={React.Fragment}
          enter="transition ease-in-out duration-500 transform"
          enterFrom={enterFromClasses}
          enterTo={enterToClasses}
          leave="transition ease-in-out duration-500 transform"
          leaveFrom={enterToClasses}
          leaveTo={enterFromClasses}
        >
          <div className={bodyClasses}>
            <div>
              <Dialog.Title className="font-bold text-2xl md:text-4xl text-blue-500">
                {title}
              </Dialog.Title>
              <Dialog.Description>{description}</Dialog.Description>
              {/* {isMounted && children} */}
            </div>
            <div className="self-center mt-10">
              <Button onClick={() => setIsOpen(!isOpen)}>Close</Button>
            </div>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}
