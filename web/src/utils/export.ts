import { Activity, ACTIVITY_NAMES } from '@midp/shared';

export interface ExportOptions {
  title: string;
  startDate?: string;
  endDate?: string;
  activities?: Activity[];
  stats?: Record<string, any>;
}

/**
 * Generate CSV content from activities data
 */
export function generateCSV(options: ExportOptions): string {
  const { title, activities = [] } = options;

  let csv = `${title}\n`;
  csv += `Généré le: ${new Date().toLocaleString('fr-FR')}\n\n`;

  csv += 'Type,Date,Participants,Hommes,Femmes,Remarques\n';

  activities.forEach(activity => {
    const activityName = ACTIVITY_NAMES[activity.type as keyof typeof ACTIVITY_NAMES] || activity.type;
    const date = new Date(activity.date).toLocaleDateString('fr-FR');
    csv += `"${activityName}","${date}",${activity.totalParticipants},${activity.menCount || 0},${activity.womenCount || 0},"${activity.remarks || ''}"\n`;
  });

  return csv;
}

/**
 * Download CSV file
 */
export function downloadCSV(content: string, filename: string): void {
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(content));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

/**
 * Generate simple JSON export (for data backup)
 */
export function generateJSON(options: ExportOptions): string {
  const { title, activities = [], stats = {} } = options;
  const data = {
    title,
    generatedAt: new Date().toISOString(),
    summary: {
      totalActivities: activities.length,
      totalParticipants: activities.reduce((sum, a) => sum + (a.totalParticipants || 0), 0),
      totalMen: activities.reduce((sum, a) => sum + (a.menCount || 0), 0),
      totalWomen: activities.reduce((sum, a) => sum + (a.womenCount || 0), 0)
    },
    activities,
    stats
  };

  return JSON.stringify(data, null, 2);
}

/**
 * Download JSON file
 */
export function downloadJSON(content: string, filename: string): void {
  const element = document.createElement('a');
  element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(content));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

/**
 * Generate HTML for PDF export (can be printed or converted to PDF)
 */
export function generateHTMLReport(options: ExportOptions): string {
  const { title, activities = [], stats = {} } = options;
  const now = new Date().toLocaleString('fr-FR');

  const statsHTML = Object.entries(stats).map(([type, data]: [string, any]) => `
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;">${ACTIVITY_NAMES[type as keyof typeof ACTIVITY_NAMES] || type}</td>
      <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${data.sessionCount || 0}</td>
      <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${data.totalParticipants || 0}</td>
      <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${data.average || 0}</td>
      <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${data.menTotal || 0}</td>
      <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${data.womenTotal || 0}</td>
    </tr>
  `).join('');

  const activitiesHTML = activities.map(activity => `
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;">${ACTIVITY_NAMES[activity.type as keyof typeof ACTIVITY_NAMES] || activity.type}</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${new Date(activity.date).toLocaleDateString('fr-FR')}</td>
      <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${activity.totalParticipants}</td>
      <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${activity.menCount || 0}</td>
      <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${activity.womenCount || 0}</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${activity.remarks || '-'}</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
        h1 { color: #f59e0b; border-bottom: 2px solid #f59e0b; padding-bottom: 10px; }
        h2 { color: #475569; margin-top: 30px; font-size: 16px; }
        table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        th { background-color: #f59e0b; color: white; padding: 12px; text-align: left; }
        .summary { background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .summary div { margin: 8px 0; }
        .summary strong { color: #f59e0b; }
        .footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <p>Rapport généré le: ${now}</p>

      <div class="summary">
        <div><strong>Total d'activités:</strong> ${activities.length}</div>
        <div><strong>Total des participants:</strong> ${activities.reduce((sum, a) => sum + (a.totalParticipants || 0), 0)}</div>
        <div><strong>Hommes:</strong> ${activities.reduce((sum, a) => sum + (a.menCount || 0), 0)}</div>
        <div><strong>Femmes:</strong> ${activities.reduce((sum, a) => sum + (a.womenCount || 0), 0)}</div>
      </div>

      ${Object.keys(stats).length > 0 ? `
        <h2>Statistiques par Type</h2>
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Séances</th>
              <th>Participants</th>
              <th>Moyenne</th>
              <th>Hommes</th>
              <th>Femmes</th>
            </tr>
          </thead>
          <tbody>
            ${statsHTML}
          </tbody>
        </table>
      ` : ''}

      ${activities.length > 0 ? `
        <h2>Détail des Activités</h2>
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Date</th>
              <th>Participants</th>
              <th>Hommes</th>
              <th>Femmes</th>
              <th>Remarques</th>
            </tr>
          </thead>
          <tbody>
            ${activitiesHTML}
          </tbody>
        </table>
      ` : ''}

      <div class="footer">
        <p>MIDP - Ministère d'Intercession et de Développement de la Prière</p>
        <p>© 2024 Tous droits réservés</p>
      </div>
    </body>
    </html>
  `;
}

/**
 * Export to PDF using browser print functionality
 */
export function exportToPDF(html: string, filename: string): void {
  const printWindow = window.open('', '', 'height=600,width=800');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  }
}

/**
 * Download as printable HTML
 */
export function downloadPrintable(html: string, filename: string): void {
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/html;charset=utf-8,' + encodeURIComponent(html));
  element.setAttribute('download', filename.replace(/\.[^.]+$/, '.html'));
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
