import React, { useState, useEffect, useCallback } from 'react';
import { getUsersRequest, updateUserStatusRequest } from '../api/admin';
import { format } from 'date-fns';

export default function AdminPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getUsersRequest();
            setUsers(response.data);
        } catch (err) {
            setError('Não foi possível carregar os usuários.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleStatusChange = async (userId, newStatus) => {
        try {
            await updateUserStatusRequest(userId, newStatus);
            // Atualiza a lista de usuários para refletir a mudança
            fetchUsers();
        } catch (err) {
            alert('Falha ao atualizar o status do usuário.');
        }
    };

    if (loading) return <p className="text-center p-8">Carregando usuários...</p>;
    if (error) return <p className="text-center p-8 text-red-500">{error}</p>;

    return (
        <div className="p-4 md:p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Painel de Administração de Usuários</h1>
            <div className="bg-white p-4 rounded-lg shadow-lg overflow-x-auto">
                <table className="min-w-full table-auto">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-4 py-2 text-left">Nome</th>
                            <th className="px-4 py-2 text-left">Email</th>
                            <th className="px-4 py-2 text-left">Status</th>
                            <th className="px-4 py-2 text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-2">{user.name}</td>
                                <td className="px-4 py-2">{user.email}</td>
                                <td className="px-4 py-2">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold
                    ${user.status === 'active' ? 'bg-green-200 text-green-800' : ''}
                    ${user.status === 'pending' ? 'bg-yellow-200 text-yellow-800' : ''}
                    ${user.status === 'inactive' ? 'bg-red-200 text-red-800' : ''}`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-4 py-2 text-center">
                                    {user.status === 'pending' && (
                                        <button onClick={() => handleStatusChange(user.id, 'active')} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">Aprovar</button>
                                    )}
                                    {user.status === 'active' && (
                                        <button onClick={() => handleStatusChange(user.id, 'inactive')} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Desativar</button>
                                    )}
                                    {user.status === 'inactive' && (
                                        <button onClick={() => handleStatusChange(user.id, 'active')} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Reativar</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}