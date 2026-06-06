export interface Farmland {
  id: string;
  name: string;
  location: string;
  area_mu: number;
  measured_area?: number;
  crop_type: string;
  owner: string;
  owner_phone: string;
  created_at: string;
  soil_type?: string;
  irrigation?: string;
  notes?: string;
  last_measured_at?: string;
}

export interface CropCycle {
  id: string;
  farmland_id: string;
  stage: string;
  date: string;
  notes: string;
}

export interface PestRecord {
  id: string;
  farmland_id: string;
  pest_type: string;
  date: string;
  severity: 'low' | 'medium' | 'high';
  treatment: string;
  effect: string;
}

export type AppointmentStatus = 
  | 'pending' 
  | 'approved' 
  | 'surveying' 
  | 'surveyed'
  | 'scheduling' 
  | 'scheduled' 
  | 'in_progress' 
  | 'operation_completed'
  | 'photos_uploaded'
  | 'signed'
  | 'pending_settlement' 
  | 'settled'
  | 'cancelled';
export type ServiceType = 'pest_control' | 'fertilizer' | 'herbicide' | 'fungicide' | 'other';

export const SERVICE_DEFAULT_PRICES: Record<ServiceType, number> = {
  pest_control: 12.5,
  fertilizer: 15.0,
  herbicide: 10.0,
  fungicide: 18.0,
  other: 15.0,
};

export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  pending: '待审核',
  approved: '待测绘',
  surveying: '测绘中',
  surveyed: '待排班',
  scheduling: '排班中',
  scheduled: '待作业',
  in_progress: '作业中',
  operation_completed: '待回传',
  photos_uploaded: '待签收',
  signed: '待结算',
  pending_settlement: '待结算',
  settled: '已结清',
  cancelled: '已取消',
};

export const APPOINTMENT_STATUS_COLORS: Record<AppointmentStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-orange-100 text-orange-700',
  surveying: 'bg-blue-100 text-blue-700',
  surveyed: 'bg-sky-100 text-sky-700',
  scheduling: 'bg-purple-100 text-purple-700',
  scheduled: 'bg-indigo-100 text-indigo-700',
  in_progress: 'bg-green-100 text-green-700',
  operation_completed: 'bg-teal-100 text-teal-700',
  photos_uploaded: 'bg-cyan-100 text-cyan-700',
  signed: 'bg-emerald-100 text-emerald-700',
  pending_settlement: 'bg-amber-100 text-amber-700',
  settled: 'bg-gray-100 text-gray-700',
  cancelled: 'bg-red-100 text-red-700',
};

export interface Appointment {
  id: string;
  farmland_id: string;
  farmland_name: string;
  service_type: ServiceType;
  expected_date: string;
  area_mu: number;
  measured_area?: number;
  quoted_price: number;
  status: AppointmentStatus;
  crop_type: string;
  farmer_name: string;
  farmer_phone: string;
  created_at: string;
  notes?: string;
  schedule_id?: string;
  bill_id?: string;
  operation_id?: string;
  survey_id?: string;
  evaluation_id?: string;
  signed_at?: string;
  signed_by?: string;
}

export interface Survey {
  id: string;
  appointment_id: string;
  farmland_id?: string;
  farmland_name: string;
  measured_area: number;
  survey_date: string;
  surveyor: string;
  status: 'pending' | 'completed';
  boundary_coords?: string;
  terrain_notes?: string;
  updated_at?: string;
  point_count?: number;
}

export interface Pesticide {
  id: string;
  name: string;
  type: 'insecticide' | 'fungicide' | 'herbicide' | 'fertilizer' | 'other';
  stock_kg: number;
  unit: string;
  expiry_date: string;
  unit_price: number;
  manufacturer?: string;
  dosage?: string;
  safety_period?: string;
}

export interface PesticidePlan {
  id: string;
  appointment_id: string;
  pesticide_list: { pesticide_id: string; name: string; quantity: number; unit: string }[];
  notes: string;
  created_at: string;
}

