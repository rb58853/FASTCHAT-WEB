import { createHashRouter } from 'react-router-dom';

import App from '../App.jsx';
import Chat from '../componets/chat/chat.jsx';
import Home from '../componets/home/home.jsx'

const routes = [
    {
        path: "/",
        element: <App content={<Home />} />,
    },
    {
        path: "/chat",
        element: <App content={<Chat />} />,
    }
]

export const router = createHashRouter(routes)