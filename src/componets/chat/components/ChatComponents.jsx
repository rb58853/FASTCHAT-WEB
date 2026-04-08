import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './styles.css';
import { useLanguage } from '../../../i18n/LanguageContext.jsx';


export function UserQueryComponent({ input }) {
    const { t } = useLanguage();

    return (
        <div className="message-card user-query-container">
            <span className="message-label">{t.messageLabels.user}</span>
            <p className="user-query-text">{input}</p>
        </div>
    );
}

export function QueryComponent({ query }) {
    const { t } = useLanguage();

    return (
        <div className="message-card query-container">
            <span className="message-label">{t.messageLabels.query}</span>
            <h3 className="query-text">{query}</h3>
        </div>
    );
}

export function DataComponent({ data }) {
    const { t } = useLanguage();

    return (
        <div className="message-card data-container">
            <span className="message-label">{t.messageLabels.data}</span>
            {Object.entries(data).map(([key, value]) => (
                <div key={key} className="data-section">
                    {key !== "querys" ? <h4 className="data-key">{key}:</h4> : <div></div>}
                    {typeof value === 'string' && (
                        <p className="data-string">{value}</p>
                    )}
                    {Array.isArray(value) && (
                        <ul className="data-list">
                            {value.map((item, idx) => (
                                <li key={idx}>{item}</li>
                            ))}
                        </ul>
                    )}
                    {typeof value === 'object' && !Array.isArray(value) && value !== null && (
                        <pre className="data-json">{JSON.stringify(value, null, 2)}</pre>
                    )}
                </div>
            ))}
        </div>
    );
}

export function StepComponent({ step, message }) {
    const { t } = useLanguage();

    return (
        <div className="message-card step-container">
            <span className="message-label">{t.messageLabels.step}</span>
            <h4 className="step-title">{step}</h4>
            <p className="step-message">{message}</p>
        </div>
    );
}

export function ResponseComponent({ response }) {
    const { t } = useLanguage();

    return (
        <div className="message-card response-container">
            <span className="message-label">{t.messageLabels.response}</span>
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkBreaks]}
                components={{
                    code({ inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                            <SyntaxHighlighter
                                style={vscDarkPlus}
                                language={match[1]}
                            >
                                {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                        ) : (
                            <code className={className} {...props}>
                                {children}
                            </code>
                        );
                    }
                }}
            >
                {response}
            </ReactMarkdown>
        </div>
    );
}

export const WorkflowLoader = ({ activeStep, workflowSteps }) => {
    const { t } = useLanguage();

    return (
        <div className="workflow-loader-card">
            <div className="workflow-loader-header">
                <img
                    className="workflow-loader-gif"
                    src={`${process.env.PUBLIC_URL}/loader-orbit.svg`}
                    alt={t.messageLabels.processingAlt}
                />
                <div className="workflow-loader-copy">
                    <span className="message-label">{t.messageLabels.processing}</span>
                    <h3>{activeStep || t.messageLabels.processingTitle}</h3>
                    <p>{t.messageLabels.processingText}</p>
                </div>
            </div>

            <div className="workflow-steps">
                {workflowSteps.map((step) => (
                    <span key={step.id} className={`workflow-step-chip tone-${step.tone}`}>
                        {step.label}
                    </span>
                ))}
            </div>
        </div>
    );
};
