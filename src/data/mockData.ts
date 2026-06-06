import type {
  Farmland,
  Appointment,
  Survey,
  Pesticide,
  Drone,
  Pilot,
  Schedule,
  Operation,
  Bill,
  Evaluation,
  SeasonStats,
  DashboardStats,
  WeatherInfo,
  OperationPhoto,
  CropCycle,
  PestRecord,
} from './types';

export const mockFarmlands: Farmland[] = [
  { id: 'f1', name: '东大田一号', location: '山东省潍坊市寿光市洛城街道', area_mu: 158.5, crop_type: '小麦', owner: '张建国', owner_phone: '138****1234', created_at: '2026-02-15', soil_type: '壤土', irrigation: '喷灌' },
  { id: 'f2', name: '西坡地', location: '山东省潍坊市寿光市孙家集街道', area_mu: 86.2, crop_type: '玉米', owner: '李明华', owner_phone: '139****5678', created_at: '2026-03-01', soil_type: '砂壤土', irrigation: '滴灌' },
  { id: 'f3', name: '南洼地块', location: '山东省潍坊市青州市黄楼街道', area_mu: 245.0, crop_type: '水稻', owner: '王德福', owner_phone: '137****9012', created_at: '2026-01-20', soil_type: '粘土', irrigation: '漫灌' },
  { id: 'f4', name: '北岭果园', location: '山东省潍坊市青州市邵庄镇', area_mu: 120.8, crop_type: '苹果', owner: '赵炳义', owner_phone: '136****3456', created_at: '2026-02-28', soil_type: '褐土', irrigation: '滴灌' },
  { id: 'f5', name: '河东蔬菜基地', location: '山东省潍坊市寿光市古城街道', area_mu: 68.5, crop_type: '番茄', owner: '刘蔬菜', owner_phone: '135****7890', created_at: '2026-03-10', soil_type: '壤土', irrigation: '滴灌' },
  { id: 'f6', name: '河西棉田', location: '山东省潍坊市昌乐县红河镇', area_mu: 195.3, crop_type: '棉花', owner: '陈棉农', owner_phone: '134****2345', created_at: '2026-02-20', soil_type: '砂壤土', irrigation: '喷灌' },
  { id: 'f7', name: '南山茶园', location: '山东省青岛市崂山区王哥庄街道', area_mu: 89.6, crop_type: '茶叶', owner: '吴茶农', owner_phone: '133****6789', created_at: '2026-01-15', soil_type: '棕壤', irrigation: '喷灌' },
  { id: 'f8', name: '北沟花生地', location: '山东省潍坊市安丘市景芝镇', area_mu: 142.0, crop_type: '花生', owner: '郑花生', owner_phone: '132****0123', created_at: '2026-03-05', soil_type: '砂壤土', irrigation: '无' },
];

export const mockCropCycles: CropCycle[] = [
  { id: 'cc1', farmland_id: 'f1', stage: '播种', date: '2026-03-05', notes: '使用优质小麦种济麦22' },
  { id: 'cc2', farmland_id: 'f1', stage: '出苗', date: '2026-03-15', notes: '出苗整齐，长势良好' },
  { id: 'cc3', farmland_id: 'f1', stage: '分蘖', date: '2026-04-01', notes: '分蘖数达标' },
  { id: 'cc4', farmland_id: 'f1', stage: '拔节', date: '2026-04-20', notes: '追施尿素15公斤/亩' },
  { id: 'cc5', farmland_id: 'f2', stage: '播种', date: '2026-04-10', notes: '春玉米播种' },
  { id: 'cc6', farmland_id: 'f2', stage: '出苗', date: '2026-04-20', notes: '出苗率95%以上' },
];

