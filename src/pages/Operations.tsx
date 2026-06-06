import { useState } from 'react';
import {
  Upload,
  Camera,
  MapPin,
  Clock,
  Plane,
  User,
  CheckCircle,
  AlertCircle,
  Image,
  Video,
  Ruler,
  Eye,
  ChevronDown,
  Search,
} from 'lucide-react';
import { mockOperations, mockOperationPhotos } from '@/data/mockData';
import type { Operation } from '@/data/types';

export default function Operations() {
  const [selectedOperation, setSelectedOperation] = useState<Operation | null>(
    mockOperations.find((o) => o.status === 'in_progress') || null
  );
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);

  const filteredOperations = mockOperations.filter(
    (op) => statusFilter === 'all' || op.status === statusFilter
  );

  const operationPhotos = selectedOperation
    ? mockOperationPhotos.filter((p) => p.operation_id === selectedOperation.id)
    : [];

  const inProgressOperations = mockOperations.filter((o) => o.status === 'in_progress');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">作业回传</h1>
          <p className="text-gray-500 mt-1">实时监控作业进度，回传作业数据和照片</p>
        </div>
        <button onClick={() => setShowUploadModal(true)} className="btn-primary flex items-center gap-2">
          <Upload className="w-5 h-5" />
          上传作业数据
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Plane className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">今日作业</p>
              <p className="text-2xl font-bold text-gray-800">{mockOperations.length}</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">已完成</p>
              <p className="text-2xl font-bold text-gray-800">
                {mockOperations.filter((o) => o.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-100 rounded-xl">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">进行中</p>
              <p className="text-2xl font-bold text-orange-600">
                {inProgressOperations.length}
              </p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Ruler className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">今日作业面积</p>
              <p className="text-2xl font-bold text-gray-800">
                {mockOperations.reduce((sum, o) => sum + (o.actual_area || 0), 0).toFixed(1)}
                <span className="text-sm font-normal">亩</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">作业列表</h3>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="input-field pr-8 appearance-none text-sm py-1.5"
                >
                  <option value="all">全部</option>
                  <option value="in_progress">进行中</option>
                  <option value="completed">已完成</option>
                  <option value="paused">已暂停</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {filteredOperations.map((op) => (
                <div
                  key={op.id}
                  onClick={() => setSelectedOperation(op)}
                  className={`p-4 rounded-xl cursor-pointer transition-all ${
                    selectedOperation?.id === op.id
                      ? 'bg-primary-50 border-2 border-primary-500'
                      : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-gray-800">{op.farmland_name}</h4>
                      <p className="text-sm text-gray-500 mt-1">
                        {op.pilot_name} · {op.drone_name}
                      </p>
                    </div>
                    <span className={`badge ${
                      op.status === 'in_progress' ? 'badge-success animate-pulse' :
                      op.status === 'completed' ? 'badge-info' : 'badge-warning'
                    }`}>
                      {op.status === 'in_progress' ? '作业中' :
                       op.status === 'completed' ? '已完成' : '已暂停'}
                    </span>
                  </div>
                  {op.status === 'in_progress' && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-500">进度</span>
                        <span className="font-medium text-primary-600">{op.progress}%</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${op.progress}%` }}></div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span>{op.operation_date}</span>
                    <span>{op.actual_area > 0 ? `${op.actual_area}亩` : '测算中'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          {selectedOperation ? (
            <>
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {selectedOperation.farmland_name}
                    </h3>
                    <p className="text-gray-500 mt-1">
                      飞手: {selectedOperation.pilot_name} · 无人机: {selectedOperation.drone_name}
                    </p>
                  </div>
                  <span className={`badge ${
                    selectedOperation.status === 'in_progress' ? 'badge-success animate-pulse' :
                    selectedOperation.status === 'completed' ? 'badge-info' : 'badge-warning'
                  }`}>
                    {selectedOperation.status === 'in_progress' ? '作业进行中' :
                     selectedOperation.status === 'completed' ? '作业已完成' : '作业暂停'}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-xl p-4 text-center">
                    <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">开始时间</p>
                    <p className="font-bold text-gray-800">{selectedOperation.start_time}</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4 text-center">
                    <Ruler className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">已完成面积</p>
                    <p className="font-bold text-gray-800">
                      {selectedOperation.actual_area > 0
                        ? `${selectedOperation.actual_area}亩`
                        : `${(selectedOperation.progress * 0.85).toFixed(1)}亩`}
                    </p>
                  </div>
                  <div className="bg-yellow-50 rounded-xl p-4 text-center">
                    <Plane className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">作业进度</p>
                    <p className="font-bold text-gray-800">{selectedOperation.progress}%</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4 text-center">
                    <Clock className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">预计剩余</p>
                    <p className="font-bold text-gray-800">
                      {Math.round((100 - selectedOperation.progress) * 1.2)}分钟
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">作业进度</span>
                    <span className="text-sm font-bold text-primary-600">
                      {selectedOperation.progress}%
                    </span>
                  </div>
                  <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-1000"
                      style={{ width: `${selectedOperation.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-medium text-gray-800 mb-3">使用药剂</h4>
                  <div className="space-y-2">
                    {selectedOperation.pesticide_used.map((item, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                        <span className="text-gray-700">{item.name}</span>
                        <span className="font-medium text-gray-800">
                          {item.quantity} {item.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800">作业照片</h3>
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="btn-secondary text-sm py-1.5 px-3 flex items-center gap-1"
                  >
                    <Camera className="w-4 h-4" />
                    上传照片
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  {operationPhotos.map((photo) => (
                    <div key={photo.id} className="relative group">
                      <div
                        className="aspect-square rounded-xl bg-cover bg-center"
                        style={{
                          backgroundImage: photo.type === 'before'
                            ? 'url(https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&h=300&fit=crop)'
                            : photo.type === 'during'
                            ? 'url(https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=300&h=300&fit=crop)'
                            : 'url(https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=300&h=300&fit=crop)',
                        }}
                      >
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all rounded-xl flex items-center justify-center">
                          <Eye className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                      <span className={`absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-medium ${
                        photo.type === 'before' ? 'bg-blue-500 text-white' :
                        photo.type === 'during' ? 'bg-yellow-500 text-white' :
                        'bg-green-500 text-white'
                      }`}>
                        {photo.type === 'before' ? '作业前' : photo.type === 'during' ? '作业中' : '作业后'}
                      </span>
                      <p className="text-xs text-gray-500 mt-1 truncate">{photo.description}</p>
                    </div>
                  ))}
                  <div
                    onClick={() => setShowUploadModal(true)}
                    className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-all"
                  >
                    <Camera className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-xs text-gray-500">添加照片</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800">面积复核</h3>
                  <button className="btn-primary text-sm py-1.5 px-3">确认面积</button>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-sm text-gray-500">预约面积</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">
                      {selectedOperation.actual_area > 0 ? selectedOperation.actual_area : 86.2}亩
                    </p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4 text-center">
                    <p className="text-sm text-gray-500">实测面积</p>
                    <p className="text-2xl font-bold text-blue-600 mt-1">
                      {selectedOperation.actual_area > 0 ? selectedOperation.actual_area + 1.3 : 87.5}亩
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4 text-center">
                    <p className="text-sm text-gray-500">差异</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">+1.5%</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-xl p-16 shadow-sm border border-gray-100 text-center">
              <Plane className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">选择作业查看详情</h3>
              <p className="text-gray-400">在左侧列表中选择一个作业任务</p>
            </div>
          )}
        </div>
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg animate-slide-up">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-800">上传作业数据</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">作业类型</label>
                <select className="input-field">
                  <option>选择作业</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">上传照片/视频</label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-primary-400 hover:bg-primary-50 transition-all cursor-pointer">
                  <Image className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">点击或拖拽上传文件</p>
                  <p className="text-sm text-gray-400 mt-1">支持 JPG、PNG、MP4 格式</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="flex-1 py-2.5 border border-gray-200 rounded-lg text-gray-600 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                  <Image className="w-5 h-5" />
                  上传照片
                </button>
                <button className="flex-1 py-2.5 border border-gray-200 rounded-lg text-gray-600 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                  <Video className="w-5 h-5" />
                  上传视频
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">备注</label>
                <textarea rows={2} placeholder="填写作业情况说明..." className="input-field resize-none" />
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-5 py-2.5 border border-gray-200 rounded-lg font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button onClick={() => setShowUploadModal(false)} className="btn-primary px-5 py-2.5">
                提交
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
