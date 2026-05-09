const Button = ({ children, type = "button", onClick, className = "", disabled = false }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  )
}

export default Button