export const mockPestRecords: PestRecord[] = [
  { id: 'p1', farmland_id: 'f1', pest_type: '蚜虫', date: '2026-04-15', severity: 'medium', treatment: '吡虫啉喷雾', effect: '防治效果良好' },
  { id: 'p2', farmland_id: 'f1', pest_type: '纹枯病', date: '2026-04-25', severity: 'low', treatment: '井冈霉素', effect: '病情得到控制' },
  { id: 'p3', farmland_id: 'f2', pest_type: '玉米螟', date: '2026-05-05', severity: 'high', treatment: '氯虫苯甲酰胺', effect: '待观察' },
  { id: 'p4', farmland_id: 'f4', pest_type: '红蜘蛛', date: '2026-04-30', severity: 'medium', treatment: '阿维菌素', effect: '效果良好' },
];

export const mockAppointments: Appointment[] = [
  { id: 'a1', farmland_id: 'f1', farmland_name: '东大田一号', service_type: 'pest_control', expected_date: '2026-06-10', area_mu: 158.5, quoted_price: 12.5, status: 'scheduled', crop_type: '小麦', farmer_name: '张建国', farmer_phone: '138****1234', created_at: '2026-06-01', notes: '重点防治蚜虫和纹枯病' },
  { id: 'a2', farmland_id: 'f2', farmland_name: '西坡地', service_type: 'fertilizer', expected_date: '2026-06-12', area_mu: 86.2, quoted_price: 15.0, status: 'in_progress', crop_type: '玉米', farmer_name: '李明华', farmer_phone: '139****5678', created_at: '2026-06-03', notes: '追施叶面肥' },
  { id: 'a3', farmland_id: 'f3', farmland_name: '南洼地块', service_type: 'herbicide', expected_date: '2026-06-08', area_mu: 245.0, quoted_price: 10.0, status: 'pending', crop_type: '水稻', farmer_name: '王德福', farmer_phone: '137****9012', created_at: '2026-06-05' },
  { id: 'a4', farmland_id: 'f4', farmland_name: '北岭果园', service_type: 'fungicide', expected_date: '2026-06-15', area_mu: 120.8, quoted_price: 18.0, status: 'approved', crop_type: '苹果', farmer_name: '赵炳义', farmer_phone: '136****3456', created_at: '2026-06-02', notes: '防治白粉病和褐斑病' },
  { id: 'a5', farmland_id: 'f5', farmland_name: '河东蔬菜基地', service_type: 'pest_control', expected_date: '2026-06-09', area_mu: 68.5, quoted_price: 20.0, status: 'completed', crop_type: '番茄', farmer_name: '刘蔬菜', farmer_phone: '135****7890', created_at: '2026-05-28' },
  { id: 'a6', farmland_id: 'f6', farmland_name: '河西棉田', service_type: 'pest_control', expected_date: '2026-06-18', area_mu: 195.3, quoted_price: 14.0, status: 'surveying', crop_type: '棉花', farmer_name: '陈棉农', farmer_phone: '134****2345', created_at: '2026-06-04' },
  { id: 'a7', farmland_id: 'f7', farmland_name: '南山茶园', service_type: 'pest_control', expected_date: '2026-06-20', area_mu: 89.6, quoted_price: 22.0, status: 'pending', crop_type: '茶叶', farmer_name: '吴茶农', farmer_phone: '133****6789', created_at: '2026-06-06' },
  { id: 'a8', farmland_id: 'f8', farmland_name: '北沟花生地', service_type: 'herbicide', expected_date: '2026-06-11', area_mu: 142.0, quoted_price: 11.0, status: 'cancelled', crop_type: '花生', farmer_name: '郑花生', farmer_phone: '132****0123', created_at: '2026-05-30', notes: '农户自行喷洒' },
];

export const mockSurveys: Survey[] = [
  { id: 's1', appointment_id: 'a1', farmland_name: '东大田一号', measured_area: 156.8, survey_date: '2026-06-05', surveyor: '测绘员小王', status: 'completed', terrain_notes: '地势平坦，无障碍物' },
  { id: 's2', appointment_id: 'a2', farmland_name: '西坡地', measured_area: 87.5, survey_date: '2026-06-06', surveyor: '测绘员小李', status: 'completed', terrain_notes: '略有坡度，作业需注意' },
  { id: 's3', appointment_id: 'a6', farmland_name: '河西棉田', measured_area: 0, survey_date: '', surveyor: '', status: 'pending' },
  { id: 's4', appointment_id: 'a3', farmland_name: '南洼地块', measured_area: 0, survey_date: '', surveyor: '', status: 'pending' },
];

