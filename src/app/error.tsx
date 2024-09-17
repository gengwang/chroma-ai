'use client' // Error boundaries must be Client Components
 
import { useEffect } from 'react'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])
 
  const handleReset = () => {
    reset(); // Call the provided reset function
    window.location.reload(); // Then force a full page reload
  };

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={handleReset}>
        Try again
      </button>
    </div>
  )
}