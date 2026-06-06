import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Sprout,
  CalendarDays,
  Map,
  Beaker,
  PlaneTakeoff,
  Upload,
  Receipt,
  Star,
  Leaf,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { path: '/', icon: LayoutDashboard, label: '数据概览' },
  { path: '/farmlands', icon: Sprout, label: '农田档案' },
  { path: '/appointments', icon: CalendarDays, label: '作业预约' },
  { path: '/surveying', icon: Map, label: '地块测绘' },
  { path: '/pesticides', icon: Beaker, label: '药剂管理' },
  { path: '/scheduling', icon: PlaneTakeoff, label: '机队排班' },
  { path: '/operations', icon: Upload, label: '作业回传' },
  { path: '/billing', icon: Receipt, label: '费用结算' },
  { path: '/evaluation', icon: Star, label: '效果评价' },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white border-r border-gray-100 h-screen fixed left-0 top-0 flex flex-col shadow-sm">
      <div className="p-6 border-b border-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-md">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800">智农飞防</h1>
            <p className="text-xs text-gray-500">植保无人机服务平台</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-4">
          功能导航
        </p>
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={cn(
                    'sidebar-item',
                    isActive ? 'sidebar-item-active' : 'sidebar-item-inactive'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-50">
        <div className="bg-gradient-to-r from-primary-50 to-green-50 rounded-xl p-4">
          <p className="text-sm font-medium text-primary-700 mb-1">今日天气</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl">☀️</span>
            <div>
              <p className="text-sm font-semibold text-gray-700">22-32°C 晴</p>
              <p className="text-xs text-green-600">非常适宜作业</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
