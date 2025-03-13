"use client";

import React, {
  Context,
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useState,
} from "react";

type CreateSimpleContextReturn<Name extends string, T> = {
  [K in
    | `${Name}Provider`
    | `use${Name}`
    | `use${Name}Setter`]: K extends `${Name}Provider`
    ? React.FC<PropsWithChildren>
    : K extends `use${Name}`
    ? () => T
    : K extends `use${Name}Setter`
    ? () => Dispatch<SetStateAction<T>>
    : never;
};

const DEFAULT_CONTEXT_VALUE = Symbol();

export function createSimpleContext<T, Name extends string>(
  name: Name,
  initialValue: T,
  errorPrefix?: string
): CreateSimpleContextReturn<Name, T> {
  const ContextValue = createContext<T | typeof DEFAULT_CONTEXT_VALUE>(
    DEFAULT_CONTEXT_VALUE
  );
  const ContextSetter = createContext<
    Dispatch<SetStateAction<T>> | typeof DEFAULT_CONTEXT_VALUE
  >(DEFAULT_CONTEXT_VALUE);

  ContextValue.displayName = `${name}Context`;
  ContextSetter.displayName = `${name}ContextSetter`;

  const Provider: React.FC<PropsWithChildren> = ({ children }) => {
    const [value, setValue] = useState<T>(initialValue);

    return (
      <ContextSetter.Provider value={setValue}>
        <ContextValue.Provider value={value}>{children}</ContextValue.Provider>
      </ContextSetter.Provider>
    );
  };

  Provider.displayName = `${name}Provider`;

  const contextGetter =
    <C,>(context: Context<C | typeof DEFAULT_CONTEXT_VALUE>) =>
    () => {
      const contextValue = useContext(context);

      if (contextValue === DEFAULT_CONTEXT_VALUE) {
        const prefix = errorPrefix ? `[${errorPrefix}] ` : "";
        const hookName = `use${context.displayName!.replace(/Context$/, "")}`;

        throw new Error(
          `${prefix}${hookName} hook must be used within the ${Provider.displayName} component.`
        );
      }

      return contextValue;
    };

  const useContextValue = contextGetter(ContextValue);

  const useContextSetter = contextGetter(ContextSetter);

  return {
    [`${name}Provider`]: Provider,
    [`use${name}`]: useContextValue,
    [`use${name}Setter`]: useContextSetter,
  } as CreateSimpleContextReturn<Name, T>;
}
