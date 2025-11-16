// components/employee/FaceScanner.tsx

type Props = {
  videoRef: React.RefObject<HTMLVideoElement>
  scanStatus: 'success' | 'error' | null
  onScan: () => void
}

export function FaceScanner({ videoRef, scanStatus, onScan }: Props) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">กล้อง & สแกนใบหน้า</p>

      <div className="border rounded overflow-hidden bg-black">
        <video ref={videoRef} autoPlay playsInline className="w-full h-64 object-cover" />
      </div>

      <button
        type="button"
        onClick={onScan}
        className="w-full bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium py-2 rounded"
      >
        สแกนใบหน้า
      </button>

      {scanStatus === 'success' && (
        <p className="text-xs text-green-600">สแกนหน้าเรียบร้อย</p>
      )}
      {scanStatus === 'error' && (
        <p className="text-xs text-red-600">สแกนหน้าไม่สำเร็จ</p>
      )}
    </div>
  )
}
