import { useState } from 'react';
import { LogIn } from 'lucide-react';
import Logo from '../components/logo';

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      localStorage.setItem('authToken', 'demo-token');
      localStorage.setItem('userEmail', email);
      setIsLoading(false);
      onLogin();
    }, 800);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'var(--body-gradient)' }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-32 -right-32 w-[28rem] h-[28rem] rounded-full blur-3xl animate-pulse-glow"
          style={{ background: 'var(--gold-soft)' }}
        />
        <div
          className="absolute -bottom-32 -left-32 w-[28rem] h-[28rem] rounded-full blur-3xl animate-pulse-glow"
          style={{ background: 'var(--royal-soft)', animationDelay: '1.2s' }}
        />
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        <div className="flex justify-center mb-6">
          <Logo size="large" showText showSubtext />
        </div>

        <p className="text-center text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
          Ministère d'Intercession et de Développement de la Prière
        </p>

        <div className="card-gold">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Adresse email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@midp.fr"
                className="input"
                required
              />
            </div>

            <div>
              <label className="label">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input"
                required
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="checkbox" />
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Se souvenir de moi
              </span>
            </label>

            <button type="submit" disabled={isLoading} className="btn btn-primary w-full">
              {isLoading ? (
                <>
                  <span
                    className="spinner"
                    style={{ width: '1.1rem', height: '1.1rem', borderWidth: '2px' }}
                  />
                  Connexion en cours...
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  Se connecter
                </>
              )}
            </button>

            <div className="relative py-1">
              <hr className="divider" />
              <span
                className="absolute left-1/2 -translate-x-1/2 -top-1 px-3 text-xs"
                style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}
              >
                Démo
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                setEmail('admin@midp.fr');
                setPassword('admin123');
              }}
              className="btn btn-secondary w-full"
            >
              Charger les identifiants de démonstration
            </button>
          </form>

          <p className="text-center text-xs mt-6" style={{ color: 'var(--text-muted)' }}>
            © 2024 MIDP. Tous droits réservés.
          </p>
        </div>
      </div>
    </div>
  );
}
