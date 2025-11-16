// components/admin/UnauthorizedCard.tsx
export function UnauthorizedCard() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white rounded-xl shadow-md p-6 max-w-md w-full text-center space-y-2">
        <h1 className="text-lg font-semibold">ไม่มีสิทธิ์เข้าถึง</h1>
        <p className="text-sm text-slate-600">
          หน้านี้สำหรับผู้ดูแลระบบเท่านั้น (role: ADMIN)
        </p>
      </div>
    </div>
  )
}
