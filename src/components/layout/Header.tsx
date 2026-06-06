import { Bell, Search, User, Settings, MessageSquare } from 'lucide-react';

export default function Header() {
  const currentDate = new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="搜索地块、作业、农户..."
            className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-lg w-80 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm"
          />
        </div>
        <span className="text-sm text-gray-500">{currentDate}</span>
      </div>

      <div className="flex items-center gap-2">
        <button className="p-2.5 rounded-lg hover:bg-gray-50 transition-colors relative">
          <MessageSquare className="w-5 h-5 text-gray-600" />
        </button>
        <button className="p-2.5 rounded-lg hover:bg-gray-50 transition-colors relative">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <button className="p-2.5 rounded-lg hover:bg-gray-50 transition-colors">
          <Settings className="w-5 h-5 text-gray-600" />
        </button>
        <div className="h-8 w-px bg-gray-200 mx-2"></div>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center shadow-sm">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-700">管理员</p>
            <p className="text-xs text-gray-500">飞防调度中心</p>
          </div>
        </div>
      </div>
    </header>
  );
}
