import React, {
  Context,
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { isNil } from "./assertions";

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

export function createSimpleContext<T, Name extends string>(
  name: Name,
  initialValue: T
): CreateSimpleContextReturn<Name, T> {
  const ContextValue = createContext<T | null>(null);
  const ContextSetter = createContext<Dispatch<SetStateAction<T>> | null>(null);

  ContextValue.displayName = `${name}Context`;
  ContextSetter.displayName = `${name}ContextSetter`;

  const Provider: React.FC<PropsWithChildren> = ({ children }) => {
    const [value, setValue] = useState<T>(initialValue);

    return (
      <ContextValue.Provider value={value}>
        <ContextSetter.Provider value={setValue}>
          {children}
        </ContextSetter.Provider>
      </ContextValue.Provider>
    );
  };

  Provider.displayName = `${name}Provider`;

  const contextGetter =
    <C,>(context: Context<C | null>) =>
    () => {
      const contextValue = useContext(context);

      if (isNil(contextValue)) {
        throw new Error(
          `Component using use${context.displayName!.replace(
            /Context$/,
            ""
          )} hook must be a child of the ${Provider.displayName}.`
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
