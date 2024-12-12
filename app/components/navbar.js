'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import classNames from 'classnames';
import Flag from 'react-world-flags'
import { useLocale, useTranslations } from 'next-intl';
import { setUserLocale } from '@/services/locale';

const Navbar = ({ locales }) => {
    const t = useTranslations('navbar');
    const locale = useLocale();
    const navigationKeys = ['home', 'shop', 'faqs', 'about', 'contact'];

    const [isLoggedIn, setIsLoggedIn] = useState(null);
    const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(false);

    const pathname = usePathname().replace(/^\/[a-z]{2}\/(.*)$/i, '/');

    useEffect(() => {
        setIsLoggedIn(document.cookie.includes('member_id'));
        const navbarToggler = document.querySelector('.navbar-toggler');
        const resizeObserver = new ResizeObserver(() => {
            setIsNavbarCollapsed(window.getComputedStyle(navbarToggler).display !== 'none');
        });

        resizeObserver.observe(navbarToggler);
        return () => resizeObserver.disconnect();
    }, []);

    const handleLangChange = (lang) => {
        setUserLocale(lang);
    };

    const handleLogout = async () => {
        const response = await fetch('/api/user/logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });
        setIsLoggedIn(!response.ok);
        window.location.href = '/login';
    };

    return (
        <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark" style={{ "zIndex": "999" }}>
            <div className="container">
                <a href="/" className="navbar-brand">
                    <img src="/globe.svg" width="32" height="32" alt="Logo" />
                </a>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarCollapse"
                    aria-controls="navbarCollapse"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="navbar-collapse collapse" id="navbarCollapse">
                    <ul className="navbar-nav me-auto">
                        {navigationKeys.map((key) => (
                            <li key={key} className="nav-item">
                                <a
                                    href={key === 'home' ? '/' : `/${key.toLowerCase()}`}
                                    className={classNames('nav-link', {
                                        active: pathname === (key === 'home' ? '/' : `/${key.toLowerCase()}`)
                                    })}
                                >
                                    {t(`navigation.${key}`)}
                                </a>
                            </li>
                        ))}
                        <li className="nav-item dropdown">
                            <a
                                className="nav-link dropdown-toggle"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                {t('buttons.language')}
                            </a>
                            <ul className="dropdown-menu">
                                {Object.keys(locales).map((lang) => (
                                    <li key={lang}>
                                        <a
                                            className={classNames('dropdown-item', {
                                                disabled: lang === locale,
                                            })}
                                            onClick={() => handleLangChange(lang)}
                                        >
                                            <Flag
                                                code={locales[lang].flag}
                                                width={20}
                                                height={15}
                                                style={{ marginRight: 10 }}
                                            />
                                            {locales[lang].language}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    </ul>

                    <div className={`navbar-nav d-flex${!isNavbarCollapsed ? ' gap-2' : ''}`}>
                        <a
                            href="/cart"
                            className={classNames({
                                'nav-link': isNavbarCollapsed,
                                'btn btn-outline-light': !isNavbarCollapsed,
                                active: pathname === '/cart'
                            })}
                        >
                            <i
                                className={classNames(
                                    'bi', pathname === '/cart' ? 'bi-cart-fill' : 'bi-cart', 'me-1'
                                )}
                            />{t('buttons.cart')}
                        </a>

                        {!isLoggedIn ? (
                            <a
                                href="/login"
                                className={classNames({
                                    'nav-link': isNavbarCollapsed,
                                    'btn btn-primary': !isNavbarCollapsed,
                                    active: pathname === '/login'
                                })}
                            >
                                <i className="bi bi-box-arrow-in-right me-1"></i>{t('buttons.login')}
                            </a>
                        ) : (
                            <li className="nav-item dropdown">
                                <a
                                    className={classNames(
                                        !isNavbarCollapsed
                                            ? 'd-block link-body-emphasis text-decoration-none dropdown-toggle cursor-pointer'
                                            : 'nav-link dropdown-toggle'
                                    )}
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    {!isNavbarCollapsed ? (
                                        <img src="/api/user/pfp" width="38" height="38" className="rounded-circle" alt="User Profile" />
                                    ) : (
                                        t('buttons.profile')
                                    )}
                                </a>
                                <ul className="dropdown-menu text-small">
                                    <li><a className="dropdown-item" href="#">{t('options.settings')}</a></li>
                                    <li><a className="dropdown-item" href="#">{t('options.profile')}</a></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li><a className="dropdown-item" style={{ cursor: 'pointer' }} onClick={handleLogout}>{t('options.logout')}</a></li>
                                </ul>
                            </li>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
