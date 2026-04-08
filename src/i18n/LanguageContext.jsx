import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const translations = {
  en: {
    ui: {
      language: 'Language',
      english: 'EN',
      spanish: 'ES',
      toLight: 'Switch to light mode',
      toDark: 'Switch to dark mode',
      lightMode: 'Light mode',
      darkMode: 'Dark mode',
    },
    home: {
      tag: 'Minimal conversational interface',
      eyebrow: 'Analytics and automation assistant',
      title: 'Ask, explore, and run flows with a clearer experience.',
      description:
        'Fastchat now shows what is happening while processing your request, selecting services, and preparing the final response.',
      openChat: 'Open chat',
      note: 'A clean interface with visible status and real-time responses.',
      ideas: 'Ideas to get started',
      prompts: [
        'Summarize this month sales and detect key changes.',
        'Select the right services to send a report by email.',
        'Compare average prices by country and give me conclusions.',
        'Generate a client list with follow-up opportunities.',
      ],
    },
    chat: {
      status: {
        connecting: 'Connecting',
        connected: 'Online',
        disconnected: 'Offline',
      },
      title: 'Fastchat',
      subtitle: '',
      emptyKicker: 'Ask a question',
      emptyTitle: 'Start a new query',
      emptyText: 'Choose a quick question or write your own.',
      composerLeft: 'Natural queries, analytics, and automation',
      composerRight: 'Enter to send · Shift + Enter for a new line',
      placeholder: 'Ask about sales, clients, services, or processes...',
      connectingTitle: 'Connecting to the service',
      connectingText: 'Establishing session.',
      disconnectedTitle: 'Could not connect to the server',
      disconnectedText: 'Check that the WebSocket backend is running and try again.',
      retry: 'Retry connection',
      faq: [
        'What is Fastchat?',
        'What kind of requests can I ask?',
        'Send sales information to Pedro Alvarez.',
        'Send sales information to clients located in the United States.',
        'How many main products does Fastchat sell?',
        'What was the average sale price in Chile?',
        'Show me a list of our clients.',
        'Find sales information and email it to Pedro Alvarez.',
        'Find company sales information and email it to all clients in the United States.',
        'Send all overall sales information to all clients in Chile by email and phone message.',
      ],
    },
    messageLabels: {
      user: 'Your message',
      query: 'Interpreted query',
      data: 'Data retrieved',
      step: 'Workflow step',
      response: 'Fastchat response',
      processing: 'Processing request',
      processingAlt: 'Fastchat loading',
      processingTitle: 'Running request',
      processingText: '',
    },
    workflow: {
      interpreting: 'Interpreting your query',
      consultingData: 'Consulting data and tools',
      writingResponse: 'Writing final answer',
      selectingServices: 'Selecting appropriate services',
      processing: 'Processing your request',
      preparingContext: 'Selecting services and preparing context',
    },
  },
  es: {
    ui: {
      language: 'Idioma',
      english: 'EN',
      spanish: 'ES',
      toLight: 'Cambiar a modo claro',
      toDark: 'Cambiar a modo oscuro',
      lightMode: 'Modo claro',
      darkMode: 'Modo oscuro',
    },
    home: {
      tag: 'Interfaz conversacional minimalista',
      eyebrow: 'Asistente de analisis y automatizacion',
      title: 'Consulta, explora y ejecuta flujos con una experiencia mas clara.',
      description:
        'Fastchat ahora puede mostrar mejor lo que esta ocurriendo mientras procesa tu solicitud, selecciona servicios y prepara la respuesta final.',
      openChat: 'Abrir chat',
      note: 'Una interfaz limpia, con estado visible y respuestas en tiempo real.',
      ideas: 'Ideas para empezar',
      prompts: [
        'Resume las ventas del mes y detecta cambios importantes.',
        'Selecciona los servicios adecuados para enviar un reporte por correo.',
        'Compara precios promedio por pais y dame conclusiones.',
        'Genera una lista de clientes con oportunidades de seguimiento.',
      ],
    },
    chat: {
      status: {
        connecting: 'Conectando',
        connected: 'En linea',
        disconnected: 'Sin conexion',
      },
      title: 'Fastchat',
      subtitle: '',
      emptyKicker: 'Haz una pregunta',
      emptyTitle: 'Inicia una consulta',
      emptyText: 'Elige una pregunta rapida o escribe la tuya.',
      composerLeft: 'Consulta natural, analisis y automatizacion',
      composerRight: 'Enter para enviar · Shift + Enter para salto',
      placeholder: 'Pregunta algo sobre ventas, clientes, servicios o procesos...',
      connectingTitle: 'Conectando con el servicio',
      connectingText: 'Estableciendo sesion.',
      disconnectedTitle: 'No se pudo establecer conexion con el servidor',
      disconnectedText: 'Verifica que el backend WebSocket este activo y vuelve a intentar la conexion.',
      retry: 'Reintentar conexion',
      faq: [
        '¿Que es Fastchat?',
        '¿Que tipos de consultas puedo hacer?',
        'Envia la informacion de las ventas a Pedro Alvarez.',
        'Envia la informacion de las ventas a cada uno de los clientes que viven en Estados Unidos.',
        '¿Cuantos productos principales vende Fastchat?',
        '¿Cual fue el precio promedio de venta en Chile?',
        'Muestrame una lista con nuestros clientes.',
        'Busca la informacion de las ventas, mandale esta informacion de ventas a Pedro Alvarez por correo.',
        'Busca la informacion de las ventas de la empresa y mandale esta informacion de ventas a cada uno de los clientes de Estados Unidos por correo electronico.',
        'Manda la informacion de todas las ventas generales a cada uno de los clientes de Chile, por correo electronico y por mensaje al telefono.',
      ],
    },
    messageLabels: {
      user: 'Tu mensaje',
      query: 'Consulta interpretada',
      data: 'Datos consultados',
      step: 'Paso del flujo',
      response: 'Respuesta de Fastchat',
      processing: 'Procesando solicitud',
      processingAlt: 'Fastchat cargando',
      processingTitle: 'Procesando consulta',
      processingText: '',
    },
    workflow: {
      interpreting: 'Interpretando tu consulta',
      consultingData: 'Consultando datos y herramientas',
      writingResponse: 'Redactando la respuesta final',
      selectingServices: 'Seleccionando servicios adecuados',
      processing: 'Procesando tu solicitud',
      preparingContext: 'Seleccionando servicios y preparando el contexto',
    },
  },
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const storedLanguage = localStorage.getItem('fastchat-language');
    return storedLanguage === 'es' || storedLanguage === 'en' ? storedLanguage : 'en';
  });

  useEffect(() => {
    localStorage.setItem('fastchat-language', language);
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: translations[language],
    }),
    [language],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }

  return context;
}
