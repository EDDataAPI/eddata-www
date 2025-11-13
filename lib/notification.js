import ReactDOMServer from 'react-dom/server'
import toast from 'react-hot-toast'

// Message can be string or JSX
function notification(message, args = {}) {
  let toastId = args?.id

  if (!toastId) {
    toastId =
      typeof message === 'string'
        ? fastHash(message)
        : fastHash(ReactDOMServer.renderToStaticMarkup(message))
  }

  // Note: The react-hot-toast library has limitations with updating existing toasts
  // and removing toasts by ID. We use a hash-based ID system to prevent duplicates,
  // but this means toasts cannot be updated once shown. Consider migrating to
  // react-toastify or sonner for better toast management.

  const options = {
    id: toastId,
    duration: args?.duration ?? 4000,
    position: args?.position ?? 'bottom-center'
  }

  toast(message, options)
}

// Fast non-secure hash (signed int)
function fastHash(string) {
  let hash = 0
  for (let i = 0; i < string.length; i++) {
    const char = string.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return hash
}

export default notification
