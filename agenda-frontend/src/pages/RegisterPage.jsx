import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerRequest } from '../api/auth'; // Verifique se este import está correto

export default function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await registerRequest(name, email, password);
      alert('Registro realizado com sucesso! Você será redirecionado para a página de login.');
      navigate('/login');
    } catch (err) {
      console.error('Erro no registro:', err);
      // Pega a mensagem de erro específica do backend, se existir
      const errorMessage = err.response?.data?.message || 'Falha no registro. Tente novamente.';
      setError(errorMessage);
    }
  };

  // O JSX do formulário que você já tem...
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Criar Conta</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Nome</label>
            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Senha</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg">Registrar</button>
        </form>
        {error && <p className="mt-4 text-center text-red-500 text-xs">{error}</p>}
        <p className="mt-6 text-center text-sm text-gray-600">
          Já tem uma conta? <Link to="/login" className="text-blue-500 hover:underline">Faça login</Link>
        </p>
      </div>
    </div>
  );
}