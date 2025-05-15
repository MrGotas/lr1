import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/Add.css';

const Add = () => {
    const navigate = useNavigate();
    const [request, setRequest] = useState({
        title: '',
        brigade: '',
        location: '',
        description: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Добавлен флаг загрузки

    const handleSave = async () => {
        // Проверка на заполнение всех полей
        if (!request.title || !request.brigade || !request.location || !request.description) {
            setError('Все поля должны быть заполнены');
            return;
        }

        try {
            setLoading(true); // Устанавливаем флаг загрузки в true
            await axios.post('http://localhost:5000/requests', request);
            setLoading(false); // Устанавливаем флаг загрузки в false после успешного сохранения
            navigate('/home'); // Переход на главную страницу
        } catch (err) {
            setLoading(false); // Устанавливаем флаг загрузки в false в случае ошибки
            setError('Ошибка сохранения заявки');
        }
    };

    return (
        <div className="add-container">
            <h1>Создание новой заявки</h1>

            {loading ? ( // Показываем спиннер, если данные загружаются
                <div className="spinner">
                    <div className="bounce1"></div>
                    <div className="bounce2"></div>
                    <div className="bounce3"></div>
                </div>
            ) : (
                <>
                    <label>Название заявки:</label>
                    <input type="text" value={request.title} onChange={(e) => setRequest({ ...request, title: e.target.value })} />

                    <label>Бригада:</label>
                    <input type="text" value={request.brigade} onChange={(e) => setRequest({ ...request, brigade: e.target.value })} />

                    <label>Местоположение:</label>
                    <input type="text" value={request.location} onChange={(e) => setRequest({ ...request, location: e.target.value })} />

                    <label>Комментарий:</label>
                    <textarea value={request.description} onChange={(e) => setRequest({ ...request, description: e.target.value })} />

                    {/* Ошибка теперь выводится непосредственно над кнопкой "Сохранить" */}
                    {error && <p className="error-message">{error}</p>}

                    <button onClick={handleSave} className="save-button">Сохранить</button>
                    <button onClick={() => navigate('/home')} className="back-button">Назад</button>
                </>
            )}
        </div>
    );
};

export default Add;
