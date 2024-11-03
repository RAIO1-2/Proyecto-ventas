// Notification.js
const Notification = ({ message, onClose, className = '' }) => {
  return (
    <div className={`p-4 rounded ${className} bg-green-500 text-white shadow-md`}>
      <div className="flex justify-between items-center">
        <span>{message}</span>
        <button onClick={onClose} className="ml-4 text-white">
          &times; {/* Close button */}
        </button>
      </div>
    </div>
  );
};

export default Notification;
