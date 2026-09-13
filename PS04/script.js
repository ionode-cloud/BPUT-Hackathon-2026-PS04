/* =============================================================
   SustainIQ India — script.js
   AI-Powered Sustainable Facility & Estate Intelligence
   ============================================================= */

'use strict';

/* ============================================================
   SECTION 1: MOCK DATA STORE
   Replace these with Axios/Fetch API calls in the MERN version
   ============================================================ */

const DATA = {

  /* --- Facility Definitions --- */
  facilities: [
    { id: 'aiims',     name: 'AIIMS Bhubaneswar',                 type: 'Healthcare',         city: 'Bhubaneswar', buildings: 12, occupancy: 84, score: 82, status: 'active' },
    { id: 'iit',       name: 'IIT Bhubaneswar',                    type: 'Educational',        city: 'Bhubaneswar', buildings: 18, occupancy: 91, score: 88, status: 'active' },
    { id: 'pune',      name: 'Smart Industrial Estate',            type: 'Industrial',         city: 'Pune',        buildings: 24, occupancy: 78, score: 79, status: 'active' },
    { id: 'delhi',     name: 'Municipal Campus',                   type: 'Government',         city: 'New Delhi',   buildings: 9,  occupancy: 69, score: 76, status: 'active' },
    { id: 'bengaluru', name: 'Corporate Technology Park',          type: 'Commercial',         city: 'Bengaluru',   buildings: 15, occupancy: 88, score: 91, status: 'active' },
  ],

  /* --- KPI Data per facility --- */
  kpis: {
    all:       { energy: 124560, energyChange: -8.4, water: 48320, waterChange: 3.2, aqi: 72,  waste: 2840, wasteChange: -5.8, alerts: 12, alertCritical: 3, score: 84, scoreChange: 6.5 },
    aiims:     { energy: 28400,  energyChange: -6.1, water: 10800, waterChange: 4.1, aqi: 68,  waste: 640,  wasteChange: -4.2, alerts: 4,  alertCritical: 1, score: 82, scoreChange: 4.2 },
    iit:       { energy: 31200,  energyChange: -9.8, water: 12400, waterChange: 2.7, aqi: 61,  waste: 780,  wasteChange: -7.1, alerts: 2,  alertCritical: 0, score: 88, scoreChange: 8.1 },
    pune:      { energy: 24600,  energyChange: -5.3, water: 9200,  waterChange: 5.8, aqi: 88,  waste: 560,  wasteChange: -3.9, alerts: 3,  alertCritical: 1, score: 79, scoreChange: 3.7 },
    delhi:     { energy: 20100,  energyChange: -11.2,water: 7600,  waterChange: 1.3, aqi: 96,  waste: 420,  wasteChange: -6.2, alerts: 2,  alertCritical: 1, score: 76, scoreChange: 5.1 },
    bengaluru: { energy: 20260,  energyChange: -8.8, water: 8320,  waterChange: 2.1, aqi: 55,  waste: 440,  wasteChange: -4.6, alerts: 1,  alertCritical: 0, score: 91, scoreChange: 9.2 },
  },

  /* --- Sustainability Scores per facility --- */
  sustainability: {
    all:       { energy: 86, water: 78, waste: 88, emission: 81, safety: 92, asset: 79, overall: 84 },
    aiims:     { energy: 84, water: 76, waste: 85, emission: 79, safety: 90, asset: 77, overall: 82 },
    iit:       { energy: 88, water: 82, waste: 90, emission: 84, safety: 94, asset: 82, overall: 88 },
    pune:      { energy: 79, water: 73, waste: 82, emission: 76, safety: 88, asset: 75, overall: 79 },
    delhi:     { energy: 76, water: 70, waste: 80, emission: 72, safety: 85, asset: 72, overall: 76 },
    bengaluru: { energy: 92, water: 86, waste: 93, emission: 88, safety: 96, asset: 88, overall: 91 },
  },

  /* --- 30 Days Energy Data (kWh) --- */
  energy30Days: {
    all: [4180,4240,4120,4380,4290,4150,4070,4420,4310,4180,4090,4250,4360,4140,4080,4200,4310,4410,4180,4090,4220,4330,4150,4080,4190,4280,4120,4060,4170,4240],
    prev:[4560,4620,4480,4750,4660,4500,4400,4810,4690,4550,4440,4620,4750,4490,4420,4560,4680,4800,4550,4440,4590,4720,4510,4430,4560,4680,4480,4410,4540,4620],
    aiims:     [1020,1040,1010,1080,1060,1020,1000,1090,1060,1030,1010,1050,1070,1020,1000,1040,1060,1090,1040,1010,1050,1070,1020,1000,1040,1060,1010,990,1030,1050],
    iit:       [1110,1130,1100,1160,1150,1120,1090,1180,1150,1120,1100,1130,1160,1120,1090,1120,1150,1190,1130,1100,1130,1160,1120,1090,1130,1160,1110,1080,1120,1150],
  },

  /* --- Energy Weekly/Monthly data --- */
  energyWeekly: {
    labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    actual: [29200,30100,28800,31200,29800,22400,18600],
    prev:   [31800,32400,31200,34100,32400,24200,20100],
  },
  energyMonthly: {
    labels: ['Apr','May','Jun','Jul','Aug','Sep'],
    actual: [128400,124200,126800,131200,127400,124560],
    prev:   [142100,138600,140200,144800,140100,138200],
  },

  /* --- Water & Waste 7 Days --- */
  waterWaste7: {
    labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    water: [6920,7140,6820,7280,7050,5640,4880],
    waste: [420,390,440,410,460,320,280],
  },

  /* --- Facility Utilization --- */
  facilityUtil: {
    labels: ['Building A','Building B','Building C','Building D','Parking Area'],
    values: [88, 72, 64, 91, 76],
  },

  /* --- Water Management Data --- */
  water: {
    all:       { consumption: 48320, storageLevel: 72, leakAlerts: 2, recycled: 31, efficiency: 78 },
    aiims:     { consumption: 10800, storageLevel: 68, leakAlerts: 1, recycled: 28, efficiency: 74 },
    iit:       { consumption: 12400, storageLevel: 78, leakAlerts: 0, recycled: 35, efficiency: 82 },
    pune:      { consumption: 9200,  storageLevel: 65, leakAlerts: 1, recycled: 29, efficiency: 71 },
    delhi:     { consumption: 7600,  storageLevel: 60, leakAlerts: 0, recycled: 26, efficiency: 68 },
    bengaluru: { consumption: 8320,  storageLevel: 80, leakAlerts: 0, recycled: 40, efficiency: 86 },
  },

  /* --- Air Quality Data --- */
  air: {
    all:       { aqi: 72,  pm25: 38,  pm10: 68,  co2: 412, temp: 29, humidity: 62, category: 'Moderate' },
    aiims:     { aqi: 68,  pm25: 34,  pm10: 62,  co2: 408, temp: 28, humidity: 64, category: 'Moderate' },
    iit:       { aqi: 61,  pm25: 28,  pm10: 54,  co2: 402, temp: 27, humidity: 66, category: 'Good' },
    pune:      { aqi: 88,  pm25: 52,  pm10: 86,  co2: 428, temp: 31, humidity: 58, category: 'Poor' },
    delhi:     { aqi: 96,  pm25: 68,  pm10: 108, co2: 438, temp: 32, humidity: 54, category: 'Unhealthy' },
    bengaluru: { aqi: 55,  pm25: 22,  pm10: 44,  co2: 396, temp: 25, humidity: 70, category: 'Good' },
  },

  /* --- Waste Data --- */
  waste: {
    all:       { total: 2840, recyclable: 1420, organic: 780, nonRecyclable: 640, collected: 2580, overflow: 1 },
    aiims:     { total: 640,  recyclable: 310,  organic: 180, nonRecyclable: 150, collected: 590,  overflow: 0 },
    iit:       { total: 780,  recyclable: 410,  organic: 220, nonRecyclable: 150, collected: 740,  overflow: 0 },
    pune:      { total: 560,  recyclable: 260,  organic: 160, nonRecyclable: 140, collected: 500,  overflow: 1 },
    delhi:     { total: 420,  recyclable: 200,  organic: 120, nonRecyclable: 100, collected: 380,  overflow: 0 },
    bengaluru: { total: 440,  recyclable: 240,  organic: 100, nonRecyclable: 100, collected: 430,  overflow: 0 },
  },

  /* --- Traffic Data --- */
  traffic: {
    all:       { vehicleCount: 3840, parkingOccupancy: 76, availableSlots: 246, peakHour: '9:00-10:30 AM', congestionLevel: 'Medium' },
    aiims:     { vehicleCount: 920,  parkingOccupancy: 84, availableSlots: 48,  peakHour: '8:30-10:00 AM', congestionLevel: 'High' },
    iit:       { vehicleCount: 740,  parkingOccupancy: 68, availableSlots: 112, peakHour: '9:00-10:30 AM', congestionLevel: 'Low' },
    pune:      { vehicleCount: 1120, parkingOccupancy: 82, availableSlots: 62,  peakHour: '8:00-9:30 AM',  congestionLevel: 'High' },
    delhi:     { vehicleCount: 620,  parkingOccupancy: 72, availableSlots: 68,  peakHour: '9:30-11:00 AM', congestionLevel: 'Medium' },
    bengaluru: { vehicleCount: 440,  parkingOccupancy: 58, availableSlots: 136, peakHour: '9:00-10:00 AM', congestionLevel: 'Low' },
  },

  /* --- Anomaly Records --- */
  anomalies: [
    { ts: '2026-09-13 02:14', facility: 'AIIMS Bhubaneswar',       category: 'Energy',     issue: 'Building B — 21% above 7-day average',    severity: 'High',     confidence: '94%', status: 'Open' },
    { ts: '2026-09-12 23:41', facility: 'IIT Bhubaneswar',         category: 'Water',      issue: 'Night-time usage spike (02:00–05:00)',      severity: 'Medium',   confidence: '87%', status: 'Investigating' },
    { ts: '2026-09-12 18:30', facility: 'Smart Industrial - Pune', category: 'Air Quality',issue: 'PM2.5 increase beyond safe threshold',      severity: 'High',     confidence: '91%', status: 'Open' },
    { ts: '2026-09-12 15:22', facility: 'Municipal - New Delhi',   category: 'Asset',      issue: 'Generator #3 — efficiency drop to 62%',     severity: 'Medium',   confidence: '82%', status: 'Reviewed' },
    { ts: '2026-09-12 11:05', facility: 'Corporate Park Bengaluru',category: 'Waste',      issue: 'Bin 04 at 91% capacity before schedule',    severity: 'Low',      confidence: '96%', status: 'Resolved' },
    { ts: '2026-09-11 08:48', facility: 'AIIMS Bhubaneswar',       category: 'Safety',     issue: 'Fire exit sensor offline — Block D',        severity: 'Critical', confidence: '99%', status: 'Investigating' },
    { ts: '2026-09-11 07:20', facility: 'IIT Bhubaneswar',         category: 'Energy',     issue: 'Solar array output 18% below forecast',     severity: 'Medium',   confidence: '85%', status: 'Reviewed' },
    { ts: '2026-09-10 22:10', facility: 'Smart Industrial - Pune', category: 'Water',      issue: 'Water pressure drop in Zone B pipeline',    severity: 'High',     confidence: '89%', status: 'Open' },
  ],

  /* --- Forecast Data --- */
  forecast: {
    energy: {
      histLabels:    ['Sep-1','Sep-2','Sep-3','Sep-4','Sep-5','Sep-6','Sep-7','Sep-8','Sep-9','Sep-10','Sep-11','Sep-12','Sep-13'],
      histValues:    [4180,4240,4120,4380,4290,4150,4070,4420,4310,4180,4090,4250,4120],
      fcLabels:      ['Sep-14','Sep-15','Sep-16','Sep-17','Sep-18','Sep-19','Sep-20'],
      fcValues:      [4210,4280,4240,4350,4300,4180,4100],
      fcLow:         [4050,4110,4070,4180,4130,4010,3940],
      fcHigh:        [4370,4450,4410,4520,4470,4350,4260],
      confidence: '91%', trend: 'Slight Increase', model: 'Moving Average + Trend Analysis',
    },
    water: {
      histLabels:    ['Sep-1','Sep-2','Sep-3','Sep-4','Sep-5','Sep-6','Sep-7','Sep-8','Sep-9','Sep-10','Sep-11','Sep-12','Sep-13'],
      histValues:    [6920,7140,6820,7280,7050,5640,4880,6980,7200,6900,7320,7100,6940],
      fcLabels:      ['Sep-14','Sep-15','Sep-16','Sep-17','Sep-18','Sep-19','Sep-20'],
      fcValues:      [7020,7180,6980,7380,7150,5720,4960],
      fcLow:         [6720,6860,6680,7080,6850,5420,4660],
      fcHigh:        [7320,7500,7280,7680,7450,6020,5260],
      confidence: '88%', trend: 'Stable', model: 'ARIMA + Seasonal Decomposition',
    },
    waste: {
      histLabels:    ['Sep-1','Sep-2','Sep-3','Sep-4','Sep-5','Sep-6','Sep-7','Sep-8','Sep-9','Sep-10','Sep-11','Sep-12','Sep-13'],
      histValues:    [420,390,440,410,460,320,280,430,400,450,420,470,400],
      fcLabels:      ['Sep-14','Sep-15','Sep-16','Sep-17','Sep-18','Sep-19','Sep-20'],
      fcValues:      [440,410,460,430,480,340,300],
      fcLow:         [380,350,400,370,420,280,240],
      fcHigh:        [500,470,520,490,540,400,360],
      confidence: '84%', trend: 'Slight Increase', model: 'Linear Regression + Weekly Pattern',
    },
    occupancy: {
      histLabels:    ['Sep-1','Sep-2','Sep-3','Sep-4','Sep-5','Sep-6','Sep-7','Sep-8','Sep-9','Sep-10','Sep-11','Sep-12','Sep-13'],
      histValues:    [78,82,84,86,83,52,44,79,83,85,87,84,81],
      fcLabels:      ['Sep-14','Sep-15','Sep-16','Sep-17','Sep-18','Sep-19','Sep-20'],
      fcValues:      [83,85,87,89,86,54,46],
      fcLow:         [76,78,80,82,79,47,39],
      fcHigh:        [90,92,94,96,93,61,53],
      confidence: '93%', trend: 'Slight Increase', model: 'Prophet + Calendar Effects',
    },
  },

  /* --- AI Recommendations --- */
  recommendations: [
    {
      id: 'rec-001',
      category: 'energy',
      icon: '⚡',
      title: 'Optimize HVAC Operating Schedule',
      reason: 'HVAC systems in Building A & B are running at full capacity outside peak occupancy hours (6 PM–8 AM). Adjusting schedules can yield significant savings.',
      impact: 'Save 8–12% monthly energy consumption (~₹1.4L annually)',
      priority: 'High',
      team: 'Operations & Engineering',
      status: 'pending',
    },
    {
      id: 'rec-002',
      category: 'water',
      icon: '💧',
      title: 'Inspect Water Pipeline — Building C',
      reason: 'Night-time water consumption spikes (02:00–05:00) suggest undetected leakage in the Building C underground pipeline network.',
      impact: 'Prevent 800–1,200 KL/month water loss (~₹48K cost savings)',
      priority: 'High',
      team: 'Maintenance',
      status: 'pending',
    },
    {
      id: 'rec-003',
      category: 'waste',
      icon: '♻️',
      title: 'Increase Waste Collection Frequency',
      reason: 'Bins 03 and 04 are consistently reaching 80%+ capacity 6 hours before scheduled collection, risking overflow and hygiene issues.',
      impact: 'Avoid overflow incidents, improve hygiene rating',
      priority: 'Medium',
      team: 'Facility Services',
      status: 'pending',
    },
    {
      id: 'rec-004',
      category: 'asset',
      icon: '⚙️',
      title: 'Prioritize Generator #3 Maintenance',
      reason: 'Generator #3 efficiency has dropped from 88% to 62% over 14 days. Predictive model indicates 90% probability of failure within 3 weeks without service.',
      impact: 'Improve reliability, prevent critical power failure',
      priority: 'Critical',
      team: 'Engineering',
      status: 'pending',
    },
    {
      id: 'rec-005',
      category: 'air',
      icon: '🌱',
      title: 'Deploy Air Purifiers in Zone C',
      reason: 'PM2.5 levels in Industrial Zone C exceed WHO guidelines by 38% during shift hours. Portable HEPA units can provide immediate relief.',
      impact: 'Reduce PM2.5 exposure by ~40%, improve worker health',
      priority: 'High',
      team: 'Health & Safety',
      status: 'pending',
    },
    {
      id: 'rec-006',
      category: 'energy',
      icon: '☀️',
      title: 'Expand Solar Panel Coverage on Rooftop B',
      reason: 'Rooftop B has 60% unused solar potential. Installing 120 additional 400W panels would significantly offset grid consumption.',
      impact: 'Generate ~180 kWh/day additional, reduce grid bills by 15%',
      priority: 'Recommendation',
      team: 'Sustainability',
      status: 'pending',
    },
  ],

  /* --- Safety Incidents --- */
  safety: {
    incidents: [
      { id: 'INC-001', date: '2026-09-11', facility: 'AIIMS Bhubaneswar',       category: 'Fire Safety', issue: 'Fire exit sensor offline — Block D', severity: 'Critical', status: 'Investigating' },
      { id: 'INC-002', date: '2026-09-10', facility: 'Smart Industrial - Pune', category: 'Chemical',    issue: 'Minor chemical spillage in Lab 3',   severity: 'Medium',   status: 'Resolved' },
      { id: 'INC-003', date: '2026-09-09', facility: 'Municipal - New Delhi',   category: 'Electrical',  issue: 'High voltage alarm — Panel Room 2',  severity: 'High',     status: 'Resolved' },
      { id: 'INC-004', date: '2026-09-08', facility: 'IIT Bhubaneswar',         category: 'Physical',    issue: 'Slip hazard in corridor B — wet floor',severity:'Low',     status: 'Resolved' },
      { id: 'INC-005', date: '2026-09-07', facility: 'Corporate Park Bengaluru',category: 'Security',    issue: 'Unauthorized access attempt — Gate 3', severity: 'Medium', status: 'Reviewed' },
      { id: 'INC-006', date: '2026-09-06', facility: 'AIIMS Bhubaneswar',       category: 'Fire Safety', issue: 'Smoke detector false alarm — OT wing',severity: 'Low',     status: 'Resolved' },
    ],
    summary: { total: 6, open: 1, critical: 1, resolved: 3 },
  },

  /* --- Assets --- */
  assets: [
    { id: 'AST-001', name: 'HVAC Unit — Building A',   category: 'Mechanical',  location: 'Block A',  utilization: 88, lastMaint: '2026-07-15', nextMaint: '2026-10-15', status: 'active' },
    { id: 'AST-002', name: 'Generator #3',             category: 'Electrical',  location: 'Power Room',utilization: 62, lastMaint: '2026-05-20', nextMaint: '2026-09-20', status: 'maintenance' },
    { id: 'AST-003', name: 'Solar Array — Rooftop B',  category: 'Renewable',   location: 'Rooftop',   utilization: 76, lastMaint: '2026-08-01', nextMaint: '2026-12-01', status: 'active' },
    { id: 'AST-004', name: 'Water Pump Station #2',    category: 'Plumbing',    location: 'Basement',  utilization: 91, lastMaint: '2026-08-10', nextMaint: '2026-11-10', status: 'active' },
    { id: 'AST-005', name: 'Elevator Block C',         category: 'Mechanical',  location: 'Block C',   utilization: 54, lastMaint: '2026-06-05', nextMaint: '2026-09-05', status: 'maintenance' },
    { id: 'AST-006', name: 'Air Compressor #1',        category: 'Industrial',  location: 'Zone B',    utilization: 38, lastMaint: '2026-09-01', nextMaint: '2026-12-01', status: 'active' },
    { id: 'AST-007', name: 'CCTV Network — Campus',    category: 'Security',    location: 'All Zones', utilization: 98, lastMaint: '2026-08-20', nextMaint: '2026-11-20', status: 'active' },
    { id: 'AST-008', name: 'Diesel Generator Backup',  category: 'Electrical',  location: 'Sub-station',utilization: 44, lastMaint: '2026-07-30', nextMaint: '2026-10-30', status: 'active' },
  ],

  /* --- AI Insights --- */
  insights: [
    {
      icon: '⚡',
      title: 'Energy Anomaly Detected',
      msg: 'Building B recorded 21% higher energy consumption than its 7-day rolling average. Possible HVAC malfunction or unauthorized usage.',
      priority: 'High',
      action: 'View Analysis',
      actionType: 'modal',
      modalTitle: 'Energy Anomaly — Building B',
      modalContent: `
        <div class="modal-stat-grid">
          <div class="modal-stat"><div class="modal-stat-val text-red">+21%</div><div class="modal-stat-lbl">Above Average</div></div>
          <div class="modal-stat"><div class="modal-stat-val">4,890</div><div class="modal-stat-lbl">kWh Today</div></div>
          <div class="modal-stat"><div class="modal-stat-val">4,042</div><div class="modal-stat-lbl">7-Day Avg kWh</div></div>
        </div>
        <p>The energy spike was first detected at <strong>02:14 AM</strong> on September 13, 2026. HVAC Unit A3 and B2 show abnormal draw patterns.</p>
        <p style="margin-top:10px;">AI Model Confidence: <strong>94%</strong></p>
        <div class="modal-alert"><i class="fa-solid fa-triangle-exclamation"></i> Recommend immediate inspection of HVAC units in Building B. Estimated excess cost: ₹8,200 if unresolved.</div>
      `,
    },
    {
      icon: '💧',
      title: 'Water Usage Alert',
      msg: 'Unusual water consumption detected between 2 AM and 5 AM. Possible leakage suspected in underground pipeline — Building C.',
      priority: 'Medium',
      action: 'Investigate',
      actionType: 'toast',
      toastMsg: 'Maintenance team notified. Inspection scheduled for 07:00 AM.',
    },
    {
      icon: '♻️',
      title: 'Waste Collection Forecast',
      msg: 'Waste Bin 04 is expected to reach 90% capacity within the next 6 hours based on current fill rate trends.',
      priority: 'High',
      action: 'Schedule Collection',
      actionType: 'toast',
      toastMsg: 'Collection request sent to Facility Services. ETA: 2 hours.',
    },
    {
      icon: '🌱',
      title: 'Sustainability Improvement',
      msg: 'Adjusting HVAC schedules to align with occupancy patterns may reduce monthly energy consumption by approximately 9%.',
      priority: 'Recommendation',
      action: 'View Recommendation',
      actionType: 'nav',
      navTarget: 'recommendations',
    },
  ],

  /* --- Reports --- */
  reports: [
    { id: 'RPT-001', title: 'Monthly Sustainability Report',   icon: '🌱', iconColor: 'green',  desc: 'Comprehensive monthly overview of all sustainability KPIs including energy, water, waste, and emission metrics.', period: 'August 2026', size: '2.4 MB', format: 'PDF' },
    { id: 'RPT-002', title: 'Energy Performance Report',      icon: '⚡', iconColor: 'amber',  desc: 'Detailed energy consumption analysis, peak demand patterns, solar generation, and cost optimization opportunities.', period: 'August 2026', size: '1.8 MB', format: 'PDF' },
    { id: 'RPT-003', title: 'Water Usage Report',             icon: '💧', iconColor: 'blue',   desc: 'Water consumption trends, storage levels, leakage incidents, and water recycling performance metrics.', period: 'August 2026', size: '1.2 MB', format: 'PDF' },
    { id: 'RPT-004', title: 'Waste Management Report',        icon: '♻️', iconColor: 'green',  desc: 'Waste generation breakdown by category, bin utilization, collection efficiency, and recycling rates.', period: 'August 2026', size: '980 KB', format: 'PDF' },
    { id: 'RPT-005', title: 'Safety Incident Report',         icon: '🛡️', iconColor: 'red',    desc: 'Summary of all safety incidents, near-misses, resolution status, and compliance scores for the reporting period.', period: 'August 2026', size: '760 KB', format: 'PDF' },
    { id: 'RPT-006', title: 'Asset Utilization Report',       icon: '⚙️', iconColor: 'purple', desc: 'Asset utilization rates, maintenance schedules, underperforming equipment, and lifecycle cost analysis.', period: 'August 2026', size: '1.1 MB', format: 'PDF' },
  ],
};

