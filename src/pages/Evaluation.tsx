import { useState } from 'react';
import {
  Star,
  MessageSquare,
  RefreshCw,
  User,
  Calendar,
  MapPin,
  Search,
  Filter,
  ChevronDown,
  ThumbsUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  FileText,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { mockEvaluations, mockSeasonStats } from '@/data/mockData';
import type { Evaluation } from '@/data/types';

const satisfactionData = [
  { month: '1月', satisfaction: 88, respray_rate: 5 },
  { month: '2月', satisfaction: 85, respray_rate: 7 },
  { month: '3月', satisfaction: 90, respray_rate: 4 },
  { month: '4月', satisfaction: 92, respray_rate: 3 },
  { month: '5月', satisfaction: 89, respray_rate: 6 },
  { month: '6月', satisfaction: 94, respray_rate: 2 },
];

export default function Evaluation() {
  const [selectedEvaluation, setSelectedEvaluation] = useState<Evaluation | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showResprayModal, setShowResprayModal] = useState(false);

  const filteredEvaluations = mockEvaluations.filter(
    (e) => filterStatus === 'all' || (filterStatus === 'need_respray' && e.needs_respray) || (filterStatus === 'normal' && !e.needs_respray)
  );

  const avgRating = mockEvaluations.reduce((sum, e) => sum + e.rating, 0) / mockEvaluations.length;
  const resprayCount = mockEvaluations.filter((e) => e.needs_respray).length;
  const goodRatingCount = mockEvaluations.filter((e) => e.rating >= 4).length;
  const satisfactionRate = (goodRatingCount / mockEvaluations.length) * 100;

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const handleResprayAction = (evaluation: Evaluation, action: 'approve' | 'reject') => {
    setSelectedEvaluation(evaluation);
    setShowResprayModal(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">效果评价</h1>
          <p className="text-gray-500 mt-1">查看农户评价，处理补喷申请，统计服务质量</p>
        </div>
        <button className="btn-secondary flex items-center gap-2">
          <FileText className="w-5 h-5" />
          导出评价报告
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-100 rounded-xl">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">平均评分</p>
              <p className="text-2xl font-bold text-gray-800">
                {avgRating.toFixed(1)}
                <span className="text-sm font-normal">/5.0</span>
              </p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-xl">
              <ThumbsUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">满意率</p>
              <p className="text-2xl font-bold text-green-600">
                {satisfactionRate.toFixed(0)}
                <span className="text-sm font-normal">%</span>
              </p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-100 rounded-xl">
              <RefreshCw className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">补喷申请</p>
              <p className="text-2xl font-bold text-orange-600">{resprayCount}笔</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-xl">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">总评价数</p>
              <p className="text-2xl font-bold text-gray-800">{mockEvaluations.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4">满意度趋势</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={satisfactionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis yAxisId="left" tick={{ fontSize: 12 }} stroke="#9ca3af" domain={[0, 100]} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} stroke="#9ca3af" domain={[0, 10]} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="satisfaction"
                  name="满意度(%)"
                  stroke="#2E7D32"
                  strokeWidth={3}
                  dot={{ fill: '#2E7D32', r: 4 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="respray_rate"
                  name="补喷率(%)"
                  stroke="#FF9800"
                  strokeWidth={3}
                  dot={{ fill: '#FF9800', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">评价列表</h3>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="搜索评价..."
                    className="input-field pl-9 w-48 text-sm"
                  />
                </div>
                <div className="relative">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="input-field pr-8 appearance-none text-sm py-2"
                  >
                    <option value="all">全部</option>
                    <option value="normal">正常评价</option>
                    <option value="need_respray">需补喷</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Filter className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="divide-y divide-gray-50">
              {filteredEvaluations.map((evaluation) => (
                <div key={evaluation.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium text-gray-800">{evaluation.farmland_name}</h4>
                        <span className="text-sm text-gray-500">农户: {evaluation.farmer_name}</span>
                        <span className="text-sm text-gray-400">{evaluation.evaluation_date}</span>
                      </div>
                      <div className="flex items-center gap-3 mb-2">
                        {renderStars(evaluation.rating)}
                        {evaluation.needs_respray && (
                          <span className="badge badge-warning flex items-center gap-1">
                            <RefreshCw className="w-3 h-3" />
                            申请补喷
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm">{evaluation.comment}</p>
                      {evaluation.needs_respray && evaluation.respray_reason && (
                        <div className="mt-2 p-3 bg-orange-50 rounded-lg">
                          <p className="text-sm text-orange-700">
                            <span className="font-medium">补喷原因：</span>
                            {evaluation.respray_reason}
                          </p>
                          {evaluation.respray_status && (
                            <p className="text-xs mt-1">
                              处理状态: 
                              <span className={`ml-1 ${
                                evaluation.respray_status === 'approved' ? 'text-green-600' :
                                evaluation.respray_status === 'rejected' ? 'text-red-600' :
                                'text-orange-600'
                              }`}>
                                {evaluation.respray_status === 'approved' ? '已批准' :
                                 evaluation.respray_status === 'rejected' ? '已驳回' : '待处理'}
                              </span>
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => setSelectedEvaluation(evaluation)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      {evaluation.needs_respray && evaluation.respray_status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleResprayAction(evaluation, 'approve')}
                            className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                          >
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </button>
                          <button
                            onClick={() => handleResprayAction(evaluation, 'reject')}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <XCircle className="w-4 h-4 text-red-600" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4">评分分布</h3>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = mockEvaluations.filter((e) => e.rating === star).length;
                const percent = (count / mockEvaluations.length) * 100;
                return (
                  <div key={star} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-16">
                      <span className="text-sm font-medium text-gray-700">{star}</span>
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    </div>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 rounded-full transition-all"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-500 w-8 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-orange-500" />
              待处理补喷
            </h3>
            <div className="space-y-3">
              {mockEvaluations
                .filter((e) => e.needs_respray && e.respray_status === 'pending')
                .map((evaluation) => (
                  <div key={evaluation.id} className="p-3 bg-orange-50 rounded-xl border border-orange-100">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-gray-800 text-sm">{evaluation.farmland_name}</p>
                      <span className="text-xs text-gray-500">{evaluation.evaluation_date}</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{evaluation.respray_reason}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleResprayAction(evaluation, 'approve')}
                        className="flex-1 py-1.5 bg-green-500 text-white rounded-lg text-xs font-medium hover:bg-green-600 transition-colors"
                      >
                        批准补喷
                      </button>
                      <button
                        onClick={() => handleResprayAction(evaluation, 'reject')}
                        className="flex-1 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-300 transition-colors"
                      >
                        驳回
                      </button>
                    </div>
                  </div>
                ))}
              {mockEvaluations.filter((e) => e.needs_respray && e.respray_status === 'pending').length === 0 && (
                <p className="text-center text-gray-400 py-4 text-sm">暂无待处理补喷申请</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4">季节服务统计</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={mockSeasonStats.slice(0, 6)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 10 }} stroke="#9ca3af" />
                <Tooltip />
                <Bar dataKey="operations" name="作业次数" fill="#2E7D32" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500">总作业次数</p>
                <p className="text-lg font-bold text-gray-800">
                  {mockSeasonStats.reduce((sum, s) => sum + s.operations, 0)}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500">总作业面积</p>
                <p className="text-lg font-bold text-gray-800">
                  {(mockSeasonStats.reduce((sum, s) => sum + s.area, 0) / 1000).toFixed(1)}k亩
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedEvaluation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg animate-slide-up">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-800">评价详情</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{selectedEvaluation.farmer_name}</p>
                    <p className="text-sm text-gray-500">{selectedEvaluation.evaluation_date}</p>
                  </div>
                </div>
                {renderStars(selectedEvaluation.rating)}
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="font-medium text-gray-800">{selectedEvaluation.farmland_name}</span>
                </div>
                <p className="text-gray-600">{selectedEvaluation.comment}</p>
              </div>

              {selectedEvaluation.needs_respray && (
                <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                    <span className="font-medium text-orange-700">申请补喷</span>
                  </div>
                  <p className="text-gray-700">{selectedEvaluation.respray_reason}</p>
                  {selectedEvaluation.respray_status && (
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-sm text-gray-600">处理状态:</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        selectedEvaluation.respray_status === 'approved' ? 'bg-green-100 text-green-700' :
                        selectedEvaluation.respray_status === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {selectedEvaluation.respray_status === 'approved' ? '已批准' :
                         selectedEvaluation.respray_status === 'rejected' ? '已驳回' : '待处理'}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {selectedEvaluation.farmer_signature && (
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-gray-500">农户签字</span>
                  <span className="font-medium text-gray-800">{selectedEvaluation.farmer_signature}</span>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setSelectedEvaluation(null)}
                className="btn-primary px-5 py-2.5"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {showResprayModal && selectedEvaluation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md animate-slide-up">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-800">处理补喷申请</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="font-medium text-gray-800">{selectedEvaluation.farmland_name}</p>
                <p className="text-sm text-gray-500 mt-1">农户: {selectedEvaluation.farmer_name}</p>
                <p className="text-sm text-gray-600 mt-2">{selectedEvaluation.respray_reason}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">处理备注</label>
                <textarea
                  rows={3}
                  placeholder="请输入处理意见..."
                  className="input-field resize-none"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setShowResprayModal(false)}
                className="px-5 py-2.5 border border-gray-200 rounded-lg font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => setShowResprayModal(false)}
                className="btn-primary px-5 py-2.5"
              >
                确认处理
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
