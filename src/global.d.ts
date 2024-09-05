declare global {
  interface WindowEventMap {
    'local-storage': CustomEvent<{
      key: string;
      value: string | null;
    }>;
  }
}

export {};
