const form = document.getElementById('estimationForm');
const resultSection = document.getElementById('resultSection');
const summary = document.getElementById('summary');
const scope = document.getElementById('scope');
const downloadPdf = document.getElementById('downloadPdf');

const asNum = (id) => Number(document.getElementById(id).value || 0);

function calculateEstimate(data, w) {
  const userBuckets = Math.ceil(data.users / 100);
  const effort =
    data.pages * w.pages +
    data.useCases * w.useCases +
    data.businessObjects * w.businessObjects +
    data.interfaces * w.interfaces +
    data.batches * w.batches +
    data.languages * w.languages +
    data.roles * w.roles +
    userBuckets * w.users;

  const riskFactor =
    1 + Math.min(0.35, (data.interfaces * 0.01) + (data.languages > 2 ? 0.08 : 0) + (data.batches * 0.015));

  const total = effort * riskFactor;
  return {
    baseEffort: effort,
    riskFactor,
    totalEffort: total,
    durationMonths: Math.max(1, total / 20),
    teamSize: Math.max(2, Math.ceil(total / 60))
  };
}

function createScopeText(d, est, sketch) {
  return `
  <p><strong>Projektziel:</strong> Umsetzung einer webbasierten Lösung mit ${d.pages} Seiten und ${d.useCases} priorisierten Use Cases.</p>
  <p><strong>Fachlicher Scope:</strong> ${d.businessObjects} Business Objects werden modelliert. Rollen- und Rechtekonzept basiert auf ${d.roles} Rollen bei ca. ${d.users} Nutzenden.</p>
  <p><strong>Integrationsscope:</strong> ${d.interfaces} Schnittstellen sowie ${d.batches} Batch-Prozesse werden umgesetzt.</p>
  <p><strong>Internationalisierung:</strong> ${d.languages} Sprachen sind im Scope enthalten.</p>
  <p><strong>Projektskizze:</strong> ${sketch.replaceAll('<', '&lt;').replaceAll('>', '&gt;')}</p>
  <p><strong>Geschätzte Umsetzung:</strong> ${est.totalEffort.toFixed(1)} Personentage (~${est.durationMonths.toFixed(1)} Monate bei 20 PT/Monat).</p>
  `;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = {
    pages: asNum('pages'),
    useCases: asNum('useCases'),
    businessObjects: asNum('businessObjects'),
    interfaces: asNum('interfaces'),
    batches: asNum('batches'),
    languages: asNum('languages'),
    roles: asNum('roles'),
    users: asNum('users')
  };

  const weights = {
    pages: asNum('wPages'),
    useCases: asNum('wUseCases'),
    businessObjects: asNum('wBusinessObjects'),
    interfaces: asNum('wInterfaces'),
    batches: asNum('wBatches'),
    languages: asNum('wLanguages'),
    roles: asNum('wRoles'),
    users: asNum('wUsers')
  };

  const est = calculateEstimate(data, weights);
  summary.innerHTML = `
    <p><strong>Basisaufwand:</strong> ${est.baseEffort.toFixed(1)} PT</p>
    <p><strong>Risikofaktor:</strong> ${est.riskFactor.toFixed(2)}</p>
    <p><strong>Gesamtaufwand:</strong> ${est.totalEffort.toFixed(1)} PT</p>
    <p><strong>Empfohlene Teamgröße:</strong> ${est.teamSize} FTE</p>
    <p><strong>Grobe Dauer:</strong> ${est.durationMonths.toFixed(1)} Monate</p>
  `;

  const sketch = document.getElementById('projectSketch').value;
  scope.innerHTML = createScopeText(data, est, sketch);
  resultSection.hidden = false;
});

downloadPdf.addEventListener('click', () => {
  window.print();
});
