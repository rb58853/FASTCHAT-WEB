import { useNavigate } from 'react-router-dom';
import "./style/desktop.css"
import { useLanguage } from '../../i18n/LanguageContext.jsx';

function Home() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const starterPrompts = t.home.prompts;

  const goToChat = () => {
    navigate('/chat');
  };

  return (
    <section className="home-shell">
      <div className="home-nav">
        <span className="home-brand">Fastchat</span>
        <span className="home-tag">{t.home.tag}</span>
      </div>

      <div className="home-hero">
        <div className="home-copy">
          <p className="home-eyebrow">{t.home.eyebrow}</p>
          <h1>{t.home.title}</h1>
          <p className="home-description">{t.home.description}</p>

          <div className="home-actions">
            <button className="button-chat" onClick={goToChat}>
              {t.home.openChat}
            </button>
            <p className="home-note">{t.home.note}</p>
          </div>
        </div>

        <div className="home-card">
          <p className="home-card-label">{t.home.ideas}</p>
          <div className="home-prompt-list">
            {starterPrompts.map((prompt) => (
              <button key={prompt} className="home-prompt" onClick={goToChat}>
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Home