export const mockPesticides: Pesticide[] = [
  { id: 'pest1', name: '吡虫啉', type: 'insecticide', stock_kg: 250, unit: 'g/亩', expiry_date: '2027-12-31', unit_price: 28.5, manufacturer: '某农药厂', dosage: '20-30', safety_period: '7天' },
  { id: 'pest2', name: '氯虫苯甲酰胺', type: 'insecticide', stock_kg: 120, unit: 'ml/亩', expiry_date: '2027-06-30', unit_price: 85.0, manufacturer: '某农化公司', dosage: '15-20', safety_period: '14天' },
  { id: 'pest3', name: '井冈霉素', type: 'fungicide', stock_kg: 180, unit: 'ml/亩', expiry_date: '2026-12-31', unit_price: 15.0, manufacturer: '某生物农药厂', dosage: '100-150', safety_period: '10天' },
  { id: 'pest4', name: '戊唑醇', type: 'fungicide', stock_kg: 95, unit: 'ml/亩', expiry_date: '2027-09-30', unit_price: 42.0, manufacturer: '某化工公司', dosage: '15-25', safety_period: '21天' },
  { id: 'pest5', name: '草甘膦', type: 'herbicide', stock_kg: 500, unit: 'ml/亩', expiry_date: '2028-03-31', unit_price: 25.0, manufacturer: '某农化公司', dosage: '200-300', safety_period: '15天' },
  { id: 'pest6', name: '烟嘧磺隆', type: 'herbicide', stock_kg: 85, unit: 'ml/亩', expiry_date: '2027-05-31', unit_price: 35.0, manufacturer: '某农药厂', dosage: '80-100', safety_period: '30天' },
  { id: 'pest7', name: '磷酸二氢钾', type: 'fertilizer', stock_kg: 800, unit: 'g/亩', expiry_date: '2029-12-31', unit_price: 8.5, manufacturer: '某化肥厂', dosage: '100-200', safety_period: '3天' },
  { id: 'pest8', name: '尿素叶面肥', type: 'fertilizer', stock_kg: 600, unit: 'g/亩', expiry_date: '2028-06-30', unit_price: 5.5, manufacturer: '某化肥厂', dosage: '500-1000', safety_period: '3天' },
  { id: 'pest9', name: '阿维菌素', type: 'insecticide', stock_kg: 45, unit: 'ml/亩', expiry_date: '2026-10-15', unit_price: 38.0, manufacturer: '某农化公司', dosage: '20-30', safety_period: '7天' },
  { id: 'pest10', name: '代森锰锌', type: 'fungicide', stock_kg: 150, unit: 'g/亩', expiry_date: '2027-08-20', unit_price: 22.0, manufacturer: '某农药厂', dosage: '100-150', safety_period: '21天' },
];

export const mockDrones: Drone[] = [
  { id: 'd1', name: '极飞P100-001', model: '极飞P100', status: 'in_use', battery_capacity: 28000, payload_kg: 50, last_maintenance: '2026-05-20', flight_hours: 486 },
  { id: 'd2', name: '极飞P100-002', model: '极飞P100', status: 'available', battery_capacity: 28000, payload_kg: 50, last_maintenance: '2026-05-25', flight_hours: 412 },
  { id: 'd3', name: '大疆T40-001', model: '大疆T40', status: 'charging', battery_capacity: 25000, payload_kg: 40, last_maintenance: '2026-06-01', flight_hours: 356 },
  { id: 'd4', name: '大疆T40-002', model: '大疆T40', status: 'maintenance', battery_capacity: 25000, payload_kg: 40, last_maintenance: '2026-06-06', flight_hours: 523 },
  { id: 'd5', name: '极飞V50-001', model: '极飞V50', status: 'available', battery_capacity: 20000, payload_kg: 30, last_maintenance: '2026-05-28', flight_hours: 289 },
  { id: 'd6', name: '大疆T30-001', model: '大疆T30', status: 'available', battery_capacity: 18000, payload_kg: 30, last_maintenance: '2026-06-03', flight_hours: 678 },
];

