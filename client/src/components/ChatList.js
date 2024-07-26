import React, { useState, useEffect } from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { QueryClientProvider, QueryClient, useQuery } from 'react-query';

export default function ChatList() {
    
    const client = new W3CWebSocket('ws://localhost:5000');
    const queryClient = new QueryClient();

    const { data: messages, status } = useQuery('messages', fetchMessages);

    function fetchMessages() {
        return fetch('http://localhost:5000/messages').then(res => res.json());
    }

    React.useEffect(() => {
        client.onopen = function () {
            console.log('WebSocket Client Connected');
        };

        client.onmessage = function (message) {
            const dataFromServer = JSON.parse(message.data);

            if (dataFromServer.type === 'NEW_MESSAGE') {
                queryClient.invalidateQueries('messages');
            }
        };
    }, []);

    return (
        <div>
            <h1>Сообщения</h1>
            <ul>
                {status === 'loading' && <p>Загрузка...</p>}
                {status === 'error' && <p>Ошибка получения сообщений</p>}
                {status === 'success' && messages.map((message) => (
                    <li key={message.id}>{message.text}</li>
                ))}
            </ul>
        </div>
    );
}