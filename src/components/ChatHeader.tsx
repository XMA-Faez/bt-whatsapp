interface ChatHeaderProps {
  onRestart: () => void
  showRestart: boolean
}

export function ChatHeader({ onRestart, showRestart }: ChatHeaderProps) {
  return (
    <header className="chat-header">
      <div className="header-left">
        <div className="avatar">BT</div>
        <div className="header-info">
          <h1 className="header-title">BaggageTAXI</h1>
          <span className="header-status">online</span>
        </div>
      </div>
      <div className="header-actions">
        {showRestart && (
          <button className="restart-btn" onClick={onRestart}>
            Restart
          </button>
        )}
      </div>
    </header>
  )
}
