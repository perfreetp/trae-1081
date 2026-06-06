import { useState } from 'react';
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
} from 'lucide-react';
import { mockFarmlands, serviceTypeLabels, statusLabels, statusColors } from '@/data/mockData';
import { useAppStore } from '@/store/useAppStore';
import type { Appointment, ServiceType } from '@/data/types';

export default function Appointments() {
  const { appointments, addAppointment, updateAppointmentStatus } = useAppStore();
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [formData, setFormData] = useState({
    farmland_id: '',
    service_type: 'pest_control' as ServiceType,
    expected_date: '',
    area_mu: 0,
    quoted_price: 12,
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

  const calculateTotal = () => {
    return (formData.area_mu * formData.quoted_price).toFixed(2);
  };

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
      quoted_price: 12,
      notes: '',
    });
    alert('预约提交成功！');
  };

  const handleApprove = (apt: Appointment) => {
    updateAppointmentStatus(apt.id, 'approved');
    alert('预约已确认！');
  };

  const handleCancel = (apt: Appointment) => {
    updateAppointmentStatus(apt.id, 'cancelled');
    alert('预约已取消');
  };

  const pendingCount = appointments.filter((a) => a.status === 'pending').length;
  const approvedCount = appointments.filter((a) => a.status === 'approved' || a.status === 'scheduled').length;
  const inProgressCount = appointments.filter((a) => a.status === 'in_progress').length;
  const completedCount = appointments.filter((a) => a.status === 'completed').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">作业预约</h1>
          <p className="text-gray-500 mt-1">管理作业预约申请，审核报价并排期</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          新建预约
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="stat-card">
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
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Check className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">已确认</p>
              <p className="text-2xl font-bold text-gray-800">{approvedCount}</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-xl">
              <Sprout className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">作业中</p>
              <p className="text-2xl font-bold text-gray-800">{inProgressCount}</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gray-100 rounded-xl">
              <Check className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">已完成</p>
              <p className="text-2xl font-bold text-gray-800">{completedCount}</p>
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
                <option value="approved">已确认</option>
                <option value="scheduled">已排期</option>
                <option value="in_progress">进行中</option>
                <option value="completed">已完成</option>
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
                <th className="table-header">农户</th>
                <th className="table-header">期望日期</th>
                <th className="table-header">总价</th>
                <th className="table-header">状态</th>
                <th className="table-header">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((apt) => (
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
                    <span className="text-gray-700">{apt.area_mu}亩</span>
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
                        ¥{(apt.area_mu * apt.quoted_price).toFixed(2)}
                      </span>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className={`badge ${statusColors[apt.status]}`}>
                      {statusLabels[apt.status]}
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
              ))}
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
                    onChange={(e) => setFormData({ ...formData, service_type: e.target.value as ServiceType })}
                    className="input-field"
                  >
                    <option value="pest_control">病虫害防治</option>
                    <option value="fertilizer">叶面施肥</option>
                    <option value="herbicide">除草作业</option>
                    <option value="fungicide">杀菌作业</option>
                    <option value="other">其他服务</option>
                  </select>
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
                  />
                </div>
              </div>

              <div className="bg-primary-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calculator className="w-5 h-5 text-primary-600" />
                  <span className="font-medium text-primary-700">费用核算</span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">面积</p>
                    <p className="font-semibold text-gray-800">{formData.area_mu} 亩</p>
                  </div>
                  <div>
                    <p className="text-gray-500">单价</p>
                    <p className="font-semibold text-gray-800">¥{formData.quoted_price}/亩</p>
                  </div>
                  <div>
                    <p className="text-gray-500">预估总价</p>
                    <p className="font-bold text-primary-600 text-lg">¥{calculateTotal()}</p>
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
          <div className="bg-white rounded-2xl w-full max-w-lg animate-slide-up">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-800">预约详情</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">预约单号</span>
                <span className="font-mono font-medium">{selectedAppointment.id.toUpperCase()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">地块名称</span>
                <span className="font-medium">{selectedAppointment.farmland_name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">服务类型</span>
                <span className="font-medium">{serviceTypeLabels[selectedAppointment.service_type]}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">作物类型</span>
                <span className="font-medium">{selectedAppointment.crop_type}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">作业面积</span>
                <span className="font-medium">{selectedAppointment.area_mu}亩</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">农户信息</span>
                <div className="text-right">
                  <p className="font-medium">{selectedAppointment.farmer_name}</p>
                  <p className="text-sm text-gray-500">{selectedAppointment.farmer_phone}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">期望日期</span>
                <span className="font-medium">{selectedAppointment.expected_date}</span>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-gray-500">服务费用</span>
                <span className="text-xl font-bold text-primary-600">
                  ¥{(selectedAppointment.area_mu * selectedAppointment.quoted_price).toFixed(2)}
                </span>
              </div>
              {selectedAppointment.notes && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">备注</p>
                  <p className="text-gray-700">{selectedAppointment.notes}</p>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-gray-500">当前状态</span>
                <span className={`badge ${statusColors[selectedAppointment.status]}`}>
                  {statusLabels[selectedAppointment.status]}
                </span>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end">
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
