ระบบลงเวลาทำงาน (Time Attendance System)

## เทคโนโลยีที่ใช้

* Next.js 14 (App Router)
* React + TypeScript
* Tailwind CSS
* Shadcn UI
* face-api.js (ตรวจจับใบหน้า)
* Prisma ORM
* PostgreSQL
* Vercel (Deploy)

## หน้าต่างๆ ภายในระบบ

### หน้าสำหรับผู้ใช้ทั่วไป

* `/auth/signup` – สมัครสมาชิก พร้อมถ่ายใบหน้า
* `/auth/login` – เข้าสู่ระบบ
* `/employee` – ลงเวลาทำงาน (สแกนใบหน้า + ดึงตำแหน่ง + เลือกประเภทการลงเวลา)

### หน้าสำหรับผู้ดูแลระบบ

* `/admin/locations` – ตั้งค่าสถานที่ทำงานหลัก (ละติจูด, ลองจิจูด, รัศมี)
* `/admin/attendance` – ดูบันทึกการลงเวลาทั้งหมดของผู้ใช้

## บัญชีทดสอบ (Admin)

อีเมล: [test1@gmail.com](mailto:test1@gmail.com)
รหัสผ่าน: 123456
