import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Sidebar: React.FC = () => {
  const location = useLocation()
  
  const navItems = [
    { name: '技能包', path: '/', icon: '📦' },
    { name: '历史记录', path: '/history', icon: '📋' },
    { name: '模型管理', path: '/models', icon: '🤖' },
    { name: '成本统计', path: '/stats', icon: '📊' },
    { name: '技能包管理', path: '/custom-skills', icon: '🛠️' },
    { name: '设置', path: '/settings', icon: '⚙️' },
  ]

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">
          职场技能包大师
        </h1>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              location.pathname === item.path
                ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            <span className="mr-3 text-xl">{item.icon}</span>
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          版本 0.1.0
        </div>
      </div>
    </div>
  )
}

export default Sidebar
