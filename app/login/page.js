'use client';

import { AvalynxAlert } from 'avalynx-alert';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

const Login = () => {
    const t = useTranslations('Login');
    const errors = useTranslations('errors');
    const validation = useTranslations('validation')

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });

    const handleChange = ({ target: { id, value, type, checked } }) => {
        setFormData((prevData) => ({
            ...prevData,
            [id]: type === 'checkbox' ? checked : value
        }));
        if (type !== 'checkbox') setInvalidAuth(false);
    };

    const [invalidEmail, setInvalidEmail] = useState(null);
    const [isEmailFocused, setIsEmailFocused] = useState(false);
    const [invalidAuth, setInvalidAuth] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const validateEmail = (value) => {
        let error = value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
            ? ''
            : validation('invalid_email');
        setInvalidEmail(error)
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (submitting) return;

        setSubmitting(true);
        try {
            const { email, password, rememberMe } = formData;
            const response = await fetch('/api/user/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, rememberMe }),
            });
            if (!response.ok) {
                const errorStatus = response.status;
                if (errorStatus !== 401) {
                    const customMessage = errors(errorStatus, { defaultValue: errors('generic') });
                    const errorMessage = response.headers.get('Content-Type')?.includes('application/json')
                        ? (await response.json()).message
                        : `Error ${errorStatus.toString()}: ${customMessage}`;
                    throw new Error(errorMessage);
                } else {
                    throw new Error(errorStatus);
                }
            }
            await response.json();
            window.location.href = '/';
        } catch (error) {
            console.log(error)
            if (error == 'Error: 401') {
                setInvalidAuth(validation('invalid_auth'));
            } else {
                new AvalynxAlert(error.message, 'danger', {
                    duration: 8000,
                    position: 'top-right',
                    closeable: true,
                    autoClose: true,
                    width: '400px'
                });
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="container d-flex flex-column justify-content-center align-items-center" style={{ height: '100vh' }}>
            <form className="needs-validation ignore-padding" onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '330px', padding: '1rem' }} noValidate>
                <h1 className="h3 mb-3 fw-normal text-center">{t('title')}</h1>

                <div className="form-floating mb-2">
                    <input
                        type="email"
                        className={`form-control ${invalidAuth || (!isEmailFocused && invalidEmail) ? 'is-invalid' : ''}`}
                        id="email"
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        onInput={({ target }) => validateEmail(target.value)}
                        onFocus={() => setIsEmailFocused(true)}
                        onBlur={() => setIsEmailFocused(false)}
                        required
                        aria-label="Email address"
                    />
                    <label htmlFor="email">{t('email')}</label>
                    <div className="invalid-feedback">{!invalidAuth ? invalidEmail : ''}</div>
                </div>

                <div className="form-floating mb-2">
                    <input
                        type="password"
                        className={`form-control ${invalidAuth ? 'is-invalid' : ''}`}
                        id="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        aria-label="Password"
                    />
                    <label htmlFor="password">{t('password')}</label>
                    <div className="invalid-feedback">{invalidAuth}</div>
                </div>

                <div className="form-check my-3 d-flex justify-content-between">
                    <div>
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="rememberMe"
                            checked={formData.rememberMe}
                            onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="rememberMe">
                            {t('remember')}
                        </label>
                    </div>
                    <a href="#" className="text-end text-decoration-none" aria-label="Forgot password">
                        {`${t('forgot')}?`}
                    </a>
                </div>

                <button
                    className="btn btn-primary w-100 py-2"
                    type="submit"
                    disabled={invalidAuth || invalidEmail || formData.email == '' || formData.password == '' || submitting}
                >
                    {t('sign')}
                </button>

                <p className="text-center mt-4">
                    {`${t('no_account')}`} <a href="/register" className="text-decoration-none">{t('create_account')}</a>.
                </p>
            </form>
        </main>
    );
};

export default Login;
