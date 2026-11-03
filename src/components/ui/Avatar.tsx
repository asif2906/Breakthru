import { ImgHTMLAttributes, forwardRef, useState } from 'react';
import { cn } from '@/lib/utils';

export interface AvatarProps extends ImgHTMLAttributes<HTMLImageElement> {
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fallback?: string;
  fallbackColor?: string;
}

export const Avatar = forwardRef<HTMLImageElement, AvatarProps>(
  ({ className, alt, size = 'md', fallback, fallbackColor, src, onError, ...props }, ref) => {
    const sizes = {
      xs: 'w-6 h-6 text-xs',
      sm: 'w-8 h-8 text-sm',
      md: 'w-10 h-10 text-base',
      lg: 'w-12 h-12 text-lg',
      xl: 'w-16 h-16 text-xl',
    };

    const [imageError, setImageError] = useState(false);

    const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
      setImageError(true);
      onError?.(e);
    };

    const getInitials = (name: string) => {
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    };

    const getColor = (name: string) => {
      if (fallbackColor) return fallbackColor;
      const colors = [
        'bg-electric-lime',
        'bg-violet',
        'bg-blue-500',
        'bg-green-500',
        'bg-yellow-500',
        'bg-pink-500',
        'bg-orange-500',
        'bg-cyan-500',
      ];
      let hash = 0;
      for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
      }
      return colors[Math.abs(hash) % colors.length];
    };

    if (!src || imageError) {
      return (
        <div
          ref={ref}
          className={cn(
            'inline-flex items-center justify-center font-semibold rounded-full overflow-hidden',
            sizes[size],
            className
          )}
          style={{ backgroundColor: fallback ? undefined : getColor(fallback || alt || 'User') }}
          {...props}
        >
          {fallback || (alt ? getInitials(alt) : '?')}
        </div>
      );
    }

    return (
      <img
        ref={ref}
        src={src}
        alt={alt || ''}
        className={cn('rounded-full object-cover', sizes[size], className)}
        onError={handleError}
        {...props}
      />
    );
  }
);

Avatar.displayName = 'Avatar';