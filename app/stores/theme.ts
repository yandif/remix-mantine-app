import { ColorScheme } from '@mantine/core';
import create from 'zustand';

type AdminLayoutState = {
  opened: boolean;
  colorScheme: ColorScheme;
  toggle: () => void;
  setColorScheme: (colorScheme: ColorScheme) => void;
  toggleColorScheme: () => void;
};

const useThemeStore = create<AdminLayoutState>((set) => ({
  opened: false,
  colorScheme: 'light',
  toggle: () => set((state) => ({ opened: !state.opened })),
  setColorScheme: (colorScheme) => set(() => ({ colorScheme })),
  toggleColorScheme: () =>
    set((state) => ({
      colorScheme: state.colorScheme === 'dark' ? 'light' : 'dark',
    })),
}));

export default useThemeStore;
