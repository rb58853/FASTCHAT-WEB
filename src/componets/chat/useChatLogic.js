import { useState, useEffect, useRef, useCallback } from "react";
import { UserQueryComponent, QueryComponent, DataComponent, StepComponent, ResponseComponent } from './components/ChatComponents';
import { useLanguage } from '../../i18n/LanguageContext.jsx';

// URLs de WebSocket
const vps_url = "ws://77.237.243.163:8000/chat/admin?chat_id=id&token=oBd-k41TmMqib1QYalke7HRCbk_HOtE0nw1YcdkibPc="

export default function useChatLogic() {
  const { t } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [isProcessing, setIsProcessing] = useState(false);
  const [workflowSteps, setWorkflowSteps] = useState([]);
  const [activeWorkflowStep, setActiveWorkflowStep] = useState('');
  const wsRef = useRef(null);
  const messageKeyRef = useRef(0);
  const workflowKeyRef = useRef(0);

  const nextMessageKey = useCallback((prefix) => `${prefix}-${messageKeyRef.current++}`, []);

  const appendWorkflowStep = useCallback((label, tone = 'neutral') => {
    if (!label) return;

    setActiveWorkflowStep(label);
    setWorkflowSteps((prev) => {
      const next = [...prev, { id: `workflow-${workflowKeyRef.current++}`, label, tone }];
      return next.slice(-4);
    });
  }, []);

  const describeWorkflowStep = useCallback((step) => {
    if (step.type === 'query') {
      return { label: t.workflow.interpreting, tone: 'neutral' };
    }

    if (step.type === 'data') {
      return { label: t.workflow.consultingData, tone: 'neutral' };
    }

    if (step.type === 'response' && step.first_chunk) {
      return { label: t.workflow.writingResponse, tone: 'accent' };
    }

    if (step.type === 'step') {
      const combinedLabel = [step.step, step.message].filter(Boolean).join(' · ');

      if (/servici|service/i.test(combinedLabel)) {
        return { label: t.workflow.selectingServices, tone: 'accent' };
      }

      return {
        label: step.message || step.step || t.workflow.processing,
        tone: 'neutral',
      };
    }

    return null;
  }, [t]);

  const handleStep = useCallback((step) => {
    const workflowDescriptor = describeWorkflowStep(step);

    if (workflowDescriptor) {
      appendWorkflowStep(workflowDescriptor.label, workflowDescriptor.tone);
    }

    setMessages((prev) => {
      let updated = [...prev];

      if (step.type === "response") {
        if (step.first_chunk || updated.length === 0) {
          updated.push(<ResponseComponent key={nextMessageKey('response')} response={step.response} />);
        } else {
          const lastIndex = updated.length - 1;
          const updatedResponse = updated[lastIndex].props.response + step.response;
          updated[lastIndex] = <ResponseComponent key={updated[lastIndex].key} response={updatedResponse} />;
        }
      }

      if (step.type === "query") {
        updated.push(<QueryComponent key={nextMessageKey('query')} query={step.query} />);
      }

      if (step.type === "data") {
        updated.push(<DataComponent key={nextMessageKey('data')} data={step.data} />);
      }

      if (step.type === "step") {
        updated.push(<StepComponent
          key={nextMessageKey('step')}
          step={step.step}
          message={step.message}
        />);
      }

      return updated;
    });
  }, [appendWorkflowStep, describeWorkflowStep, nextMessageKey]);

  useEffect(() => {
    const ws = new WebSocket(vps_url);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("✅ Conectado al servidor WebSocket");
      setConnectionStatus('connected');
    };

    ws.onmessage = (event) => {
      const data = event.data;
      if (data === "--next") {
        setIsProcessing(false);
        setActiveWorkflowStep('');
        return;
      }

      try {
        const step = JSON.parse(data);
        handleStep(step);
      } catch (err) {
        console.error("Error procesando mensaje:", data, err);
      }
    };

    ws.onclose = () => {
      setConnectionStatus('disconnected');
      setIsProcessing(false);
    };

    ws.onerror = (err) => {
      console.error("⚠️ Error WebSocket:", err);
      setConnectionStatus('disconnected');
      setIsProcessing(false);
    };

    return () => ws.close();
  }, [handleStep]);

  const sendMessage = () => {
    if (input.trim() && wsRef.current?.readyState === WebSocket.OPEN) {
      const submittedInput = input.trim();

      wsRef.current.send(input);
      setMessages((prev) => [
        ...prev,
        <UserQueryComponent key={nextMessageKey('user')} input={submittedInput} />
      ]);
      setIsProcessing(true);
      setWorkflowSteps([
        {
          id: `workflow-${workflowKeyRef.current++}`,
          label: t.workflow.preparingContext,
          tone: 'accent',
        },
      ]);
      setActiveWorkflowStep(t.workflow.preparingContext);
      setInput("");
    }
  };

  return {
    messages,
    input,
    setInput,
    sendMessage,
    connectionStatus,
    isProcessing,
    workflowSteps,
    activeWorkflowStep,
  };
}
