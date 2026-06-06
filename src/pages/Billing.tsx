import { useState } from 'react';
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
import { mockBills, mockSeasonStats, statusLabels, statusColors } from '@/data/mockData';
import type { Bill } from '@/data/types';

const COLORS = ['#22c55e', '#eab308', '#ef4444', '#3b82f6'];

export default function Billing() {
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);

  const filteredBills = mockBills.filter(
    (b) => statusFilter === 'all' || b.status === statusFilter
  );

  const totalRevenue = mockBills.reduce((sum, b) => sum + b.total_amount, 0);
  const totalPaid = mockBills.reduce((sum, b) => sum + b.paid_amount, 0);
  const totalUnpaid = totalRevenue - totalPaid;
  const overdueBills = mockBills.filter((b) => b.status === 'overdue');

  const paymentStats = [
    { name: '已支付', value: mockBills.filter((b) => b.status === 'paid').length, color: '#22c55e' },
    { name: '部分支付', value: mockBills.filter((b) => b.status === 'partial').length, color: '#eab308' },
    { name: '待支付', value: mockBills.filter((b) => b.status === 'unpaid').length, color: '#3b82f6' },
    { name: '已逾期', value: mockBills.filter((b) => b.status === 'overdue').length, color: '#ef4444' },
  ];

  const handleViewDetail = (bill: Bill) => {
    setSelectedBill(bill);
    setShowDetailModal(true);
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
          <button className="btn-primary flex items-center gap-2">
            <Receipt className="w-5 h-5" />
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
                          >
                            <Eye className="w-4 h-4 text-gray-600" />
                          </button>
                          {(bill.status === 'unpaid' || bill.status === 'partial' || bill.status === 'overdue') && (
                            <button
                              onClick={() => {
                                setSelectedBill(bill);
                                setShowReminderModal(true);
                              }}
                              className="p-1.5 hover:bg-yellow-50 rounded-lg transition-colors"
                            >
                              <Send className="w-4 h-4 text-yellow-600" />
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

      {showDetailModal && selectedBill && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg animate-slide-up">
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
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-5 py-2.5 border border-gray-200 rounded-lg font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                关闭
              </button>
              {selectedBill.status !== 'paid' && (
                <button className="btn-primary px-5 py-2.5">确认收款</button>
              )}
            </div>
          </div>
        </div>
      )}

      {showReminderModal && selectedBill && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md animate-slide-up">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-800">发送催款提醒</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-yellow-50 rounded-xl p-4">
                <p className="font-medium text-yellow-800">{selectedBill.farmer_name}</p>
                <p className="text-sm text-yellow-700 mt-1">
                  待支付金额: ¥{(selectedBill.total_amount - selectedBill.paid_amount).toFixed(2)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">提醒方式</label>
                <div className="flex gap-3">
                  <button className="flex-1 py-3 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    📱 短信
                  </button>
                  <button className="flex-1 py-3 border border-primary-500 bg-primary-50 rounded-xl font-medium text-primary-700">
                    💬 微信
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">提醒内容</label>
                <textarea
                  rows={3}
                  defaultValue={`尊敬的${selectedBill.farmer_name}，您的植保服务账单（${selectedBill.id.toUpperCase()}）已到期，应付金额¥${(selectedBill.total_amount - selectedBill.paid_amount).toFixed(2)}，请及时支付。如有疑问请联系我们。`}
                  className="input-field resize-none"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setShowReminderModal(false)}
                className="px-5 py-2.5 border border-gray-200 rounded-lg font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => setShowReminderModal(false)}
                className="btn-primary px-5 py-2.5"
              >
                发送提醒
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
