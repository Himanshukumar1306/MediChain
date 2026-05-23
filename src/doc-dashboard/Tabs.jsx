import { clsx } from 'clsx';

const tabs = ['Upcoming', 'Past', 'Cancelled'];

export function BookingTabs({ activeTab, onTabChange }) {
  return (
    <div className="flex justify-center gap-12 mb-8">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={clsx(
            'px-8 py-2 text-sm font-semibold transition-all duration-200',
            activeTab === tab
              ? 'bg-emerald-500 text-white rounded-md'
              : 'text-gray-500 hover:text-gray-800'
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}