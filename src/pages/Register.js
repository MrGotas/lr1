import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/Register.css';

const Register = () => {
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const confirmPasswordRef = useRef(null);
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [serverError, setServerError] = useState(null);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleRegister = (e) => {
        e.preventDefault();
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        const confirmPassword = confirmPasswordRef.current.value;

        if (!validateEmail(email)) {
            setError("Некорректный формат электронной почты!");
            return;
        }

        if (password !== confirmPassword) {
            setError("Пароли не совпадают!");
            return;
        }

        axios.get(`http://localhost:5000/users?email=${email}`)
            .then(response => {
                if (response.data.length > 0) {
                    setError("Пользователь уже существует");
                } else {
                    axios.post("http://localhost:5000/users", { email, password }, {
                        headers: { "Content-Type": "application/json" }
                    })
                        .then(() => {
                            console.log("Пользователь зарегистрирован");
                            navigate('/');
                        })
                        .catch(error => {
                            console.error("Ошибка регистрации:", error);
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
                }
            })
            .catch(error => {
                console.error("Ошибка проверки пользователя:", error);
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
        <div className="register-container">
            <h2>Регистрация</h2>
            <form onSubmit={handleRegister} className="register-form">
                <label>Email:</label>
                <input type="email" ref={emailRef} required />

                <label>Пароль:</label>
                <input type="password" ref={passwordRef} required />

                <label>Повторите пароль:</label>
                <input type="password" ref={confirmPasswordRef} required />

                {error && <p className="error-message">{error}</p>}
                {serverError && <p className="error-message">{serverError}</p>} {/* Показываем ошибку сервера */}

                <button type="submit" className="register-button">Зарегистрироваться</button>
            </form>

            <button onClick={() => navigate('/')} className="back-button">Назад</button>
        </div>
    );
};

export default Register;
