'use client'

import { useEffect, useRef, useState } from 'react'
import * as faceapi from 'face-api.js'

type FaceDescriptor = number[]

export default function SignUpPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')

  const [modelsLoaded, setModelsLoaded] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
  const [descriptor, setDescriptor] = useState<FaceDescriptor | null>(null)

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
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop())
      }
    }
  }, [])


  async function handleCaptureFace() {
    try {
      if (!modelsLoaded || !videoRef.current) {
        return setStatus('ไม่สามารถเปิดกล้องได้')
      }

      const det = await faceapi
        .detectSingleFace(videoRef.current)
        .withFaceLandmarks()
        .withFaceDescriptor()

      if (!det?.descriptor) {
        setDescriptor(null)
        return setStatus('ไม่พบใบหน้า')
      }

      setDescriptor(Array.from(det.descriptor))
      setStatus('ถ่ายใบหน้าเรียบร้อย')
    } catch (err) {
      console.error(err)
      setStatus('เกิดข้อผิดพลาดในการถ่ายใบหน้า')
    }
  }


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!fullName || !email || !password) {
      return setStatus('กรุณากรอกข้อมูลให้ครบ')
    }
    if (!descriptor) {
      return setStatus('กรุณาถ่ายใบหน้า')
    }

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password, descriptor }),
      })

      const data = await res.json()

      if (!res.ok) {
        return setStatus(`สมัครไม่สำเร็จ: ${data.error || ''}`)
      }

      setStatus('สมัครสำเร็จ')


    } catch (err) {
      console.error(err)
      setStatus('เกิดข้อผิดพลาดในการสมัคร')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-md p-6 md:p-8 space-y-6">
        <h1 className="text-2xl font-bold text-center">สมัครใช้งานระบบลงเวลา</h1>

        <div className="grid md:grid-cols-2 gap-6">

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                ชื่อ - นามสกุล
              </label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2 text-sm"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="เช่น ยศนนท์ ดวงไข"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">อีเมล</label>
              <input
                type="email"
                className="w-full border rounded px-3 py-2 text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">รหัสผ่าน</label>
              <input
                type="password"
                className="w-full border rounded px-3 py-2 text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded"
            >
              สมัครใช้งาน
            </button>

            {descriptor && (
              <p className="text-xs text-green-600">
                ✅ พร้อมสมัครใช้งาน
              </p>
            )}
          </form>

          <div className="space-y-3">
            <p className="text-sm font-medium">สแกนใบหน้าสำหรับใช้ลงเวลา</p>

            <div className="border rounded overflow-hidden bg-black">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-56 object-cover"
              />
            </div>

            <button
              type="button"
              onClick={handleCaptureFace}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium py-2 rounded"
            >
              ถ่ายใบหน้า
            </button>

            <p className="text-xs text-slate-500">
              กรุณาหันหน้าเข้าหากล้องและอยู่ในแสงพอเหมาะ
            </p>
          </div>
        </div>

        {status && (
          <div className="text-sm text-center text-slate-700 border-t pt-3">
            {status}
          </div>
        )}
      </div>
    </div>
  )
}