export const mockPilots: Pilot[] = [
  { id: 'p1', name: '张宇飞', phone: '138****1111', license_no: 'NUA20230001', experience_years: 4, status: 'on_duty', completed_tasks: 326, rating: 4.8 },
  { id: 'p2', name: '李翔', phone: '139****2222', license_no: 'NUA20230002', experience_years: 3, status: 'on_duty', completed_tasks: 258, rating: 4.7 },
  { id: 'p3', name: '王浩宇', phone: '137****3333', license_no: 'NUA20220015', experience_years: 5, status: 'on_duty', completed_tasks: 412, rating: 4.9 },
  { id: 'p4', name: '陈天宇', phone: '136****4444', license_no: 'NUA20230008', experience_years: 2, status: 'off_duty', completed_tasks: 156, rating: 4.5 },
  { id: 'p5', name: '赵云龙', phone: '135****5555', license_no: 'NUA20210003', experience_years: 6, status: 'available', completed_tasks: 589, rating: 4.9 },
];

export const mockWeather: WeatherInfo[] = [
  { date: '2026-06-06', temp: '22-32°C', condition: '晴', wind_speed: '2级', humidity: '55%', suitability: 'excellent' },
  { date: '2026-06-07', temp: '23-33°C', condition: '多云', wind_speed: '3级', humidity: '60%', suitability: 'good' },
  { date: '2026-06-08', temp: '21-30°C', condition: '阴', wind_speed: '4级', humidity: '65%', suitability: 'fair' },
  { date: '2026-06-09', temp: '20-28°C', condition: '小雨', wind_speed: '5级', humidity: '80%', suitability: 'poor' },
  { date: '2026-06-10', temp: '19-27°C', condition: '多云转晴', wind_speed: '2级', humidity: '65%', suitability: 'excellent' },
  { date: '2026-06-11', temp: '21-31°C', condition: '晴', wind_speed: '1级', humidity: '58%', suitability: 'excellent' },
  { date: '2026-06-12', temp: '24-34°C', condition: '晴', wind_speed: '2级', humidity: '52%', suitability: 'good' },
];

export const mockSchedules: Schedule[] = [
  { id: 'sch1', appointment_id: 'a2', farmland_name: '西坡地', drone_id: 'd1', drone_name: '极飞P100-001', pilot_id: 'p1', pilot_name: '张宇飞', operation_date: '2026-06-06', weather_condition: '晴，22-32°C', weather_suitability: 'excellent', status: 'in_progress', start_time: '08:00', end_time: '11:30' },
  { id: 'sch2', appointment_id: 'a1', farmland_name: '东大田一号', drone_id: 'd2', drone_name: '极飞P100-002', pilot_id: 'p3', pilot_name: '王浩宇', operation_date: '2026-06-10', weather_condition: '多云转晴，19-27°C', weather_suitability: 'excellent', status: 'scheduled', start_time: '07:30', end_time: '12:00' },
  { id: 'sch3', appointment_id: 'a4', farmland_name: '北岭果园', drone_id: 'd3', drone_name: '大疆T40-001', pilot_id: 'p2', pilot_name: '李翔', operation_date: '2026-06-12', weather_condition: '晴，24-34°C', weather_suitability: 'good', status: 'scheduled', start_time: '06:30', end_time: '11:00' },
  { id: 'sch4', appointment_id: 'a5', farmland_name: '河东蔬菜基地', drone_id: 'd5', drone_name: '极飞V50-001', pilot_id: 'p5', pilot_name: '赵云龙', operation_date: '2026-06-09', weather_condition: '', weather_suitability: 'excellent', status: 'completed', start_time: '08:00', end_time: '10:30' },
];

