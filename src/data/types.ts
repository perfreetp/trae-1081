export interface Farmland {
  id: string;
  name: string;
  location: string;
  area_mu: number;
  crop_type: string;
  owner: string;
  owner_phone: string;
  created_at: string;
  soil_type?: string;
  irrigation?: string;
  notes?: string;
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

export type AppointmentStatus = 'pending' | 'approved' | 'surveying' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
export type ServiceType = 'pest_control' | 'fertilizer' | 'herbicide' | 'fungicide' | 'other';

export const SERVICE_DEFAULT_PRICES: Record<ServiceType, number> = {
  pest_control: 12.5,
  fertilizer: 15.0,
  herbicide: 10.0,
  fungicide: 18.0,
  other: 15.0,
};

export interface Appointment {
  id: string;
  farmland_id: string;
  farmland_name: string;
  service_type: ServiceType;
  expected_date: string;
  area_mu: number;
  quoted_price: number;
  status: AppointmentStatus;
  crop_type: string;
  farmer_name: string;
  farmer_phone: string;
  created_at: string;
  notes?: string;
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

export interface BillItem {
  name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface Bill {
  id: string;
  appointment_id: string;
  farmland_id?: string;
  farmland_name: string;
  farmer_name: string;
  total_amount: number;
  paid_amount: number;
  status: 'unpaid' | 'partial' | 'paid' | 'overdue';
  due_date: string;
  paid_date?: string;
  items: BillItem[];
  created_at: string;
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
