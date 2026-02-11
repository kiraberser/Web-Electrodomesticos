'use client'

import { useState, useEffect, useRef } from 'react'

interface CountdownTimerProps {
  targetDate: string
}

interface TimeLeft {
  hours: number
  minutes: number
  seconds: number
}

function getTimeLeft(target: string): TimeLeft {
  const diff = Math.max(0, new Date(target).getTime() - Date.now())
  return {
    hours: Math.floor(diff / (1000 * 60 * 60)),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

function pad(n: number): string {
  return n.toString().padStart(2, '0')
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  // Initialize with null to avoid hydration mismatch (Date.now() differs server vs client)
  const [time, setTime] = useState<TimeLeft | null>(null)
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    // Set initial time only on client
    setTime(getTimeLeft(targetDate))

    const start = () => {
      intervalRef.current = setInterval(() => {
        setTime(getTimeLeft(targetDate))
      }, 1000)
    }
    const stop = () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }

    const handleVisibility = () => {
      if (document.hidden) {
        stop()
      } else {
        setTime(getTimeLeft(targetDate))
        start()
      }
    }

    start()
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      stop()
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [targetDate])

  // Show placeholder during SSR / before hydration
  if (!time) {
    return (
      <div className="flex items-center gap-1">
        <span className="text-xs text-gray-500 mr-1">Termina en</span>
        <div className="flex items-center gap-1">
          <span className="bg-[#E38E49] text-white text-sm font-bold px-2 py-0.5 rounded">--</span>
          <span className="text-gray-400 font-bold">:</span>
          <span className="bg-[#E38E49] text-white text-sm font-bold px-2 py-0.5 rounded">--</span>
          <span className="text-gray-400 font-bold">:</span>
          <span className="bg-[#E38E49] text-white text-sm font-bold px-2 py-0.5 rounded">--</span>
        </div>
      </div>
    )
  }

  const expired = time.hours === 0 && time.minutes === 0 && time.seconds === 0

  if (expired) {
    return (
      <span className="text-sm text-gray-500 font-medium">
        Ofertas finalizadas
      </span>
    )
  }

  return (
    <div className="flex items-center gap-1">
      <span className="text-xs text-gray-500 mr-1">Termina en</span>
      <div className="flex items-center gap-1">
        <span className="bg-[#E38E49] text-white text-sm font-bold px-2 py-0.5 rounded">
          {pad(time.hours)}
        </span>
        <span className="text-gray-400 font-bold">:</span>
        <span className="bg-[#E38E49] text-white text-sm font-bold px-2 py-0.5 rounded">
          {pad(time.minutes)}
        </span>
        <span className="text-gray-400 font-bold">:</span>
        <span className="bg-[#E38E49] text-white text-sm font-bold px-2 py-0.5 rounded">
          {pad(time.seconds)}
        </span>
      </div>
    </div>
  )
}
