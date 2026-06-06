import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  Calendar,
  MapPin,
  Sprout,
  DollarSign,
  Clock,
  Check,
  X,
  Eye,
  ChevronDown,
  Calculator,
  Ruler,
  PlaneTakeoff,
  FileText,
  ClipboardCheck,
  ArrowRight,
  Link,
} from 'lucide-react';
import { mockFarmlands, serviceTypeLabels } from '@/data/mockData';
import { useAppStore } from '@/store/useAppStore';
import type { Appointment, ServiceType, AppointmentStatus } from '@/data/types';
import { SERVICE_DEFAULT_PRICES, APPOINTMENT_STATUS_LABELS, APPOINTMENT_STATUS_COLORS } from '@/data/types';

const STATUS_FLOW: AppointmentStatus[] = [
  'pending', 'approved', 'surveyed', 'scheduled', 
  'in_progress', 'photos_uploaded', 'signed', 'settled'
];

const STATUS_STEP_LABELS: Record<AppointmentStatus, string> = {
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

export default function Appointments() {
  const navigate = useNavigate();
  const { appointments, addAppointment, updateAppointmentStatus, schedules, bills } = useAppStore();
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [formData, setFormData] = useState({
    farmland_id: '',
    service_type: 'pest_control' as ServiceType,
    expected_date: '',
    area_mu: 0,
    quoted_price: SERVICE_DEFAULT_PRICES.pest_control,
    notes: '',
  });

  const filteredAppointments = appointments.filter((apt) => {
    const matchSearch =
      apt.farmland_name.includes(searchTerm) ||
      apt.farmer_name.includes(searchTerm);
    const matchStatus = statusFilter === 'all' || apt.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const selectedFarmland = mockFarmlands.find((f) => f.id === formData.farmland_id);

  const totalPrice = useMemo(() => {
    return (formData.area_mu * formData.quoted_price).toFixed(2);
  }, [formData.area_mu, formData.quoted_price]);

  const getEffectiveArea = (apt: Appointment) => apt.measured_area || apt.area_mu;

  const handleSelectFarmland = (farmlandId: string) => {
    const farmland = mockFarmlands.find((f) => f.id === farmlandId);
    if (farmland) {
      setFormData({
        ...formData,
        farmland_id: farmlandId,
        area_mu: farmland.area_mu,
      });
    }
  };

  const handleServiceTypeChange = (serviceType: ServiceType) => {
    setFormData({
      ...formData,
      service_type: serviceType,
      quoted_price: SERVICE_DEFAULT_PRICES[serviceType],
    });
  };

  const handleSubmit = () => {
    if (!formData.farmland_id || !formData.expected_date) {
      alert('请填写完整信息');
      return;
    }
    const farmland = mockFarmlands.find((f) => f.id === formData.farmland_id);
    if (!farmland) return;

    const newAppointment: Appointment = {
      id: `a${Date.now()}`,
      farmland_id: formData.farmland_id,
      farmland_name: farmland.name,
      service_type: formData.service_type,
      expected_date: formData.expected_date,
      area_mu: formData.area_mu,
      quoted_price: formData.quoted_price,
      status: 'pending',
      crop_type: farmland.crop_type,
      farmer_name: farmland.owner,
      farmer_phone: farmland.owner_phone,
      created_at: new Date().toISOString().split('T')[0],
      notes: formData.notes,
    };

    addAppointment(newAppointment);
    setShowModal(false);
    setFormData({
      farmland_id: '',
      service_type: 'pest_control',
      expected_date: '',
      area_mu: 0,
      quoted_price: SERVICE_DEFAULT_PRICES.pest_control,
      notes: '',
    });
    alert('预约提交成功！');
  };

  const handleApprove = (apt: Appointment) => {
    updateAppointmentStatus(apt.id, 'approved');
    alert('预约已确认！可在排班和账单中选择此预约');
  };

  const handleCancel = (apt: Appointment) => {
    updateAppointmentStatus(apt.id, 'cancelled');
    alert('预约已取消');
  };

  const getCurrentStepIndex = (status: AppointmentStatus) => {
    const idx = STATUS_FLOW.indexOf(status);
    return idx >= 0 ? idx : -1;
  };

  const getRelatedSchedule = (apt: Appointment) => {
    if (apt.schedule_id) return schedules.find(s => s.id === apt.schedule_id);
    return schedules.find(s => s.appointment_id === apt.id);
  };

  const getRelatedBill = (apt: Appointment) => {
    if (apt.bill_id) return bills.find(b => b.id === apt.bill_id);
    return bills.find(b => b.appointment_id === apt.id);
  };

  const pendingCount = appointments.filter((a) => a.status === 'pending').length;
  const surveyingCount = appointments.filter((a) => a.status === 'approved' || a.status === 'surveying').length;
  const schedulingCount = appointments.filter((a) => a.status === 'surveyed' || a.status === 'scheduling').length;
  const inProgressCount = appointments.filter((a) => a.status === 'in_progress' || a.status === 'operation_completed' || a.status === 'photos_uploaded').length;
  const settlementCount = appointments.filter((a) => a.status === 'signed' || a.status === 'pending_settlement').length;
  const settledCount = appointments.filter((a) => a.status === 'settled').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">作业预约</h1>
          <p className="text-gray-500 mt-1">管理作业预约申请，查看全流程进度</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          新建预约
        </button>
      </div>

      <div className="grid grid-cols-6 gap-4">
        <div 
          className="stat-card cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => { setStatusFilter('pending'); navigate('/appointments'); }}
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-100 rounded-xl">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">待审核</p>
              <p className="text-2xl font-bold text-gray-800">{pendingCount}</p>
            </div>
          </div>
        </div>
        <div 
          className="stat-card cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => { setStatusFilter('approved'); navigate('/appointments'); }}
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-100 rounded-xl">
              <Ruler className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">待测绘</p>
              <p className="text-2xl font-bold text-gray-800">{surveyingCount}</p>
            </div>
          </div>
        </div>
        <div 
          className="stat-card cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => { setStatusFilter('surveyed'); navigate('/appointments'); }}
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-sky-100 rounded-xl">
              <Calendar className="w-6 h-6 text-sky-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">待排班</p>
              <p className="text-2xl font-bold text-gray-800">{schedulingCount}</p>
            </div>
          </div>
        </div>
        <div 
          className="stat-card cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => { setStatusFilter('in_progress'); navigate('/appointments'); }}
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-xl">
              <PlaneTakeoff className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">作业中</p>
              <p className="text-2xl font-bold text-gray-800">{inProgressCount}</p>
            </div>
          </div>
        </div>
        <div 
          className="stat-card cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => { setStatusFilter('signed'); navigate('/appointments'); }}
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-100 rounded-xl">
              <FileText className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">待结算</p>
              <p className="text-2xl font-bold text-gray-800">{settlementCount}</p>
            </div>
          </div>
        </div>
        <div 
          className="stat-card cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => { setStatusFilter('settled'); navigate('/appointments'); }}
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gray-100 rounded-xl">
              <Check className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">已结清</p>
              <p className="text-2xl font-bold text-gray-800">{settledCount}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="搜索预约..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-9 w-64 text-sm"
              />
            </div>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-field pr-8 appearance-none text-sm"
              >
                <option value="all">全部状态</option>
                <option value="pending">待审核</option>
                <option value="approved">待测绘</option>
                <option value="surveyed">待排班</option>
                <option value="scheduled">待作业</option>
                <option value="in_progress">作业中</option>
                <option value="photos_uploaded">待签收</option>
                <option value="signed">待结算</option>
                <option value="settled">已结清</option>
                <option value="cancelled">已取消</option>
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
          <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-600">筛选</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header">地块名称</th>
                <th className="table-header">服务类型</th>
                <th className="table-header">作物</th>
                <th className="table-header">面积</th>
                <th className="table-header">单价/亩</th>
                <th className="table-header">农户</th>
                <th className="table-header">期望日期</th>
                <th className="table-header">总价</th>
                <th className="table-header">关联</th>
                <th className="table-header">状态</th>
                <th className="table-header">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((apt) => {
                const relatedSchedule = getRelatedSchedule(apt);
                const relatedBill = getRelatedBill(apt);
                const effectiveArea = getEffectiveArea(apt);
                const hasMeasured = !!apt.measured_area;
                
                return (
                  <tr key={apt.id} className="hover:bg-gray-50 transition-colors">
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                          <MapPin className="w-4 h-4 text-primary-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{apt.farmland_name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className="text-gray-700">{serviceTypeLabels[apt.service_type]}</span>
                    </td>
                    <td className="table-cell">
                      <span className="text-gray-700">{apt.crop_type}</span>
                    </td>
                    <td className="table-cell">
                      <div>
                        <span className="text-gray-700">
                          {effectiveArea.toFixed(1)}亩
                          {hasMeasured && (
                            <span className="ml-1 text-xs text-green-600">(实测)</span>
                          )}
                        </span>
                        {hasMeasured && apt.measured_area !== apt.area_mu && (
                          <p className="text-xs text-gray-400">
                            档案: {apt.area_mu}亩
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className="text-gray-700">¥{apt.quoted_price.toFixed(2)}</span>
                    </td>
                    <td className="table-cell">
                      <div>
                        <p className="text-gray-700">{apt.farmer_name}</p>
                        <p className="text-xs text-gray-400">{apt.farmer_phone}</p>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {apt.expected_date}
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-gray-800">
                          ¥{(effectiveArea * apt.quoted_price).toFixed(2)}
                        </span>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-1">
                        {relatedSchedule && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs" title="已排班">
                            <PlaneTakeoff className="w-3 h-3" /> 排
                          </span>
                        )}
                        {relatedBill && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-xs" title="已开单">
                            <FileText className="w-3 h-3" /> 账
                          </span>
                        )}
                        {!relatedSchedule && !relatedBill && (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className={`badge ${APPOINTMENT_STATUS_COLORS[apt.status]}`}>
                        {STATUS_STEP_LABELS[apt.status]}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setSelectedAppointment(apt)}
                          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                        {apt.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(apt)}
                              className="p-1.5 hover:bg-green-50 rounded-lg transition-colors"
                              title="确认"
                            >
                              <Check className="w-4 h-4 text-green-600" />
                            </button>
                            <button
                              onClick={() => handleCancel(apt)}
                              className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                              title="取消"
                            >
                              <X className="w-4 h-4 text-red-600" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-800">新建作业预约</h3>
              <p className="text-gray-500 text-sm mt-1">填写预约信息，系统将自动核算费用</p>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  选择地块
                </label>
                <select
                  value={formData.farmland_id}
                  onChange={(e) => handleSelectFarmland(e.target.value)}
                  className="input-field"
                >
                  <option value="">请选择地块</option>
                  {mockFarmlands.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} - {f.area_mu}亩 - {f.crop_type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Sprout className="w-4 h-4 inline mr-1" />
                    服务类型
                  </label>
                  <select
                    value={formData.service_type}
                    onChange={(e) => handleServiceTypeChange(e.target.value as ServiceType)}
                    className="input-field"
                  >
                    <option value="pest_control">病虫害防治</option>
                    <option value="fertilizer">叶面施肥</option>
                    <option value="herbicide">除草作业</option>
                    <option value="fungicide">杀菌作业</option>
                    <option value="other">其他服务</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    默认单价：¥{SERVICE_DEFAULT_PRICES[formData.service_type]}/亩
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    期望作业日期
                  </label>
                  <input
                    type="date"
                    value={formData.expected_date}
                    onChange={(e) => setFormData({ ...formData, expected_date: e.target.value })}
                    className="input-field"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    作业面积（亩）
                  </label>
                  <input
                    type="number"
                    value={formData.area_mu}
                    onChange={(e) => setFormData({ ...formData, area_mu: parseFloat(e.target.value) || 0 })}
                    className="input-field"
                    step="0.1"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    单价（元/亩）
                  </label>
                  <input
                    type="number"
                    value={formData.quoted_price}
                    onChange={(e) => setFormData({ ...formData, quoted_price: parseFloat(e.target.value) || 0 })}
                    className="input-field"
                    step="0.1"
                    min="0"
                  />
                </div>
              </div>

              <div className="bg-primary-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calculator className="w-5 h-5 text-primary-600" />
                  <span className="font-medium text-primary-700">费用核算（实时计算）</span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">面积</p>
                    <p className="font-semibold text-gray-800">{formData.area_mu} 亩</p>
                  </div>
                  <div>
                    <p className="text-gray-500">单价</p>
                    <p className="font-semibold text-gray-800">¥{formData.quoted_price.toFixed(2)}/亩</p>
                  </div>
                  <div>
                    <p className="text-gray-500">预估总价</p>
                    <p className="font-bold text-primary-600 text-lg">¥{totalPrice}</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">备注</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="请输入作业要求或注意事项..."
                  rows={3}
                  className="input-field resize-none"
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 border border-gray-200 rounded-lg font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button onClick={handleSubmit} className="btn-primary px-5 py-2.5">
                提交预约
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-800">预约详情</h3>
              <p className="text-gray-500 text-sm mt-1">
                预约单号：<span className="font-mono">{selectedAppointment.id.toUpperCase()}</span>
              </p>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-4">流程进度</h4>
                <div className="flex items-center justify-between">
                  {STATUS_FLOW.slice(0, 6).map((status, idx) => {
                    const currentIdx = getCurrentStepIndex(selectedAppointment.status);
                    const isCompleted = currentIdx >= idx;
                    const isCurrent = currentIdx === idx;
                    
                    return (
                      <div key={status} className="flex-1 flex flex-col items-center relative">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                          isCompleted 
                            ? 'bg-primary-500 text-white' 
                            : 'bg-gray-200 text-gray-400'
                        } ${isCurrent ? 'ring-4 ring-primary-200' : ''}`}>
                          {isCompleted ? <Check className="w-4 h-4" /> : idx + 1}
                        </div>
                        <p className={`text-xs mt-2 text-center ${isCompleted ? 'text-primary-600 font-medium' : 'text-gray-400'}`}>
                          {STATUS_STEP_LABELS[status]}
                        </p>
                        {idx < 5 && (
                          <div className={`absolute top-4 left-1/2 w-full h-0.5 -translate-y-1/2 ${
                            currentIdx > idx ? 'bg-primary-500' : 'bg-gray-200'
                          }`} />
                        )}
                      </div>
                    );
                  })}
                </div>
                {selectedAppointment.status === 'cancelled' && (
                  <div className="mt-4 p-3 bg-red-50 rounded-lg text-center">
                    <p className="text-red-600 font-medium">此预约已取消</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">地块名称</p>
                  <p className="font-medium text-gray-800 mt-1">{selectedAppointment.farmland_name}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">服务类型</p>
                  <p className="font-medium text-gray-800 mt-1">{serviceTypeLabels[selectedAppointment.service_type]}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">作物类型</p>
                  <p className="font-medium text-gray-800 mt-1">{selectedAppointment.crop_type}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">农户信息</p>
                  <p className="font-medium text-gray-800 mt-1">{selectedAppointment.farmer_name}</p>
                  <p className="text-sm text-gray-500">{selectedAppointment.farmer_phone}</p>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-4">
                <h4 className="text-sm font-medium text-blue-700 mb-3">面积信息</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-blue-600">档案面积</p>
                    <p className="text-lg font-bold text-gray-800">{selectedAppointment.area_mu}亩</p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-600">实测面积</p>
                    <p className={`text-lg font-bold ${selectedAppointment.measured_area ? 'text-green-600' : 'text-gray-400'}`}>
                      {selectedAppointment.measured_area ? `${selectedAppointment.measured_area}亩` : '未测绘'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-600">计价面积</p>
                    <p className="text-lg font-bold text-primary-600">
                      {getEffectiveArea(selectedAppointment)}亩
                      {selectedAppointment.measured_area && <span className="text-xs ml-1">(优先实测)</span>}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">单价/亩</p>
                  <p className="font-medium text-gray-800 mt-1">¥{selectedAppointment.quoted_price.toFixed(2)}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">期望日期</p>
                  <p className="font-medium text-gray-800 mt-1">{selectedAppointment.expected_date}</p>
                </div>
              </div>

              <div className="bg-primary-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-primary-700">服务费用</span>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {getEffectiveArea(selectedAppointment)}亩 × ¥{selectedAppointment.quoted_price.toFixed(2)}/亩
                    </p>
                    <p className="text-2xl font-bold text-primary-600">
                      ¥{(getEffectiveArea(selectedAppointment) * selectedAppointment.quoted_price).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {getRelatedSchedule(selectedAppointment) && (
                  <div className="bg-sky-50 rounded-xl p-4 border border-sky-100">
                    <div className="flex items-center gap-2 mb-2">
                      <PlaneTakeoff className="w-5 h-5 text-sky-600" />
                      <span className="font-medium text-sky-700">关联排班</span>
                    </div>
                    <p className="text-sm text-gray-700">
                      {getRelatedSchedule(selectedAppointment)?.drone_name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {getRelatedSchedule(selectedAppointment)?.pilot_name}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {getRelatedSchedule(selectedAppointment)?.operation_date}
                    </p>
                  </div>
                )}
                
                {getRelatedBill(selectedAppointment) && (
                  <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-5 h-5 text-amber-600" />
                      <span className="font-medium text-amber-700">关联账单</span>
                    </div>
                    <p className="text-sm text-gray-700">
                      账单号: {getRelatedBill(selectedAppointment)?.id.toUpperCase()}
                    </p>
                    <p className="text-sm text-gray-500">
                      金额: ¥{getRelatedBill(selectedAppointment)?.total_amount.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      状态: {getRelatedBill(selectedAppointment)?.status}
                    </p>
                  </div>
                )}
              </div>

              {selectedAppointment.notes && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">备注</p>
                  <p className="text-gray-700">{selectedAppointment.notes}</p>
                </div>
              )}

              {selectedAppointment.signed_at && (
                <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                  <div className="flex items-center gap-2">
                    <ClipboardCheck className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-700">已签收</p>
                      <p className="text-sm text-green-600">
                        签收人: {selectedAppointment.signed_by} · {selectedAppointment.signed_at}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <span className="text-gray-500">当前状态</span>
                <span className={`badge ${APPOINTMENT_STATUS_COLORS[selectedAppointment.status]}`}>
                  {STATUS_STEP_LABELS[selectedAppointment.status]}
                </span>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setSelectedAppointment(null)}
                className="btn-primary px-5 py-2.5"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
