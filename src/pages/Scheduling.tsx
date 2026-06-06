import { useState } from 'react';
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
} from 'lucide-react';
import { mockSchedules, mockDrones, mockPilots, mockWeather, suitabilityLabels, suitabilityColors, statusLabels, statusColors } from '@/data/mockData';
import type { Schedule } from '@/data/types';

export default function Scheduling() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

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
    return mockSchedules.filter((s) => s.operation_date === dateStr);
  };

  const getWeatherForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return mockWeather.find((w) => w.date === dateStr);
  };

  const availableDrones = mockDrones.filter((d) => d.status === 'available');
  const availablePilots = mockPilots.filter((p) => p.status === 'available' || p.status === 'on_duty');

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
              <p className="text-2xl font-bold text-gray-800">{mockSchedules.length}</p>
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
            const schedules = getSchedulesForDate(date);
            const isToday = date.toDateString() === new Date().toDateString();

            return (
              <div
                key={index}
                className={`border-r border-gray-100 last:border-r-0 p-2 ${
                  isToday ? 'bg-primary-50/50' : ''
                }`}
              >
                <div className="space-y-2">
                  {schedules.map((schedule) => (
                    <div
                      key={schedule.id}
                      onClick={() => setSelectedSchedule(schedule)}
                      className={`p-3 rounded-xl cursor-pointer transition-all ${
                        schedule.status === 'in_progress'
                          ? 'bg-green-100 border-2 border-green-300'
                          : schedule.status === 'scheduled'
                          ? 'bg-blue-50 border-2 border-blue-200 hover:bg-blue-100'
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
                    </div>
                  ))}
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
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-800">新增排班</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">选择作业</label>
                <select className="input-field">
                  <option>请选择作业预约</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">作业日期</label>
                  <input type="date" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">开始时间</label>
                  <input type="time" className="input-field" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">指派无人机</label>
                  <select className="input-field">
                    {availableDrones.map((d) => (
                      <option key={d.id} value={d.id}>{d.name} ({d.model})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">指派飞手</label>
                  <select className="input-field">
                    {availablePilots.map((p) => (
                      <option key={p.id} value={p.id}>{p.name} (⭐{p.rating})</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">备注</label>
                <textarea rows={2} placeholder="填写作业注意事项..." className="input-field resize-none" />
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-5 py-2.5 border border-gray-200 rounded-lg font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button onClick={() => setShowAddModal(false)} className="btn-primary px-5 py-2.5">
                确认排期
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
