import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/Home.css';

const Home = () => {
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [serverError, setServerError] = useState(null);
    const [loading, setLoading] = useState(true); // Добавлен флаг загрузки

    useEffect(() => {
        setLoading(true); // Устанавливаем флаг загрузки в true
        axios.get('http://localhost:5000/requests')
            .then(response => {
                setRequests(response.data);
                setLoading(false); // Устанавливаем флаг загрузки в false после получения данных
            })
            .catch(error => {
                console.error('Ошибка загрузки заявок:', error);
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
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        navigate('/');
    };

    const handleDelete = (id) => {
        axios.delete(`http://localhost:5000/requests/${id}`)
            .then(() => {
                setRequests(requests.filter(request => request.id !== id));
            })
            .catch(error => {
                console.error('Ошибка удаления заявки:', error);
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
            });
    };

    return (
        <div className="home-container">
            <h2>Система управления заявками</h2>
            <div className="top-bar">
                <button onClick={() => navigate('/add')} className="add-request-button">Добавить заявку</button>
                <button onClick={handleLogout} className="logout-button">Выйти</button>
            </div>
            {loading ? ( // Показываем спиннер, если данные загружаются
                <div className="spinner">
                    <div className="bounce1"></div>
                    <div className="bounce2"></div>
                    <div className="bounce3"></div>
                </div>
            ) : (
                <>
                    <h3>Список активных заявок: </h3>
                    {/* Список заявок */}
                    <div className="requests-list">
                        {requests.map((request) => (
                            <div key={request.id} className="request-item">
                                <button className="request-button" onClick={() => navigate(`/details/${request.id}`)}>
                                    Заявка: {request.title}<br /><br />Бригада: {request.brigade}
                                </button>
                                <button onClick={() => handleDelete(request.id)} className="delete-button">Удалить</button>
                            </div>
                        ))}
                    </div>
                </>
            )}
            {serverError && <p className="error">{serverError}</p>} {/* Показываем ошибку сервера */}
        </div>
    );
};

export default Home;