export const mockOperations: Operation[] = [
  { id: 'op1', appointment_id: 'a2', farmland_name: '西坡地', operation_date: '2026-06-06', actual_area: 0, progress: 65, status: 'in_progress', pilot_name: '张宇飞', drone_name: '极飞P100-001', pesticide_used: [{ name: '尿素叶面肥', quantity: 80, unit: 'g/亩' }], start_time: '08:00' },
  { id: 'op2', appointment_id: 'a5', farmland_name: '河东蔬菜基地', operation_date: '2026-06-09', actual_area: 68.5, progress: 100, status: 'completed', pilot_name: '赵云龙', drone_name: '极飞V50-001', pesticide_used: [{ name: '吡虫啉', quantity: 25, unit: 'g/亩' }, { name: '代森锰锌', quantity: 120, unit: 'g/亩' }], start_time: '08:00', end_time: '10:25' },
];

export const mockOperationPhotos: OperationPhoto[] = [
  { id: 'ph1', operation_id: 'op2', url: '', type: 'before', upload_time: '2026-06-09 07:55', description: '作业前地块全景' },
  { id: 'ph2', operation_id: 'op2', url: '', type: 'during', upload_time: '2026-06-09 09:15', description: '无人机作业中' },
  { id: 'ph3', operation_id: 'op2', url: '', type: 'after', upload_time: '2026-06-09 10:30', description: '作业完成后效果' },
  { id: 'ph4', operation_id: 'op2', url: '', type: 'after', upload_time: '2026-06-09 10:35', description: '作物细节' },
  { id: 'ph5', operation_id: 'op1', url: '', type: 'before', upload_time: '2026-06-06 07:50', description: '玉米苗期' },
  { id: 'ph6', operation_id: 'op1', url: '', type: 'during', upload_time: '2026-06-06 09:00', description: '施肥作业中' },
];

export const mockBills: Bill[] = [
  { id: 'b1', appointment_id: 'a5', farmland_name: '河东蔬菜基地', farmer_name: '刘蔬菜', total_amount: 1370.0, paid_amount: 1370.0, status: 'paid', due_date: '2026-06-19', paid_date: '2026-06-10', items: [{ name: '病虫害防治服务费', quantity: 68.5, unit_price: 20.0, subtotal: 1370.0 }], created_at: '2026-06-09' },
  { id: 'b2', appointment_id: 'a2', farmland_name: '西坡地', farmer_name: '李明华', total_amount: 1293.0, paid_amount: 500.0, status: 'partial', due_date: '2026-06-22', items: [{ name: '叶面肥喷施服务费', quantity: 86.2, unit_price: 15.0, subtotal: 1293.0 }], created_at: '2026-06-06' },
  { id: 'b3', appointment_id: 'a1', farmland_name: '东大田一号', farmer_name: '张建国', total_amount: 1981.25, paid_amount: 0, status: 'unpaid', due_date: '2026-06-25', items: [{ name: '病虫害防治服务费', quantity: 158.5, unit_price: 12.5, subtotal: 1981.25 }], created_at: '2026-06-01' },
  { id: 'b4', appointment_id: 'a8', farmland_name: '北沟花生地', farmer_name: '郑花生', total_amount: 1562.0, paid_amount: 0, status: 'overdue', due_date: '2026-06-01', items: [{ name: '除草服务费', quantity: 142.0, unit_price: 11.0, subtotal: 1562.0 }], created_at: '2026-05-20' },
];

