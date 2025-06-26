import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { loginRequest } from '../api/auth';

export default function LoginPage() {
    const navigate = useNavigate();
    const { setToken, setUser } = useAuthStore();

    // Estados para controlar os campos do formulário e a mensagem de erro
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    /**
     * Função executada ao submeter o formulário.
     */
    const handleSubmit = async (e) => {
        e.preventDefault(); // Impede o recarregamento da página
        setError(''); // Limpa erros anteriores

        try {
            // Faz a chamada à API de login
            const response = await loginRequest(email, password);

            // Se o login for bem-sucedido, salva o token e os dados do usuário no estado global
            setToken(response.data.token);
            setUser(response.data.user);

            // Redireciona o usuário para o Dashboard
            navigate('/');

        } catch (err) {
            // Se a chamada à API falhar, este bloco é executado
            console.error('Erro no login:', err);

            // Captura a mensagem de erro específica do backend (ex: "Conta pendente")
            // Se não houver uma, exibe uma mensagem genérica.
            const errorMessage = err.response?.data?.message || 'Falha no login. Verifique suas credenciais.';
            setError(errorMessage);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>
                <form onSubmit={handleSubmit} noValidate>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Senha
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-200"
                    >
                        Entrar
                    </button>
                </form>
                {/* Exibe a mensagem de erro somente se ela existir */}
                {error && <p className="mt-4 text-center text-red-500 text-sm font-bold">{error}</p>}
                <p className="mt-6 text-center text-sm text-gray-600">
                    Não tem uma conta?{' '}
                    <Link to="/register" className="text-blue-500 hover:underline">
                        Registre-se aqui
                    </Link>
                </p>
            </div>
        </div>
    );
}