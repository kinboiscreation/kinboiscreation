import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Isole les erreurs de rendu : une page en échec affiche un message
 * exploitable au lieu de vider entièrement l'application.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Erreur de rendu :', error, info.componentStack);
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div className="card-gold space-y-4 animate-fade-in">
        <h2 className="section-subtitle flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" style={{ color: 'var(--danger)' }} />
          Cette page n'a pas pu s'afficher
        </h2>
        <p className="text-soft text-sm">
          Une erreur est survenue pendant le rendu. Le reste de l'application reste utilisable.
        </p>
        <pre
          className="text-xs p-3 rounded-lg overflow-x-auto"
          style={{ background: 'var(--bg-input)', color: 'var(--text-muted)' }}
        >
          {error.message}
        </pre>
        <button onClick={() => this.setState({ error: null })} className="btn btn-primary">
          <RotateCcw className="h-4 w-4" />
          Réessayer
        </button>
      </div>
    );
  }
}
