import { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Beaker,
  AlertTriangle,
  Package,
  DollarSign,
  Calendar,
  Edit,
  Eye,
  Trash2,
  ChevronDown,
  Droplets,
  Pill,
} from 'lucide-react';
import { mockPesticides, pesticideTypeLabels } from '@/data/mockData';
import type { Pesticide } from '@/data/types';

export default function Pesticides() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedPesticide, setSelectedPesticide] = useState<Pesticide | null>(null);
  const [showUsageModal, setShowUsageModal] = useState(false);

  const filteredPesticides = mockPesticides.filter((p) => {
    const matchSearch = p.name.includes(searchTerm) || p.manufacturer?.includes(searchTerm);
    const matchType = typeFilter === 'all' || p.type === typeFilter;
    return matchSearch && matchType;
  });

  const lowStockPesticides = mockPesticides.filter((p) => p.stock_kg < 100);
  const expiringPesticides = mockPesticides.filter((p) => {
    const expiryDate = new Date(p.expiry_date);
    const now = new Date();
    const diffMonths = (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30);
    return diffMonths < 6;
  });

  const typeIcons: Record<string, typeof Beaker> = {
    insecticide: Pill,
    fungicide: Beaker,
    herbicide: Droplets,
    fertilizer: Package,
    other: Beaker,
  };

  const typeColors: Record<string, string> = {
    insecticide: 'from-red-500 to-red-600',
    fungicide: 'from-blue-500 to-blue-600',
    herbicide: 'from-green-500 to-green-600',
    fertilizer: 'from-yellow-500 to-yellow-600',
    other: 'from-gray-500 to-gray-600',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">药剂管理</h1>
          <p className="text-gray-500 mt-1">管理药剂库存，制定配比方案，登记使用记录</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          新增药剂
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-xl">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">库存品种</p>
              <p className="text-2xl font-bold text-gray-800">{mockPesticides.length}</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-100 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">库存预警</p>
              <p className="text-2xl font-bold text-yellow-600">{lowStockPesticides.length}</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 rounded-xl">
              <Calendar className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">临期品种</p>
              <p className="text-2xl font-bold text-red-600">{expiringPesticides.length}</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-xl">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">库存总值</p>
              <p className="text-2xl font-bold text-gray-800">
                ¥{mockPesticides.reduce((sum, p) => sum + p.stock_kg * p.unit_price, 0).toFixed(0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="搜索药剂..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-field pl-9 w-56 text-sm"
                  />
                </div>
                <div className="relative">
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="input-field pr-8 appearance-none text-sm"
                  >
                    <option value="all">全部类型</option>
                    <option value="insecticide">杀虫剂</option>
                    <option value="fungicide">杀菌剂</option>
                    <option value="herbicide">除草剂</option>
                    <option value="fertilizer">叶面肥</option>
                    <option value="other">其他</option>
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
                    <th className="table-header">药剂名称</th>
                    <th className="table-header">类型</th>
                    <th className="table-header">库存</th>
                    <th className="table-header">单价</th>
                    <th className="table-header">有效期</th>
                    <th className="table-header">状态</th>
                    <th className="table-header">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPesticides.map((pesticide) => {
                    const isLowStock = pesticide.stock_kg < 100;
                    const isExpiring = new Date(pesticide.expiry_date) < new Date(new Date().setMonth(new Date().getMonth() + 6));
                    const Icon = typeIcons[pesticide.type];

                    return (
                      <tr
                        key={pesticide.id}
                        onClick={() => setSelectedPesticide(pesticide)}
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <td className="table-cell">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${typeColors[pesticide.type]} flex items-center justify-center`}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{pesticide.name}</p>
                              <p className="text-xs text-gray-400">{pesticide.manufacturer}</p>
                            </div>
                          </div>
                        </td>
                        <td className="table-cell">
                          <span className="text-gray-700">{pesticideTypeLabels[pesticide.type]}</span>
                        </td>
                        <td className="table-cell">
                          <div>
                            <p className={`font-medium ${isLowStock ? 'text-red-600' : 'text-gray-800'}`}>
                              {pesticide.stock_kg} {pesticide.unit === 'g/亩' ? 'kg' : 'L'}
                            </p>
                            {isLowStock && (
                              <p className="text-xs text-red-500 flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" /> 库存不足
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="table-cell">
                          <span className="font-medium text-gray-800">¥{pesticide.unit_price}/{pesticide.unit === 'g/亩' ? 'kg' : 'L'}</span>
                        </td>
                        <td className="table-cell">
                          <div>
                            <p className="text-gray-700">{pesticide.expiry_date}</p>
                            {isExpiring && (
                              <p className="text-xs text-orange-500">即将到期</p>
                            )}
                          </div>
                        </td>
                        <td className="table-cell">
                          <span className={`badge ${isLowStock || isExpiring ? 'badge-warning' : 'badge-success'}`}>
                            {isLowStock ? '库存低' : isExpiring ? '临期' : '正常'}
                          </span>
                        </td>
                        <td className="table-cell">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPesticide(pesticide);
                              }}
                              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <Eye className="w-4 h-4 text-gray-600" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowUsageModal(true);
                              }}
                              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <Edit className="w-4 h-4 text-gray-600" />
                            </button>
                            <button
                              onClick={(e) => e.stopPropagation()}
                              className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4">药剂详情</h3>
            {selectedPesticide ? (
              <div className="space-y-4">
                <div className="text-center pb-4 border-b border-gray-100">
                  <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${typeColors[selectedPesticide.type]} flex items-center justify-center mb-3`}>
                    {(() => {
                      const Icon = typeIcons[selectedPesticide.type];
                      return <Icon className="w-8 h-8 text-white" />;
                    })()}
                  </div>
                  <h4 className="text-lg font-bold text-gray-800">{selectedPesticide.name}</h4>
                  <p className="text-sm text-gray-500">{pesticideTypeLabels[selectedPesticide.type]}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-gray-500">当前库存</span>
                    <span className="font-medium text-gray-800">
                      {selectedPesticide.stock_kg} {selectedPesticide.unit === 'g/亩' ? 'kg' : 'L'}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-gray-500">建议用量</span>
                    <span className="font-medium text-gray-800">{selectedPesticide.dosage} {selectedPesticide.unit}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-gray-500">安全间隔期</span>
                    <span className="font-medium text-gray-800">{selectedPesticide.safety_period}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-gray-500">有效期至</span>
                    <span className="font-medium text-gray-800">{selectedPesticide.expiry_date}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-500">生产厂家</span>
                    <span className="font-medium text-gray-800">{selectedPesticide.manufacturer}</span>
                  </div>
                </div>

                <button onClick={() => setShowUsageModal(true)} className="w-full btn-primary">
                  登记使用
                </button>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Beaker className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>选择药剂查看详情</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              库存预警
            </h3>
            <div className="space-y-3">
              {lowStockPesticides.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{p.name}</p>
                    <p className="text-xs text-yellow-600">仅剩 {p.stock_kg} {p.unit === 'g/亩' ? 'kg' : 'L'}</p>
                  </div>
                  <button className="text-xs px-2 py-1 bg-yellow-500 text-white rounded-lg font-medium">
                    补货
                  </button>
                </div>
              ))}
              {lowStockPesticides.length === 0 && (
                <p className="text-center text-gray-400 py-4 text-sm">暂无库存预警</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {showUsageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md animate-slide-up">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-800">登记药剂使用</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">选择药剂</label>
                <select className="input-field">
                  {mockPesticides.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} (库存: {p.stock_kg} {p.unit === 'g/亩' ? 'kg' : 'L'})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">使用数量</label>
                <input type="number" placeholder="请输入使用数量" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">关联作业</label>
                <input type="text" placeholder="选择作业单" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">备注</label>
                <textarea rows={2} placeholder="填写备注信息..." className="input-field resize-none" />
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setShowUsageModal(false)}
                className="px-5 py-2.5 border border-gray-200 rounded-lg font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button onClick={() => setShowUsageModal(false)} className="btn-primary px-5 py-2.5">
                确认登记
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
