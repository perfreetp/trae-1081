import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Sprout,
  CalendarClock,
  Plane,
  DollarSign,
  TrendingUp,
  Clock,
  Star,
  ChevronRight,
  MapPin,
} from 'lucide-react';
import { mockDashboardStats, mockSeasonStats, mockAppointments, mockOperations, serviceTypeLabels, statusLabels, statusColors } from '@/data/mockData';

const COLORS = ['#2E7D32', '#42A5F5', '#FF9800', '#795548', '#9C27B0'];

const pieData = [
  { name: '病虫害防治', value: 45 },
  { name: '叶面施肥', value: 25 },
  { name: '除草作业', value: 20 },
  { name: '杀菌作业', value: 10 },
];

const statCards = [
  { label: '服务地块', value: mockDashboardStats.total_farmlands, unit: '块', icon: Sprout, color: 'from-green-500 to-green-600', bg: 'bg-green-50' },
  { label: '总作业面积', value: mockDashboardStats.total_area, unit: '亩', icon: MapPin, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50' },
  { label: '待处理预约', value: mockDashboardStats.pending_appointments, unit: '单', icon: CalendarClock, color: 'from-orange-500 to-orange-600', bg: 'bg-orange-50' },
  { label: '今日作业', value: mockDashboardStats.today_operations, unit: '架', icon: Plane, color: 'from-sky-500 to-sky-600', bg: 'bg-sky-50' },
  { label: '本月营收', value: mockDashboardStats.monthly_revenue / 10000, unit: '万元', icon: DollarSign, color: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-50' },
  { label: '作业完成率', value: mockDashboardStats.completion_rate, unit: '%', icon: TrendingUp, color: 'from-teal-500 to-teal-600', bg: 'bg-teal-50' },
  { label: '平均评分', value: mockDashboardStats.avg_rating, unit: '分', icon: Star, color: 'from-yellow-500 to-yellow-600', bg: 'bg-yellow-50' },
  { label: '在役无人机', value: mockDashboardStats.active_drones, unit: '架', icon: Plane, color: 'from-indigo-500 to-indigo-600', bg: 'bg-indigo-50' },
];

export default function Dashboard() {
  const recentAppointments = mockAppointments.slice(0, 5);
  const activeOperations = mockOperations.filter((o) => o.status === 'in_progress');

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">数据概览</h1>
        <p className="text-gray-500 mt-1">欢迎回来，这是您今天的飞防服务概况</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="stat-card animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">{card.label}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    {card.value}
                    <span className="text-sm font-normal text-gray-500 ml-1">{card.unit}</span>
                  </p>
                </div>
                <div className={`${card.bg} p-3 rounded-xl`}>
                  <Icon className={`w-6 h-6 bg-gradient-to-br ${card.color} bg-clip-text text-transparent`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">季节作业统计</h3>
              <p className="text-sm text-gray-500 mt-1">2026年上半年作业量和营收趋势</p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 bg-primary-50 text-primary-600 rounded-lg text-sm font-medium">月度</button>
              <button className="px-3 py-1.5 text-gray-500 hover:bg-gray-50 rounded-lg text-sm">季度</button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockSeasonStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis yAxisId="left" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Bar yAxisId="left" dataKey="area" name="作业面积(亩)" fill="#2E7D32" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="right" dataKey="revenue" name="营收(元)" fill="#42A5F5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">服务类型占比</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-4">
            {pieData.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="font-medium text-gray-800">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">进行中的作业</h3>
            <button className="text-primary-600 text-sm font-medium flex items-center gap-1 hover:text-primary-700">
              查看全部 <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          {activeOperations.length > 0 ? (
            <div className="space-y-4">
              {activeOperations.map((op) => (
                <div key={op.id} className="p-4 bg-green-50 rounded-xl border border-green-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-800">{op.farmland_name}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        飞手: {op.pilot_name} · {op.drone_name}
                      </p>
                    </div>
                    <span className="badge badge-success animate-pulse">作业中</span>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">作业进度</span>
                      <span className="font-medium text-primary-600">{op.progress}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${op.progress}%` }}></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" /> {op.start_time} 开始
                    </span>
                    <span>预计剩余 {Math.round((100 - op.progress) * 1.5)} 分钟</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Plane className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>暂无进行中的作业</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">最近预约</h3>
            <button className="text-primary-600 text-sm font-medium flex items-center gap-1 hover:text-primary-700">
              查看全部 <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {recentAppointments.map((apt) => (
              <div key={apt.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Sprout className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{apt.farmland_name}</p>
                    <p className="text-xs text-gray-500">
                      {serviceTypeLabels[apt.service_type]} · {apt.area_mu}亩
                    </p>
                  </div>
                </div>
                <span className={`badge ${statusColors[apt.status]}`}>{statusLabels[apt.status]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">满意度趋势</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={mockSeasonStats}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
            <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} stroke="#9ca3af" />
            <Tooltip />
            <Line type="monotone" dataKey="operations" name="作业次数" stroke="#2E7D32" strokeWidth={2} dot={{ fill: '#2E7D32' }} />
            <Line type="monotone" dataKey={() => 85 + Math.random() * 10} name="满意度%" stroke="#FF9800" strokeWidth={2} dot={{ fill: '#FF9800' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
