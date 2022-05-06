import { htmlElement } from '../utility/querySelector';

/**
 * function to set/update wether dark mode is preferred, to localStorage
 */
function updateLocalStorage() {
  try {
    if (htmlElement.body?.classList.contains('dark-mode')) {
      localStorage.setItem('darkMode', 'true');
    } else {
      localStorage.setItem('darkMode', 'false');
    }
  } catch (error) {
    console.error(error);
  }
}

/**
 * function to toggle between dark and light theme
 */
function toggleTheme() {
  htmlElement.body?.classList.toggle('dark-mode');

  htmlElement.themeDark?.classList.toggle('hidden');
  htmlElement.themeLight?.classList.toggle('hidden');

  updateLocalStorage();
}

/**
 * function that checks if user has set dark mode preference through Os
 * and calls toggleTheme() if so as light mode is the default
 */
function osThemeSwitcher() {
  const supportsThemeSwitching = window.matchMedia('(prefers-color-scheme)');
  if (supportsThemeSwitching) {
    const isDarkModePreferred = window.matchMedia(
        '(prefers-color-scheme: dark)',
    );
    if (
      isDarkModePreferred &&
      !htmlElement.body?.classList.contains('dark-mode')
    ) {
      toggleTheme();
    }
  }

  // console.log(supportsThemeSwitching);
}

/**
 * Main function that handles theme switching ability
 * including storing preference to localStorage
 */
export function run() {
  try {
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode === null) osThemeSwitcher();
    else if (darkMode === 'true') toggleTheme();

    // console.log(darkMode);
  } catch (error) {
    // Run osThemeSwitcher if there is an error getting data from localStorage API
    osThemeSwitcher();
    console.error(error);
  }

  htmlElement.themeContainer?.addEventListener('click', toggleTheme);
}