/* ============================================================
   SECTION 2: STATE
   ============================================================ */

const STATE = {
  currentPage: 'overview',
  currentFacility: 'all',
  currentDateRange: 30,
  darkMode: false,
  charts: {},   // Holds Chart.js instances for destruction
};

/* ============================================================
   SECTION 3: UTILITIES
   ============================================================ */

/** Safely destroy a Chart.js instance */
function destroyChart(key) {
  if (STATE.charts[key]) {
    STATE.charts[key].destroy();
    delete STATE.charts[key];
  }
}

/** Format number with comma separators */
function fmtNum(n) {
  return n.toLocaleString('en-IN');
}

/** Get severity class */
function sevClass(sev) {
  const map = { Critical: 'sev-critical', High: 'sev-high', Medium: 'sev-medium', Low: 'sev-low', Resolved: 'sev-resolved' };
  return map[sev] || 'sev-low';
}

/** Get status class */
function statClass(st) {
  const map = { Open: 'stat-open', Investigating: 'stat-investigating', Reviewed: 'stat-reviewed', Resolved: 'stat-resolved', Active: 'stat-active', active: 'stat-active', maintenance: 'stat-maintenance', Inactive: 'stat-inactive' };
  return map[st] || 'stat-open';
}

/** Score level class */
function scoreClass(score) {
  if (score >= 85) return 'excellent';
  if (score >= 70) return 'good';
  if (score >= 55) return 'moderate';
  return 'critical';
}

