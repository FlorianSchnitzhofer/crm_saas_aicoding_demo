const form = document.getElementById('estimation-form');
const output = document.getElementById('estimation-output');
const resultCard = document.getElementById('result-card');
const downloadBtn = document.getElementById('download-pdf');

let lastResult = null;

const toNumber = (v) => Number.parseFloat(v || '0');

function calculate(values) {
  const efforts = {
    pages: values.pages * values.wPages,
    useCases: values.useCases * values.wUseCases,
    businessObjects: values.businessObjects * values.wBusinessObjects,
    interfaces: values.interfaces * values.wInterfaces,
    batches: values.batches * values.wBatches,
    languages: values.languages * values.wLanguages,
    roles: values.roles * values.wRoles,
    users: values.users * values.wUsers,
  };

  const baseTotal = Object.values(efforts).reduce((sum, v) => sum + v, 0);
  const managementReserve = baseTotal * 0.15;
  const qaReserve = baseTotal * 0.1;
  const total = baseTotal + managementReserve + qaReserve;

  return { efforts, baseTotal, managementReserve, qaReserve, total };
}

function buildScopeText(values, result) {
  const complexityDriver = result.total > 140 ? 'hoch' : result.total > 70 ? 'mittel' : 'niedrig';
  return `Die Scope-Beschreibung basiert auf ${values.pages} Seiten, ${values.useCases} Use Cases, ${values.businessObjects} Business Objects sowie ${values.interfaces} Schnittstellen. Das Projekt adressiert ${values.users} Nutzer in ${values.languages} Sprache(n) und ${values.roles} Rolle(n). Die technische Komplexität wird als ${complexityDriver} eingestuft. Die Projektskizze priorisiert folgende Inhalte: ${values.projectSketch}`;
}

function render(values, result, scopeText) {
  output.innerHTML = `
    <div class="result-grid">
      <div class="metric"><strong>Basisaufwand</strong><br>${result.baseTotal.toFixed(1)} PT</div>
      <div class="metric"><strong>Management-Reserve (15%)</strong><br>${result.managementReserve.toFixed(1)} PT</div>
      <div class="metric"><strong>QA-Reserve (10%)</strong><br>${result.qaReserve.toFixed(1)} PT</div>
      <div class="metric"><strong>Gesamtaufwand</strong><br>${result.total.toFixed(1)} PT</div>
    </div>
    <h3>Aufwandsdetails</h3>
    <p class="small">Pages: ${result.efforts.pages.toFixed(1)} PT · Use Cases: ${result.efforts.useCases.toFixed(1)} PT · Business Objects: ${result.efforts.businessObjects.toFixed(1)} PT · Interfaces: ${result.efforts.interfaces.toFixed(1)} PT · Batches: ${result.efforts.batches.toFixed(1)} PT · Languages: ${result.efforts.languages.toFixed(1)} PT · Roles: ${result.efforts.roles.toFixed(1)} PT · User: ${result.efforts.users.toFixed(1)} PT</p>
    <h3>Scope-Beschreibung</h3>
    <p>${scopeText}</p>
  `;
  resultCard.hidden = false;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const values = {
    pages: toNumber(data.get('pages')),
    useCases: toNumber(data.get('useCases')),
    businessObjects: toNumber(data.get('businessObjects')),
    interfaces: toNumber(data.get('interfaces')),
    batches: toNumber(data.get('batches')),
    languages: toNumber(data.get('languages')),
    roles: toNumber(data.get('roles')),
    users: toNumber(data.get('users')),
    projectSketch: String(data.get('projectSketch') || '').trim(),
    wPages: toNumber(data.get('wPages')),
    wUseCases: toNumber(data.get('wUseCases')),
    wBusinessObjects: toNumber(data.get('wBusinessObjects')),
    wInterfaces: toNumber(data.get('wInterfaces')),
    wBatches: toNumber(data.get('wBatches')),
    wLanguages: toNumber(data.get('wLanguages')),
    wRoles: toNumber(data.get('wRoles')),
    wUsers: toNumber(data.get('wUsers')),
  };

  const result = calculate(values);
  const scopeText = buildScopeText(values, result);

  lastResult = { values, result, scopeText };
  render(values, result, scopeText);
  downloadBtn.disabled = false;
});

downloadBtn.addEventListener('click', () => {
  if (!lastResult) return;
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const { values, result, scopeText } = lastResult;

  const lines = [
    'ReqPOOL Estimation Manager',
    `Datum: ${new Date().toISOString().slice(0, 10)}`,
    '',
    'Parameter:',
    `Pages: ${values.pages}`,
    `Use Cases: ${values.useCases}`,
    `Business Objects: ${values.businessObjects}`,
    `Interfaces: ${values.interfaces}`,
    `Batches: ${values.batches}`,
    `Languages: ${values.languages}`,
    `Roles: ${values.roles}`,
    `User: ${values.users}`,
    '',
    'Aufwandsschaetzung:',
    `Basisaufwand: ${result.baseTotal.toFixed(1)} PT`,
    `Management Reserve: ${result.managementReserve.toFixed(1)} PT`,
    `QA Reserve: ${result.qaReserve.toFixed(1)} PT`,
    `Gesamtaufwand: ${result.total.toFixed(1)} PT`,
    '',
    'Scope Beschreibung:',
    scopeText,
  ];

  let y = 15;
  doc.setFontSize(12);
  lines.forEach((line) => {
    const wrapped = doc.splitTextToSize(line, 180);
    doc.text(wrapped, 15, y);
    y += wrapped.length * 7;
    if (y > 270) {
      doc.addPage();
      y = 15;
    }
  });

  doc.save('reqpool-estimation.pdf');
});
