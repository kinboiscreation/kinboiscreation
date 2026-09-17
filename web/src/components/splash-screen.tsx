import Logo from './logo';

interface SplashScreenProps {
  message?: string;
  progress?: number;
}

export default function SplashScreen({ message = 'Chargement...', progress }: SplashScreenProps) {
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center z-50"
      style={{ background: 'var(--body-gradient)' }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl animate-pulse-glow"
          style={{ background: 'var(--gold-soft)' }}
        />
        <div
          className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full blur-3xl animate-pulse-glow"
          style={{ background: 'var(--royal-soft)', animationDelay: '1.2s' }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 px-6">
        <Logo size="large" showText showSubtext animated />

        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          {message}
        </p>

        <div className="w-64 space-y-2">
          <div
            className="h-1 rounded-full overflow-hidden"
            style={{ background: 'var(--border-strong)' }}
          >
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: progress !== undefined ? `${Math.min(progress, 100)}%` : '30%',
                background: 'linear-gradient(90deg, var(--gold-deep), var(--gold-bright))'
              }}
            />
          </div>
          {progress !== undefined && (
            <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
              {Math.round(progress)}%
            </p>
          )}
        </div>
      </div>

      <p className="absolute bottom-8 text-xs" style={{ color: 'var(--text-muted)' }}>
        MIDP © 2024 • v1.0.0
      </p>
    </div>
  );
}
