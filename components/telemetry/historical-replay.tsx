"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from "lucide-react"

interface HistoricalReplayProps {
  onTimeChange: (timestamp: Date) => void
  onPlayStateChange: (isPlaying: boolean) => void
}

export function HistoricalReplay({ onTimeChange, onPlayStateChange }: HistoricalReplayProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)

  const startTime = new Date(Date.now() - 24 * 60 * 60 * 1000)
  const endTime = new Date()
  const totalDuration = endTime.getTime() - startTime.getTime()

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 1000 * playbackSpeed
          if (next >= totalDuration) {
            setIsPlaying(false)
            onPlayStateChange(false)
            return totalDuration
          }

          const timestamp = new Date(startTime.getTime() + next)
          onTimeChange(timestamp)
          return next
        })
      }, 100) // Update every 100ms for smooth playback
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isPlaying, playbackSpeed, totalDuration, startTime, onTimeChange, onPlayStateChange])

  const handlePlay = () => {
    setIsPlaying(!isPlaying)
    onPlayStateChange(!isPlaying)
  }

  const handleTimeChange = (value: number[]) => {
    const newTime = value[0]
    setCurrentTime(newTime)
    const timestamp = new Date(startTime.getTime() + newTime)
    onTimeChange(timestamp)
  }

  const handleSkipBack = () => {
    const newTime = Math.max(0, currentTime - 60000) // Skip back 1 minute
    setCurrentTime(newTime)
    const timestamp = new Date(startTime.getTime() + newTime)
    onTimeChange(timestamp)
  }

  const handleSkipForward = () => {
    const newTime = Math.min(totalDuration, currentTime + 60000) // Skip forward 1 minute
    setCurrentTime(newTime)
    const timestamp = new Date(startTime.getTime() + newTime)
    onTimeChange(timestamp)
  }

  const handleReset = () => {
    setCurrentTime(0)
    setIsPlaying(false)
    onPlayStateChange(false)
    onTimeChange(startTime)
  }

  const formatTime = (milliseconds: number) => {
    const date = new Date(startTime.getTime() + milliseconds)
    return date.toLocaleString()
  }

  const getProgressPercentage = () => {
    return (currentTime / totalDuration) * 100
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Historical Replay</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Timeline Slider */}
        <div className="space-y-2">
          <Slider
            value={[currentTime]}
            onValueChange={handleTimeChange}
            max={totalDuration}
            step={60000} // 1 minute steps
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{startTime.toLocaleString()}</span>
            <span>{endTime.toLocaleString()}</span>
          </div>
        </div>

        {/* Current Time Display */}
        <div className="text-center">
          <div className="text-sm font-medium">{formatTime(currentTime)}</div>
          <div className="text-xs text-muted-foreground">Progress: {getProgressPercentage().toFixed(1)}%</div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-center space-x-2">
          <Button variant="outline" size="icon" onClick={handleReset}>
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleSkipBack}>
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handlePlay}>
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="icon" onClick={handleSkipForward}>
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        {/* Playback Speed */}
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">Playback Speed</label>
          <div className="flex items-center space-x-2">
            <span className="text-xs">0.5x</span>
            <Slider
              value={[playbackSpeed]}
              onValueChange={(value) => setPlaybackSpeed(value[0])}
              min={0.5}
              max={4}
              step={0.5}
              className="flex-1"
            />
            <span className="text-xs">4x</span>
          </div>
          <div className="text-center text-xs text-muted-foreground">Current: {playbackSpeed}x</div>
        </div>
      </CardContent>
    </Card>
  )
}
