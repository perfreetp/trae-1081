import { useState, useMemo } from 'react';
import {
  Receipt,
  DollarSign,
  Clock,
  AlertTriangle,
  CheckCircle,
  Filter,
  Search,
  ChevronDown,
  Eye,
  FileText,
  Send,
  Calendar,
  TrendingUp,
  BarChart3,
  Plus,
  X,
  Check,
  CreditCard,
  History,
  Undo2,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { mockSeasonStats, statusLabels, statusColors, mockAppointments, mockFarmlands } from '@/data/mockData';
import { useAppStore } from '@/store/useAppStore';
import type { Bill, BillItem, PaymentRecord, RefundRecord, BillItemType } from '@/data/types';

const COLORS = ['#22c55e', '#eab308', '#ef4444', '#3b82f6'];

const paymentMethodLabels: Record<string, string> = {
  cash: '现金',
  bank_transfer: '银行转账',
  wechat: '微信支付',
  alipay: '支付宝',
  other: '其他',
};

const billItemTypeLabels: Record<BillItemType, string> = {
  service: '服务费',
  pesticide: '药剂费',
  respray: '补喷费',
  discount: '优惠/减免',
  other: '其他',
};

const billItemTypeColors: Record<BillItemType, string> = {
  service: 'bg-green-100 text-green-700',
  pesticide: 'bg-blue-100 text-blue-700',
  respray: 'bg-orange-100 text-orange-700',
  discount: 'bg-red-100 text-red-700',
  other: 'bg-gray-100 text-gray-700',
};

export default function Billing() {
  const { 
    bills, 
    addBill, 
    updateBillPayment, 
    paymentRecords, 
    addPaymentRecord,
    refundRecords,
    processRefund,
  } = useAppStore();
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'bank_transfer' | 'wechat' | 'alipay' | 'other'>('wechat');
  const [paymentRemark, setPaymentRemark] = useState('');
  const [refundAmount, setRefundAmount] = useState('');
  const [refundMethod, setRefundMethod] = useState<'cash' | 'bank_transfer' | 'wechat' | 'alipay' | 'other'>('wechat');
  const [refundReason, setRefundReason] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [createForm, setCreateForm] = useState({
    appointment_id: '',
    farmland_id: '',
    farmland_name: '',
    farmer_name: '',
    farmer_phone: '',
    due_date: '',
    items: [{ name: '病虫害防治', quantity: 0, unit_price: 12, subtotal: 0 }] as BillItem[],
  });

  const filteredBills = bills.filter((b) => {
    const matchStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchSearch = !searchTerm ||
      b.farmland_name.includes(searchTerm) ||
      b.farmer_name.includes(searchTerm) ||
      b.id.includes(searchTerm);
    return matchStatus && matchSearch;
  });

  const totalRevenue = bills.reduce((sum, b) => sum + b.total_amount, 0);
  const totalPaid = bills.reduce((sum, b) => sum + b.paid_amount, 0);
  const totalUnpaid = totalRevenue - totalPaid;
  const overdueBills = bills.filter((b) => b.status === 'overdue');

  const paymentStats = [
    { name: '已支付', value: bills.filter((b) => b.status === 'paid').length, color: '#22c55e' },
    { name: '部分支付', value: bills.filter((b) => b.status === 'partial').length, color: '#eab308' },
    { name: '待支付', value: bills.filter((b) => b.status === 'unpaid').length, color: '#3b82f6' },
    { name: '已逾期', value: bills.filter((b) => b.status === 'overdue').length, color: '#ef4444' },
  ];

  const billPaymentRecords = useMemo(() => {
    if (!selectedBill) return [];
    return paymentRecords.filter((r) => r.bill_id === selectedBill.id);
  }, [selectedBill, paymentRecords]);

  const billRefundRecords = useMemo(() => {
    if (!selectedBill) return [];
    return refundRecords.filter((r) => r.bill_id === selectedBill.id);
  }, [selectedBill, refundRecords]);

  const calculateTotal = (items: BillItem[]) => {
    return items.reduce((sum, item) => sum + item.subtotal, 0);
  };

  const handleRefundSubmit = () => {
    if (!selectedBill) return;
    const amount = parseFloat(refundAmount);
    if (!amount || amount <= 0) {
      alert('请输入有效的退款金额');
      return;
    }
    const maxRefund = selectedBill.paid_amount - (selectedBill.refunded_amount || 0);
    if (amount > maxRefund + 0.01) {
      alert(`退款金额不能超过已收金额 ¥${maxRefund.toFixed(2)}`);
      return;
    }
    const refund: RefundRecord = {
      id: `rf${Date.now()}`,
      bill_id: selectedBill.id,
      amount: amount,
      refund_method: refundMethod,
      refund_reason: refundReason,
      refund_date: new Date().toISOString().split('T')[0],
      status: 'completed',
      operator: '当前用户',
      created_at: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };
    processRefund(selectedBill.id, refund);
    setShowRefundModal(false);
    setRefundAmount('');
    setRefundReason('');
    alert('退款成功！');
  };

  const handleSelectAppointment = (appointmentId: string) => {
    const apt = mockAppointments.find((a) => a.id === appointmentId);
    if (apt) {
      const total = apt.area_mu * apt.quoted_price;
      setCreateForm({
        ...createForm,
        appointment_id: apt.id,
        farmland_id: apt.farmland_id,
        farmland_name: apt.farmland_name,
        farmer_name: apt.farmer_name,
        farmer_phone: apt.farmer_phone,
        items: [{
          name: '病虫害防治',
          quantity: apt.area_mu,
          unit_price: apt.quoted_price,
          subtotal: total,
        }],
      });
    }
  };

  const handleUpdateItem = (index: number, field: keyof BillItem, value: number) => {
    const newItems = [...createForm.items];
    newItems[index] = { ...newItems[index], [field]: value };
    newItems[index].subtotal = newItems[index].quantity * newItems[index].unit_price;
    setCreateForm({ ...createForm, items: newItems });
  };

  const handleAddItem = () => {
    setCreateForm({
      ...createForm,
      items: [...createForm.items, { name: '其他费用', quantity: 0, unit_price: 0, subtotal: 0 }],
    });
  };

  const handleRemoveItem = (index: number) => {
    if (createForm.items.length > 1) {
      const newItems = createForm.items.filter((_, i) => i !== index);
      setCreateForm({ ...createForm, items: newItems });
    }
  };

  const handleCreateBill = () => {
    if (!createForm.farmland_name || !createForm.due_date) {
      alert('请填写完整信息');
      return;
    }
    const totalAmount = calculateTotal(createForm.items);
    const newBill: Bill = {
      id: `b${Date.now()}`,
      appointment_id: createForm.appointment_id,
      farmland_id: createForm.farmland_id,
      farmland_name: createForm.farmland_name,
      farmer_name: createForm.farmer_name,
      farmer_phone: createForm.farmer_phone || '13800138000',
      items: createForm.items,
      total_amount: totalAmount,
      paid_amount: 0,
      status: 'unpaid',
      created_at: new Date().toISOString().split('T')[0],
      due_date: createForm.due_date,
    };

    addBill(newBill);
    setShowCreateModal(false);
    setCreateForm({
      appointment_id: '',
      farmland_id: '',
      farmland_name: '',
      farmer_name: '',
      farmer_phone: '',
      due_date: '',
      items: [{ name: '病虫害防治', quantity: 0, unit_price: 12, subtotal: 0 }],
    });
    alert('账单生成成功！');
  };

  const handleConfirmPayment = () => {
    if (!selectedBill || !paymentAmount) return;
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('请输入有效的收款金额');
      return;
    }

    const remaining = selectedBill.total_amount - selectedBill.paid_amount;
    if (amount > remaining + 0.01) {
      alert(`收款金额不能超过待支付金额 ¥${remaining.toFixed(2)}`);
      return;
    }

    const actualAmount = Math.min(amount, remaining);
    let newStatus: Bill['status'] = selectedBill.status;
    const newPaid = selectedBill.paid_amount + actualAmount;
    if (newPaid >= selectedBill.total_amount - 0.01) {
      newStatus = 'paid';
    } else if (newPaid > 0) {
      newStatus = 'partial';
    }

    updateBillPayment(selectedBill.id, actualAmount, newStatus);

    const record: PaymentRecord = {
      id: `pr${Date.now()}`,
      bill_id: selectedBill.id,
      amount: actualAmount,
      payment_method: paymentMethod,
      payment_date: new Date().toISOString().split('T')[0],
      remark: paymentRemark,
      created_at: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };
    addPaymentRecord(record);

    setShowPaymentModal(false);
    setPaymentAmount('');
    setPaymentRemark('');
    setPaymentMethod('wechat');
    setSelectedBill(null);
    setShowDetailModal(false);
    alert('收款确认成功！');
  };

  const handleViewDetail = (bill: Bill) => {
    setSelectedBill(bill);
    setShowDetailModal(true);
  };

  const handleOpenPayment = (bill: Bill) => {
    setSelectedBill(bill);
    const remaining = bill.total_amount - bill.paid_amount;
    setPaymentAmount(remaining.toFixed(2));
    setPaymentRemark('');
    setPaymentMethod('wechat');
    setShowPaymentModal(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">费用结算</h1>
          <p className="text-gray-500 mt-1">管理账单、催款提醒和季节服务统计</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <FileText className="w-5 h-5" />
            导出报表
          </button>
          <button onClick={() => setShowCreateModal(true)} className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            生成账单
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-xl">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">总营收</p>
              <p className="text-2xl font-bold text-gray-800">
                ¥{totalRevenue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-xl">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">已收款</p>
              <p className="text-2xl font-bold text-blue-600">
                ¥{totalPaid.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-100 rounded-xl">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">待收款</p>
              <p className="text-2xl font-bold text-yellow-600">
                ¥{totalUnpaid.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">逾期账单</p>
              <p className="text-2xl font-bold text-red-600">{overdueBills.length}笔</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-800">季节营收统计</h3>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 bg-primary-50 text-primary-600 rounded-lg text-sm font-medium">
                  2026年
                </button>
                <button className="px-3 py-1.5 text-gray-500 hover:bg-gray-50 rounded-lg text-sm">
                  2025年
                </button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={mockSeasonStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  formatter={(value: number) => [`¥${value.toLocaleString()}`, '营收']}
                />
                <Bar dataKey="revenue" name="营收(元)" fill="#2E7D32" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">账单列表</h3>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="搜索账单..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-field pl-9 w-48 text-sm"
                  />
                </div>
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="input-field pr-8 appearance-none text-sm py-2"
                  >
                    <option value="all">全部状态</option>
                    <option value="paid">已支付</option>
                    <option value="partial">部分支付</option>
                    <option value="unpaid">待支付</option>
                    <option value="overdue">已逾期</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Filter className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="table-header">账单号</th>
                    <th className="table-header">地块名称</th>
                    <th className="table-header">农户</th>
                    <th className="table-header">金额</th>
                    <th className="table-header">已付</th>
                    <th className="table-header">待付</th>
                    <th className="table-header">到期日</th>
                    <th className="table-header">状态</th>
                    <th className="table-header">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBills.map((bill) => (
                    <tr key={bill.id} className="hover:bg-gray-50 transition-colors">
                      <td className="table-cell">
                        <span className="font-mono text-sm text-gray-700">
                          {bill.id.toUpperCase()}
                        </span>
                      </td>
                      <td className="table-cell">
                        <span className="font-medium text-gray-800">{bill.farmland_name}</span>
                      </td>
                      <td className="table-cell">
                        <span className="text-gray-700">{bill.farmer_name}</span>
                      </td>
                      <td className="table-cell">
                        <span className="font-semibold text-gray-800">
                          ¥{bill.total_amount.toFixed(2)}
                        </span>
                      </td>
                      <td className="table-cell">
                        <span className="text-green-600 font-medium">
                          ¥{bill.paid_amount.toFixed(2)}
                        </span>
                      </td>
                      <td className="table-cell">
                        <span className="text-orange-600 font-medium">
                          ¥{(bill.total_amount - bill.paid_amount).toFixed(2)}
                        </span>
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className={bill.status === 'overdue' ? 'text-red-600 font-medium' : 'text-gray-600'}>
                            {bill.due_date}
                          </span>
                        </div>
                      </td>
                      <td className="table-cell">
                        <span className={`badge ${statusColors[bill.status]}`}>
                          {statusLabels[bill.status]}
                        </span>
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleViewDetail(bill)}
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                            title="查看详情"
                          >
                            <Eye className="w-4 h-4 text-gray-600" />
                          </button>
                          {bill.status !== 'paid' && (
                            <button
                              onClick={() => handleOpenPayment(bill)}
                              className="p-1.5 hover:bg-green-50 rounded-lg transition-colors"
                              title="确认收款"
                            >
                              <DollarSign className="w-4 h-4 text-green-600" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4">收款状态</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={paymentStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {paymentStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {paymentStats.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-gray-600">{item.name}</span>
                  </div>
                  <span className="font-medium text-gray-800">{item.value}笔</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              欠款提醒
            </h3>
            <div className="space-y-3">
              {overdueBills.map((bill) => (
                <div key={bill.id} className="p-3 bg-red-50 rounded-xl border border-red-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{bill.farmland_name}</p>
                      <p className="text-xs text-gray-500 mt-1">{bill.farmer_name}</p>
                    </div>
                    <span className="text-red-600 font-bold">
                      ¥{(bill.total_amount - bill.paid_amount).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-red-500">已逾期 5 天</p>
                    <button className="text-xs px-2 py-1 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors">
                      发送催款
                    </button>
                  </div>
                </div>
              ))}
              {overdueBills.length === 0 && (
                <p className="text-center text-gray-400 py-4 text-sm">暂无逾期账单</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              本月业绩
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">作业次数</span>
                <span className="font-bold text-gray-800">145 次</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">作业面积</span>
                <span className="font-bold text-gray-800">11,230 亩</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">服务农户</span>
                <span className="font-bold text-gray-800">68 户</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">平均单价</span>
                <span className="font-bold text-gray-800">¥15.0/亩</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                <span className="text-gray-500 text-sm">环比增长</span>
                <span className="font-bold text-green-600">+12.5%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-800">生成账单</h3>
              <p className="text-gray-500 text-sm mt-1">选择作业预约或手动填写账单信息</p>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">关联预约（可选）</label>
                <select
                  value={createForm.appointment_id}
                  onChange={(e) => handleSelectAppointment(e.target.value)}
                  className="input-field"
                >
                  <option value="">手动填写</option>
                  {mockAppointments.filter((a) => a.status === 'approved' || a.status === 'scheduled' || a.status === 'completed').slice(0, 10).map((apt) => (
                    <option key={apt.id} value={apt.id}>
                      {apt.farmland_name} - {apt.area_mu}亩 - ¥{(apt.area_mu * apt.quoted_price).toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">地块名称</label>
                  <input
                    type="text"
                    value={createForm.farmland_name}
                    onChange={(e) => setCreateForm({ ...createForm, farmland_name: e.target.value })}
                    placeholder="请输入地块名称"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">农户姓名</label>
                  <input
                    type="text"
                    value={createForm.farmer_name}
                    onChange={(e) => setCreateForm({ ...createForm, farmer_name: e.target.value })}
                    placeholder="请输入农户姓名"
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">到期日期</label>
                <input
                  type="date"
                  value={createForm.due_date}
                  onChange={(e) => setCreateForm({ ...createForm, due_date: e.target.value })}
                  className="input-field"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-700">费用明细</label>
                  <button
                    onClick={handleAddItem}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    + 添加明细
                  </button>
                </div>
                <div className="space-y-3">
                  {createForm.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-end">
                      <div className="col-span-4">
                        <label className="block text-xs text-gray-500 mb-1">项目名称</label>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => {
                            const newItems = [...createForm.items];
                            newItems[index].name = e.target.value;
                            setCreateForm({ ...createForm, items: newItems });
                          }}
                          className="input-field text-sm py-2"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs text-gray-500 mb-1">数量</label>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleUpdateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                          className="input-field text-sm py-2"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs text-gray-500 mb-1">单价</label>
                        <input
                          type="number"
                          value={item.unit_price}
                          onChange={(e) => handleUpdateItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                          className="input-field text-sm py-2"
                        />
                      </div>
                      <div className="col-span-3">
                        <label className="block text-xs text-gray-500 mb-1">小计</label>
                        <div className="py-2 px-3 bg-gray-50 rounded-lg text-sm font-medium text-gray-700">
                          ¥{item.subtotal.toFixed(2)}
                        </div>
                      </div>
                      <div className="col-span-1">
                        {createForm.items.length > 1 && (
                          <button
                            onClick={() => handleRemoveItem(index)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-primary-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">账单总计</span>
                  <span className="text-2xl font-bold text-primary-600">
                    ¥{calculateTotal(createForm.items).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-5 py-2.5 border border-gray-200 rounded-lg font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button onClick={handleCreateBill} className="btn-primary px-5 py-2.5">
                生成账单
              </button>
            </div>
          </div>
        </div>
      )}

      {showDetailModal && selectedBill && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-800">账单详情</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">账单号</span>
                <span className="font-mono font-medium">{selectedBill.id.toUpperCase()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">地块名称</span>
                <span className="font-medium">{selectedBill.farmland_name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">农户</span>
                <span className="font-medium">{selectedBill.farmer_name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">开单日期</span>
                <span className="font-medium">{selectedBill.created_at}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">到期日期</span>
                <span className={`font-medium ${selectedBill.status === 'overdue' ? 'text-red-600' : ''}`}>
                  {selectedBill.due_date}
                </span>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <h4 className="font-medium text-gray-800 mb-3">费用明细</h4>
                <div className="space-y-2">
                  {selectedBill.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.name} ({item.quantity}亩 × ¥{item.unit_price})
                      </span>
                      <span className="font-medium text-gray-800">¥{item.subtotal.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
                  <span className="font-semibold text-gray-800">总计</span>
                  <span className="font-bold text-xl text-primary-600">
                    ¥{selectedBill.total_amount.toFixed(2)}
                  </span>
                </div>
                <div className="mt-2 flex justify-between">
                  <span className="text-gray-500">已支付</span>
                  <span className="font-medium text-green-600">
                    ¥{selectedBill.paid_amount.toFixed(2)}
                  </span>
                </div>
                <div className="mt-2 flex justify-between">
                  <span className="text-gray-500">待支付</span>
                  <span className="font-medium text-orange-600">
                    ¥{(selectedBill.total_amount - selectedBill.paid_amount).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-gray-500">支付状态</span>
                <span className={`badge ${statusColors[selectedBill.status]}`}>
                  {statusLabels[selectedBill.status]}
                </span>
              </div>

              {billPaymentRecords.length > 0 && (
                <div className="border-t border-gray-100 pt-4">
                  <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                    <History className="w-4 h-4" />
                    收款记录
                  </h4>
                  <div className="space-y-2">
                    {billPaymentRecords.map((record) => (
                      <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <CreditCard className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800 text-sm">
                              {paymentMethodLabels[record.payment_method]}
                            </p>
                            <p className="text-xs text-gray-500">{record.created_at}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">+¥{record.amount.toFixed(2)}</p>
                          {record.remark && (
                            <p className="text-xs text-gray-500">{record.remark}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {billRefundRecords.length > 0 && (
                <div className="border-t border-gray-100 pt-4">
                  <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                    <Undo2 className="w-4 h-4" />
                    退款记录
                  </h4>
                  <div className="space-y-2">
                    {billRefundRecords.map((record) => (
                      <div key={record.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                            <Undo2 className="w-4 h-4 text-red-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800 text-sm">
                              {paymentMethodLabels[record.refund_method]} 退款
                            </p>
                            <p className="text-xs text-gray-500">{record.created_at}</p>
                            <p className="text-xs text-gray-500">原因：{record.refund_reason}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-red-600">-¥{record.amount.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-between">
              <div>
                {selectedBill.paid_amount > 0 && (
                  <button
                    onClick={() => {
                      const maxRefund = selectedBill.paid_amount - (selectedBill.refunded_amount || 0);
                      setRefundAmount(maxRefund.toFixed(2));
                      setRefundReason('');
                      setRefundMethod('wechat');
                      setShowRefundModal(true);
                    }}
                    className="px-5 py-2.5 border border-red-200 rounded-lg font-medium text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                  >
                    <Undo2 className="w-4 h-4" />
                    退款/冲正
                  </button>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-5 py-2.5 border border-gray-200 rounded-lg font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  关闭
                </button>
                {selectedBill.status !== 'paid' && selectedBill.status !== 'refunded' && (
                  <button
                    onClick={() => {
                      const remaining = selectedBill.total_amount - selectedBill.paid_amount;
                      setPaymentAmount(remaining.toFixed(2));
                      setPaymentRemark('');
                      setPaymentMethod('wechat');
                      setShowPaymentModal(true);
                    }}
                    className="btn-primary px-5 py-2.5"
                  >
                    确认收款
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showPaymentModal && selectedBill && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md animate-slide-up">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-800">确认收款</h3>
              <p className="text-gray-500 text-sm mt-1">
                账单：{selectedBill.id.toUpperCase()}
              </p>
            </div>
            <div className="p-6 space-y-5">
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">账单总金额</span>
                  <span className="font-bold text-gray-800">¥{selectedBill.total_amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">已支付金额</span>
                  <span className="font-medium text-green-600">¥{selectedBill.paid_amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="text-gray-500">待支付金额</span>
                  <span className="font-bold text-orange-600">
                    ¥{(selectedBill.total_amount - selectedBill.paid_amount).toFixed(2)}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  本次收款金额（元）
                </label>
                <div className="relative">
                  <DollarSign className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      const max = selectedBill.total_amount - selectedBill.paid_amount;
                      if (val > max) {
                        setPaymentAmount(max.toFixed(2));
                      } else {
                        setPaymentAmount(e.target.value);
                      }
                    }}
                    placeholder="请输入收款金额"
                    className="input-field pl-10 text-lg"
                    step="0.01"
                    max={selectedBill.total_amount - selectedBill.paid_amount}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  最多可收：¥{(selectedBill.total_amount - selectedBill.paid_amount).toFixed(2)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  收款方式
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['wechat', 'alipay', 'bank_transfer', 'cash', 'other'] as const).map((method) => (
                    <button
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                        paymentMethod === method
                          ? 'bg-primary-100 text-primary-700 border-2 border-primary-500'
                          : 'bg-gray-50 text-gray-600 border-2 border-transparent hover:bg-gray-100'
                      }`}
                    >
                      {paymentMethodLabels[method]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  备注（可选）
                </label>
                <input
                  type="text"
                  value={paymentRemark}
                  onChange={(e) => setPaymentRemark(e.target.value)}
                  placeholder="填写收款备注..."
                  className="input-field"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setPaymentAmount('');
                  setPaymentRemark('');
                }}
                className="px-5 py-2.5 border border-gray-200 rounded-lg font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button onClick={handleConfirmPayment} className="btn-primary px-5 py-2.5">
                确认收款
              </button>
            </div>
          </div>
        </div>
      )}

      {showRefundModal && selectedBill && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md animate-slide-up">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Undo2 className="w-5 h-5 text-red-500" />
                退款/冲正
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                账单：{selectedBill.id.toUpperCase()}
              </p>
            </div>
            <div className="p-6 space-y-5">
              <div className="bg-red-50 rounded-xl p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">已支付金额</span>
                  <span className="font-bold text-gray-800">¥{selectedBill.paid_amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">已退款金额</span>
                  <span className="font-medium text-red-600">¥{(selectedBill.refunded_amount || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-red-200">
                  <span className="text-gray-500">可退款金额</span>
                  <span className="font-bold text-orange-600">
                    ¥{(selectedBill.paid_amount - (selectedBill.refunded_amount || 0)).toFixed(2)}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  退款金额（元）
                </label>
                <div className="relative">
                  <DollarSign className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    value={refundAmount}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      const max = selectedBill.paid_amount - (selectedBill.refunded_amount || 0);
                      if (val > max) {
                        setRefundAmount(max.toFixed(2));
                      } else {
                        setRefundAmount(e.target.value);
                      }
                    }}
                    placeholder="请输入退款金额"
                    className="input-field pl-10 text-lg"
                    step="0.01"
                    max={selectedBill.paid_amount - (selectedBill.refunded_amount || 0)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  退款方式
                </label>
                <select
                  value={refundMethod}
                  onChange={(e) => setRefundMethod(e.target.value as any)}
                  className="input-field"
                >
                  <option value="wechat">微信支付</option>
                  <option value="alipay">支付宝</option>
                  <option value="bank_transfer">银行转账</option>
                  <option value="cash">现金</option>
                  <option value="other">其他</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  退款原因
                </label>
                <textarea
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  placeholder="请填写退款原因..."
                  className="input-field"
                  rows={3}
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowRefundModal(false);
                  setRefundAmount('');
                  setRefundReason('');
                }}
                className="px-5 py-2.5 border border-gray-200 rounded-lg font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button onClick={handleRefundSubmit} className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors">
                确认退款
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
