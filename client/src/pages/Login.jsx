import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(username, password);
    
    if (result.success) {
      navigate('/chat');
    } else {
      setError(result.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '3rem', width: '100%', maxWidth: '400px' }}>
      <div className="text-center mb-4">
        <h2>Ingresar al Chat</h2>
        <p className="text-muted mb-2">Conéctate a Corp Chat App</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <input
            type="text"
            placeholder="Usuario (ej. admin)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
          />
        </div>
        <div className="mb-2">
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>
        
        {error && <p className="error-text text-center mb-2">{error}</p>}
        
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Conectando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
};

export default Login;
