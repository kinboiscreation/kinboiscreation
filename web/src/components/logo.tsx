interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  showSubtext?: boolean;
  animated?: boolean;
}

const sizeClasses = {
  small: 'h-9 w-9',
  medium: 'h-11 w-11',
  large: 'h-20 w-20'
};

const glyphSizes = {
  small: 'text-base',
  medium: 'text-xl',
  large: 'text-4xl'
};

const textSizes = {
  small: 'text-base',
  medium: 'text-xl',
  large: 'text-4xl'
};

const subtextSizes = {
  small: 'text-[10px]',
  medium: 'text-xs',
  large: 'text-sm'
};

export default function Logo({
  size = 'medium',
  showText = true,
  showSubtext = true,
  animated = false
}: LogoProps) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`${sizeClasses[size]} rounded-xl flex items-center justify-center shrink-0 ${
          animated ? 'animate-pulse-glow' : ''
        }`}
        style={{
          background: 'linear-gradient(140deg, var(--royal-deep) 0%, var(--midnight) 45%, var(--gold-deep) 100%)',
          border: '1px solid var(--gold-border)',
          boxShadow: 'var(--shadow-glow)'
        }}
      >
        <span className={glyphSizes[size]}>🙏</span>
      </div>

      {showText && (
        <div className="min-w-0">
          <p
            className={`${textSizes[size]} font-bold leading-tight tracking-tight`}
            style={{
              background: 'linear-gradient(100deg, var(--gold-bright), var(--gold), var(--gold-bright))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            MIDP
          </p>
          {showSubtext && (
            <p className={`${subtextSizes[size]} leading-tight truncate`} style={{ color: 'var(--text-muted)' }}>
              Ministère d'Intercession
            </p>
          )}
        </div>
      )}
    </div>
  );
}
