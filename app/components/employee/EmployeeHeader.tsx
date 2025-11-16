// components/employee/EmployeeHeader.tsx
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function EmployeeHeader({ session }: any) {
  const userName = session?.user.name || 'พนักงาน'

  return (
    <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
      <div>
        <h1 className="text-2xl font-bold">ลงเวลาทำงาน</h1>
        <p className="text-sm text-slate-600">สวัสดีคุณ {userName}</p>
      </div>
      <div className="text-xs text-slate-500">Role: {session?.user.role ?? '-'}</div>
    </header>
  )
}
