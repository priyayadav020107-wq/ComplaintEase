// Small dismissible notice used for things like "you can't edit a
// complaint that isn't Pending". The parent owns the auto-hide timer.
export default function Toast({ message, type = "info", onClose }) {
  if (!message) return null;

  return (
    <div className={`toast toast-${type}`} onClick={onClose} role="alert">
      {message}
    </div>
  );
}
