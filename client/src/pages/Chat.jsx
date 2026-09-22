import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client';
import axios from 'axios';
import config from '../config';

const Chat = () => {
  const { user, productCount, incrementProductCount, logout } = useAuth();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  
  // Product creation state
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // 1. Cargar mensajes históricos
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${config.apiUrl}/messages`);
        setMessages(res.data);
        scrollToBottom();
      } catch (err) {
        console.error("Error cargando historial", err);
      }
    };
    fetchMessages();

    // 2. Conectar a Socket.IO
    const token = localStorage.getItem('token');
    const newSocket = io(config.socketUrl, {
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

  // Fetch products
  const [products, setProducts] = useState([]);
  
  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${config.apiUrl}/products`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(res.data);
    } catch (err) {
      console.error('Error fetching products', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() !== '' && socket) {
      socket.emit('send_message', { text: newMessage });
      setNewMessage('');
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!productName || !productPrice) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${config.apiUrl}/products`, 
        { name: productName, price: parseFloat(productPrice) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.status === 201) {
        incrementProductCount();
        fetchProducts();
        setProductName('');
        setProductPrice('');
        alert('Producto creado exitosamente');
      }
    } catch (err) {
      console.error('Error al crear producto', err);
      alert('Error al crear producto');
    }
  };

  return (
    <div className="chat-container">
      {/* Sidebar: Online Users */}
      <aside className="glass-panel sidebar">
        <h3>Corp Chat</h3>
        
        <div style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', margin: '1rem 0' }}>
          <strong>{user.username} ({productCount})</strong>
        </div>

        <form onSubmit={handleCreateProduct} style={{ marginBottom: '1.5rem' }}>
          <p className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '0.5rem' }}>Crear Producto</p>
          <input 
            type="text" 
            placeholder="Nombre" 
            value={productName} 
            onChange={e => setProductName(e.target.value)}
            style={{ width: '100%', marginBottom: '5px' }}
          />
          <input 
            type="number" 
            placeholder="Precio" 
            value={productPrice} 
            onChange={e => setProductPrice(e.target.value)}
            style={{ width: '100%', marginBottom: '5px' }}
          />
          <button type="submit" style={{ width: '100%', padding: '5px' }}>Crear</button>
        </form>

        <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Usuarios en línea</p>
        
        <div className="online-users-list">
          {onlineUsers.map(u => (
            <div key={u.id} className="online-user-item">
              <span className="status-dot"></span>
              <span>{u.username} {u.id === user.id ? '(Tú)' : ''}</span>
            </div>
          ))}
        </div>

        <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: '1.5rem' }}>Catálogo Reciente</p>
        <div style={{ fontSize: '0.85rem', flex: 1, overflowY: 'auto' }}>
          {products.slice(0, 5).map(p => (
            <div key={p.id} style={{ marginBottom: '8px', background: 'rgba(0,0,0,0.2)', padding: '5px', borderRadius: '4px' }}>
              <strong>{p.name}</strong> - ${p.price}<br/>
              <span style={{ color: '#aaa', fontSize: '0.75rem' }}>Por: {p.created_by_user}</span>
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
