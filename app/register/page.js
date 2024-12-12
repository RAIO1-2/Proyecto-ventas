'use client';

import { AvalynxAlert } from 'avalynx-alert';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

const SignUp = () => {
    const t = useTranslations('Register');
    const errors = useTranslations('errors');
    const validation = useTranslations('validation')

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleChange = ({ target: { id, value, type, checked } }) => {
        setFormData((prevData) => ({
            ...prevData,
            [id]: type === 'checkbox' ? checked : value,
        }));
    };

    const [validationErrors, setValidationErrors] = useState({
        email: '',
        password: '',
        confirmPassword: '',
    });

    const validateField = (id, value) => {
        let error = '';
        switch (id) {
            case 'email':
                error = value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                    ? ''
                    : validation('invalid_email');
                break;
            case 'password':
                error = value.length >= 8
                    ? ''
                    : validation('short_password', { chars: 8 });
                break;
            case 'confirmPassword':
                if (!showPassword) {
                    error = value === formData.password
                        ? ''
                        : validation('password_mismatch');
                }
                break;
            default:
                break;
        }
        setValidationErrors((prevErrors) => ({
            ...prevErrors,
            [id]: error,
        }));
    };

    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (submitting) return;

        setSubmitting(true);
        try {
            const { email, password } = formData;

            const response = await fetch('/api/user/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                if (response.status === 409) {
                    setValidationErrors((prevErrors) => ({
                        ...prevErrors,
                        email: validation('email_in_use'),
                    }));
                } else {
                    const errorStatus = response.status.toString();
                    const customMessage = errors(errorStatus, { defaultValue: errors('generic') });
                    const errorMessage = response.headers.get('Content-Type')?.includes('application/json')
                        ? (await response.json()).message
                        : `Error ${errorStatus}: ${customMessage}`;
                    throw new Error(errorMessage);
                }
                return;
            }

            await response.json();
            window.location.href = '/';
        } catch (error) {
            new AvalynxAlert(error.message, 'danger', {
                duration: 8000,
                position: 'top-right',
                closeable: true,
                autoClose: true,
                width: '400px',
            });
        } finally {
            setSubmitting(false);
        }
    };


    const isFormValid =
        Object.values(validationErrors).every((error) => !error) &&
        formData.email &&
        formData.password &&
        formData.agreeToTerms &&
        (showPassword || (formData.confirmPassword && !validationErrors.confirmPassword));

    useEffect(() => {
        if (showPassword) {
            setValidationErrors((prevErrors) => ({
                ...prevErrors,
                confirmPassword: '',
            }));
        } else if (formData.confirmPassword) {
            validateField('confirmPassword', formData.confirmPassword);
        }
    }, [showPassword, formData.password, formData.confirmPassword]);

    return (
        <main className="container d-flex flex-column justify-content-center align-items-center" style={{ height: '100vh' }}>
            <form className="needs-validation ignore-padding" onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '330px', padding: '1rem' }} noValidate>
                <h1 className="h3 mb-3 fw-normal text-center">{t('title')}</h1>

                <div className="form-floating mb-2">
                    <input
                        type="email"
                        className={`form-control ${validationErrors.email ? 'is-invalid' : ''}`}
                        id="email"
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        onInput={({ target }) => validateField(target.id, target.value)}
                        required
                        aria-label="Email address"
                    />
                    <label htmlFor="email">{t('email')}</label>
                    <div className="invalid-feedback">{validationErrors.email}</div>
                </div>

                <div className="form-floating mb-2">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        className={`form-control ${validationErrors.password ? 'is-invalid' : ''}`}
                        id="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        onInput={({ target }) => validateField(target.id, target.value)}
                        required
                        aria-label="Password"
                    />
                    <label htmlFor="password">{t('password')}</label>
                    <div className="invalid-feedback">{validationErrors.password}</div>
                </div>

                {!showPassword && (
                    <div className="form-floating mb-2">
                        <input
                            type="password"
                            className={`form-control ${validationErrors.confirmPassword ? 'is-invalid' : ''}`}
                            id="confirmPassword"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            onInput={({ target }) => validateField(target.id, target.value)}
                            required
                            aria-label="Confirm Password"
                        />
                        <label htmlFor="confirmPassword">{t('confirm_password')}</label>
                        <div className="invalid-feedback">{validationErrors.confirmPassword}</div>
                    </div>
                )}

                <button
                    type="button"
                    className="btn btn-link p-0 text-decoration-none"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={`${showPassword ? `${t('hide')}` : `${t('show')}`} ${t('password')}`}
                >
                    {showPassword ? t('hide') : t('show')} {t('password')}
                </button>

                <div className="form-check my-3">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={handleChange}
                        required
                    />
                    <label className="form-check-label" htmlFor="agreeToTerms">
                        {`${t('agree_to')} `}
                        <a href="/tos" className="text-end text-decoration-none">{t('terms')}</a>.
                    </label>
                </div>

                <button
                    className="btn btn-primary w-100 py-2"
                    type="submit"
                    disabled={!isFormValid}
                >
                    {t('sign_up')}
                </button>

                <p className="text-center mt-4">
                    {`${t('already_have_account')}?`} <a href="/login" className="text-decoration-none">{t('login')}</a>.
                </p>
            </form>
        </main>
    );
};

export default SignUp;
