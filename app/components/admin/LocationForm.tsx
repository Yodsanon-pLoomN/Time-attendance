
import type { Location } from '@prisma/client'

type LocationFormProps = {
  mainLocation: Location | null
  action: (formData: FormData) => Promise<void>
}

export function LocationForm({ mainLocation, action }: LocationFormProps) {
  return (
    <form action={action} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">ชื่อสถานที่</label>
        <input
          name="name"
          type="text"
          defaultValue={mainLocation?.name ?? 'สถานที่ทำงานหลัก'}
          className="w-full border rounded px-3 py-2 text-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Latitude (ละติจูด)
          </label>
          <input
            name="latitude"
            type="number"
            step="0.000001"
            defaultValue={
              mainLocation?.latitude !== undefined ? mainLocation.latitude : ''
            }
            className="w-full border rounded px-3 py-2 text-sm"
            placeholder="เช่น 16.472000"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Longitude (ลองจิจูด)
          </label>
          <input
            name="longitude"
            type="number"
            step="0.000001"
            defaultValue={
              mainLocation?.longitude !== undefined
                ? mainLocation.longitude
                : ''
            }
            className="w-full border rounded px-3 py-2 text-sm"
            placeholder="เช่น 102.823000"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          รัศมี (เมตร)
        </label>
        <input
          name="radiusM"
          type="number"
          min={10}
          step={10}
          defaultValue={mainLocation?.radiusM ?? 200}
          className="w-full border rounded px-3 py-2 text-sm"
        />
      </div>

      <button
        type="submit"
        className="inline-flex items-center px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
      >
        บันทึกสถานที่ทำงาน
      </button>
    </form>
  )
}
