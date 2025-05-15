import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/Authentication.css';

const Authentication = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [serverError, setServerError] = useState(null);

    // Функция для проверки email
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleLogin = async () => {
        // Проверяем email перед отправкой запроса
        if (!validateEmail(email)) {
            setError('Введите корректный email');
            return;
        }

        try {
            // Запрос к локальной базе данных (замени URL на реальный API)
            const response = await axios.get('http://localhost:5000/users');
            const users = response.data;

            // Проверяем, есть ли пользователь с такими данными
            const user = users.find(user => user.email === email && user.password === password);

            if (user) {
                console.log('Login successful:', user);
                localStorage.setItem('isAuthenticated', 'true');
                navigate('/home'); // Перенаправление на главную страницу
            } else {
                setError('Неверный email или пароль');
            }
        } catch (error) {
            console.error('Ошибка авторизации:', error);
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
        <div className="auth-container">
            <h1>Система управления заявками</h1>
            <h2>Вход в систему</h2>
            <h3>Email:</h3>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => {
                    setEmail(e.target.value);
                    setError(''); // Убираем ошибку при изменении
                }}
            />
            {error && <p className="error">{error}</p>} {/* Показываем ошибку, если email неверный */}
            <h3>Пароль:</h3>
            <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            {serverError && <p className="error">{serverError}</p>} {/* Показываем ошибку сервера */}
            <button className="reg_button" onClick={() => navigate('/register')}>Зарегистрироваться</button>
            <button className="login_button" onClick={handleLogin}>Войти</button>
        </div>
    );
};

export default Authentication;
