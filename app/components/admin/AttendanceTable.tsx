
import type { AttendanceRecord, User, Location } from '@prisma/client'

type AttendanceRecordWithRelations = AttendanceRecord & {
  user: User
  location: Location | null
}

type AttendanceTableProps = {
  records: AttendanceRecordWithRelations[]
}

export function AttendanceTable({ records }: AttendanceTableProps) {
  if (!records || records.length === 0) {
    return <p className="text-sm text-slate-600">ยังไม่มีข้อมูลการลงเวลา</p>
  }

  return (
    <div className="overflow-auto border rounded-lg">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-100 text-slate-700">
          <tr>
            <th className="px-3 py-2 text-left">เวลา</th>
            <th className="px-3 py-2 text-left">พนักงาน</th>
            <th className="px-3 py-2 text-left">ประเภท</th>
            <th className="px-3 py-2 text-left">สถานะ</th>
            <th className="px-3 py-2 text-left">พิกัด</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={r.id} className="border-t hover:bg-slate-50">
              <td className="px-3 py-2 align-top">
                {new Date(r.timestamp).toLocaleString('th-TH', {
                  dateStyle: 'short',
                  timeStyle: 'medium',
                })}
              </td>
              <td className="px-3 py-2 align-top">
                <div className="font-medium">{r.user.fullName}</div>
                <div className="text-xs text-slate-500">{r.user.email}</div>
              </td>
              <td className="px-3 py-2 align-top">
                <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                  {r.eventType}
                </span>
              </td>
              <td className="px-3 py-2 align-top">
                {r.status === 'PASS' ? (
                  <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-700">
                    ทันเวลา
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-700">
                    ไม่ทันเวลา
                  </span>
                )}
              </td>
              <td className="px-3 py-2 align-top text-xs text-slate-600">
                {r.latitude != null && r.longitude != null ? (
                  <>
                    lat: {r.latitude.toFixed(5)}
                    <br />
                    lng: {r.longitude.toFixed(5)}
                  </>
                ) : (
                  '-'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
