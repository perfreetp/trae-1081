import { useState, useRef, useEffect } from 'react';
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
  Undo2,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import type { Survey } from '@/data/types';

interface Point {
  x: number;
  y: number;
}

export default function Surveying() {
  const { surveys, updateSurvey } = useAppStore();
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [mapType, setMapType] = useState<'satellite' | 'standard'>('satellite');
  const [points, setPoints] = useState<Point[]>([]);
  const [drawnArea, setDrawnArea] = useState<number>(0);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const pendingSurveys = surveys.filter((s) => s.status === 'pending');
  const completedSurveys = surveys.filter((s) => s.status === 'completed');

  const calculatePolygonArea = (pts: Point[]): number => {
    if (pts.length < 3) return 0;
    let area = 0;
    for (let i = 0; i < pts.length; i++) {
      const j = (i + 1) % pts.length;
      area += pts[i].x * pts[j].y;
      area -= pts[j].x * pts[i].y;
    }
    area = Math.abs(area) / 2;
    const pixelToMu = 0.0008;
    return area * pixelToMu;
  };

  useEffect(() => {
    const area = calculatePolygonArea(points);
    setDrawnArea(area);
  }, [points]);

  useEffect(() => {
    if (selectedSurvey && selectedSurvey.status === 'completed' && points.length === 0) {
      const savedPoints = selectedSurvey.boundary_coords;
      if (savedPoints) {
        try {
          const parsed = JSON.parse(savedPoints) as Point[];
          setPoints(parsed);
          setDrawnArea(selectedSurvey.measured_area);
        } catch (e) {
          console.error('解析边界坐标失败');
        }
      }
    }
  }, [selectedSurvey]);

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawing || !mapContainerRef.current) return;
    const rect = mapContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPoints([...points, { x, y }]);
  };

  const handleStartDrawing = () => {
    setIsDrawing(true);
    setPoints([]);
    setDrawnArea(0);
  };

  const handleClear = () => {
    setPoints([]);
    setDrawnArea(0);
    setIsDrawing(false);
  };

  const handleUndo = () => {
    if (points.length > 0) {
      setPoints(points.slice(0, -1));
    }
  };

  const handleSave = () => {
    if (!selectedSurvey || points.length < 3) {
      alert('请至少绘制3个点形成闭合区域');
      return;
    }
    const updatedSurvey: Survey = {
      ...selectedSurvey,
      status: 'completed',
      measured_area: parseFloat(drawnArea.toFixed(2)),
      survey_date: new Date().toISOString().split('T')[0],
      surveyor: '当前用户',
      boundary_coords: JSON.stringify(points),
    };
    updateSurvey(updatedSurvey);
    setSelectedSurvey(updatedSurvey);
    setIsDrawing(false);
    alert('测绘结果保存成功！');
  };

  const getPolygonPoints = () => {
    return points.map((p) => `${p.x},${p.y}`).join(' ');
  };

  const getPolygonCenter = () => {
    if (points.length < 3) return { x: 0, y: 0 };
    const x = points.reduce((sum, p) => sum + p.x, 0) / points.length;
    const y = points.reduce((sum, p) => sum + p.y, 0) / points.length;
    return { x, y };
  };

  const center = getPolygonCenter();

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
              {surveys.map((survey) => (
                <div
                  key={survey.id}
                  onClick={() => {
                    setSelectedSurvey(survey);
                    setPoints([]);
                    setDrawnArea(0);
                    setIsDrawing(false);
                  }}
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
                {isDrawing && (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-medium animate-pulse">
                    点击地图添加边界点 ({points.length}个点)
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

            <div
              ref={mapContainerRef}
              className="relative cursor-crosshair select-none"
              style={{ height: '480px' }}
              onClick={handleMapClick}
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: mapType === 'satellite'
                    ? 'url(https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&h=800&fit=crop)'
                    : 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
                }}
              >
                <svg className="absolute inset-0 w-full h-full">
                  {points.length > 1 && (
                    <polyline
                      points={getPolygonPoints()}
                      fill="none"
                      stroke="#2E7D32"
                      strokeWidth="2"
                      strokeDasharray="8,4"
                    />
                  )}
                  {points.length >= 3 && (
                    <polygon
                      points={getPolygonPoints()}
                      fill="rgba(46, 125, 50, 0.25)"
                      stroke="#2E7D32"
                      strokeWidth="3"
                    />
                  )}
                  {points.map((point, index) => (
                    <g key={index}>
                      <circle
                        cx={point.x}
                        cy={point.y}
                        r="7"
                        fill="#2E7D32"
                        stroke="white"
                        strokeWidth="2"
                      />
                      <text
                        x={point.x}
                        y={point.y - 12}
                        textAnchor="middle"
                        className="fill-white text-xs font-bold"
                        style={{ paintOrder: 'stroke', stroke: '#2E7D32', strokeWidth: 3 }}
                      >
                        {index + 1}
                      </text>
                    </g>
                  ))}
                  {points.length >= 3 && (
                    <text
                      x={center.x}
                      y={center.y}
                      textAnchor="middle"
                      className="fill-primary-700 font-bold text-sm"
                      style={{ paintOrder: 'stroke', stroke: 'white', strokeWidth: 4 }}
                    >
                      {drawnArea.toFixed(2)} 亩
                    </text>
                  )}
                </svg>

                {!selectedSurvey && !isDrawing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/60">
                    <div className="text-center">
                      <Map className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 font-medium">选择测绘任务或开始新的测绘</p>
                      <p className="text-sm text-gray-400 mt-1">在左侧列表中选择一个待测绘任务</p>
                    </div>
                  </div>
                )}

                {isDrawing && points.length === 0 && selectedSurvey && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center bg-white/90 backdrop-blur rounded-2xl p-6 shadow-xl">
                      <PenTool className="w-12 h-12 text-primary-600 mx-auto mb-3 animate-bounce" />
                      <p className="text-primary-700 font-semibold text-lg">开始绘制边界</p>
                      <p className="text-sm text-gray-600 mt-2">沿地块边缘依次点击添加顶点</p>
                      <p className="text-sm text-gray-500">至少需要3个点形成闭合区域</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur rounded-xl p-3 shadow-lg">
                <p className="text-xs text-gray-500 mb-1">当前位置</p>
                <p className="text-sm font-medium text-gray-800">山东省潍坊市</p>
                <p className="text-xs text-gray-500 mt-1">北纬 36.88° 东经 118.72°</p>
              </div>

              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <span className="text-xl font-bold text-gray-600">+</span>
                </button>
                <button className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <span className="text-xl font-bold text-gray-600">−</span>
                </button>
              </div>

              {isDrawing && points.length > 0 && (
                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur rounded-xl p-3 shadow-lg">
                  <p className="text-xs text-gray-500 mb-1">绘制提示</p>
                  <p className="text-sm text-gray-700">已添加 <span className="font-bold text-primary-600">{points.length}</span> 个顶点</p>
                  <p className="text-xs text-gray-500 mt-1">点击撤销可删除最后一个点</p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleStartDrawing}
                  disabled={!selectedSurvey}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    isDrawing
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'bg-primary-50 text-primary-600 hover:bg-primary-100'
                  }`}
                >
                  <PenTool className="w-5 h-5" />
                  {isDrawing ? '绘制中...' : '开始绘制'}
                </button>
                {isDrawing && (
                  <button
                    onClick={handleUndo}
                    disabled={points.length === 0}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Undo2 className="w-5 h-5" />
                    撤销
                  </button>
                )}
                <button
                  onClick={handleClear}
                  disabled={points.length === 0 && !isDrawing}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-5 h-5" />
                  清除
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsDrawing(false);
                    setPoints([]);
                    setDrawnArea(0);
                  }}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleSave}
                  disabled={points.length < 3 || !selectedSurvey || selectedSurvey.status === 'completed'}
                  className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
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
              <div className="mt-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm text-green-700 font-medium">边界坐标已保存，共 {points.length} 个顶点</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
