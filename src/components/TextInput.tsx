import { useState } from 'react'

interface TextInputProps {
  placeholder: string
  onSubmit: (value: string) => void
  disabled?: boolean
}

export function TextInput({ placeholder, onSubmit, disabled }: TextInputProps) {
  const [value, setValue] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.trim()) {
      onSubmit(value.trim())
      setValue('')
    }
  }

  return (
    <form className="text-input-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="text-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled}
        autoFocus
      />
      <button type="submit" className="send-btn" disabled={disabled || !value.trim()}>
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
        </svg>
      </button>
    </form>
  )
}
