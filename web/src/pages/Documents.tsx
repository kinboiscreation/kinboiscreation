import { FileText, Plus, Download, Trash2, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  uploadedBy: string;
}

export default function Documents() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('documents');
    if (stored) setDocuments(JSON.parse(stored));
  }, []);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName) return;

    const newDoc: Document = {
      id: Date.now().toString(),
      name: fileName,
      type: 'application/pdf',
      size: Math.random() * 10000000,
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'Admin'
    };

    const updated = [...documents, newDoc];
    setDocuments(updated);
    localStorage.setItem('documents', JSON.stringify(updated));
    setFileName('');
    setShowUpload(false);
  };

  const handleDelete = (id: string) => {
    const updated = documents.filter(d => d.id !== id);
    setDocuments(updated);
    localStorage.setItem('documents', JSON.stringify(updated));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="section-title">
          <FileText className="h-8 w-8 text-amber-500" />
          Documents
        </h1>
        <button
          onClick={() => setShowUpload(!showUpload)}
          className="btn btn-primary"
        >
          <Plus className="h-5 w-5" />
          Télécharger Document
        </button>
      </div>

      {showUpload && (
        <div className="card p-8">
          <h2 className="section-subtitle mb-6">Télécharger un Document</h2>
          <form onSubmit={handleUpload} className="space-y-6">
            <div>
              <label className="label">Nom du Document</label>
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="Nom du document"
                className="input"
                required
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button type="submit" className="btn btn-primary flex-1">
                Télécharger
              </button>
              <button
                type="button"
                onClick={() => setShowUpload(false)}
                className="btn btn-secondary flex-1"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {documents.length > 0 ? (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="px-4 py-3 text-left text-slate-300 font-semibold">Nom</th>
                <th className="px-4 py-3 text-left text-slate-300 font-semibold">Taille</th>
                <th className="px-4 py-3 text-left text-slate-300 font-semibold">Date</th>
                <th className="px-4 py-3 text-center text-slate-300 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {documents.map(doc => (
                <tr key={doc.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-4 py-3 text-slate-100">{doc.name}</td>
                  <td className="px-4 py-3 text-slate-300">{formatFileSize(doc.size)}</td>
                  <td className="px-4 py-3 text-slate-300 text-sm">
                    {new Date(doc.uploadedAt).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors">
                        <Download className="h-4 w-4 text-blue-400" />
                      </button>
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4 text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card text-center py-12">
          <p className="text-slate-400">Aucun document</p>
        </div>
      )}
    </div>
  );
}
