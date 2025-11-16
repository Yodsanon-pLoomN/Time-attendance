// components/admin/LocationSummary.tsx
import type { Location } from '@prisma/client'

type LocationSummaryProps = {
  mainLocation: Location | null
}

export function LocationSummary({ mainLocation }: LocationSummaryProps) {
  if (!mainLocation) {
    return (
      <p className="text-sm text-slate-500">
        ยังไม่ได้ตั้งค่าสถานที่ทำงานหลัก
      </p>
    )
  }

  return (
    <div className="border rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-700 space-y-1">
      <div>
        <span className="font-medium">ชื่อ: </span>
        {mainLocation.name}
      </div>
      <div>
        <span className="font-medium">พิกัด: </span>
        lat: {mainLocation.latitude.toFixed(6)}, lng:{' '}
        {mainLocation.longitude.toFixed(6)}
      </div>
      <div>
        <span className="font-medium">รัศมี: </span>
        {mainLocation.radiusM} เมตร
      </div>
      <div className="text-xs text-slate-500">
        อัปเดตล่าสุด:{' '}
        {new Date(mainLocation.createdAt).toLocaleString('th-TH', {
          dateStyle: 'short',
          timeStyle: 'short',
        })}
      </div>
    </div>
  )
}
