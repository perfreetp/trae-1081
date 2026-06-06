import { useState, useMemo } from 'react';
import {
  PlaneTakeoff,
  Calendar,
  User,
  Clock,
  CloudSun,
  Wind,
  Droplets,
  Thermometer,
  ChevronLeft,
  ChevronRight,
  Plus,
  CheckCircle,
  AlertCircle,
  MapPin,
  AlertTriangle,
  X,
} from 'lucide-react';
import {
  mockDrones,
  mockPilots,
  mockWeather,
  mockAppointments,
  suitabilityLabels,
  suitabilityColors,
  statusLabels,
  statusColors,
} from '@/data/mockData';
import { useAppStore } from '@/store/useAppStore';
import type { Schedule } from '@/data/types';

interface ConflictInfo {
  hasConflict: boolean;
  appointmentConflict?: string;
  droneConflict?: string;
  droneUnavailable?: string;
  pilotConflict?: string;
  pilotUnavailable?: string;
  weatherWarning?: boolean;
}

export default function Scheduling() {
  const { schedules, addSchedule } = useAppStore();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [conflictInfo, setConflictInfo] = useState<ConflictInfo>({ hasConflict: false });
  const [formData, setFormData] = useState({
    appointment_id: '',
    farmland_name: '',
    operation_date: new Date().toISOString().split('T')[0],
    start_time: '08:00',
    end_time: '12:00',
    drone_id: '',
    drone_name: '',
    pilot_id: '',
    pilot_name: '',
    notes: '',
  });

  const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

  const getWeekDates = () => {
    const dates = [];
    const startOfWeek = new Date(selectedDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates();

  const prevWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 7);
    setSelectedDate(newDate);
  };

  const nextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 7);
    setSelectedDate(newDate);
  };

  const getSchedulesForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return schedules.filter((s) => s.operation_date === dateStr && s.status !== 'cancelled');
  };

  const getWeatherForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return mockWeather.find((w) => w.date === dateStr);
  };

  const availableDrones = mockDrones.filter((d) => d.status === 'available');
  const availablePilots = mockPilots.filter((p) => p.status === 'available' || p.status === 'on_duty');

  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const checkConflicts = useMemo((): ConflictInfo => {
    const info: ConflictInfo = { hasConflict: false };
    
    if (!formData.operation_date || !formData.start_time || !formData.end_time) {
      return info;
    }

    if (formData.appointment_id) {
      const existingSchedule = schedules.find(
        (s) => s.appointment_id === formData.appointment_id && s.status !== 'cancelled'
      );
      if (existingSchedule) {
        info.hasConflict = true;
        info.appointmentConflict = `此预约已在 ${existingSchedule.operation_date} 排期，请勿重复排班`;
      }
    }

    if (formData.drone_id) {
      const drone = mockDrones.find((d) => d.id === formData.drone_id);
      if (drone && drone.status !== 'available' && drone.status !== 'in_use') {
        info.hasConflict = true;
        info.droneUnavailable = `无人机 ${drone.name} 当前状态为：${statusLabels[drone.status] || drone.status}，不可用`;
      }
    }

    if (formData.pilot_id) {
      const pilot = mockPilots.find((p) => p.id === formData.pilot_id);
      if (pilot && pilot.status !== 'available' && pilot.status !== 'on_duty') {
        info.hasConflict = true;
        info.pilotUnavailable = `飞手 ${pilot.name} 当前状态为：${statusLabels[pilot.status] || pilot.status}，不可排班`;
      }
    }

    const daySchedules = schedules.filter(
      (s) => s.operation_date === formData.operation_date && s.status !== 'cancelled'
    );

    const newStart = timeToMinutes(formData.start_time);
    const newEnd = timeToMinutes(formData.end_time);

    if (!info.hasConflict && formData.drone_id) {
      const droneSchedules = daySchedules.filter((s) => s.drone_id === formData.drone_id);
      for (const s of droneSchedules) {
        const sStart = timeToMinutes(s.start_time || '00:00');
        const sEnd = timeToMinutes(s.end_time || '23:59');
        if (newStart < sEnd && newEnd > sStart) {
          info.hasConflict = true;
          info.droneConflict = `无人机 ${s.drone_name} 在 ${s.start_time}-${s.end_time} 已有排期：${s.farmland_name}`;
          break;
        }
      }
    }

    if (!info.hasConflict && formData.pilot_id) {
      const pilotSchedules = daySchedules.filter((s) => s.pilot_id === formData.pilot_id);
      for (const s of pilotSchedules) {
        const sStart = timeToMinutes(s.start_time || '00:00');
        const sEnd = timeToMinutes(s.end_time || '23:59');
        if (newStart < sEnd && newEnd > sStart) {
          info.hasConflict = true;
          info.pilotConflict = `飞手 ${s.pilot_name} 在 ${s.start_time}-${s.end_time} 已有排期：${s.farmland_name}`;
          break;
        }
      }
    }

    const weather = getWeatherForDate(new Date(formData.operation_date));
    if (weather && (weather.suitability === 'fair' || weather.suitability === 'poor')) {
      info.weatherWarning = true;
    }

    return info;
  }, [formData, schedules]);

  const handleSelectAppointment = (appointmentId: string) => {
    const apt = mockAppointments.find((a) => a.id === appointmentId);
    if (apt) {
      setFormData({
        ...formData,
        appointment_id: apt.id,
        farmland_name: apt.farmland_name,
      });
    }
  };

  const handleSelectDrone = (droneId: string) => {
    const drone = mockDrones.find((d) => d.id === droneId);
    if (drone) {
      setFormData({
        ...formData,
        drone_id: drone.id,
        drone_name: drone.name,
      });
    }
  };

  const handleSelectPilot = (pilotId: string) => {
    const pilot = mockPilots.find((p) => p.id === pilotId);
    if (pilot) {
      setFormData({
        ...formData,
        pilot_id: pilot.id,
        pilot_name: pilot.name,
      });
    }
  };

  const handleSubmitSchedule = () => {
    if (!formData.farmland_name || !formData.drone_id || !formData.pilot_id) {
      alert('请填写完整信息');
      return;
    }

    if (timeToMinutes(formData.start_time) >= timeToMinutes(formData.end_time)) {
      alert('结束时间必须晚于开始时间');
      return;
    }

    setConflictInfo(checkConflicts);

    if (checkConflicts.hasConflict) {
      return;
    }

    if (checkConflicts.weatherWarning) {
      setShowConfirmDialog(true);
      return;
    }

    submitSchedule();
  };

  const submitSchedule = () => {
    const weather = getWeatherForDate(new Date(formData.operation_date));
    const hasWeatherRisk = checkConflicts.weatherWarning;
    const newSchedule: Schedule = {
      id: `s${Date.now()}`,
      appointment_id: formData.appointment_id,
      farmland_name: formData.farmland_name,
      operation_date: formData.operation_date,
      start_time: formData.start_time,
      end_time: formData.end_time,
      drone_id: formData.drone_id,
      drone_name: formData.drone_name,
      pilot_id: formData.pilot_id,
      pilot_name: formData.pilot_name,
      status: 'scheduled',
      weather_condition: weather?.condition || '晴',
      weather_suitability: weather?.suitability || 'good',
      notes: formData.notes,
      has_weather_risk: hasWeatherRisk,
      risk_confirmed: hasWeatherRisk,
      created_at: new Date().toISOString(),
    };

    addSchedule(newSchedule);
    setShowAddModal(false);
    setShowConfirmDialog(false);
    setFormData({
      appointment_id: '',
      farmland_name: '',
      operation_date: new Date().toISOString().split('T')[0],
      start_time: '08:00',
      end_time: '12:00',
      drone_id: '',
      drone_name: '',
      pilot_id: '',
      pilot_name: '',
      notes: '',
    });
    setSelectedDate(new Date(formData.operation_date));
    setConflictInfo({ hasConflict: false });
    alert('排班创建成功！');
  };

  const weekScheduleCount = weekDates.reduce((sum, date) => sum + getSchedulesForDate(date).length, 0);

  const weather = getWeatherForDate(new Date(formData.operation_date));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">机队排班</h1>
          <p className="text-gray-500 mt-1">管理无人机和飞手排班，确认作业天气窗口</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          新增排班
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-sky-100 rounded-xl">
              <PlaneTakeoff className="w-6 h-6 text-sky-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">无人机总数</p>
              <p className="text-2xl font-bold text-gray-800">{mockDrones.length}</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">可用无人机</p>
              <p className="text-2xl font-bold text-green-600">{availableDrones.length}</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-xl">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">在岗飞手</p>
              <p className="text-2xl font-bold text-gray-800">{availablePilots.length}</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-100 rounded-xl">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">本周排期</p>
              <p className="text-2xl font-bold text-gray-800">{weekScheduleCount}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-semibold text-gray-800">排班日历</h3>
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={prevWeek}
                  className="p-1.5 rounded-md hover:bg-white transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <span className="px-4 font-medium text-gray-800">
                  {weekDates[0].toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })} -{' '}
                  {weekDates[6].toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
                <button
                  onClick={nextWeek}
                  className="p-1.5 rounded-md hover:bg-white transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <CloudSun className="w-5 h-5 text-yellow-500" />
                <span className="text-sm text-gray-600">今日适宜作业</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-7 border-b border-gray-100">
          {weekDays.map((day, index) => {
            const date = weekDates[index];
            const weather = getWeatherForDate(date);
            const isToday = date.toDateString() === new Date().toDateString();

            return (
              <div
                key={day}
                className={`p-3 text-center border-r border-gray-100 last:border-r-0 ${
                  isToday ? 'bg-primary-50' : ''
                }`}
              >
                <p className={`text-sm font-medium ${isToday ? 'text-primary-600' : 'text-gray-600'}`}>
                  {day}
                </p>
                <p className={`text-xl font-bold mt-1 ${isToday ? 'text-primary-600' : 'text-gray-800'}`}>
                  {date.getDate()}
                </p>
                {weather && (
                  <div className="mt-2 text-xs">
                    <p className="text-gray-500">{weather.temp}</p>
                    <p className={`mt-1 px-2 py-0.5 rounded-full inline-block ${suitabilityColors[weather.suitability]}`}>
                      {suitabilityLabels[weather.suitability]}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-7 min-h-[400px]">
          {weekDates.map((date, index) => {
            const daySchedules = getSchedulesForDate(date);
            const isToday = date.toDateString() === new Date().toDateString();

            return (
              <div
                key={index}
                className={`border-r border-gray-100 last:border-r-0 p-2 ${
                  isToday ? 'bg-primary-50/50' : ''
                }`}
              >
                <div className="space-y-2">
                  {daySchedules.map((schedule) => (
                    <div
                      key={schedule.id}
                      onClick={() => setSelectedSchedule(schedule)}
                      className={`p-3 rounded-xl cursor-pointer transition-all ${
                        schedule.status === 'in_progress'
                          ? 'bg-green-100 border-2 border-green-300'
                          : schedule.status === 'scheduled'
                          ? 'bg-blue-50 border-2 border-blue-200 hover:bg-blue-100'
                          : schedule.status === 'completed'
                          ? 'bg-gray-100 border-2 border-gray-200'
                          : 'bg-gray-100 border-2 border-gray-200'
                      }`}
                    >
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {schedule.farmland_name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {schedule.start_time} - {schedule.end_time}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        ✈️ {schedule.drone_name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        👤 {schedule.pilot_name}
                      </p>
                      <div className="flex items-center gap-1 mt-1 flex-wrap">
                        <span className={`text-xs ${suitabilityColors[schedule.weather_suitability].replace('bg-', 'text-').replace('text-white', 'text-gray-600')}`}>
                          {suitabilityLabels[schedule.weather_suitability]}
                        </span>
                        {schedule.has_weather_risk && (
                          <span className="inline-flex items-center gap-0.5 text-xs text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded" title="带风险确认">
                            <AlertTriangle className="w-3 h-3" /> 风险
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  {daySchedules.length === 0 && (
                    <div
                      onClick={() => {
                        setFormData({
                          ...formData,
                          operation_date: date.toISOString().split('T')[0],
                        });
                        setShowAddModal(true);
                      }}
                      className="p-3 rounded-xl border-2 border-dashed border-gray-200 text-center cursor-pointer hover:border-primary-300 hover:bg-primary-50 transition-all"
                    >
                      <Plus className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                      <p className="text-xs text-gray-400">添加排班</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">无人机状态</h3>
          <div className="space-y-3">
            {mockDrones.map((drone) => (
              <div key={drone.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    drone.status === 'available' ? 'bg-green-100' :
                    drone.status === 'in_use' ? 'bg-blue-100' :
                    drone.status === 'charging' ? 'bg-purple-100' : 'bg-yellow-100'
                  }`}>
                    <PlaneTakeoff className={`w-5 h-5 ${
                      drone.status === 'available' ? 'text-green-600' :
                      drone.status === 'in_use' ? 'text-blue-600' :
                      drone.status === 'charging' ? 'text-purple-600' : 'text-yellow-600'
                    }`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{drone.name}</p>
                    <p className="text-xs text-gray-500">{drone.model} · 续航{drone.battery_capacity / 1000}Ah</p>
                  </div>
                </div>
                <span className={`badge ${statusColors[drone.status]}`}>
                  {statusLabels[drone.status]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">飞手状态</h3>
          <div className="space-y-3">
            {mockPilots.map((pilot) => (
              <div key={pilot.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    pilot.status === 'on_duty' || pilot.status === 'available' ? 'bg-green-100' : 'bg-gray-200'
                  }`}>
                    <User className={`w-5 h-5 ${
                      pilot.status === 'on_duty' || pilot.status === 'available' ? 'text-green-600' : 'text-gray-500'
                    }`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{pilot.name}</p>
                    <p className="text-xs text-gray-500">
                      执照: {pilot.license_no} · {pilot.experience_years}年经验
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`badge ${statusColors[pilot.status]}`}>
                    {statusLabels[pilot.status]}
                  </span>
                  <p className="text-xs text-yellow-600 mt-1">⭐ {pilot.rating}分</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <CloudSun className="w-5 h-5 text-yellow-500" />
          未来一周天气预报
        </h3>
        <div className="grid grid-cols-7 gap-3">
          {mockWeather.map((weather, index) => (
            <div key={index} className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600 font-medium">{weather.date.slice(5)}</p>
              <div className="my-3">
                <span className="text-3xl">
                  {weather.condition.includes('晴') ? '☀️' :
                   weather.condition.includes('云') ? '⛅' :
                   weather.condition.includes('雨') ? '🌧️' : '🌤️'}
                </span>
              </div>
              <p className="text-sm font-medium text-gray-800">{weather.temp}</p>
              <div className="mt-2 space-y-1 text-xs text-gray-500">
                <p className="flex items-center justify-center gap-1">
                  <Wind className="w-3 h-3" /> {weather.wind_speed}
                </p>
                <p className="flex items-center justify-center gap-1">
                  <Droplets className="w-3 h-3" /> {weather.humidity}
                </p>
              </div>
              <p className={`mt-3 px-2 py-1 rounded-lg text-xs font-medium ${suitabilityColors[weather.suitability]}`}>
                {suitabilityLabels[weather.suitability]}
              </p>
            </div>
          ))}
        </div>
      </div>

      {selectedSchedule && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg animate-slide-up">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-800">排期详情</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{selectedSchedule.farmland_name}</p>
                  <p className="text-sm text-gray-500">{selectedSchedule.operation_date}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">无人机</p>
                  <p className="font-medium text-gray-800 mt-1">{selectedSchedule.drone_name}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">飞手</p>
                  <p className="font-medium text-gray-800 mt-1">{selectedSchedule.pilot_name}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">作业时间</p>
                  <p className="font-medium text-gray-800 mt-1">
                    {selectedSchedule.start_time} - {selectedSchedule.end_time}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">状态</p>
                  <p className="font-medium mt-1">
                    <span className={`badge ${statusColors[selectedSchedule.status]}`}>
                      {statusLabels[selectedSchedule.status]}
                    </span>
                  </p>
                </div>
              </div>
              <div className="bg-yellow-50 rounded-xl p-4">
                <p className="text-sm text-yellow-700 font-medium flex items-center gap-2">
                  <CloudSun className="w-4 h-4" />
                  天气条件
                </p>
                <p className="text-gray-700 mt-1">{selectedSchedule.weather_condition}</p>
                <p className={`mt-2 inline-block px-2 py-1 rounded-lg text-xs font-medium ${suitabilityColors[selectedSchedule.weather_suitability]}`}>
                  作业适宜度: {suitabilityLabels[selectedSchedule.weather_suitability]}
                </p>
              </div>
              {selectedSchedule.notes && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">备注</p>
                  <p className="text-gray-700 mt-1">{selectedSchedule.notes}</p>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setSelectedSchedule(null)}
                className="px-5 py-2.5 border border-gray-200 rounded-lg font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                关闭
              </button>
              <button className="btn-primary px-5 py-2.5">编辑排期</button>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg animate-slide-up">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">新增排班</h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setConflictInfo({ hasConflict: false });
                }}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
              {(checkConflicts.hasConflict || checkConflicts.weatherWarning) && (
                <div className={`rounded-xl p-4 ${
                  checkConflicts.hasConflict ? 'bg-red-50' : 'bg-orange-50'
                }`}>
                  <div className="flex items-start gap-3">
                    {checkConflicts.hasConflict ? (
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-2">
                      {checkConflicts.hasConflict ? (
                        <>
                          <p className="font-medium text-red-800">无法排班</p>
                          {checkConflicts.appointmentConflict && (
                            <p className="text-sm text-red-700">⚠️ {checkConflicts.appointmentConflict}</p>
                          )}
                          {checkConflicts.droneUnavailable && (
                            <p className="text-sm text-red-700">⚠️ {checkConflicts.droneUnavailable}</p>
                          )}
                          {checkConflicts.pilotUnavailable && (
                            <p className="text-sm text-red-700">⚠️ {checkConflicts.pilotUnavailable}</p>
                          )}
                          {checkConflicts.droneConflict && (
                            <p className="text-sm text-red-700">⚠️ {checkConflicts.droneConflict}</p>
                          )}
                          {checkConflicts.pilotConflict && (
                            <p className="text-sm text-red-700">⚠️ {checkConflicts.pilotConflict}</p>
                          )}
                        </>
                      ) : (
                        <>
                          <p className="font-medium text-orange-800">天气风险提示</p>
                          <p className="text-sm text-orange-700">
                            ⚠️ 当日天气条件{weather?.suitability === 'poor' ? '不适宜' : '一般'}，建议确认是否继续排期
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">选择作业（可选）</label>
                <select
                  value={formData.appointment_id}
                  onChange={(e) => handleSelectAppointment(e.target.value)}
                  className="input-field"
                >
                  <option value="">手动填写</option>
                  {mockAppointments.filter((a) => a.status === 'approved' || a.status === 'scheduled').slice(0, 10).map((apt) => (
                    <option key={apt.id} value={apt.id}>
                      {apt.farmland_name} - {apt.area_mu}亩
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">地块名称</label>
                <input
                  type="text"
                  value={formData.farmland_name}
                  onChange={(e) => setFormData({ ...formData, farmland_name: e.target.value })}
                  placeholder="请输入地块名称"
                  className="input-field"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">作业日期</label>
                  <input
                    type="date"
                    value={formData.operation_date}
                    onChange={(e) => setFormData({ ...formData, operation_date: e.target.value })}
                    className="input-field"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">开始时间</label>
                    <input
                      type="time"
                      value={formData.start_time}
                      onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">结束时间</label>
                    <input
                      type="time"
                      value={formData.end_time}
                      onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">指派无人机</label>
                  <select
                    value={formData.drone_id}
                    onChange={(e) => handleSelectDrone(e.target.value)}
                    className={`input-field ${
                      checkConflicts.droneConflict ? 'border-red-400 focus:ring-red-500' : ''
                    }`}
                  >
                    <option value="">请选择无人机</option>
                    {availableDrones.map((d) => (
                      <option key={d.id} value={d.id}>{d.name} ({d.model})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">指派飞手</label>
                  <select
                    value={formData.pilot_id}
                    onChange={(e) => handleSelectPilot(e.target.value)}
                    className={`input-field ${
                      checkConflicts.pilotConflict ? 'border-red-400 focus:ring-red-500' : ''
                    }`}
                  >
                    <option value="">请选择飞手</option>
                    {availablePilots.map((p) => (
                      <option key={p.id} value={p.id}>{p.name} (⭐{p.rating})</option>
                    ))}
                  </select>
                </div>
              </div>

              {formData.operation_date && weather && (
                <div className={`rounded-xl p-4 ${
                  weather.suitability === 'poor' || weather.suitability === 'fair'
                    ? 'bg-orange-50'
                    : 'bg-blue-50'
                }`}>
                  <p className={`text-sm font-medium flex items-center gap-2 ${
                    weather.suitability === 'poor' || weather.suitability === 'fair'
                      ? 'text-orange-700'
                      : 'text-blue-700'
                  }`}>
                    <CloudSun className="w-4 h-4" />
                    当日天气
                  </p>
                  <p className="text-gray-700 mt-1">{weather.condition}</p>
                  <p className={`mt-2 inline-block px-2 py-1 rounded-lg text-xs font-medium ${
                    suitabilityColors[weather.suitability]
                  }`}>
                    作业适宜度: {suitabilityLabels[weather.suitability]}
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">备注</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="填写作业注意事项..."
                  className="input-field resize-none"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setConflictInfo({ hasConflict: false });
                }}
                className="px-5 py-2.5 border border-gray-200 rounded-lg font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSubmitSchedule}
                disabled={checkConflicts.hasConflict}
                className="btn-primary px-5 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {checkConflicts.hasConflict ? '存在冲突' : '确认排期'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl w-full max-w-md animate-slide-up">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">天气风险确认</h3>
            </div>
            <div className="p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-800">当日天气条件一般</p>
                  <p className="text-sm text-gray-600 mt-2">
                    {weather?.suitability === 'poor'
                      ? '当日天气不适宜植保作业，可能影响作业效果和飞行安全。'
                      : '当日天气条件一般，建议确认现场实际天气后再作业。'}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    是否确认继续排期？
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-5 py-2.5 border border-gray-200 rounded-lg font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={submitSchedule}
                className="btn-primary px-5 py-2.5"
              >
                确认排期
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
