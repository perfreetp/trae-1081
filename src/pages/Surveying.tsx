import { useState } from 'react';
import {
  Map,
  PenTool,
  Trash2,
  Save,
  Layers,
  Ruler,
  CheckCircle,
  Clock,
  Plus,
  Eye,
  Edit,
} from 'lucide-react';
import { mockSurveys } from '@/data/mockData';
import type { Survey } from '@/data/types';

export default function Surveying() {
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [mapType, setMapType] = useState<'satellite' | 'standard'>('satellite');
  const [drawnArea, setDrawnArea] = useState<number>(0);

  const pendingSurveys = mockSurveys.filter((s) => s.status === 'pending');
  const completedSurveys = mockSurveys.filter((s) => s.status === 'completed');

  const handleStartDrawing = () => {
    setIsDrawing(true);
    setDrawnArea(0);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">地块测绘</h1>
          <p className="text-gray-500 mt-1">精确测绘地块边界，自动计算作业面积</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          新建测绘任务
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-100 rounded-xl">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">待测绘</p>
              <p className="text-2xl font-bold text-gray-800">{pendingSurveys.length}</p>
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
              <p className="text-2xl font-bold text-gray-800">{completedSurveys.length}</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Ruler className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">本月测绘面积</p>
              <p className="text-2xl font-bold text-gray-800">
                {completedSurveys.reduce((sum, s) => sum + s.measured_area, 0).toFixed(1)}
                <span className="text-sm font-normal">亩</span>
              </p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Map className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">平均精度</p>
              <p className="text-2xl font-bold text-gray-800">98.5<span className="text-sm font-normal">%</span></p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4">测绘任务列表</h3>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {mockSurveys.map((survey) => (
                <div
                  key={survey.id}
                  onClick={() => setSelectedSurvey(survey)}
                  className={`p-4 rounded-xl cursor-pointer transition-all ${
                    selectedSurvey?.id === survey.id
                      ? 'bg-primary-50 border-2 border-primary-500'
                      : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-gray-800">{survey.farmland_name}</h4>
                      <p className="text-sm text-gray-500 mt-1">
                        {survey.status === 'completed' ? survey.survey_date : '待测绘'}
                      </p>
                    </div>
                    <span className={`badge ${survey.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                      {survey.status === 'completed' ? '已完成' : '待测绘'}
                    </span>
                  </div>
                  {survey.status === 'completed' && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-primary-600">
                      <Ruler className="w-4 h-4" />
                      <span>实测面积: {survey.measured_area}亩</span>
                    </div>
                  )}
                  {survey.surveyor && (
                    <p className="text-xs text-gray-400 mt-1">测绘员: {survey.surveyor}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold text-gray-800">
                  {selectedSurvey ? selectedSurvey.farmland_name : '地块测绘'}
                </h3>
                {drawnArea > 0 && (
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-lg text-sm font-medium">
                    已绘制: {drawnArea.toFixed(2)}亩
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setMapType('satellite')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      mapType === 'satellite'
                        ? 'bg-white shadow-sm text-gray-800'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    卫星图
                  </button>
                  <button
                    onClick={() => setMapType('standard')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      mapType === 'standard'
                        ? 'bg-white shadow-sm text-gray-800'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    标准图
                  </button>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Layers className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="relative" style={{ height: '480px' }}>
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: mapType === 'satellite'
                    ? 'url(https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&h=800&fit=crop)'
                    : 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
                }}
              >
                <div className="absolute inset-0 bg-black/5">
                  {selectedSurvey?.status === 'completed' && (
                    <svg className="absolute inset-0 w-full h-full">
                      <polygon
                        points="100,150 300,100 450,200 400,380 150,400 80,280"
                        fill="rgba(46, 125, 50, 0.2)"
                        stroke="#2E7D32"
                        strokeWidth="3"
                        strokeDasharray="10,5"
                      />
                      <text x="250" y="250" textAnchor="middle" className="fill-primary-700 font-semibold text-sm">
                        {selectedSurvey.measured_area} 亩
                      </text>
                    </svg>
                  )}
                  {isDrawing && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <PenTool className="w-12 h-12 text-primary-600 mx-auto mb-2 animate-pulse" />
                        <p className="text-primary-700 font-medium">点击地图开始绘制边界</p>
                        <p className="text-sm text-gray-500 mt-1">沿地块边缘依次点击，最后闭合多边形</p>
                      </div>
                    </div>
                  )}
                  {!selectedSurvey && !isDrawing && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <Map className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">选择测绘任务或开始新的测绘</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur rounded-xl p-3 shadow-lg">
                <p className="text-xs text-gray-500 mb-1">当前位置</p>
                <p className="text-sm font-medium text-gray-800">山东省潍坊市</p>
                <p className="text-xs text-gray-500 mt-1">北纬 36.88° 东经 118.72°</p>
              </div>

              <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                <button className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <span className="text-xl font-bold text-gray-600">+</span>
                </button>
                <button className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <span className="text-xl font-bold text-gray-600">−</span>
                </button>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleStartDrawing}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    isDrawing
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'bg-primary-50 text-primary-600 hover:bg-primary-100'
                  }`}
                >
                  <PenTool className="w-5 h-5" />
                  {isDrawing ? '绘制中...' : '开始绘制'}
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                  <Edit className="w-5 h-5" />
                  编辑边界
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
                  <Trash2 className="w-5 h-5" />
                  清除
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 font-medium hover:bg-gray-50 transition-colors">
                  取消
                </button>
                <button className="btn-primary flex items-center gap-2">
                  <Save className="w-5 h-5" />
                  保存测绘结果
                </button>
              </div>
            </div>
          </div>

          {selectedSurvey?.status === 'completed' && (
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mt-4">
              <h3 className="font-semibold text-gray-800 mb-4">测绘详情</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">地块名称</p>
                  <p className="font-medium text-gray-800 mt-1">{selectedSurvey.farmland_name}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">实测面积</p>
                  <p className="font-medium text-primary-600 mt-1 text-lg">{selectedSurvey.measured_area} 亩</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">测绘日期</p>
                  <p className="font-medium text-gray-800 mt-1">{selectedSurvey.survey_date}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">测绘员</p>
                  <p className="font-medium text-gray-800 mt-1">{selectedSurvey.surveyor}</p>
                </div>
              </div>
              {selectedSurvey.terrain_notes && (
                <div className="mt-4 bg-yellow-50 rounded-xl p-4">
                  <p className="text-sm text-yellow-700 font-medium">地形备注</p>
                  <p className="text-gray-700 mt-1">{selectedSurvey.terrain_notes}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
