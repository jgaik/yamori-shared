import { useLayoutEffect, useState } from 'react';
import { useLocalStorage } from './use-local-storage';

function getDarkModeMatchMedia() {
  return window.matchMedia('(prefers-color-scheme: dark)');
}

export function useIsDarkMode(localStorageKey: string) {
  const [useDarkMode, setUseDarkMode] = useState(
    () => getDarkModeMatchMedia().matches
  );
  const [localDarkMode] = useLocalStorage<boolean>(localStorageKey);

  useLayoutEffect(() => {
    const darkModeMedia = getDarkModeMatchMedia();

    const readDarkMode = () => {
      setUseDarkMode(darkModeMedia.matches);
    };

    darkModeMedia.addEventListener('change', readDarkMode);

    return () => {
      darkModeMedia.removeEventListener('change', readDarkMode);
    };
  }, []);

  return localDarkMode ?? useDarkMode;
}
