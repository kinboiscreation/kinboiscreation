interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  showSubtext?: boolean;
  animated?: boolean;
}

export default function Logo({
  size = 'medium',
  showText = true,
  showSubtext = true,
  animated = false
}: LogoProps) {
  const sizeClasses = {
    small: 'h-8 w-8',
    medium: 'h-12 w-12',
    large: 'h-20 w-20'
  };

  const textSizes = {
    small: 'text-lg',
    medium: 'text-2xl',
    large: 'text-4xl'
  };

  const subtextSizes = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  };

  return (
    <div className="flex items-center gap-3">
      {/* Logo Icon */}
      <div
        className={`
          ${sizeClasses[size]} rounded-xl
          bg-gradient-to-br from-amber-500 to-orange-600
          flex items-center justify-center
          shadow-lg shadow-amber-500/50
          ${animated ? 'animate-pulse' : ''}
        `}
      >
        <span className={`${size === 'small' ? 'text-sm' : size === 'medium' ? 'text-xl' : 'text-4xl'}`}>
          🙏
        </span>
      </div>

      {/* Text */}
      {showText && (
        <div>
          <p className={`${textSizes[size]} font-bold text-white leading-tight`}>
            MIDP
          </p>
          {showSubtext && (
            <p className={`${subtextSizes[size]} text-slate-400 leading-tight`}>
              Ministère d'Intercession
            </p>
          )}
        </div>
      )}
    </div>
  );
}
