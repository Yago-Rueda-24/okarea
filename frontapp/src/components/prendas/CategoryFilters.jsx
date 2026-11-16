import { CATEGORIES_CONFIG } from '../../mocks/prendasData';

export default function CategoryFilters({ activeCategory, onSelectCategory }) {
  return (
    <div className="flex items-center gap-space-xs overflow-x-auto pb-space-xs scrollbar-none">
      {CATEGORIES_CONFIG.map((cat) => {
        const isActive = activeCategory === cat.id;

        if (cat.id === 'all') {
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory('all')}
              className={`shrink-0 px-space-md py-1.5 rounded-full font-label-md text-label-md flex items-center gap-1.5 shadow-sm transition-all cursor-pointer ${
                isActive
                  ? 'bg-inverse-surface text-inverse-on-surface'
                  : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
              }`}
              type="button"
            >
              <span>{cat.label}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-label-sm ${
                  isActive
                    ? 'bg-surface-container-highest text-on-surface'
                    : 'text-outline'
                }`}
              >
                {cat.count}
              </span>
            </button>
          );
        }

        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`shrink-0 px-space-md py-1.5 rounded-full font-label-md text-label-md flex items-center gap-1.5 shadow-sm transition-all cursor-pointer ${
              isActive
                ? 'bg-inverse-surface text-inverse-on-surface'
                : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
            }`}
            type="button"
          >
            {cat.icon && (
              <span className="material-symbols-outlined text-[16px]">{cat.icon}</span>
            )}
            <span>{cat.label}</span>
            <span
              className={`text-label-sm ${
                isActive
                  ? 'px-1.5 py-0.5 rounded-full bg-surface-container-highest text-on-surface'
                  : 'text-outline'
              }`}
            >
              {cat.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
