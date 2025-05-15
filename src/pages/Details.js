import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/Details.css';

const Details = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [request, setRequest] = useState(null);
    const [editing, setEditing] = useState(false);
    const [updatedRequest, setUpdatedRequest] = useState({ title: '', brigade: '', location: '', description: '' });
    const [serverError, setServerError] = useState(null);
    const [loading, setLoading] = useState(true); // Добавлен флаг загрузки

    useEffect(() => {
        setLoading(true); // Устанавливаем флаг загрузки в true
        axios.get(`http://localhost:5000/requests/${id}`)
            .then(response => {
                setRequest(response.data);
                setUpdatedRequest(response.data);
                setLoading(false); // Устанавливаем флаг загрузки в false после получения данных
            })
            .catch(error => {
                console.error('Ошибка загрузки заявки:', error);
                if (error.response) {
                    // Обработка ошибок сервера
                    const { status } = error.response;
                    if (status === 400) {
                        setServerError('Неверный запрос');
                    } else if (status === 404) {
                        setServerError('Ресурс не найден');
                    } else if (status === 500) {
                        setServerError('Ошибка сервера');
                    } else {
                        setServerError('Произошла ошибка');
                    }
                } else {
                    setServerError('Ошибка соединения с сервером');
                }
                setLoading(false); // Устанавливаем флаг загрузки в false в случае ошибки
            });
    }, [id]);

    const handleEdit = () => setEditing(true);
    const handleSave = async () => {
        try {
            await axios.put(`http://localhost:5000/requests/${id}`, updatedRequest);
            setRequest(updatedRequest);
            setEditing(false);
        } catch (error) {
            console.error('Ошибка сохранения заявки:', error);
            if (error.response) {
                // Обработка ошибок сервера
                const { status } = error.response;
                if (status === 400) {
                    setServerError('Неверный запрос');
                } else if (status === 404) {
                    setServerError('Ресурс не найден');
                } else if (status === 500) {
                    setServerError('Ошибка сервера');
                } else {
                    setServerError('Произошла ошибка');
                }
            } else {
                setServerError('Ошибка соединения с сервером');
            }
        }
    };

    return (
        <div className="request-container">
            {loading ? ( // Показываем спиннер, если данные загружаются
                <div className="spinner">
                    <div className="bounce1"></div>
                    <div className="bounce2"></div>
                    <div className="bounce3"></div>
                </div>
            ) : request ? (
                <>
                    {editing ? (
                        <>
                            <input type="text" value={updatedRequest.title} onChange={(e) => setUpdatedRequest({ ...updatedRequest, title: e.target.value })} />
                            <input type="text" value={updatedRequest.brigade} onChange={(e) => setUpdatedRequest({ ...updatedRequest, brigade: e.target.value })} />
                            <input type="text" value={updatedRequest.location} onChange={(e) => setUpdatedRequest({ ...updatedRequest, location: e.target.value })} />
                            <textarea value={updatedRequest.description} onChange={(e) => setUpdatedRequest({ ...updatedRequest, description: e.target.value })} />
                            <button onClick={handleSave} className="save-button">Сохранить</button>
                        </>
                    ) : (
                        <>
                            <h2>{request.title}</h2>
                            <p><strong>Бригада:</strong> {request.brigade}</p>
                            <p><strong>Местоположение:</strong> {request.location}</p>
                            <p><strong>Описание:</strong> {request.description}</p>
                            <button onClick={handleEdit} className="edit-button">Редактировать</button>
                        </>
                    )}
                    <button onClick={() => navigate('/home')} className="back-button">Назад</button>
                </>
            ) : (
                <p>Загрузка...</p>
            )}
            {serverError && <p className="error">{serverError}</p>} {/* Показываем ошибку сервера */}
        </div>
    );
};

export default Details;
