import { useEffect, useState } from 'react';
import './App.css';
import { useLanguage } from './i18n/LanguageContext.jsx';

function App({ content }) {
  const { language, setLanguage, t } = useLanguage();
  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem('fastchat-theme');

    if (storedTheme === 'light' || storedTheme === 'dark') {
      return storedTheme;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('fastchat-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="App">
      <div className="app-backdrop" aria-hidden="true">
        <div className="app-orb app-orb-primary" />
        <div className="app-orb app-orb-secondary" />
      </div>

      <div className="app-controls">
        <div className="language-toggle" role="group" aria-label={t.ui.language}>
          <button
            type="button"
            className={`language-option ${language === 'en' ? 'is-active' : ''}`}
            onClick={() => setLanguage('en')}
          >
            {t.ui.english}
          </button>
          <button
            type="button"
            className={`language-option ${language === 'es' ? 'is-active' : ''}`}
            onClick={() => setLanguage('es')}
          >
            {t.ui.spanish}
          </button>
        </div>

        <button
          type="button"
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? t.ui.toLight : t.ui.toDark}
        >
          <span className="theme-toggle-icon" aria-hidden="true">
            {theme === 'dark' ? '☀' : '☾'}
          </span>
          <span>{theme === 'dark' ? t.ui.lightMode : t.ui.darkMode}</span>
        </button>
      </div>

      <div className="App-shell">{content}</div>
    </div>
  );
}
export default App;