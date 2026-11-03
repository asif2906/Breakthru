import { ReactNode, useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, X } from 'lucide-react';

export interface DropdownItem {
  label: string;
  onClick: () => void;
  icon?: ReactNode;
  danger?: boolean;
  disabled?: boolean;
}

export interface DropdownProps {
  trigger: ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
  className?: string;
}

export function Dropdown({ trigger, items, align = 'right', className }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className={cn('relative inline-block', className)}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          className={cn(
            'fixed z-50 mt-2 min-w-[180px] bg-dark-cards border border-gray-700 rounded-lg shadow-xl overflow-hidden animate-slide-down',
            align === 'right' ? 'right-0' : 'left-0'
          )}
          role="menu"
        >
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                item.onClick();
                setIsOpen(false);
              }}
              disabled={item.disabled}
              className={cn(
                'w-full px-4 py-2.5 text-left text-sm font-medium transition-colors flex items-center gap-3',
                'hover:bg-gray-800 focus:outline-none focus:bg-gray-800',
                item.danger ? 'text-red-400 hover:bg-red-900/20' : 'text-warm-off-white',
                item.disabled && 'opacity-50 cursor-not-allowed'
              )}
              role="menuitem"
            >
              {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export interface DropdownMenuProps {
  children: ReactNode;
  align?: 'left' | 'right';
  className?: string;
}

export interface DropdownContentProps {
  children: ReactNode;
  className?: string;
}

export interface DropdownItemProps {
  children: ReactNode;
  onClick: () => void;
  icon?: ReactNode;
  danger?: boolean;
  disabled?: boolean;
  className?: string;
}

export interface DropdownSeparatorProps {
  className?: string;
}