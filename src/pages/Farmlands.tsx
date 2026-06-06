import { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  MapPin,
  Sprout,
  Calendar,
  Phone,
  Edit,
  Eye,
  Trash2,
  ChevronDown,
  Bug,
  Leaf,
  TrendingUp,
} from 'lucide-react';
import { mockCropCycles, mockPestRecords } from '@/data/mockData';
import { useAppStore } from '@/store/useAppStore';
import type { Farmland } from '@/data/types';

export default function Farmlands() {
  const { farmlands } = useAppStore();
  const [selectedFarmland, setSelectedFarmland] = useState<Farmland | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'info' | 'crop' | 'pest'>('info');

  const filteredFarmlands = farmlands.filter(
    (f) =>
      f.name.includes(searchTerm) ||
      f.location.includes(searchTerm) ||
      f.owner.includes(searchTerm)
  );

  const farmlandCropCycles = selectedFarmland
    ? mockCropCycles.filter((c) => c.farmland_id === selectedFarmland.id)
    : [];

  const farmlandPestRecords = selectedFarmland
    ? mockPestRecords.filter((p) => p.farmland_id === selectedFarmland.id)
    : [];

  const cropStageColors: Record<string, string> = {
    播种: 'bg-blue-100 text-blue-700',
    出苗: 'bg-green-100 text-green-700',
    分蘖: 'bg-yellow-100 text-yellow-700',
    拔节: 'bg-orange-100 text-orange-700',
    抽穗: 'bg-purple-100 text-purple-700',
    成熟: 'bg-red-100 text-red-700',
  };

  const severityColors: Record<string, string> = {
    low: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-red-100 text-red-700',
  };

  const severityLabels: Record<string, string> = {
    low: '轻度',
    medium: '中度',
    high: '重度',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">农田档案</h1>
          <p className="text-gray-500 mt-1">管理所有农田地块信息和作物生长记录</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          新增地块
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="搜索地块..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-9 text-sm"
                />
              </div>
              <button className="p-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="space-y-2 max-h-[calc(100vh-320px)] overflow-y-auto">
              {filteredFarmlands.map((farmland) => (
                <div
                  key={farmland.id}
                  onClick={() => setSelectedFarmland(farmland)}
                  className={`p-4 rounded-xl cursor-pointer transition-all ${
                    selectedFarmland?.id === farmland.id
                      ? 'bg-primary-50 border-2 border-primary-500'
                      : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-800">{farmland.name}</h4>
                      <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {farmland.location.slice(0, 15)}...
                      </p>
                    </div>
                    <span className="px-2.5 py-1 bg-primary-100 text-primary-700 rounded-lg text-xs font-medium">
                      {farmland.crop_type}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Sprout className="w-4 h-4" />
                      {farmland.measured_area ? (
                        <>
                          <span className="text-green-600 font-medium">{farmland.measured_area}亩</span>
                          <span className="text-gray-400 text-xs">(档案{farmland.area_mu}亩)</span>
                        </>
                      ) : (
                        <>{farmland.area_mu}亩</>
                      )}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {farmland.created_at}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedFarmland ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">{selectedFarmland.name}</h2>
                    <p className="text-gray-500 mt-1 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {selectedFarmland.location}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Eye className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Edit className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-5 h-5 text-red-500" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mt-6">
                  <div className="bg-green-50 rounded-xl p-4 text-center">
                    <Sprout className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">实测面积</p>
                    <p className={`text-xl font-bold ${selectedFarmland.measured_area ? 'text-green-600' : 'text-gray-400'}`}>
                      {selectedFarmland.measured_area || '-'}
                      <span className="text-sm font-normal">{selectedFarmland.measured_area ? '亩' : ''}</span>
                    </p>
                    {selectedFarmland.last_measured_at && (
                      <p className="text-xs text-gray-400 mt-1">{selectedFarmland.last_measured_at.slice(0, 10)}</p>
                    )}
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4 text-center">
                    <Leaf className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">作物</p>
                    <p className="text-xl font-bold text-gray-800">{selectedFarmland.crop_type}</p>
                  </div>
                  <div className="bg-yellow-50 rounded-xl p-4 text-center">
                    <Calendar className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">建档时间</p>
                    <p className="text-lg font-bold text-gray-800">{selectedFarmland.created_at}</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4 text-center">
                    <TrendingUp className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">作业次数</p>
                    <p className="text-xl font-bold text-gray-800">3<span className="text-sm font-normal">次</span></p>
                  </div>
                </div>
              </div>

              <div className="border-b border-gray-100">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab('info')}
                    className={`px-6 py-4 text-sm font-medium transition-colors relative ${
                      activeTab === 'info' ? 'text-primary-600' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    基本信息
                    {activeTab === 'info' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"></div>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('crop')}
                    className={`px-6 py-4 text-sm font-medium transition-colors relative ${
                      activeTab === 'crop' ? 'text-primary-600' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    作物周期
                    {activeTab === 'crop' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"></div>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('pest')}
                    className={`px-6 py-4 text-sm font-medium transition-colors relative ${
                      activeTab === 'pest' ? 'text-primary-600' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    病虫害记录
                    {activeTab === 'pest' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"></div>
                    )}
                  </button>
                </div>
              </div>

              <div className="p-6">
                {activeTab === 'info' && (
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-primary-600" />
                        地块信息
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between py-2 border-b border-gray-50">
                          <span className="text-gray-500">地块名称</span>
                          <span className="font-medium text-gray-800">{selectedFarmland.name}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-50">
                          <span className="text-gray-500">详细地址</span>
                          <span className="font-medium text-gray-800">{selectedFarmland.location}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-50">
                          <span className="text-gray-500">土壤类型</span>
                          <span className="font-medium text-gray-800">{selectedFarmland.soil_type || '壤土'}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-50">
                          <span className="text-gray-500">灌溉方式</span>
                          <span className="font-medium text-gray-800">{selectedFarmland.irrigation || '喷灌'}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-50">
                          <span className="text-gray-500">档案面积</span>
                          <span className="font-medium text-gray-800">{selectedFarmland.area_mu}亩</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-gray-500">实测面积</span>
                          <span className={`font-medium ${selectedFarmland.measured_area ? 'text-green-600' : 'text-gray-400'}`}>
                            {selectedFarmland.measured_area ? `${selectedFarmland.measured_area}亩` : '未测绘'}
                            {selectedFarmland.measured_area && selectedFarmland.measured_area !== selectedFarmland.area_mu && (
                              <span className="ml-1 text-xs text-gray-400">
                                ({selectedFarmland.measured_area > selectedFarmland.area_mu ? '+' : ''}
                                {(selectedFarmland.measured_area - selectedFarmland.area_mu).toFixed(1)}亩)
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                        <Phone className="w-5 h-5 text-primary-600" />
                        负责人信息
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between py-2 border-b border-gray-50">
                          <span className="text-gray-500">姓名</span>
                          <span className="font-medium text-gray-800">{selectedFarmland.owner}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-50">
                          <span className="text-gray-500">联系电话</span>
                          <span className="font-medium text-gray-800">{selectedFarmland.owner_phone}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-50">
                          <span className="text-gray-500">作物类型</span>
                          <span className="font-medium text-gray-800">{selectedFarmland.crop_type}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-50">
                          <span className="text-gray-500">建档日期</span>
                          <span className="font-medium text-gray-800">{selectedFarmland.created_at}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'crop' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-800">作物生长周期记录</h4>
                      <button className="btn-secondary text-sm py-1.5 px-3 flex items-center gap-1">
                        <Plus className="w-4 h-4" /> 新增记录
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                      <div className="space-y-4">
                        {farmlandCropCycles.map((cycle) => (
                          <div key={cycle.id} className="relative pl-10">
                            <div className={`absolute left-2 w-5 h-5 rounded-full border-4 border-white shadow-sm ${
                              cropStageColors[cycle.stage]?.split(' ')[0] || 'bg-gray-200'
                            }`}></div>
                            <div className="bg-gray-50 rounded-xl p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${cropStageColors[cycle.stage] || 'bg-gray-100 text-gray-700'}`}>
                                    {cycle.stage}
                                  </span>
                                  <span className="text-sm text-gray-500">{cycle.date}</span>
                                </div>
                                <button className="text-gray-400 hover:text-gray-600">
                                  <ChevronDown className="w-5 h-5" />
                                </button>
                              </div>
                              <p className="text-sm text-gray-600 mt-2">{cycle.notes}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'pest' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-800">病虫害防治记录</h4>
                      <button className="btn-secondary text-sm py-1.5 px-3 flex items-center gap-1">
                        <Plus className="w-4 h-4" /> 新增记录
                      </button>
                    </div>
                    <div className="space-y-3">
                      {farmlandPestRecords.map((record) => (
                        <div key={record.id} className="bg-gray-50 rounded-xl p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                <Bug className="w-5 h-5 text-red-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-800">{record.pest_type}</p>
                                <p className="text-sm text-gray-500">{record.date}</p>
                              </div>
                            </div>
                            <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${severityColors[record.severity]}`}>
                              {severityLabels[record.severity]}
                            </span>
                          </div>
                          <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">防治措施：</span>
                              <span className="text-gray-800">{record.treatment}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">防治效果：</span>
                              <span className="text-gray-800">{record.effect}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                      {farmlandPestRecords.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                          <Bug className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                          <p>暂无病虫害记录</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-16 text-center">
              <Sprout className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">选择一个地块查看详情</h3>
              <p className="text-gray-400">在左侧列表中选择地块，或点击新增地块创建新档案</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