/** Show loading overlay briefly */
function showLoading(ms = 400) {
  const overlay = document.getElementById('loadingOverlay');
  overlay.classList.add('active');
  return new Promise(resolve => setTimeout(() => {
    overlay.classList.remove('active');
    resolve();
  }, ms));
}

/** Format date nicely */
function fmtDate(d) {
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

/** Get last 30 day labels */
function getLast30DayLabels() {
  const labels = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    labels.push(`Sep-${d.getDate()}`);
  }
  return labels;
}

/* ============================================================
   SECTION 4: TOAST NOTIFICATIONS
   ============================================================ */

function showToast(title, msg, type = 'success', duration = 4000) {
  const icons = { success: 'fa-circle-check', warning: 'fa-triangle-exclamation', error: 'fa-circle-xmark', info: 'fa-circle-info' };
  const container = document.getElementById('toastContainer');

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <i class="fa-solid ${icons[type] || icons.info} toast-icon"></i>
    <div class="toast-body">
      <div class="toast-title">${title}</div>
      ${msg ? `<div class="toast-msg">${msg}</div>` : ''}
    </div>
    <button class="toast-close" aria-label="Dismiss notification"><i class="fa-solid fa-xmark"></i></button>
  `;

  container.appendChild(toast);

  const closeBtn = toast.querySelector('.toast-close');
  closeBtn.addEventListener('click', () => dismissToast(toast));

  const timer = setTimeout(() => dismissToast(toast), duration);
  toast._timer = timer;
}

function dismissToast(toast) {
  if (toast._timer) clearTimeout(toast._timer);
  toast.classList.add('fade-out');
  setTimeout(() => toast.remove(), 320);
}

/* ============================================================
   SECTION 5: MODAL
   ============================================================ */

function openModal(title, bodyHTML, actionLabel = 'Take Action', onAction = null) {
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalBody').innerHTML = bodyHTML;

  const actionBtn = document.getElementById('modalActionBtn');
  actionBtn.textContent = actionLabel;
  actionBtn.onclick = () => {
    if (onAction) onAction();
    closeModal();
  };

  document.getElementById('modalOverlay').classList.add('open');
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
}

/* ============================================================
   SECTION 6: NAVIGATION
   ============================================================ */

function navigateTo(page) {
  // Update sidebar active
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.page === page);
  });

  // Page title map
  const titles = {
    overview:        'Facility Intelligence Overview',
    sustainability:  'Sustainability Dashboard',
    energy:          'Energy Intelligence',
    water:           'Water Management',
    air:             'Air Quality Monitoring',
    waste:           'Waste Management',
    traffic:         'Traffic & Parking',
    assets:          'Asset Utilization',
    safety:          'Safety Monitoring',
    forecast:        'Forecast & Anomaly Detection',
    recommendations: 'AI Recommendations',
    reports:         'Reports & Analytics',
    facilities:      'Facility Management',
    settings:        'Settings & Preferences',
  };

  document.getElementById('pageTitle').textContent = titles[page] || page;

  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));

  // Show target page
  const target = document.getElementById(`page-${page}`);
  if (target) target.classList.remove('hidden');

  STATE.currentPage = page;

  // Close sidebar on mobile
  if (window.innerWidth < 768) {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebarOverlay').classList.remove('active');
  }

  // Render page content
  renderPage(page);
}

/* ============================================================
   SECTION 7: PAGE RENDERERS
   ============================================================ */

async function renderPage(page) {
  await showLoading(350);

  switch(page) {
    case 'overview':        renderOverview(); break;
    case 'sustainability':  renderSustainability(); break;
    case 'energy':          renderEnergy(); break;
    case 'water':           renderWater(); break;
    case 'air':             renderAir(); break;
    case 'waste':           renderWaste(); break;
    case 'traffic':         renderTraffic(); break;
    case 'assets':          renderAssets(); break;
    case 'safety':          renderSafety(); break;
    case 'forecast':        renderForecast(); break;
    case 'recommendations': renderRecommendations(); break;
    case 'reports':         renderReports(); break;
    case 'facilities':      renderFacilities(); break;
    case 'settings':        /* static HTML */; break;
  }
}

/* ---- 7A: OVERVIEW ---- */
function renderOverview() {
  renderKPIs();
  renderEnergyTrendChart('daily');
  renderSustainabilityRadar();
  renderWaterWasteChart();
  renderFacilityUtilChart();
  renderInsights();
}

function renderKPIs() {
  const kpi = DATA.kpis[STATE.currentFacility];
  const container = document.getElementById('kpiGrid');

  const cards = [
    {
      label: 'Total Energy Consumption', value: `${fmtNum(kpi.energy)} kWh`,
      change: kpi.energyChange, icon: 'fa-bolt', colorClass: 'kpi-green', iconClass: 'green',
      status: kpi.energyChange < 0 ? 'Improving' : 'Monitor',
      statusBadge: kpi.energyChange < 0 ? 'badge-improving' : 'badge-monitor',
      sparkId: 'spark-energy',
    },
    {
      label: 'Water Consumption', value: `${fmtNum(kpi.water)} KL`,
      change: kpi.waterChange, icon: 'fa-droplet', colorClass: 'kpi-blue', iconClass: 'blue',
      status: kpi.waterChange < 3 ? 'Stable' : 'Monitor',
      statusBadge: kpi.waterChange < 3 ? 'badge-good' : 'badge-monitor',
      sparkId: 'spark-water',
    },
    {
      label: 'Air Quality Index', value: `${kpi.aqi} AQI`,
      change: null, icon: 'fa-wind', colorClass: 'kpi-cyan', iconClass: 'cyan',
      status: kpi.aqi < 70 ? 'Good' : kpi.aqi < 90 ? 'Moderate' : 'Poor',
      statusBadge: kpi.aqi < 70 ? 'badge-good' : kpi.aqi < 90 ? 'badge-moderate' : 'badge-attention',
      sparkId: 'spark-aqi',
    },
    {
      label: 'Waste Generated', value: `${fmtNum(kpi.waste)} kg`,
      change: kpi.wasteChange, icon: 'fa-recycle', colorClass: 'kpi-green', iconClass: 'green',
      status: kpi.wasteChange < 0 ? 'Improving' : 'Monitor',
      statusBadge: kpi.wasteChange < 0 ? 'badge-improving' : 'badge-monitor',
      sparkId: 'spark-waste',
    },
    {
      label: 'Active Alerts', value: `${kpi.alerts}`,
      change: null, icon: 'fa-triangle-exclamation', colorClass: 'kpi-red', iconClass: 'red',
      status: `${kpi.alertCritical} Critical`,
      statusBadge: kpi.alertCritical > 0 ? 'badge-attention' : 'badge-good',
      sparkId: 'spark-alerts',
    },
    {
      label: 'Sustainability Score', value: `${kpi.score}/100`,
      change: kpi.scoreChange, icon: 'fa-leaf', colorClass: 'kpi-green', iconClass: 'green',
      status: kpi.score >= 80 ? 'Excellent' : 'Good',
      statusBadge: kpi.score >= 80 ? 'badge-excellent' : 'badge-good',
      sparkId: 'spark-score',
    },
  ];

  container.innerHTML = cards.map((c, i) => {
    const trendIcon = c.change !== null ? (c.change < 0 ? 'fa-arrow-trend-down trend-down' : 'fa-arrow-trend-up trend-up') : '';
    const trendHtml = c.change !== null
      ? `<i class="fa-solid ${trendIcon}"></i> ${c.change > 0 ? '+' : ''}${c.change}%`
      : '';

    return `
      <div class="kpi-card ${c.colorClass}">
        <div class="kpi-header">
          <div class="kpi-icon ${c.iconClass}"><i class="fa-solid ${c.icon}"></i></div>
          <span class="kpi-status-badge ${c.statusBadge}">${c.status}</span>
        </div>
        <div class="kpi-label">${c.label}</div>
        <div class="kpi-value">${c.value}</div>
        ${trendHtml ? `<div class="kpi-trend ${c.change < 0 ? 'trend-down' : 'trend-up'}">${trendHtml} <span style="color:var(--color-text-muted);font-weight:400">vs prev period</span></div>` : ''}
        <div class="kpi-sparkline"><canvas id="${c.sparkId}"></canvas></div>
      </div>
    `;
  }).join('');

  // Render sparklines
  const sparkData = {
    'spark-energy': [4380,4290,4150,4070,4420,4310,4180,4090,4250,4240],
    'spark-water':  [6920,7140,6820,7280,7050,5640,4880,6980,7200,6940],
    'spark-aqi':    [68,72,69,74,78,76,72,70,74,72],
    'spark-waste':  [420,390,440,410,460,320,280,430,400,400],
    'spark-alerts': [8,10,9,12,11,9,10,13,11,12],
    'spark-score':  [79,80,81,82,81,83,82,84,83,84],
  };

  requestAnimationFrame(() => {
    Object.entries(sparkData).forEach(([id, data]) => {
      const canvas = document.getElementById(id);
      if (!canvas) return;
      destroyChart(id);
      STATE.charts[id] = new Chart(canvas, {
        type: 'line',
        data: {
          labels: data.map((_, i) => i),
          datasets: [{
            data,
            borderColor: id === 'spark-alerts' ? '#ef4444' : '#10b981',
            borderWidth: 1.5,
            fill: true,
            backgroundColor: id === 'spark-alerts' ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
            tension: 0.4,
            pointRadius: 0,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false }, tooltip: { enabled: false } },
          scales: { x: { display: false }, y: { display: false } },
          animation: { duration: 600 },
        },
      });
    });
  });
}

function renderEnergyTrendChart(period) {
  destroyChart('energyTrend');

  let labels, actual, prev;
  if (period === 'daily') {
    labels = getLast30DayLabels();
    const fKey = STATE.currentFacility;
    actual = DATA.energy30Days[fKey] || DATA.energy30Days['all'];
    prev = DATA.energy30Days.prev;
  } else if (period === 'weekly') {
    labels = DATA.energyWeekly.labels;
    actual = DATA.energyWeekly.actual;
    prev = DATA.energyWeekly.prev;
  } else {
    labels = DATA.energyMonthly.labels;
    actual = DATA.energyMonthly.actual;
    prev = DATA.energyMonthly.prev;
  }

  const canvas = document.getElementById('energyTrendChart');
  if (!canvas) return;

  STATE.charts.energyTrend = new Chart(canvas, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Current Period (kWh)',
          data: actual,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16,185,129,0.08)',
          borderWidth: 2.5,
          fill: true,
          tension: 0.4,
          pointRadius: period === 'daily' ? 0 : 4,
          pointHoverRadius: 6,
        },
        {
          label: 'Previous Period (kWh)',
          data: prev,
          borderColor: '#94a3b8',
          backgroundColor: 'rgba(148,163,184,0.05)',
          borderWidth: 1.5,
          fill: false,
          tension: 0.4,
          borderDash: [4, 4],
          pointRadius: 0,
          pointHoverRadius: 5,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 2.8,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          position: 'top',
          align: 'end',
          labels: { boxWidth: 12, font: { size: 11 }, color: '#64748b', padding: 16 },
        },
        tooltip: {
          backgroundColor: '#1e293b',
          titleColor: '#f1f5f9',
          bodyColor: '#94a3b8',
          borderColor: '#334155',
          borderWidth: 1,
          padding: 10,
          callbacks: {
            label: ctx => ` ${ctx.dataset.label}: ${fmtNum(ctx.raw)} kWh`,
          },
        },
      },
      scales: {
        x: {
          grid: { color: 'rgba(0,0,0,0.04)' },
          ticks: { color: '#94a3b8', font: { size: 10 }, maxTicksLimit: 10 },
        },
        y: {
          grid: { color: 'rgba(0,0,0,0.04)' },
          ticks: { color: '#94a3b8', font: { size: 10 }, callback: v => fmtNum(v) },
          title: { display: true, text: 'kWh', color: '#94a3b8', font: { size: 10 } },
        },
      },
      animation: { duration: 700 },
    },
  });
}

function renderSustainabilityRadar() {
  destroyChart('sustainRadar');

  const scores = DATA.sustainability[STATE.currentFacility];
  const canvas = document.getElementById('sustainabilityRadar');
  if (!canvas) return;

  const el = document.getElementById('overallScoreDisplay');
  if (el) el.textContent = scores.overall;

  STATE.charts.sustainRadar = new Chart(canvas, {
    type: 'radar',
    data: {
      labels: ['Energy', 'Water', 'Waste', 'Emissions', 'Safety', 'Assets'],
      datasets: [{
        label: 'Score',
        data: [scores.energy, scores.water, scores.waste, scores.emission, scores.safety, scores.asset],
        backgroundColor: 'rgba(16,185,129,0.15)',
        borderColor: '#10b981',
        borderWidth: 2,
        pointBackgroundColor: '#10b981',
        pointRadius: 4,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 1.4,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => ` ${ctx.raw}/100` } },
      },
      scales: {
        r: {
          min: 0, max: 100,
          grid: { color: 'rgba(0,0,0,0.06)' },
          angleLines: { color: 'rgba(0,0,0,0.06)' },
          ticks: { display: false, stepSize: 25 },
          pointLabels: { font: { size: 11, weight: '600' }, color: '#64748b' },
        },
      },
      animation: { duration: 800 },
    },
  });
}

function renderWaterWasteChart() {
  destroyChart('waterWaste');
  const canvas = document.getElementById('waterWasteChart');
  if (!canvas) return;

  const d = DATA.waterWaste7;
  STATE.charts.waterWaste = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: d.labels,
      datasets: [
        {
          label: 'Water (KL)',
          data: d.water,
          backgroundColor: 'rgba(59,130,246,0.7)',
          borderColor: '#3b82f6',
          borderWidth: 1,
          borderRadius: 4,
          yAxisID: 'y',
        },
        {
          label: 'Waste (kg)',
          data: d.waste,
          type: 'line',
          borderColor: '#10b981',
          backgroundColor: 'rgba(16,185,129,0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 3,
          yAxisID: 'y1',
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 1.6,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          position: 'top',
          align: 'end',
          labels: { boxWidth: 10, font: { size: 10 }, color: '#64748b' },
        },
        tooltip: { backgroundColor: '#1e293b', titleColor: '#f1f5f9', bodyColor: '#94a3b8', borderColor: '#334155', borderWidth: 1 },
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 10 } } },
        y: { position: 'left', ticks: { color: '#94a3b8', font: { size: 10 } }, grid: { color: 'rgba(0,0,0,0.04)' } },
        y1: { position: 'right', grid: { display: false }, ticks: { color: '#10b981', font: { size: 10 } } },
      },
    },
  });
}

function renderFacilityUtilChart() {
  destroyChart('facilityUtil');
  const canvas = document.getElementById('facilityUtilChart');
  if (!canvas) return;

  const d = DATA.facilityUtil;
  const colors = d.values.map(v => v >= 90 ? '#ef4444' : v >= 80 ? '#f59e0b' : v >= 60 ? '#3b82f6' : '#10b981');

  STATE.charts.facilityUtil = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: d.labels,
      datasets: [{
        label: 'Utilization (%)',
        data: d.values,
        backgroundColor: colors.map(c => c + 'bb'),
        borderColor: colors,
        borderWidth: 1.5,
        borderRadius: 5,
        borderSkipped: false,
      }],
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 1.6,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: { label: ctx => ` ${ctx.raw}% Utilization` },
          backgroundColor: '#1e293b', titleColor: '#f1f5f9', bodyColor: '#94a3b8',
        },
      },
      scales: {
        x: {
          min: 0, max: 100,
          grid: { color: 'rgba(0,0,0,0.04)' },
          ticks: { callback: v => `${v}%`, color: '#94a3b8', font: { size: 10 } },
        },
        y: { grid: { display: false }, ticks: { color: '#475569', font: { size: 11 } } },
      },
      animation: { duration: 700 },
    },
  });
}

function renderInsights() {
  const container = document.getElementById('insightGrid');
  if (!container) return;

  container.innerHTML = DATA.insights.map(ins => `
    <div class="insight-card">
      <div class="insight-card-top">
        <span class="insight-icon">${ins.icon}</span>
        <span class="priority-badge priority-${ins.priority.toLowerCase()}">${ins.priority}</span>
      </div>
      <div class="insight-title">${ins.title}</div>
      <p class="insight-msg">${ins.msg}</p>
      <button class="btn btn-primary btn-sm" data-insight-action="${ins.actionType}"
        data-insight-modal-title="${ins.modalTitle || ''}"
        data-insight-modal-content="${encodeURIComponent(ins.modalContent || '')}"
        data-insight-toast="${ins.toastMsg || ''}"
        data-insight-nav="${ins.navTarget || ''}">
        ${ins.action}
      </button>
    </div>
  `).join('');
}

/* ---- 7B: SUSTAINABILITY ---- */
function renderSustainability() {
  const scores = DATA.sustainability[STATE.currentFacility];
  const container = document.getElementById('sustainabilityContent');
  if (!container) return;

  container.innerHTML = `
    <div class="charts-grid">
      <div class="chart-card col-1">
        <div class="chart-card-header"><div>
          <h3 class="chart-title">Overall Score</h3>
          <p class="chart-subtitle">Composite sustainability rating</p>
        </div></div>
        <div class="gauge-wrap">
          <div class="gauge-value">${scores.overall}</div>
          <div class="gauge-label">out of 100</div>
          <div class="gauge-grade">${scores.overall >= 85 ? 'Excellent' : scores.overall >= 70 ? 'Good' : 'Needs Improvement'}</div>
          <canvas id="sustainDonut" style="max-width:180px;margin-top:16px;" aria-label="Overall Sustainability Donut Chart"></canvas>
        </div>
      </div>
      <div class="chart-card col-2">
        <div class="chart-card-header"><div>
          <h3 class="chart-title">Score Breakdown</h3>
          <p class="chart-subtitle">Performance by category</p>
        </div></div>
        <div style="padding-top:8px;">
          ${[
            ['Energy Efficiency', scores.energy],
            ['Water Efficiency', scores.water],
            ['Waste Management', scores.waste],
            ['Emission Control', scores.emission],
            ['Safety Score', scores.safety],
            ['Asset Utilization', scores.asset],
          ].map(([label, val]) => `
            <div class="score-row">
              <div class="score-row-label">${label}</div>
              <div class="score-bar-wrap">
                <div class="score-bar">
                  <div class="score-bar-fill ${scoreClass(val)}" style="width:${val}%"></div>
                </div>
              </div>
              <div class="score-row-val">${val}</div>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="chart-card col-3">
        <div class="chart-card-header"><div>
          <h3 class="chart-title">Score Trend — Last 6 Months</h3>
          <p class="chart-subtitle">Monthly sustainability score progression</p>
        </div></div>
        <div class="chart-body">
          <canvas id="scoreTrendChart" aria-label="Score Trend Chart"></canvas>
        </div>
      </div>
    </div>
  `;

  requestAnimationFrame(() => {
    // Donut
    destroyChart('sustainDonut');
    STATE.charts.sustainDonut = new Chart(document.getElementById('sustainDonut'), {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [scores.overall, 100 - scores.overall],
          backgroundColor: ['#10b981', '#e2e8f0'],
          borderWidth: 0,
          circumference: 270,
          rotation: 225,
        }],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        cutout: '78%',
        animation: { duration: 900 },
      },
    });

    // Score Trend
    destroyChart('scoreTrend');
    STATE.charts.scoreTrend = new Chart(document.getElementById('scoreTrendChart'), {
      type: 'line',
      data: {
        labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
        datasets: [{
          label: 'Sustainability Score',
          data: [76, 78, 80, 81, 83, scores.overall],
          borderColor: '#10b981',
          backgroundColor: 'rgba(16,185,129,0.1)',
          borderWidth: 2.5,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#10b981',
          pointRadius: 5,
          pointHoverRadius: 7,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 3.5,
        plugins: {
          legend: { display: false },
          tooltip: { backgroundColor: '#1e293b', titleColor: '#f1f5f9', bodyColor: '#94a3b8' },
        },
        scales: {
          y: { min: 60, max: 100, grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { color: '#94a3b8', font: { size: 10 } } },
          x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 10 } } },
        },
      },
    });
  });
}