export const mockEvaluations: Evaluation[] = [
  { id: 'e1', appointment_id: 'a5', farmland_name: '河东蔬菜基地', farmer_name: '刘蔬菜', rating: 5, comment: '作业非常专业，喷洒均匀，服务态度也很好，下次还会继续合作！', needs_respray: false, evaluation_date: '2026-06-11', farmer_signature: '刘蔬菜' },
  { id: 'e2', appointment_id: 'a4', farmland_name: '北岭果园', farmer_name: '赵炳义', rating: 4, comment: '整体效果不错，但果园边缘部分喷洒不够均匀，希望下次改进。', needs_respray: true, respray_reason: '边缘区域喷洒覆盖率不足', evaluation_date: '2026-06-14', farmer_signature: '赵炳义', respray_status: 'pending' },
  { id: 'e3', appointment_id: 'a8', farmland_name: '北沟花生地', farmer_name: '郑花生', rating: 3, comment: '作业效果一般，部分杂草没有除干净。', needs_respray: true, respray_reason: '除草效果不理想', evaluation_date: '2026-06-05', farmer_signature: '郑花生', respray_status: 'rejected' },
];

export const mockSeasonStats: SeasonStats[] = [
  { month: '1月', operations: 45, area: 3250, revenue: 48600 },
  { month: '2月', operations: 38, area: 2890, revenue: 42150 },
  { month: '3月', operations: 72, area: 5120, revenue: 76800 },
  { month: '4月', operations: 98, area: 7650, revenue: 114750 },
  { month: '5月', operations: 126, area: 9870, revenue: 148050 },
  { month: '6月', operations: 145, area: 11230, revenue: 168450 },
];

export const mockDashboardStats: DashboardStats = {
  total_farmlands: 8,
  total_area: 1105.9,
  pending_appointments: 4,
  today_operations: 2,
  monthly_revenue: 168450,
  completion_rate: 87.5,
  avg_rating: 4.6,
  active_drones: 4,
};

export const serviceTypeLabels: Record<string, string> = {
  pest_control: '病虫害防治',
  fertilizer: '叶面施肥',
  herbicide: '除草作业',
  fungicide: '杀菌作业',
  other: '其他服务',
};

export const statusLabels: Record<string, string> = {
  pending: '待审核',
  approved: '已确认',
  surveying: '待测绘',
  scheduled: '已排期',
  in_progress: '进行中',
  completed: '已完成',
  cancelled: '已取消',
  unpaid: '待支付',
  partial: '部分支付',
  paid: '已支付',
  overdue: '已逾期',
  available: '可用',
  in_use: '使用中',
  maintenance: '维护中',
  charging: '充电中',
  on_duty: '在岗',
  off_duty: '休息',
};

export const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-blue-100 text-blue-700',
  surveying: 'bg-purple-100 text-purple-700',
  scheduled: 'bg-indigo-100 text-indigo-700',
  in_progress: 'bg-green-100 text-green-700',
  completed: 'bg-gray-100 text-gray-700',
  cancelled: 'bg-red-100 text-red-700',
  unpaid: 'bg-red-100 text-red-700',
  partial: 'bg-yellow-100 text-yellow-700',
  paid: 'bg-green-100 text-green-700',
  overdue: 'bg-red-100 text-red-700',
  available: 'bg-green-100 text-green-700',
  in_use: 'bg-blue-100 text-blue-700',
  maintenance: 'bg-yellow-100 text-yellow-700',
  charging: 'bg-purple-100 text-purple-700',
  on_duty: 'bg-green-100 text-green-700',
  off_duty: 'bg-gray-100 text-gray-700',
};

export const pesticideTypeLabels: Record<string, string> = {
  insecticide: '杀虫剂',
  fungicide: '杀菌剂',
  herbicide: '除草剂',
  fertilizer: '叶面肥',
  other: '其他',
};

export const suitabilityLabels: Record<string, string> = {
  excellent: '非常适宜',
  good: '适宜',
  fair: '一般',
  poor: '不适宜',
};

export const suitabilityColors: Record<string, string> = {
  excellent: 'bg-green-100 text-green-700',
  good: 'bg-blue-100 text-blue-700',
  fair: 'bg-yellow-100 text-yellow-700',
  poor: 'bg-red-100 text-red-700',
};
