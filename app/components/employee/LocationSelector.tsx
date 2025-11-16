// components/employee/LocationSelector.tsx

type Props = {
  eventType: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setEventType: (v: any) => void
  position: { lat: number; lng: number } | null
  onGetLocation: () => void
  checkinStatus: 'success' | 'error' | null
  onCheckIn: () => void
}

export function LocationSelector({
  eventType,
  setEventType,
  position,
  onGetLocation,
  checkinStatus,
  onCheckIn,
}: Props) {
  return (
    <div className="space-y-4">

      <div>
        <label className="block text-sm font-medium mb-1">ประเภทการลงเวลา</label>
        <select
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm"
        >
          <option value="CHECK_IN_MORNING">เข้างาน (เช้า)</option>
          <option value="CHECK_OUT_MORNING">ออก (เช้า)</option>
          <option value="CHECK_IN_AFTERNOON">เข้างาน (บ่าย)</option>
          <option value="CHECK_OUT_AFTERNOON">ออก (บ่าย)</option>
          <option value="CHECK_IN_EVENING">เข้างาน (เย็น)</option>
          <option value="CHECK_OUT_EVENING">ออก (เย็น)</option>
        </select>
      </div>

      <div className="space-y-2">
        <button
          type="button"
          onClick={onGetLocation}
          className="text-xs px-2 py-1 rounded bg-slate-100 hover:bg-slate-200"
        >
          ดึงตำแหน่งปัจจุบัน
        </button>

        <div className="text-xs text-slate-600 border rounded px-3 py-2 bg-slate-50">
          {position
            ? `lat: ${position.lat.toFixed(6)}, lng: ${position.lng.toFixed(6)}`
            : 'ยังไม่ได้ดึงตำแหน่ง'}
        </div>
      </div>

      <button
        type="button"
        onClick={onCheckIn}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded"
      >
        ลงเวลา
      </button>

      {checkinStatus === 'success' && (
        <p className="text-xs text-green-600 text-center">ลงเวลาสำเร็จ</p>
      )}
      {checkinStatus === 'error' && (
        <p className="text-xs text-red-600 text-center">ลงเวลาไม่สำเร็จ</p>
      )}
    </div>
  )
}