/* ---- 7C: ENERGY ---- */
function renderEnergy() {
  const kpi = DATA.kpis[STATE.currentFacility];
  const container = document.getElementById('energyContent');
  if (!container) return;

  container.innerHTML = `
    <div class="mini-kpi-grid">
      <div class="mini-kpi">
        <div class="mini-kpi-label">Total Consumption</div>
        <div class="mini-kpi-val">${fmtNum(kpi.energy)} kWh</div>
        <div class="mini-kpi-change ${kpi.energyChange < 0 ? 'trend-down' : 'trend-up'}">${kpi.energyChange > 0 ? '+' : ''}${kpi.energyChange}% vs prev</div>
      </div>
      <div class="mini-kpi">
        <div class="mini-kpi-label">Peak Demand</div>
        <div class="mini-kpi-val">284 kW</div>
        <div class="mini-kpi-change trend-up">+4.2% vs avg</div>
      </div>
      <div class="mini-kpi">
        <div class="mini-kpi-label">Solar Generated</div>
        <div class="mini-kpi-val">18,240 kWh</div>
        <div class="mini-kpi-change trend-down">-2.1% cloud cover</div>
      </div>
      <div class="mini-kpi">
        <div class="mini-kpi-label">Energy Cost</div>
        <div class="mini-kpi-val">₹9.84L</div>
        <div class="mini-kpi-change trend-down">-8.4% savings</div>
      </div>
    </div>
    <div class="charts-grid">
      <div class="chart-card col-2">
        <div class="chart-card-header">
          <div><h3 class="chart-title">Consumption Trend</h3><p class="chart-subtitle">Daily energy usage over 30 days</p></div>
        </div>
        <div class="chart-body"><canvas id="energyPageTrendChart" aria-label="Energy Page Trend Chart"></canvas></div>
      </div>
      <div class="chart-card col-1">
        <div class="chart-card-header">
          <div><h3 class="chart-title">Energy Sources</h3><p class="chart-subtitle">Grid vs Renewable split</p></div>
        </div>
        <div class="chart-body"><canvas id="energySourceChart" aria-label="Energy Source Chart"></canvas></div>
      </div>
      <div class="chart-card col-1">
        <div class="chart-card-header">
          <div><h3 class="chart-title">Building-wise Usage</h3><p class="chart-subtitle">Consumption by block</p></div>
        </div>
        <div class="chart-body"><canvas id="buildingEnergyChart" aria-label="Building Energy Chart"></canvas></div>
      </div>
      <div class="chart-card col-2">
        <div class="chart-card-header">
          <div><h3 class="chart-title">Peak Demand Profile</h3><p class="chart-subtitle">24-hour demand curve</p></div>
        </div>
        <div class="chart-body"><canvas id="peakDemandChart" aria-label="Peak Demand Chart"></canvas></div>
      </div>
    </div>
  `;

  requestAnimationFrame(() => {
    // Trend
    destroyChart('energyPageTrend');
    const fKey = STATE.currentFacility;
    const actual = DATA.energy30Days[fKey] || DATA.energy30Days['all'];
    STATE.charts.energyPageTrend = new Chart(document.getElementById('energyPageTrendChart'), {
      type: 'line',
      data: {
        labels: getLast30DayLabels(),
        datasets: [{
          label: 'Energy (kWh)',
          data: actual,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16,185,129,0.1)',
          borderWidth: 2.5,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 5,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 2.5,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: ctx => ` ${fmtNum(ctx.raw)} kWh` }, backgroundColor: '#1e293b', titleColor: '#f1f5f9', bodyColor: '#94a3b8' },
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 10 }, maxTicksLimit: 8 } },
          y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { color: '#94a3b8', font: { size: 10 } } },
        },
      },
    });

    // Source Donut
    destroyChart('energySource');
    STATE.charts.energySource = new Chart(document.getElementById('energySourceChart'), {
      type: 'doughnut',
      data: {
        labels: ['Grid', 'Solar', 'Diesel Gen'],
        datasets: [{
          data: [68, 24, 8],
          backgroundColor: ['#3b82f6', '#f59e0b', '#64748b'],
          borderWidth: 0,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 1.6,
        plugins: {
          legend: { position: 'bottom', labels: { font: { size: 11 }, color: '#64748b', boxWidth: 10 } },
          tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.raw}%` } },
        },
        cutout: '65%',
      },
    });

    // Building Energy Bar
    destroyChart('buildingEnergy');
    STATE.charts.buildingEnergy = new Chart(document.getElementById('buildingEnergyChart'), {
      type: 'bar',
      data: {
        labels: ['Block A','Block B','Block C','Block D','Parking'],
        datasets: [{
          label: 'kWh',
          data: [3420, 4890, 2840, 3100, 1080],
          backgroundColor: ['rgba(16,185,129,0.7)','rgba(239,68,68,0.7)','rgba(59,130,246,0.7)','rgba(245,158,11,0.7)','rgba(100,116,139,0.7)'],
          borderRadius: 4,
          borderSkipped: false,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 1.5,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: ctx => ` ${fmtNum(ctx.raw)} kWh` }, backgroundColor: '#1e293b', titleColor: '#f1f5f9', bodyColor: '#94a3b8' },
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 10 } } },
          y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { color: '#94a3b8', font: { size: 10 } } },
        },
      },
    });

    // Peak Demand
    const hours = Array.from({length: 24}, (_, i) => `${i.toString().padStart(2,'0')}:00`);
    const demand = [42,38,35,33,31,34,52,84,162,218,246,232,198,184,196,210,240,264,248,220,184,142,98,62];
    destroyChart('peakDemand');
    STATE.charts.peakDemand = new Chart(document.getElementById('peakDemandChart'), {
      type: 'line',
      data: {
        labels: hours,
        datasets: [{
          label: 'Demand (kW)',
          data: demand,
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245,158,11,0.1)',
          borderWidth: 2.5,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 5,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 2.5,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: ctx => ` ${ctx.raw} kW` }, backgroundColor: '#1e293b', titleColor: '#f1f5f9', bodyColor: '#94a3b8' },
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 10 }, maxTicksLimit: 12 } },
          y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { color: '#94a3b8', font: { size: 10 } }, title: { display: true, text: 'kW', color: '#94a3b8', font: { size: 10 } } },
        },
      },
    });
  });
}

/* ---- 7D: WATER ---- */
function renderWater() {
  const wd = DATA.water[STATE.currentFacility];
  const container = document.getElementById('waterContent');
  if (!container) return;

  container.innerHTML = `
    <div class="mini-kpi-grid">
      <div class="mini-kpi">
        <div class="mini-kpi-label">Total Consumption</div>
        <div class="mini-kpi-val">${fmtNum(wd.consumption)} KL</div>
        <div class="mini-kpi-change text-muted">This month</div>
      </div>
      <div class="mini-kpi">
        <div class="mini-kpi-label">Storage Level</div>
        <div class="mini-kpi-val">${wd.storageLevel}%</div>
        <div class="mini-kpi-change ${wd.storageLevel > 70 ? 'trend-down' : 'trend-up'}">${wd.storageLevel > 70 ? 'Adequate' : 'Low'}</div>
      </div>
      <div class="mini-kpi">
        <div class="mini-kpi-label">Leakage Alerts</div>
        <div class="mini-kpi-val">${wd.leakAlerts}</div>
        <div class="mini-kpi-change ${wd.leakAlerts > 0 ? 'trend-up' : 'trend-down'}">${wd.leakAlerts > 0 ? 'Active alerts' : 'No active alerts'}</div>
      </div>
      <div class="mini-kpi">
        <div class="mini-kpi-label">Recycled Water</div>
        <div class="mini-kpi-val">${wd.recycled}%</div>
        <div class="mini-kpi-change trend-down">+3.2% from last month</div>
      </div>
    </div>
    <div class="charts-grid">
      <div class="chart-card col-2">
        <div class="chart-card-header"><div><h3 class="chart-title">Water Consumption Trend</h3><p class="chart-subtitle">Daily consumption over 14 days</p></div></div>
        <div class="chart-body"><canvas id="waterTrendChart" aria-label="Water Trend Chart"></canvas></div>
      </div>
      <div class="chart-card col-1">
        <div class="chart-card-header"><div><h3 class="chart-title">Storage Level</h3><p class="chart-subtitle">Current reservoir status</p></div></div>
        <div class="chart-body" style="display:flex;align-items:center;justify-content:center;padding:20px 0;">
          <canvas id="storageLevelChart" style="max-width:200px;" aria-label="Storage Level Chart"></canvas>
        </div>
      </div>
    </div>
  `;

  requestAnimationFrame(() => {
    // Water Trend
    destroyChart('waterTrend');
    const labels14 = Array.from({length: 14}, (_, i) => `Sep-${i + 1}`);
    const vals14 = [6920,7140,6820,7280,7050,5640,4880,6980,7200,6900,7320,7100,6940,7020];
    STATE.charts.waterTrend = new Chart(document.getElementById('waterTrendChart'), {
      type: 'line',
      data: {
        labels: labels14,
        datasets: [{
          label: 'Water (KL)',
          data: vals14,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59,130,246,0.1)',
          borderWidth: 2.5,
          fill: true,
          tension: 0.4,
          pointRadius: 3,
          pointHoverRadius: 6,
          pointBackgroundColor: '#3b82f6',
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 2.5,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: ctx => ` ${fmtNum(ctx.raw)} KL` }, backgroundColor: '#1e293b', titleColor: '#f1f5f9', bodyColor: '#94a3b8' },
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 10 } } },
          y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { color: '#94a3b8', font: { size: 10 } } },
        },
      },
    });

    // Storage Level Donut
    destroyChart('storageLevel');
    STATE.charts.storageLevel = new Chart(document.getElementById('storageLevelChart'), {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [wd.storageLevel, 100 - wd.storageLevel],
          backgroundColor: [wd.storageLevel > 60 ? '#3b82f6' : '#ef4444', '#e2e8f0'],
          borderWidth: 0,
        }],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: ctx => ctx.dataIndex === 0 ? ` Used: ${wd.storageLevel}%` : ` Empty: ${100 - wd.storageLevel}%` } },
        },
        cutout: '72%',
        plugins2: [],
      },
    });
  });
}

/* ---- 7E: AIR QUALITY ---- */
function renderAir() {
  const air = DATA.air[STATE.currentFacility];
  const container = document.getElementById('airContent');
  if (!container) return;

  const aqiColor = air.aqi < 50 ? '#10b981' : air.aqi < 100 ? '#f59e0b' : '#ef4444';

  container.innerHTML = `
    <div class="charts-grid">
      <div class="chart-card col-1">
        <div class="chart-card-header"><div><h3 class="chart-title">Air Quality Index</h3></div></div>
        <div class="aqi-display">
          <div class="aqi-number" style="color:${aqiColor}">${air.aqi}</div>
          <div class="aqi-label" style="color:${aqiColor}">${air.category}</div>
          <div class="aqi-category">AQI Scale: 0–50 Good | 51–100 Moderate | 101+ Unhealthy</div>
        </div>
        <div class="pollutant-grid">
          <div class="pollutant-card">
            <div class="pollutant-name">PM2.5</div>
            <div class="pollutant-value">${air.pm25}<span class="pollutant-unit">μg/m³</span></div>
          </div>
          <div class="pollutant-card">
            <div class="pollutant-name">PM10</div>
            <div class="pollutant-value">${air.pm10}<span class="pollutant-unit">μg/m³</span></div>
          </div>
          <div class="pollutant-card">
            <div class="pollutant-name">CO2</div>
            <div class="pollutant-value">${air.co2}<span class="pollutant-unit">ppm</span></div>
          </div>
          <div class="pollutant-card">
            <div class="pollutant-name">Temperature</div>
            <div class="pollutant-value">${air.temp}<span class="pollutant-unit">°C</span></div>
          </div>
          <div class="pollutant-card">
            <div class="pollutant-name">Humidity</div>
            <div class="pollutant-value">${air.humidity}<span class="pollutant-unit">%</span></div>
          </div>
          <div class="pollutant-card">
            <div class="pollutant-name">O3 (Ozone)</div>
            <div class="pollutant-value">0.04<span class="pollutant-unit">ppm</span></div>
          </div>
        </div>
      </div>
      <div class="chart-card col-2">
        <div class="chart-card-header"><div><h3 class="chart-title">Air Quality Trend</h3><p class="chart-subtitle">Last 14 days AQI readings</p></div></div>
        <div class="chart-body"><canvas id="aqiTrendChart" aria-label="AQI Trend Chart"></canvas></div>
      </div>
    </div>
  `;

  requestAnimationFrame(() => {
    destroyChart('aqiTrend');
    const aqiVals = [64,68,72,70,74,78,76,72,70,74,72,69,74,air.aqi];
    const aqiColors = aqiVals.map(v => v < 50 ? '#10b981' : v < 100 ? '#f59e0b' : '#ef4444');

    STATE.charts.aqiTrend = new Chart(document.getElementById('aqiTrendChart'), {
      type: 'line',
      data: {
        labels: Array.from({length:14}, (_,i) => `Sep-${i+1}`),
        datasets: [{
          label: 'AQI',
          data: aqiVals,
          borderColor: aqiColor,
          backgroundColor: `${aqiColor}15`,
          borderWidth: 2.5,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: aqiColors,
          pointRadius: 4,
          pointHoverRadius: 7,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 2.2,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: ctx => ` AQI: ${ctx.raw}` }, backgroundColor: '#1e293b', titleColor: '#f1f5f9', bodyColor: '#94a3b8' },
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 10 } } },
          y: { min: 0, max: 150, grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { color: '#94a3b8', font: { size: 10 } } },
        },
      },
    });
  });
}

/* ---- 7F: WASTE ---- */
function renderWaste() {
  const wd = DATA.waste[STATE.currentFacility];
  const container = document.getElementById('wasteContent');
  if (!container) return;

  const bins = [
    { name: 'Bin 01', pct: 45, color: '#10b981' },
    { name: 'Bin 02', pct: 68, color: '#f59e0b' },
    { name: 'Bin 03', pct: 82, color: '#f59e0b' },
    { name: 'Bin 04', pct: 91, color: '#ef4444' },
    { name: 'Bin 05', pct: 34, color: '#10b981' },
    { name: 'Bin 06', pct: 57, color: '#3b82f6' },
    { name: 'Bin 07', pct: 76, color: '#f59e0b' },
    { name: 'Bin 08', pct: 22, color: '#10b981' },
  ];

  container.innerHTML = `
    <div class="mini-kpi-grid">
      <div class="mini-kpi">
        <div class="mini-kpi-label">Total Waste</div>
        <div class="mini-kpi-val">${fmtNum(wd.total)} kg</div>
        <div class="mini-kpi-change text-muted">This month</div>
      </div>
      <div class="mini-kpi">
        <div class="mini-kpi-label">Recyclable</div>
        <div class="mini-kpi-val">${fmtNum(wd.recyclable)} kg</div>
        <div class="mini-kpi-change trend-down">${((wd.recyclable/wd.total)*100).toFixed(0)}% recycled</div>
      </div>
      <div class="mini-kpi">
        <div class="mini-kpi-label">Organic</div>
        <div class="mini-kpi-val">${fmtNum(wd.organic)} kg</div>
        <div class="mini-kpi-change text-muted">Composting eligible</div>
      </div>
      <div class="mini-kpi">
        <div class="mini-kpi-label">Non-Recyclable</div>
        <div class="mini-kpi-val">${fmtNum(wd.nonRecyclable)} kg</div>
        <div class="mini-kpi-change ${wd.overflow > 0 ? 'trend-up' : 'trend-down'}">${wd.overflow > 0 ? 'Overflow risk' : 'Managed'}</div>
      </div>
    </div>
    <div class="charts-grid">
      <div class="chart-card col-1">
        <div class="chart-card-header"><div><h3 class="chart-title">Waste Composition</h3><p class="chart-subtitle">Category breakdown</p></div></div>
        <div class="chart-body"><canvas id="wasteCompositionChart" aria-label="Waste Composition Chart"></canvas></div>
      </div>
      <div class="chart-card col-2">
        <div class="chart-card-header"><div><h3 class="chart-title">Bin Capacity Status</h3><p class="chart-subtitle">Real-time fill levels</p></div></div>
        <div class="bin-grid">
          ${bins.map(bin => `
            <div class="bin-card">
              <div class="bin-name">${bin.name}</div>
              <div class="bin-capacity-ring" style="--fill-color:${bin.color};--fill-pct:${bin.pct * 3.6}deg">
                <div class="bin-pct">${bin.pct}%</div>
              </div>
              <div class="bin-status" style="color:${bin.color}">${bin.pct >= 85 ? 'Critical' : bin.pct >= 70 ? 'High' : 'Normal'}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  requestAnimationFrame(() => {
    destroyChart('wasteComposition');
    STATE.charts.wasteComposition = new Chart(document.getElementById('wasteCompositionChart'), {
      type: 'doughnut',
      data: {
        labels: ['Recyclable', 'Organic', 'Non-Recyclable'],
        datasets: [{
          data: [wd.recyclable, wd.organic, wd.nonRecyclable],
          backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
          borderWidth: 0,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 1.5,
        plugins: {
          legend: { position: 'bottom', labels: { font: { size: 11 }, color: '#64748b', boxWidth: 10 } },
          tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${fmtNum(ctx.raw)} kg` } },
        },
        cutout: '60%',
      },
    });
  });
}

