'use client'

import { useEffect } from 'react'

export function ErrorHandler() {
  useEffect(() => {
    // Handle ChunkLoadError - reload page if chunk fails to load
    const handleChunkError = (event: ErrorEvent) => {
      if (event.error?.name === 'ChunkLoadError' || 
          event.message?.includes('Loading chunk') ||
          event.message?.includes('Failed to fetch dynamically imported module')) {
        console.warn('Chunk load error detected, reloading page...')
        // Clear cache and reload
        if ('caches' in window) {
          caches.keys().then(names => {
            names.forEach(name => caches.delete(name))
          })
        }
        window.location.reload()
      }
    }

    // Handle unhandled promise rejections (chunk errors often come as promise rejections)
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (event.reason?.message?.includes('Loading chunk') ||
          event.reason?.message?.includes('Failed to fetch dynamically imported module')) {
        console.warn('Chunk load error detected in promise rejection, reloading page...')
        event.preventDefault()
        if ('caches' in window) {
          caches.keys().then(names => {
            names.forEach(name => caches.delete(name))
          })
        }
        window.location.reload()
      }
    }

    window.addEventListener('error', handleChunkError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('error', handleChunkError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  return null
}

