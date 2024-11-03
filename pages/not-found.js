"use client";

export default function Custom404() {
    return (
        <div className="d-flex flex-column justify-content-center align-items-center text-center vh-100">
            <h1 className="display-1">404</h1>
            <h2 className="mt-3">Page Not Found</h2>
            <p className="mt-3">The page you are looking for does not exist.</p>
            <a href="/" className="btn btn-primary mt-3">Go to Home</a>
        </div>
    );
};
