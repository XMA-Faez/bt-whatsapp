interface ChatHeaderProps {
  onRestart: () => void
  showRestart: boolean
}

export function ChatHeader({ onRestart, showRestart }: ChatHeaderProps) {
  return (
    <header className="chat-header">
      <div className="header-left">
        <div className="back-arrow">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M12 4l1.41 1.41L7.83 11H20v2H7.83l5.58 5.59L12 20l-8-8 8-8z" />
          </svg>
        </div>
        <div className="avatar">BT</div>
        <div className="header-info">
          <h1 className="header-title">BaggageTaxi</h1>
          <span className="header-status">online</span>
        </div>
      </div>
      <div className="header-actions">
        {showRestart && (
          <button className="restart-btn" onClick={onRestart}>
            Restart
          </button>
        )}
        <div className="header-icon">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M15.9 14.3H15l-.3-.3c1-1.1 1.6-2.7 1.6-4.3 0-3.7-3-6.7-6.7-6.7S3 6 3 9.7s3 6.7 6.7 6.7c1.6 0 3.2-.6 4.3-1.6l.3.3v.8l5.1 5.1 1.5-1.5-5-5.2zm-6.2 0c-2.6 0-4.6-2.1-4.6-4.6s2.1-4.6 4.6-4.6 4.6 2.1 4.6 4.6-2 4.6-4.6 4.6z" />
          </svg>
        </div>
        <div className="header-icon">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M12 7a2 2 0 1 0-.001-4.001A2 2 0 0 0 12 7zm0 2a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 9zm0 6a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 15z" />
          </svg>
        </div>
      </div>
    </header>
  )
}
