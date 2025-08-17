export type ThemeName =
  | 'system'
  | 'light'
  | 'dark'
  | 'dracula'
  | 'solarizedLight'
  | 'solarizedDark'
  | 'oneDark'
  | 'monokai'
  | 'nord'
  | 'gruvboxDark'
  | 'gruvboxLight'
  | 'catppuccinMocha'
  | 'ayuDark'

export const THEME_LABELS: Record<ThemeName, string> = {
  system: 'System',
  light: 'Light',
  dark: 'Dark',
  dracula: 'Dracula',
  solarizedLight: 'Solarized Light',
  solarizedDark: 'Solarized Dark',
  oneDark: 'One Dark',
  monokai: 'Monokai',
  nord: 'Nord',
  gruvboxDark: 'Gruvbox Dark',
  gruvboxLight: 'Gruvbox Light',
  catppuccinMocha: 'Catppuccin (Mocha)',
  ayuDark: 'Ayu Dark',
}

export const THEME_CLASS: Record<Exclude<ThemeName, 'system'>, string> = {
  light: 'theme-light',
  dark: 'theme-dark',
  dracula: 'theme-dracula',
  solarizedLight: 'theme-solarized-light',
  solarizedDark: 'theme-solarized-dark',
  oneDark: 'theme-one-dark',
  monokai: 'theme-monokai',
  nord: 'theme-nord',
  gruvboxDark: 'theme-gruvbox-dark',
  gruvboxLight: 'theme-gruvbox-light',
  catppuccinMocha: 'theme-catppuccin-mocha',
  ayuDark: 'theme-ayu-dark',
}

const KEY = 'braincache.theme.v3'

function isDark(t: Exclude<ThemeName, 'system'>){
  return ['dark','dracula','solarizedDark','oneDark','monokai','nord','gruvboxDark','catppuccinMocha','ayuDark'].includes(t)
}

export function getInitialTheme(): ThemeName {
  const saved = localStorage.getItem(KEY) as ThemeName | null
  if (saved && saved in THEME_LABELS) return saved
  return 'system'
}

export function resolveSystem(): 'light'|'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function applyTheme(theme: ThemeName){
  const root = document.documentElement
  Object.values(THEME_CLASS).forEach(c => root.classList.remove(c))
  const applied: Exclude<ThemeName, 'system'> = theme === 'system' ? resolveSystem() : theme
  root.classList.add(THEME_CLASS[applied])
  if (isDark(applied)) root.classList.add('dark'); else root.classList.remove('dark')
  localStorage.setItem(KEY, theme)
}

export function listenSystemTheme(){
  const m = window.matchMedia('(prefers-color-scheme: dark)')
  const on = () => {
    const saved = getInitialTheme()
    if (saved === 'system') applyTheme('system')
  }
  if (typeof m.addEventListener === 'function') m.addEventListener('change', on)
  else if (typeof (m as any).addListener === 'function') (m as any).addListener(on)
  return () => {
    if (typeof m.removeEventListener === 'function') m.removeEventListener('change', on)
    else if (typeof (m as any).removeListener === 'function') (m as any).removeListener(on)
  }
}
