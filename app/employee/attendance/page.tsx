'use client'

import { useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import * as faceapi from 'face-api.js'

import { EmployeeHeader } from '@/app/components/employee/EmployeeHeader'
import { FaceScanner } from '@/app/components/employee/FaceScanner'
import { LocationSelector } from '@/app/components/employee/LocationSelector'

type AttendanceEventType =
  | 'CHECK_IN_MORNING'
  | 'CHECK_OUT_MORNING'
  | 'CHECK_IN_AFTERNOON'
  | 'CHECK_OUT_AFTERNOON'
  | 'CHECK_IN_EVENING'
  | 'CHECK_OUT_EVENING'

type FaceDescriptor = number[]

export default function EmployeePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const videoRef = useRef<HTMLVideoElement>(null) as React.RefObject<HTMLVideoElement>
  const streamRef = useRef<MediaStream | null>(null)

  const [modelsLoaded, setModelsLoaded] = useState(false)
  const [descriptor, setDescriptor] = useState<FaceDescriptor | null>(null)
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null)

  const [scanStatus, setScanStatus] = useState<'success' | 'error' | null>(null)
  const [checkinStatus, setCheckinStatus] = useState<'success' | 'error' | null>(null)

  const [eventType, setEventType] = useState<AttendanceEventType>('CHECK_IN_MORNING')


  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/login')
  }, [status, router])

 
  useEffect(() => {
    async function setup() {
      try {
        await faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
        await faceapi.nets.faceLandmark68Net.loadFromUri('/models')
        await faceapi.nets.faceRecognitionNet.loadFromUri('/models')
        setModelsLoaded(true)

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
        })
        streamRef.current = stream
        if (videoRef.current) videoRef.current.srcObject = stream
      } catch (err) {
        console.error(err)
      }
    }

    setup()

    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop())
    }
  }, [])

  async function handleCaptureFace() {
    try {
      if (!modelsLoaded || !videoRef.current) return setScanStatus('error')

      const det = await faceapi
        .detectSingleFace(videoRef.current)
        .withFaceLandmarks()
        .withFaceDescriptor()

      if (!det?.descriptor) {
        setDescriptor(null)
        return setScanStatus('error')
      }

      setDescriptor(Array.from(det.descriptor))
      setScanStatus('success')
    } catch (err) {
      console.error(err)
      setScanStatus('error')
    }
  }


  function handleGetLocation() {
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      () => setPosition(null)
    )
  }


  async function handleCheckIn() {
    try {
      if (!descriptor || !position) return setCheckinStatus('error')

      const res = await fetch('/api/attendance/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType,
          latitude: position.lat,
          longitude: position.lng,
          descriptor,
        }),
      })

      setCheckinStatus(res.ok ? 'success' : 'error')
    } catch (err) {
      console.error(err)
      setCheckinStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-md p-6 md:p-8 space-y-6">

        <EmployeeHeader session={session} />

        <div className="grid md:grid-cols-2 gap-6">

          <FaceScanner
            videoRef={videoRef}
            scanStatus={scanStatus}
            onScan={handleCaptureFace}
          />

          <LocationSelector
            eventType={eventType}
            setEventType={setEventType}
            position={position}
            onGetLocation={handleGetLocation}
            checkinStatus={checkinStatus}
            onCheckIn={handleCheckIn}
          />

        </div>
      </div>
    </div>
  )
}