/* ---- 7G: TRAFFIC ---- */
function renderTraffic() {
  const td = DATA.traffic[STATE.currentFacility];
  const container = document.getElementById('trafficContent');
  if (!container) return;

  container.innerHTML = `
    <div class="traffic-kpi-grid">
      <div class="mini-kpi">
        <div class="mini-kpi-label">Vehicle Count (Today)</div>
        <div class="mini-kpi-val">${fmtNum(td.vehicleCount)}</div>
        <div class="mini-kpi-change text-muted">Unique entries</div>
      </div>
      <div class="mini-kpi">
        <div class="mini-kpi-label">Parking Occupancy</div>
        <div class="mini-kpi-val">${td.parkingOccupancy}%</div>
        <div class="mini-kpi-change ${td.parkingOccupancy > 85 ? 'trend-up' : 'trend-down'}">${td.parkingOccupancy > 85 ? 'Near full' : 'Available'}</div>
      </div>
      <div class="mini-kpi">
        <div class="mini-kpi-label">Available Slots</div>
        <div class="mini-kpi-val">${td.availableSlots}</div>
        <div class="mini-kpi-change text-muted">Out of total capacity</div>
      </div>
    </div>
    <div class="charts-grid">
      <div class="chart-card col-2">
        <div class="chart-card-header"><div><h3 class="chart-title">Traffic Flow Trend</h3><p class="chart-subtitle">Hourly vehicle count today</p></div></div>
        <div class="chart-body"><canvas id="trafficTrendChart" aria-label="Traffic Trend Chart"></canvas></div>
      </div>
      <div class="chart-card col-1">
        <div class="chart-card-header"><div><h3 class="chart-title">Parking Utilization</h3><p class="chart-subtitle">Zone-wise occupancy</p></div></div>
        <div class="chart-body"><canvas id="parkingChart" aria-label="Parking Utilization Chart"></canvas></div>
      </div>
    </div>
    <div class="card">
      <h3 class="chart-title" style="margin-bottom:8px;">Congestion Hotspots</h3>
      <p class="chart-subtitle" style="margin-bottom:16px;">Peak congestion points at ${td.peakHour}</p>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;">
        ${[
          { zone: 'Main Gate', level: 'High',   count: 284, color: '#ef4444' },
          { zone: 'Zone A Parking', level: 'Medium', count: 162, color: '#f59e0b' },
          { zone: 'North Entrance', level: 'Low',    count: 84,  color: '#10b981' },
        ].map(h => `
          <div class="mini-kpi">
            <div class="mini-kpi-label">${h.zone}</div>
            <div class="mini-kpi-val" style="color:${h.color}">${h.count} vehicles</div>
            <div class="mini-kpi-change" style="color:${h.color}">${h.level} congestion</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  requestAnimationFrame(() => {
    const hours = Array.from({length:24}, (_,i) => `${i.toString().padStart(2,'0')}:00`);
    const flow = [12,8,6,5,7,14,38,96,184,246,210,186,174,168,176,196,218,248,226,196,152,112,74,38];

    destroyChart('trafficTrend');
    STATE.charts.trafficTrend = new Chart(document.getElementById('trafficTrendChart'), {
      type: 'bar',
      data: {
        labels: hours,
        datasets: [{
          label: 'Vehicles',
          data: flow,
          backgroundColor: flow.map(v => v > 200 ? 'rgba(239,68,68,0.7)' : v > 150 ? 'rgba(245,158,11,0.7)' : 'rgba(59,130,246,0.7)'),
          borderRadius: 3,
          borderSkipped: false,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 2.5,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ` ${ctx.raw} vehicles` }, backgroundColor: '#1e293b', titleColor: '#f1f5f9', bodyColor: '#94a3b8' } },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 10 }, maxTicksLimit: 12 } },
          y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { color: '#94a3b8', font: { size: 10 } } },
        },
      },
    });

    destroyChart('parking');
    STATE.charts.parking = new Chart(document.getElementById('parkingChart'), {
      type: 'doughnut',
      data: {
        labels: ['Occupied', 'Available'],
        datasets: [{
          data: [td.parkingOccupancy, 100 - td.parkingOccupancy],
          backgroundColor: [td.parkingOccupancy > 85 ? '#ef4444' : '#f59e0b', '#e2e8f0'],
          borderWidth: 0,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 1.5,
        plugins: {
          legend: { position: 'bottom', labels: { font: { size: 11 }, color: '#64748b', boxWidth: 10 } },
          tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.raw}%` } },
        },
        cutout: '70%',
      },
    });
  });
}

/* ---- 7H: ASSETS ---- */
function renderAssets() {
  const container = document.getElementById('assetsContent');
  if (!container) return;

  const active = DATA.assets.filter(a => a.status === 'active').length;
  const maint = DATA.assets.filter(a => a.status === 'maintenance').length;
  const underutilized = DATA.assets.filter(a => a.utilization < 50).length;

  container.innerHTML = `
    <div class="card mb-4">
      <div class="asset-status-summary">
        <div class="asset-status-item">
          <div class="asset-status-label">Total Assets</div>
          <div class="asset-status-val">${DATA.assets.length}</div>
        </div>
        <div class="asset-status-item">
          <div class="asset-status-label">Active</div>
          <div class="asset-status-val text-green">${active}</div>
        </div>
        <div class="asset-status-item">
          <div class="asset-status-label">Under Maintenance</div>
          <div class="asset-status-val text-amber">${maint}</div>
        </div>
        <div class="asset-status-item">
          <div class="asset-status-label">Underutilized (&lt;50%)</div>
          <div class="asset-status-val text-red">${underutilized}</div>
        </div>
      </div>
    </div>
    <div class="charts-grid">
      <div class="chart-card col-2">
        <div class="chart-card-header"><div><h3 class="chart-title">Asset Utilization Rates</h3><p class="chart-subtitle">Current utilization per asset</p></div></div>
        <div class="chart-body"><canvas id="assetUtilChart" aria-label="Asset Utilization Chart"></canvas></div>
      </div>
      <div class="chart-card col-1">
        <div class="chart-card-header"><div><h3 class="chart-title">Status Distribution</h3><p class="chart-subtitle">Asset health overview</p></div></div>
        <div class="chart-body"><canvas id="assetStatusChart" aria-label="Asset Status Chart"></canvas></div>
      </div>
    </div>
    <div class="card">
      <div class="chart-card-header">
        <div><h3 class="chart-title">Asset Register</h3><p class="chart-subtitle">Full asset inventory</p></div>
      </div>
      <div class="table-wrapper">
        <table class="data-table" aria-label="Assets Table">
          <thead>
            <tr>
              <th>Asset ID</th><th>Name</th><th>Category</th><th>Location</th>
              <th>Utilization</th><th>Last Maintenance</th><th>Next Due</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${DATA.assets.map(a => `
              <tr>
                <td><code>${a.id}</code></td>
                <td>${a.name}</td>
                <td>${a.category}</td>
                <td>${a.location}</td>
                <td>
                  <div class="score-bar-wrap">
                    <div class="score-bar" style="min-width:80px;">
                      <div class="score-bar-fill ${scoreClass(a.utilization)}" style="width:${a.utilization}%"></div>
                    </div>
                    <span>${a.utilization}%</span>
                  </div>
                </td>
                <td>${fmtDate(a.lastMaint)}</td>
                <td>${fmtDate(a.nextMaint)}</td>
                <td><span class="status-badge ${statClass(a.status)}">${a.status}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  requestAnimationFrame(() => {
    destroyChart('assetUtil');
    STATE.charts.assetUtil = new Chart(document.getElementById('assetUtilChart'), {
      type: 'bar',
      data: {
        labels: DATA.assets.map(a => a.name.slice(0, 20)),
        datasets: [{
          label: 'Utilization %',
          data: DATA.assets.map(a => a.utilization),
          backgroundColor: DATA.assets.map(a => a.utilization >= 85 ? 'rgba(239,68,68,0.7)' : a.utilization >= 60 ? 'rgba(245,158,11,0.7)' : 'rgba(16,185,129,0.7)'),
          borderRadius: 4,
          borderSkipped: false,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 2.2,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ` ${ctx.raw}%` }, backgroundColor: '#1e293b', titleColor: '#f1f5f9', bodyColor: '#94a3b8' } },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 9 }, maxRotation: 45 } },
          y: { min: 0, max: 100, grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { color: '#94a3b8', font: { size: 10 }, callback: v => `${v}%` } },
        },
      },
    });

    destroyChart('assetStatus');
    STATE.charts.assetStatus = new Chart(document.getElementById('assetStatusChart'), {
      type: 'doughnut',
      data: {
        labels: ['Active', 'Maintenance', 'Underutilized'],
        datasets: [{
          data: [active, maint, underutilized],
          backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
          borderWidth: 0,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 1.5,
        plugins: {
          legend: { position: 'bottom', labels: { font: { size: 11 }, color: '#64748b', boxWidth: 10 } },
        },
        cutout: '65%',
      },
    });
  });
}

/* ---- 7I: SAFETY ---- */
function renderSafety() {
  const container = document.getElementById('safetyContent');
  if (!container) return;
  const s = DATA.safety;

  container.innerHTML = `
    <div class="incident-summary">
      <div class="incident-card">
        <div class="incident-val">${s.summary.total}</div>
        <div class="incident-lbl">Total Incidents</div>
      </div>
      <div class="incident-card">
        <div class="incident-val text-red">${s.summary.open}</div>
        <div class="incident-lbl">Open Incidents</div>
      </div>
      <div class="incident-card">
        <div class="incident-val" style="color:#e65100">${s.summary.critical}</div>
        <div class="incident-lbl">Critical</div>
      </div>
      <div class="incident-card">
        <div class="incident-val text-green">${s.summary.resolved}</div>
        <div class="incident-lbl">Resolved</div>
      </div>
    </div>
    <div class="charts-grid">
      <div class="chart-card col-1">
        <div class="chart-card-header"><div><h3 class="chart-title">Incident Categories</h3></div></div>
        <div class="chart-body"><canvas id="incidentCatChart" aria-label="Incident Category Chart"></canvas></div>
      </div>
      <div class="chart-card col-2">
        <div class="chart-card-header"><div><h3 class="chart-title">Incident Trend</h3><p class="chart-subtitle">Monthly incident count</p></div></div>
        <div class="chart-body"><canvas id="incidentTrendChart" aria-label="Incident Trend Chart"></canvas></div>
      </div>
    </div>
    <div class="card">
      <div class="chart-card-header">
        <div><h3 class="chart-title">Incident Log</h3></div>
      </div>
      <div class="table-wrapper">
        <table class="data-table" aria-label="Safety Incidents Table">
          <thead>
            <tr><th>Incident ID</th><th>Date</th><th>Facility</th><th>Category</th><th>Issue</th><th>Severity</th><th>Status</th></tr>
          </thead>
          <tbody>
            ${s.incidents.map(inc => `
              <tr>
                <td><code>${inc.id}</code></td>
                <td>${fmtDate(inc.date)}</td>
                <td>${inc.facility}</td>
                <td>${inc.category}</td>
                <td>${inc.issue}</td>
                <td><span class="severity-badge ${sevClass(inc.severity)}">${inc.severity}</span></td>
                <td><span class="status-badge ${statClass(inc.status)}">${inc.status}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  requestAnimationFrame(() => {
    destroyChart('incidentCat');
    STATE.charts.incidentCat = new Chart(document.getElementById('incidentCatChart'), {
      type: 'doughnut',
      data: {
        labels: ['Fire Safety','Electrical','Chemical','Physical','Security'],
        datasets: [{
          data: [2, 1, 1, 1, 1],
          backgroundColor: ['#ef4444','#f59e0b','#8b5cf6','#3b82f6','#64748b'],
          borderWidth: 0,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 1.5,
        plugins: {
          legend: { position: 'bottom', labels: { font: { size: 11 }, color: '#64748b', boxWidth: 10 } },
        },
        cutout: '60%',
      },
    });

    destroyChart('incidentTrend');
    STATE.charts.incidentTrend = new Chart(document.getElementById('incidentTrendChart'), {
      type: 'bar',
      data: {
        labels: ['Apr','May','Jun','Jul','Aug','Sep'],
        datasets: [
          { label: 'Total', data: [12,9,11,8,7,6], backgroundColor: 'rgba(59,130,246,0.6)', borderRadius: 4, borderSkipped: false },
          { label: 'Resolved', data: [10,9,9,8,7,5], backgroundColor: 'rgba(16,185,129,0.6)', borderRadius: 4, borderSkipped: false },
          { label: 'Critical', data: [2,0,3,1,0,1], backgroundColor: 'rgba(239,68,68,0.7)', borderRadius: 4, borderSkipped: false },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 2.5,
        plugins: {
          legend: { position: 'top', align: 'end', labels: { font: { size: 11 }, color: '#64748b', boxWidth: 10 } },
          tooltip: { backgroundColor: '#1e293b', titleColor: '#f1f5f9', bodyColor: '#94a3b8' },
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 10 } } },
          y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { color: '#94a3b8', font: { size: 10 } } },
        },
      },
    });
  });
}

/* ---- 7J: FORECAST ---- */
function renderForecast(type = 'energy') {
  renderForecastChart(type);
  renderAnomalyTable(DATA.anomalies);
}

function renderForecastChart(type) {
  destroyChart('forecast');
  const canvas = document.getElementById('forecastChart');
  if (!canvas) return;

  const fc = DATA.forecast[type];
  const allLabels = [...fc.histLabels, ...fc.fcLabels];
  const histLen = fc.histLabels.length;

  // Build padded arrays
  const actualData = [...fc.histValues, ...Array(fc.fcLabels.length).fill(null)];
  const fcData = [...Array(histLen - 1).fill(null), fc.histValues[histLen - 1], ...fc.fcValues];

  document.getElementById('forecastConfidence').textContent = fc.confidence;
  document.getElementById('forecastTrend').textContent = fc.trend;
  document.getElementById('forecastModel').textContent = fc.model;

  STATE.charts.forecast = new Chart(canvas, {
    type: 'line',
    data: {
      labels: allLabels,
      datasets: [
        {
          label: 'Actual',
          data: actualData,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59,130,246,0.08)',
          borderWidth: 2.5,
          fill: true,
          tension: 0.4,
          pointRadius: 3,
          pointHoverRadius: 6,
          spanGaps: false,
        },
        {
          label: 'Forecast',
          data: fcData,
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245,158,11,0.06)',
          borderWidth: 2.5,
          fill: true,
          tension: 0.4,
          borderDash: [6, 4],
          pointRadius: 3,
          pointHoverRadius: 6,
          spanGaps: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 3,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          position: 'top',
          align: 'end',
          labels: { boxWidth: 12, font: { size: 11 }, color: '#64748b', padding: 16 },
        },
        tooltip: {
          backgroundColor: '#1e293b',
          titleColor: '#f1f5f9',
          bodyColor: '#94a3b8',
          callbacks: {
            label: ctx => {
              if (ctx.raw === null) return '';
              const suffix = type === 'energy' ? ' kWh' : type === 'water' ? ' KL' : type === 'waste' ? ' kg' : '%';
              return ` ${ctx.dataset.label}: ${fmtNum(ctx.raw)}${suffix}`;
            },
          },
        },
      },
      scales: {
        x: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { color: '#94a3b8', font: { size: 10 } } },
        y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { color: '#94a3b8', font: { size: 10 } } },
      },
      animation: { duration: 700 },
    },
  });
}

function renderAnomalyTable(data) {
  const tbody = document.getElementById('anomalyTableBody');
  if (!tbody) return;

  tbody.innerHTML = data.map(row => `
    <tr>
      <td>${row.ts}</td>
      <td>${row.facility}</td>
      <td>${row.category}</td>
      <td>${row.issue}</td>
      <td><span class="severity-badge ${sevClass(row.severity)}">${row.severity}</span></td>
      <td><strong>${row.confidence}</strong></td>
      <td><span class="status-badge ${statClass(row.status)}">${row.status}</span></td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="openModal('Anomaly Detail', '<p>${row.issue}</p><p style=\\'margin-top:10px;\\'>Facility: <strong>${row.facility}</strong></p><p>Severity: <strong>${row.severity}</strong></p><p>Confidence: <strong>${row.confidence}</strong></p>')">
          <i class='fa-solid fa-eye'></i> View
        </button>
      </td>
    </tr>
  `).join('');
}

/* ---- 7K: RECOMMENDATIONS ---- */
function renderRecommendations() {
  const container = document.getElementById('recGrid');
  if (!container) return;

  container.innerHTML = DATA.recommendations.map(rec => `
    <div class="rec-card ${rec.status === 'reviewed' ? 'reviewed' : ''}" id="rec-card-${rec.id}">
      <div class="rec-header">
        <div class="rec-icon ${rec.category}">
          <span style="font-size:20px">${rec.icon}</span>
        </div>
        <div>
          <div class="rec-title">${rec.title}</div>
          <div class="rec-category">${rec.category.charAt(0).toUpperCase() + rec.category.slice(1)}</div>
        </div>
        <span class="priority-badge priority-${rec.priority.toLowerCase()}" style="margin-left:auto">${rec.priority}</span>
      </div>
      <div class="rec-body">
        <p class="rec-reason">${rec.reason}</p>
        <div class="rec-meta">
          <div class="rec-meta-item">
            <span class="rec-meta-label">Expected Impact</span>
            <span class="rec-meta-value">${rec.impact}</span>
          </div>
          <div class="rec-meta-item">
            <span class="rec-meta-label">Assigned Team</span>
            <span class="rec-meta-value">${rec.team}</span>
          </div>
        </div>
      </div>
      <div class="rec-footer">
        <button class="btn btn-secondary btn-sm" onclick="markReviewed('${rec.id}')">
          <i class="fa-solid fa-check"></i> Mark Reviewed
        </button>
        <button class="btn btn-outline btn-sm" onclick="showToast('Team Notified','${rec.team} has been assigned this action.','success')">
          <i class="fa-solid fa-user-plus"></i> Assign Team
        </button>
        <button class="btn btn-primary btn-sm" onclick="openModal('${rec.title}', '<p>${rec.reason}</p><br><p><strong>Expected Impact:</strong> ${rec.impact}</p><p style=\\'margin-top:8px;\\'><strong>Team:</strong> ${rec.team}</p>', 'Assign & Execute')">
          <i class="fa-solid fa-arrow-right"></i> View Details
        </button>
      </div>
    </div>
  `).join('');
}

function markReviewed(recId) {
  const rec = DATA.recommendations.find(r => r.id === recId);
  if (rec) {
    rec.status = 'reviewed';
    const card = document.getElementById(`rec-card-${recId}`);
    if (card) {
      card.classList.add('reviewed');
      showToast('Marked as Reviewed', `"${rec.title}" has been reviewed.`, 'success');
    }
  }
}

/* ---- 7L: REPORTS ---- */
function renderReports() {
  const container = document.getElementById('reportGrid');
  if (!container) return;

  const iconColorMap = {
    green: { bg: 'var(--accent-green-light)', color: 'var(--accent-green)' },
    amber: { bg: 'var(--accent-amber-light)', color: 'var(--accent-amber)' },
    blue:  { bg: 'var(--accent-blue-light)',  color: 'var(--accent-blue)' },
    red:   { bg: 'var(--accent-red-light)',   color: 'var(--accent-red)' },
    purple:{ bg: 'var(--accent-purple-light)',color: 'var(--accent-purple)' },
  };

  container.innerHTML = DATA.reports.map(r => {
    const clr = iconColorMap[r.iconColor] || iconColorMap.green;
    return `
      <div class="report-card">
        <div class="report-icon" style="background:${clr.bg};color:${clr.color};font-size:24px">${r.icon}</div>
        <div class="report-title">${r.title}</div>
        <p class="report-desc">${r.desc}</p>
        <div class="report-meta">
          Period: ${r.period} &nbsp;|&nbsp; Format: ${r.format} &nbsp;|&nbsp; Size: ${r.size}
        </div>
        <div class="report-actions">
          <button class="btn btn-primary btn-sm" onclick="showToast('Opening Report','Loading ${r.title}...','info')">
            <i class="fa-solid fa-eye"></i> View
          </button>
          <button class="btn btn-secondary btn-sm" onclick="showToast('PDF Export','${r.title} export started.','success')">
            <i class="fa-solid fa-file-pdf"></i> Export PDF
          </button>
          <button class="btn btn-outline btn-sm" onclick="downloadCSV('${r.id}', '${r.title}')">
            <i class="fa-solid fa-file-csv"></i> CSV
          </button>
        </div>
      </div>
    `;
  }).join('');
}

/* ---- 7M: FACILITIES ---- */
function renderFacilities() {
  const tbody = document.getElementById('facilitiesTableBody');
  if (!tbody) return;

  tbody.innerHTML = DATA.facilities.map(f => {
    const sc = scoreClass(f.score);
    return `
      <tr>
        <td><strong>${f.name}</strong></td>
        <td>${f.type}</td>
        <td>${f.city}</td>
        <td>${f.buildings}</td>
        <td>${f.occupancy}%</td>
        <td>
          <div class="score-bar-wrap">
            <div class="score-bar" style="min-width:80px">
              <div class="score-bar-fill ${sc}" style="width:${f.score}%"></div>
            </div>
            <span style="font-weight:700">${f.score}/100</span>
          </div>
        </td>
        <td><span class="status-badge stat-active">${f.status}</span></td>
        <td>
          <button class="btn btn-primary btn-sm" onclick="openFacilityDetail('${f.id}')">
            <i class="fa-solid fa-chart-line"></i> Dashboard
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function openFacilityDetail(facilityId) {
  const f = DATA.facilities.find(x => x.id === facilityId);
  const kpi = DATA.kpis[facilityId];
  if (!f || !kpi) return;

  openModal(
    `${f.name} — Facility Summary`,
    `
      <div class="modal-stat-grid">
        <div class="modal-stat"><div class="modal-stat-val">${kpi.energy.toLocaleString('en-IN')}</div><div class="modal-stat-lbl">kWh Energy</div></div>
        <div class="modal-stat"><div class="modal-stat-val">${kpi.water.toLocaleString('en-IN')}</div><div class="modal-stat-lbl">KL Water</div></div>
        <div class="modal-stat"><div class="modal-stat-val text-green">${kpi.score}/100</div><div class="modal-stat-lbl">Sustain. Score</div></div>
      </div>
      <p><strong>Type:</strong> ${f.type} &nbsp;|&nbsp; <strong>City:</strong> ${f.city}</p>
      <p style="margin-top:6px;"><strong>Buildings:</strong> ${f.buildings} &nbsp;|&nbsp; <strong>Occupancy:</strong> ${f.occupancy}%</p>
      <p style="margin-top:6px;"><strong>AQI:</strong> ${kpi.aqi} &nbsp;|&nbsp; <strong>Active Alerts:</strong> ${kpi.alerts} (${kpi.alertCritical} critical)</p>
    `,
    'View Full Dashboard',
    () => {
      STATE.currentFacility = facilityId;
      document.getElementById('facilitySelect').value = facilityId;
      navigateTo('overview');
    }
  );
}

/* ============================================================
   SECTION 8: CSV EXPORT
   ============================================================ */

function downloadCSV(reportId, reportTitle) {
  let csvData = '';
  let rows = [];

  if (reportId === 'RPT-001') {
    rows = [
      ['Metric', 'Value', 'Change', 'Status'],
      ['Energy (kWh)', '124560', '-8.4%', 'Improving'],
      ['Water (KL)', '48320', '+3.2%', 'Monitor'],
      ['AQI', '72', 'N/A', 'Moderate'],
      ['Waste (kg)', '2840', '-5.8%', 'Improving'],
      ['Sustainability Score', '84/100', '+6.5%', 'Excellent'],
    ];
  } else if (reportId === 'RPT-002') {
    rows = [
      ['Date', 'Energy kWh', 'Solar kWh', 'Grid kWh', 'Cost INR'],
      ...getLast30DayLabels().map((label, i) => [label, DATA.energy30Days.all[i], Math.round(DATA.energy30Days.all[i] * 0.15), Math.round(DATA.energy30Days.all[i] * 0.85), (DATA.energy30Days.all[i] * 7.8).toFixed(0)]),
    ];
  } else if (reportId === 'RPT-005') {
    rows = [
      ['Incident ID', 'Date', 'Facility', 'Category', 'Issue', 'Severity', 'Status'],
      ...DATA.safety.incidents.map(i => [i.id, i.date, i.facility, i.category, i.issue, i.severity, i.status]),
    ];
  } else {
    rows = [
      ['Facility', 'Type', 'City', 'Buildings', 'Occupancy', 'Score', 'Status'],
      ...DATA.facilities.map(f => [f.name, f.type, f.city, f.buildings, `${f.occupancy}%`, `${f.score}/100`, f.status]),
    ];
  }

  csvData = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');

  const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${reportTitle.replace(/\s/g, '_')}_${new Date().toISOString().slice(0,10)}.csv`;
  link.click();

  showToast('CSV Downloaded', `${reportTitle} exported successfully.`, 'success');
}

/* ============================================================
   SECTION 9: EVENT HANDLERS
   ============================================================ */

function initEventHandlers() {

  /* ---- Sidebar Navigation ---- */
  document.querySelectorAll('.nav-item[data-page]').forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      navigateTo(item.dataset.page);
    });
  });

  /* ---- Hamburger / Sidebar Toggle ---- */
  document.getElementById('hamburgerBtn').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('sidebarOverlay').classList.toggle('active');
  });

  document.getElementById('sidebarClose').addEventListener('click', () => {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebarOverlay').classList.remove('active');
  });

  document.getElementById('sidebarOverlay').addEventListener('click', () => {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebarOverlay').classList.remove('active');
  });

  /* ---- Facility Selector ---- */
  document.getElementById('facilitySelect').addEventListener('change', e => {
    STATE.currentFacility = e.target.value;
    renderPage(STATE.currentPage);
    showToast('Facility Changed', `Showing data for: ${e.target.options[e.target.selectedIndex].text}`, 'info', 3000);
  });

  /* ---- Date Range ---- */
  document.getElementById('dateRangeSelect').addEventListener('change', e => {
    STATE.currentDateRange = parseInt(e.target.value);
    renderPage(STATE.currentPage);
    showToast('Date Range Updated', `Showing last ${e.target.value} days`, 'info', 2500);
  });

  /* ---- Refresh Button ---- */
  document.getElementById('refreshBtn').addEventListener('click', async () => {
    const btn = document.getElementById('refreshBtn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-rotate-right spin"></i> Refreshing...';
    await renderPage(STATE.currentPage);
    const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    document.getElementById('lastUpdated').textContent = `Last updated: ${now}`;
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-rotate-right"></i> Refresh';
    showToast('Data Refreshed', 'Dashboard data updated successfully.', 'success', 2500);
  });

  /* ---- Export Button ---- */
  document.getElementById('exportBtn').addEventListener('click', () => {
    downloadCSV('RPT-001', 'Monthly_Sustainability_Report');
  });

  /* ---- Notification Bell ---- */
  document.getElementById('notifBtn').addEventListener('click', e => {
    e.stopPropagation();
    document.getElementById('notifDropdown').classList.toggle('open');
    document.getElementById('profileDropdown').classList.remove('open');
  });

  document.getElementById('clearNotifs').addEventListener('click', () => {
    document.getElementById('notifDropdown').classList.remove('open');
    document.getElementById('notifBadge').textContent = '0';
    document.getElementById('notifDropdown').querySelector('.notif-list').innerHTML = '<li style="padding:20px;text-align:center;color:var(--color-text-muted);font-size:13px;">No new notifications</li>';
    showToast('Cleared', 'All notifications cleared.', 'info', 2000);
  });

  /* ---- User Profile ---- */
  document.getElementById('userProfileBtn').addEventListener('click', e => {
    e.stopPropagation();
    document.getElementById('profileDropdown').classList.toggle('open');
    document.getElementById('notifDropdown').classList.remove('open');
  });

  document.getElementById('goToSettings').addEventListener('click', e => {
    e.preventDefault();
    document.getElementById('profileDropdown').classList.remove('open');
    navigateTo('settings');
  });

  /* ---- Close dropdowns on outside click ---- */
  document.addEventListener('click', () => {
    document.getElementById('notifDropdown').classList.remove('open');
    document.getElementById('profileDropdown').classList.remove('open');
  });

  /* ---- Modal Close ---- */
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modalCancelBtn').addEventListener('click', closeModal);
  document.getElementById('modalOverlay').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeModal();
  });

  /* ---- Energy Chart Tabs ---- */
  document.querySelectorAll('.chart-tabs .chart-tab[data-period]').forEach(tab => {
    tab.addEventListener('click', function() {
      document.querySelectorAll('.chart-tabs .chart-tab[data-period]').forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      renderEnergyTrendChart(this.dataset.period);
    });
  });

  /* ---- Forecast Tabs ---- */
  document.addEventListener('click', e => {
    const tab = e.target.closest('.chart-tab[data-forecast]');
    if (tab) {
      document.querySelectorAll('.chart-tab[data-forecast]').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderForecastChart(tab.dataset.forecast);
    }
  });

  /* ---- AI Insight Actions ---- */
  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-insight-action]');
    if (!btn) return;

    const action = btn.dataset.insightAction;
    if (action === 'modal') {
      openModal(
        btn.dataset.insightModalTitle,
        decodeURIComponent(btn.dataset.insightModalContent)
      );
    } else if (action === 'toast') {
      showToast('Action Taken', btn.dataset.insightToast, 'success');
    } else if (action === 'nav') {
      navigateTo(btn.dataset.insightNav);
    }
  });

  /* ---- Dark Mode Toggle ---- */
  const darkToggle = document.getElementById('darkModeToggle');
  darkToggle.addEventListener('change', function() {
    STATE.darkMode = this.checked;
    document.documentElement.setAttribute('data-theme', this.checked ? 'dark' : 'light');
    showToast(
      this.checked ? 'Dark Mode Enabled' : 'Light Mode Enabled',
      'Interface theme updated.',
      'info', 2000
    );
  });

  /* ---- Compact View Toggle ---- */
  document.getElementById('compactToggle').addEventListener('change', function() {
    document.body.classList.toggle('compact', this.checked);
    showToast(this.checked ? 'Compact View On' : 'Standard View On', '', 'info', 1500);
  });

  /* ---- Save Settings ---- */
  const saveBtn = document.getElementById('saveSettingsBtn');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      showToast('Settings Saved', 'Your preferences have been saved.', 'success');
    });
  }

  /* ---- Anomaly Table Search ---- */
  document.addEventListener('input', e => {
    if (e.target && e.target.id === 'anomalySearch') {
      const query = e.target.value.toLowerCase();
      const filtered = DATA.anomalies.filter(a =>
        a.issue.toLowerCase().includes(query) ||
        a.facility.toLowerCase().includes(query) ||
        a.category.toLowerCase().includes(query) ||
        a.severity.toLowerCase().includes(query)
      );
      renderAnomalyTable(filtered);
    }
  });

  /* ---- Facility Table Search ---- */
  document.addEventListener('input', e => {
    if (e.target && e.target.id === 'facilitySearch') {
      const query = e.target.value.toLowerCase();
      const tbody = document.getElementById('facilitiesTableBody');
      if (!tbody) return;
      tbody.querySelectorAll('tr').forEach(row => {
        row.style.display = row.textContent.toLowerCase().includes(query) ? '' : 'none';
      });
    }
  });

  /* ---- Logout ---- */
  document.querySelectorAll('.logout-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      showToast('Signed Out', 'You have been signed out successfully.', 'info');
    });
  });
}

/* ============================================================
   SECTION 10: INIT
   ============================================================ */

function init() {
  initEventHandlers();
  navigateTo('overview');

  // Update timestamp
  const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const el = document.getElementById('lastUpdated');
  if (el) el.textContent = `Last updated: ${now}`;
}

// Boot when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