export interface Drone {
  id: string;
  name: string;
  model: string;
  status: 'available' | 'in_use' | 'maintenance' | 'charging';
  battery_capacity: number;
  payload_kg: number;
  last_maintenance: string;
  flight_hours: number;
}

export interface Pilot {
  id: string;
  name: string;
  phone: string;
  license_no: string;
  experience_years: number;
  status: 'available' | 'on_duty' | 'off_duty';
  completed_tasks: number;
  rating: number;
}

export interface Schedule {
  id: string;
  appointment_id: string;
  farmland_name: string;
  drone_id: string;
  drone_name: string;
  pilot_id: string;
  pilot_name: string;
  operation_date: string;
  weather_condition: string;
  weather_suitability: 'excellent' | 'good' | 'fair' | 'poor';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  start_time?: string;
  end_time?: string;
  notes?: string;
  has_weather_risk?: boolean;
  risk_confirmed?: boolean;
  created_by?: string;
  created_at?: string;
}

export interface WeatherInfo {
  date: string;
  temp: string;
  condition: string;
  wind_speed: string;
  humidity: string;
  suitability: 'excellent' | 'good' | 'fair' | 'poor';
}

export interface Operation {
  id: string;
  appointment_id: string;
  farmland_name: string;
  operation_date: string;
  actual_area: number;
  progress: number;
  status: 'in_progress' | 'completed' | 'paused';
  pilot_name: string;
  drone_name: string;
  pesticide_used: { name: string; quantity: number; unit: string }[];
  flight_path?: string;
  start_time?: string;
  end_time?: string;
}

export type PhotoType = 'before' | 'during' | 'after';
export type MediaType = 'image' | 'video';

export interface OperationPhoto {
  id: string;
  operation_id: string;
  url: string;
  type: PhotoType;
  media_type: MediaType;
  upload_time: string;
  uploaded_at?: string;
  description?: string;
}

export interface PaymentRecord {
  id: string;
  bill_id: string;
  amount: number;
  payment_method: 'cash' | 'bank_transfer' | 'wechat' | 'alipay' | 'other';
  payment_date: string;
  remark?: string;
  created_at: string;
}

export type BillItemType = 'service' | 'pesticide' | 'respray' | 'discount' | 'other';

export interface BillItem {
  id?: string;
  type: BillItemType;
  name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  description?: string;
}

export type RefundStatus = 'pending' | 'completed' | 'cancelled';

export interface RefundRecord {
  id: string;
  bill_id: string;
  amount: number;
  refund_method: 'cash' | 'bank_transfer' | 'wechat' | 'alipay' | 'other';
  refund_reason: string;
  refund_date: string;
  status: RefundStatus;
  operator: string;
  remark?: string;
  created_at: string;
}

export interface Bill {
  id: string;
  appointment_id: string;
  farmland_id?: string;
  farmland_name: string;
  farmer_name: string;
  total_amount: number;
  paid_amount: number;
  refunded_amount?: number;
  status: 'unpaid' | 'partial' | 'paid' | 'overdue' | 'refunded';
  due_date: string;
  paid_date?: string;
  items: BillItem[];
  created_at: string;
  created_by?: string;
  billed_area?: number;
  area_type?: 'registered' | 'measured';
}

export type ResprayStatus = 'pending' | 'approved' | 'completed' | 'rejected';

export interface Evaluation {
  id: string;
  appointment_id: string;
  farmland_name: string;
  farmer_name: string;
  rating: number;
  comment: string;
  needs_respray: boolean;
  respray_reason?: string;
  respray_note?: string;
  evaluation_date: string;
  farmer_signature?: string;
  respray_status?: ResprayStatus;
}

export interface SeasonStats {
  month: string;
  operations: number;
  area: number;
  revenue: number;
}

export interface DashboardStats {
  total_farmlands: number;
  total_area: number;
  pending_appointments: number;
  today_operations: number;
  monthly_revenue: number;
  completion_rate: number;
  avg_rating: number;
  active_drones: number;
}
