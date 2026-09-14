import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client';
import axios from 'axios';

const Chat = () => {
  const { user, logout } = useAuth();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // 1. Cargar mensajes históricos
    const fetchMessages = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/messages');
        setMessages(res.data);
        scrollToBottom();
      } catch (err) {
        console.error("Error cargando historial", err);
      }
    };
    fetchMessages();

    // 2. Conectar a Socket.IO
    const token = localStorage.getItem('token');
    const newSocket = io('http://localhost:3000', {
      auth: { token }
    });

    setSocket(newSocket);

    // Escuchar mensajes
    newSocket.on('receive_message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    // Escuchar online users
    newSocket.on('online_users', (users) => {
      setOnlineUsers(users);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() !== '' && socket) {
      socket.emit('send_message', { text: newMessage });
      setNewMessage('');
    }
  };

  return (
    <div className="chat-container">
      {/* Sidebar: Online Users */}
      <aside className="glass-panel sidebar">
        <h3>Corp Chat</h3>
        <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Usuarios en línea</p>
        
        <div className="online-users-list">
          {onlineUsers.map(u => (
            <div key={u.id} className="online-user-item">
              <span className="status-dot"></span>
              <span>{u.username} {u.id === user.id ? '(Tú)' : ''}</span>
            </div>
          ))}
        </div>
        
        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button onClick={logout} style={{ width: '100%' }}>Salir</button>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="glass-panel chat-main">
        <div className="messages-area">
          {messages.length === 0 ? (
            <div style={{ margin: 'auto', color: 'var(--text-muted)' }}>No hay mensajes aún. ¡Escribe algo!</div>
          ) : (
            messages.map((msg, index) => {
              const isOwn = msg.user_id === user.id;
              return (
                <div key={msg.id || index} className={`message-bubble ${isOwn ? 'own-message' : ''}`}>
                  {!isOwn && <div className="message-sender">{msg.username}</div>}
                  <div className="message-text">{msg.text}</div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="chat-input-area">
          <input 
            type="text" 
            placeholder="Escribe un mensaje..." 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            style={{ flex: 1 }}
          />
          <button type="submit" style={{ width: 'auto' }}>Enviar</button>
        </form>
      </main>
    </div>
  );
};

export default Chat;
