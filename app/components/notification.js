import React, { useState, useEffect, useRef, memo } from 'react';

// Notification Component
const Notification = memo(({ id, message, type = 'danger', duration = 8000, onClose, startTime, position }) => {
    const [progress, setProgress] = useState(100); // Initial progress at 100%
    const animationFrameRef = useRef(null);
    const progressRef = useRef(progress); // Store progress in a ref to persist it
    const startTimeRef = useRef(startTime); // Store startTime in a ref to persist it
    const notificationRef = useRef(null);

    // Update progress smoothly
    useEffect(() => {
        startTimeRef.current = startTime;

        const updateProgress = () => {
            const elapsed = Date.now() - startTimeRef.current; // Time elapsed since start
            const remainingTime = duration - elapsed;
            const newProgress = Math.max((remainingTime / duration) * 100, 0);

            if (newProgress !== progressRef.current) {
                progressRef.current = newProgress;
                setProgress(newProgress); // Update progress in state
            }

            if (newProgress === 0) {
                onClose(id); // Close notification
            } else {
                animationFrameRef.current = requestAnimationFrame(updateProgress);
            }
        };

        animationFrameRef.current = requestAnimationFrame(updateProgress);

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [duration, id, onClose]);

    if (progress <= 0) return null;

    const notificationHeight = notificationRef.current?.offsetHeight || 70;

    return (
        <div
            className={`alert alert-${type} alert-dismissible fade show`}
            role="alert"
            style={{
                position: 'fixed',
                right: '10px',
                zIndex: 1050 + position,
                top: `${10 + position * (notificationHeight + 10)}px`,
                maxWidth: '430px',
            }}
            ref={notificationRef}
        >
            {message}
            <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => onClose(id)}
            ></button>
            <div className="progress my-2" style={{ height: '5px' }}>
                <div
                    className={`progress-bar bg-${type}`}
                    role="progressbar"
                    style={{ width: `${progress}%` }}
                    aria-valuenow={progress}
                    aria-valuemin="0"
                    aria-valuemax="100"
                ></div>
            </div>
        </div>
    );
});

Notification.displayName = 'Notification';

// Hook: useNotification
export const useNotification = () => {
    const [notifications, setNotifications] = useState([]);

    const addNotification = ({ message, type = 'info', duration = 8000 }) => {
        const id = Date.now();
        const startTime = Date.now();
        setNotifications((prev) => [
            ...prev,
            { id, message, type, duration, startTime },
        ]);
    };

    const removeNotification = (id) => {
        setNotifications((prev) => prev.filter((notification) => notification.id !== id));
    };

    const NotificationContainer = () => (
        <div>
            {notifications.map(({ id, message, type, duration, startTime }, index) => (
                <Notification
                    key={id}
                    id={id}
                    message={message}
                    type={type}
                    duration={duration}
                    startTime={startTime}
                    onClose={removeNotification}
                    position={index} // Use stable index for ordering
                />
            ))}
        </div>
    );

    return { addNotification, NotificationContainer };
};
