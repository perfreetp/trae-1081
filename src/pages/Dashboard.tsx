import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { useAppStore } from '@/store/useAppStore';
import { mockSeasonStats, serviceTypeLabels, statusLabels, statusColors } from '@/data/mockData';
import { mockDrones, mockFarmlands } from '@/data/mockData';

const COLORS = ['#2E7D32', '#42A5F5', '#FF9800', '#795548', '#9C27B0'];

const pieData = [
  { name: '病虫害防治', value: 45 },
  { name: '叶面施肥', value: 25 },
  { name: '除草作业', value: 20 },
  { name: '杀菌作业', value: 10 },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const {
    farmlands,
    appointments,
    operations,
    bills,
    evaluations,
    surveys,
    schedules,
  } = useAppStore();

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekStartStr = weekStart.toISOString().split('T')[0];

    const totalFarmlands = farmlands.length;
    const totalArea = farmlands.reduce((sum, f) => sum + f.area_mu, 0);
    
    const pendingReview = appointments.filter((a) => a.status === 'pending').length;
    const pendingSurvey = appointments.filter((a) => a.status === 'approved' || a.status === 'surveying').length;
    const pendingScheduling = appointments.filter((a) => a.status === 'surveyed').length;
    
    const todaySchedules = schedules.filter((s) => s.operation_date === today).length;
    const weekSchedules = schedules.filter((s) => s.operation_date >= weekStartStr).length;
    
    const totalPaid = bills.reduce((sum, b) => sum + b.paid_amount, 0);
    const totalUnpaid = bills.reduce((sum, b) => sum + (b.total_amount - b.paid_amount), 0);
    
    const activeOperations = operations.filter((o) => o.status === 'in_progress').length;
    const completedOperations = operations.filter((o) => o.status === 'completed').length;
    const totalOperations = operations.length;
    const completionRate = totalOperations > 0
      ? Math.round((completedOperations / totalOperations) * 100)
      : 0;
    const avgRating = evaluations.length > 0
      ? (evaluations.reduce((sum, e) => sum + e.rating, 0) / evaluations.length).toFixed(1)
      : '0';
    const activeDrones = mockDrones.filter((d) => d.status === 'available' || d.status === 'in_use').length;
    const pendingResprays = evaluations.filter((e) => e.respray_status === 'pending').length;

    return {
      totalFarmlands,
      totalArea,
      pendingReview,
      pendingSurvey,
      pendingScheduling,
      todaySchedules,
      weekSchedules,
      totalPaid,
      totalUnpaid,
      activeOperations,
      completionRate,
      avgRating,
      activeDrones,
      pendingResprays,
    };
  }, [farmlands, appointments, operations, bills, evaluations, surveys, schedules]);

  const statCards = useMemo(() => [
    { label: '待审核预约', value: stats.pendingReview, unit: '单', icon: CalendarClock, color: 'from-red-500 to-red-600', bg: 'bg-red-50', onClick: () => navigate('/appointments?status=pending') },
    { label: '待测绘', value: stats.pendingSurvey, unit: '单', icon: MapPin, color: 'from-orange-500 to-orange-600', bg: 'bg-orange-50', onClick: () => navigate('/surveys?status=pending') },
    { label: '待排班', value: stats.pendingScheduling, unit: '单', icon: CalendarClock, color: 'from-yellow-500 to-yellow-600', bg: 'bg-yellow-50', onClick: () => navigate('/appointments?status=surveyed') },
    { label: '今日排班', value: stats.todaySchedules, unit: '架', icon: Plane, color: 'from-sky-500 to-sky-600', bg: 'bg-sky-50', onClick: () => navigate('/scheduling') },
    { label: '本周排班', value: stats.weekSchedules, unit: '架', icon: Plane, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50', onClick: () => navigate('/scheduling') },
    { label: '累计实收', value: (stats.totalPaid / 10000).toFixed(2), unit: '万元', icon: DollarSign, color: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-50', onClick: () => navigate('/billing?status=paid') },
    { label: '待收款', value: (stats.totalUnpaid / 10000).toFixed(1), unit: '万元', icon: TrendingUp, color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50', onClick: () => navigate('/billing?status=unpaid') },
    { label: '待处理补喷', value: stats.pendingResprays, unit: '条', icon: Clock, color: 'from-pink-500 to-pink-600', bg: 'bg-pink-50', onClick: () => navigate('/evaluation') },
  ], [stats, navigate]);

  const recentAppointments = appointments.slice(0, 5);
  const activeOperations = operations.filter((o) => o.status === 'in_progress');

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
            <div 
              key={index} 
              className="stat-card animate-slide-up cursor-pointer hover:shadow-md transition-shadow" 
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={card.onClick}
            >
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

      {stats.pendingResprays > 0 && (
        <div 
          onClick={() => navigate('/evaluation')}
          className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:bg-orange-100 transition-colors"
        >
          <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5 text-orange-600" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-orange-800">待处理补喷申请</p>
            <p className="text-sm text-orange-600">当前有 {stats.pendingResprays} 条补喷申请待处理，请及时跟进</p>
          </div>
          <ChevronRight className="w-5 h-5 text-orange-400" />
        </div>
      )}

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
          {recentAppointments.length > 0 ? (
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
                        {serviceTypeLabels[apt.service_type]} · {apt.area_mu}亩 · ¥{apt.quoted_price.toFixed(2)}/亩
                      </p>
                    </div>
                  </div>
                  <span className={`badge ${statusColors[apt.status]}`}>{statusLabels[apt.status]}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <CalendarClock className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>暂无预约记录</p>
            </div>
          )}
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
