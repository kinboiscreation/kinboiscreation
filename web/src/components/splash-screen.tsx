import Logo from './logo';

interface SplashScreenProps {
  message?: string;
  progress?: number;
}

export default function SplashScreen({ message = 'Chargement...', progress }: SplashScreenProps) {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex flex-col items-center justify-center z-50">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Logo */}
        <div className="animate-bounce" style={{ animationDuration: '2s' }}>
          <Logo size="large" showText={true} showSubtext={true} animated={true} />
        </div>

        {/* Message */}
        <div className="text-center">
          <p className="text-lg text-slate-100 font-medium">{message}</p>
        </div>

        {/* Progress Bar */}
        <div className="w-64 space-y-2">
          <div className="h-1 bg-slate-700/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-300"
              style={{
                width: progress ? `${Math.min(progress, 100)}%` : '30%'
              }}
            ></div>
          </div>
          {progress !== undefined && (
            <p className="text-xs text-slate-400 text-center">{Math.round(progress)}%</p>
          )}
        </div>

        {/* Loading spinner */}
        <div className="mt-4">
          <div className="animate-spin">
            <div className="h-8 w-8 border-3 border-amber-500 border-t-transparent rounded-full"></div>
          </div>
        </div>

        {/* Bottom text */}
        <p className="absolute bottom-8 text-xs text-slate-500">
          MIDP © 2024 • v1.0.0
        </p>
      </div>
    </div>
  );
}
