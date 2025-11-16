
'use client'

import { useState } from 'react'

type AttendanceEventType =
  | 'CHECK_IN_MORNING'
  | 'CHECK_OUT_MORNING'
  | 'CHECK_IN_AFTERNOON'
  | 'CHECK_OUT_AFTERNOON'
  | 'CHECK_IN_EVENING'
  | 'CHECK_OUT_EVENING'

type TimeConfigRow = {
  eventType: AttendanceEventType
  startMinute: number | null
  endMinute: number | null
}

type Props = {
  initialConfigs: {
    eventType: AttendanceEventType
    startMinute: number
    endMinute: number
  }[]
}

const EVENT_LABELS: Record<AttendanceEventType, string> = {
  CHECK_IN_MORNING: 'เข้างาน (เช้า)',
  CHECK_OUT_MORNING: 'ออกงาน (เช้า)',
  CHECK_IN_AFTERNOON: 'เข้างาน (บ่าย)',
  CHECK_OUT_AFTERNOON: 'ออกงาน (บ่าย)',
  CHECK_IN_EVENING: 'เข้างาน (เย็น)',
  CHECK_OUT_EVENING: 'ออกงาน (เย็น)',
}

const EVENT_ORDER: AttendanceEventType[] = [
  'CHECK_IN_MORNING',
  'CHECK_OUT_MORNING',
  'CHECK_IN_AFTERNOON',
  'CHECK_OUT_AFTERNOON',
  'CHECK_IN_EVENING',
  'CHECK_OUT_EVENING',
]

function minutesToHHMM(min: number | null): string {
  if (min === null || Number.isNaN(min)) return ''
  const h = Math.floor(min / 60)
  const m = min % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
}

function hhmmToMinutes(value: string): number | null {
  if (!value) return null
  const [hh, mm] = value.split(':').map((v) => Number(v))
  if (
    Number.isNaN(hh) ||
    Number.isNaN(mm) ||
    hh < 0 ||
    hh > 23 ||
    mm < 0 ||
    mm > 59
  )
    return null
  return hh * 60 + mm
}

export default function AttendanceTimeEditor({ initialConfigs }: Props) {
  const [rows, setRows] = useState<TimeConfigRow[]>(() => {
    const map = new Map<AttendanceEventType, TimeConfigRow>()
    for (const type of EVENT_ORDER) {
      const found = initialConfigs.find((c) => c.eventType === type)
      map.set(type, {
        eventType: type,
        startMinute: found?.startMinute ?? null,
        endMinute: found?.endMinute ?? null,
      })
    }
    return Array.from(map.values())
  })

  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  function handleTimeChange(
    eventType: AttendanceEventType,
    field: 'start' | 'end',
    value: string
  ) {
    const minutes = hhmmToMinutes(value)
    setRows((prev) =>
      prev.map((r) =>
        r.eventType === eventType
          ? {
              ...r,
              startMinute: field === 'start' ? minutes : r.startMinute,
              endMinute: field === 'end' ? minutes : r.endMinute,
            }
          : r
      )
    )
  }

  async function handleSave() {
    try {
      setSaving(true)
      setMessage(null)
      setError(null)

      const payload = rows.map((r) => ({
        eventType: r.eventType,
        startMinute: r.startMinute ?? 0,
        endMinute: r.endMinute ?? 0,
      }))

      const res = await fetch('/api/admin/attendance-time-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'บันทึกเวลาไม่สำเร็จ')
      } else {
        setMessage('บันทึกเวลาเข้างานสำเร็จ')
      }
    } catch (err) {
      console.error(err)
      setError('เกิดข้อผิดพลาดขณะบันทึกเวลา')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-slate-700">
        ตั้งค่าเวลาเข้างาน / ออกงาน
      </h2>

      <div className="overflow-auto border rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="px-3 py-2 text-left">ประเภท</th>
              <th className="px-3 py-2 text-left">เวลาเริ่ม</th>
              <th className="px-3 py-2 text-left">เวลาสิ้นสุด</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.eventType} className="border-t">
                <td className="px-3 py-2 align-top whitespace-nowrap">
                  {EVENT_LABELS[row.eventType]}
                </td>
                <td className="px-3 py-2 align-top">
                  <input
                    type="time"
                    className="border rounded px-2 py-1 text-sm"
                    value={minutesToHHMM(row.startMinute)}
                    onChange={(e) =>
                      handleTimeChange(row.eventType, 'start', e.target.value)
                    }
                  />
                </td>
                <td className="px-3 py-2 align-top">
                  <input
                    type="time"
                    className="border rounded px-2 py-1 text-sm"
                    value={minutesToHHMM(row.endMinute)}
                    onChange={(e) =>
                      handleTimeChange(row.eventType, 'end', e.target.value)
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="inline-flex items-center px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium disabled:opacity-60"
      >
        {saving ? 'กำลังบันทึก...' : 'บันทึกเวลาเข้างาน'}
      </button>

      {message && (
        <p className="text-xs text-green-600">
          {message}
        </p>
      )}
      {error && (
        <p className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}
