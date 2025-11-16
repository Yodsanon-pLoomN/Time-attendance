
import type {
  Role,
  AttendanceEventType,
  User as PrismaUser,
  Location as PrismaLocation,
  FaceTemplate as PrismaFaceTemplate,
  AttendanceRecord as PrismaAttendanceRecord,
} from '@prisma/client'

export type UserRole = Role
export type AttendanceType = AttendanceEventType

export type UserSafe = Omit<PrismaUser, 'passwordHash'>

export type UserModel = PrismaUser
export type LocationModel = PrismaLocation
export type FaceTemplateModel = PrismaFaceTemplate
export type AttendanceRecordModel = PrismaAttendanceRecord

export interface LocationDTO {
  id: string
  name: string
  latitude: number
  longitude: number
  radiusM: number
  createdAt: Date
}

export interface AttendanceRecordDTO {
  id: string
  userId: string
  locationId: string
  eventType: AttendanceType
  timestamp: Date
  latitude?: number | null
  longitude?: number | null
  createdAt: Date
}

export interface AttendanceWithRelations extends AttendanceRecordDTO {
  user: UserSafe
  location: LocationDTO
}


export interface AttendanceCheckInRequest {
  descriptor: FaceDescriptor
  latitude: number
  longitude: number
  eventType: AttendanceType
}


export interface ApiSuccessResponse<T = unknown> {
  ok: true
  data: T
}

export interface ApiErrorResponse {
  ok: false
  error: string
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse


export type FaceDescriptor = number[]

export interface SignUpRequest {
  email: string
  password: string
  fullName: string
  descriptor: FaceDescriptor
}
