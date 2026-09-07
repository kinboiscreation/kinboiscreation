import { FileText, Plus, Download } from 'lucide-react';

export default function Documents() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="section-title">
          <FileText className="h-8 w-8 text-amber-500" />
          Documents
        </h1>
        <button className="btn btn-primary">
          <Plus className="h-5 w-5" />
          Télécharger Document
        </button>
      </div>
      <div className="card text-center py-12">
        <p className="text-slate-300">Gestion des documents à mettre en place</p>
      </div>
    </div>
  );
}
