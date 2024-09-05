import React, {
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
  createContext,
  PropsWithChildren,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

export type DialogContextValue = {
  showDialog: (props: ComponentPropsWithoutRef<'dialog'>) => void;
};

const DialogContext = createContext<DialogContextValue | null>(null);

DialogContext.displayName = 'DialogContext';

export const DialogContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [{ children: dialogChildren, ...dialogProps }, setDialogProps] =
    useState<ComponentPropsWithRef<'dialog'>>({});

  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const dialogContentRef = useRef<HTMLDivElement | null>(null);

  const contextValue = useMemo<DialogContextValue>(
    () => ({
      showDialog: (props) => {
        setDialogProps(props);
        dialogRef.current?.showModal();
      },
    }),
    []
  );

  useLayoutEffect(() => {
    if (!dialogRef.current) return;

    const dialogNode = dialogRef.current;

    const handleClick = (event: MouseEvent) => {
      if (!dialogContentRef.current?.contains(event.target as Node)) {
        dialogNode.close();
      }
    };

    const handleClose = () => {
      setDialogProps({});
    };

    dialogNode.addEventListener('click', handleClick);
    dialogNode.addEventListener('close', handleClose);

    return () => {
      dialogNode.removeEventListener('click', handleClick);
      dialogNode.removeEventListener('close', handleClose);
    };
  }, []);

  return (
    <DialogContext.Provider value={contextValue}>
      {children}
      <dialog ref={dialogRef} {...dialogProps}>
        {dialogChildren && <div ref={dialogContentRef}>{dialogChildren}</div>}
      </dialog>
    </DialogContext.Provider>
  );
};

export function useDialogContext() {
  const dialogContext = React.useContext(DialogContext);

  if (!dialogContext) {
    throw new Error(
      '[@yamori-shared/react] Component using useDialogContext hook must be a child of the DialogContextProvider'
    );
  }

  return dialogContext;
}
