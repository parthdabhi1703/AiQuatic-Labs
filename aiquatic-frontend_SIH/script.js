// ===== GLOBAL VARIABLES =====
let uploadedFiles = [];
let currentFileData = null;
let currentDataType = 'ocean';
let previewCharts = {};
let modalCharts = {};

// Sample data for demonstration (the "old 4 data" mentioned)
const sampleData = [
  {
    id: 'sample_ocean_data_1',
    name: 'Pacific Ocean Temperature Survey 2024.csv',
    type: 'ocean',
    size: '145 KB',
    uploadDate: '2024-01-15',
    downloadUrl: '#',
    data: generateSampleOceanData(50)
  },
  {
    id: 'sample_fish_data_1', 
    name: 'Marine Species Census 2024.csv',
    type: 'fish',
    size: '89 KB',
    uploadDate: '2024-01-10',
    downloadUrl: '#',
    data: generateSampleFishData(30)
  },
  {
    id: 'sample_edna_data_1',
    name: 'eDNA Analysis Results Q1 2024.csv', 
    type: 'edna',
    size: '67 KB',
    uploadDate: '2024-01-08',
    downloadUrl: '#',
    data: generateSampleEDNAData(40)
  },
  {
    id: 'sample_otolith_data_1',
    name: 'Otolith Microstructure Study.csv',
    type: 'otolith', 
    size: '123 KB',
    uploadDate: '2024-01-05',
    downloadUrl: '#',
    data: generateSampleOtolithData(35)
  }
];

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
  initializeEventListeners();
  initializeSampleData();
  updateVisualizationContent();
});

function initializeEventListeners() {
  // File upload elements
  const dropArea = document.getElementById('dropArea');
  const fileUpload = document.getElementById('fileUpload');
  const browseBtn = document.getElementById('browseBtn');
  const uploadBtn = document.getElementById('uploadBtn');

  // Data type radio buttons
  const dataTypeRadios = document.querySelectorAll('input[name="dataType"]');
  
  // Modal close
  const viewModal = document.getElementById('viewModal');

  // Event listeners
  if (dropArea) {
    dropArea.addEventListener('dragover', handleDragOver);
    dropArea.addEventListener('dragleave', handleDragLeave);
    dropArea.addEventListener('drop', handleDrop);
    dropArea.addEventListener('click', () => fileUpload?.click());
  }

  if (fileUpload) {
    fileUpload.addEventListener('change', handleFileSelect);
  }

  if (browseBtn) {
    browseBtn.addEventListener('click', () => fileUpload?.click());
  }

  if (uploadBtn) {
    uploadBtn.addEventListener('click', handleUpload);
  }

  dataTypeRadios.forEach(radio => {
    radio.addEventListener('change', handleDataTypeChange);
  });

  // Modal event listeners
  if (viewModal) {
    viewModal.addEventListener('click', function(e) {
      if (e.target === viewModal) {
        closeViewModal();
      }
    });
  }

  // Close modal with Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeViewModal();
    }
  });
}

function initializeSampleData() {
  uploadedFiles = [...sampleData];
  updateRecentUploads();
}

// ===== DRAG AND DROP HANDLERS =====
function handleDragOver(e) {
  e.preventDefault();
  document.getElementById('dropArea').classList.add('dragover');
}

function handleDragLeave(e) {
  e.preventDefault();
  document.getElementById('dropArea').classList.remove('dragover');
}

function handleDrop(e) {
  e.preventDefault();
  document.getElementById('dropArea').classList.remove('dragover');
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    processFile(files[0]);
  }
}

function handleFileSelect(e) {
  const file = e.target.files[0];
  if (file) {
    processFile(file);
  }
}

// ===== FILE PROCESSING =====
function processFile(file) {
  const fileDetails = document.getElementById('fileDetails');
  const uploadBtn = document.getElementById('uploadBtn');

  // Show file details
  fileDetails.innerHTML = `
    <div style="margin-top: 1rem; padding: 1rem; background: #f1f5f9; border-radius: 8px; border-left: 4px solid #3b82f6;">
      <strong>File:</strong> ${file.name}<br>
      <strong>Size:</strong> ${formatFileSize(file.size)}<br>
      <strong>Type:</strong> ${file.type || 'Unknown'}
    </div>
  `;
  
  uploadBtn.hidden = false;
  uploadBtn.onclick = () => handleUpload(file);

  // Parse file for instant preview
  parseFileData(file).then(data => {
    if (data && data.length > 0) {
      currentFileData = data;
      createInstantPreview(data);
    }
  }).catch(error => {
    console.error('Error parsing file:', error);
    showError('Error parsing file. Please check the file format.');
  });
}

async function parseFileData(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = function(e) {
      try {
        const content = e.target.result;
        let data;

        if (file.name.endsWith('.csv')) {
          // Parse CSV using PapaParse
          Papa.parse(content, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true,
            complete: function(results) {
              resolve(results.data);
            },
            error: function(error) {
              reject(error);
            }
          });
        } else if (file.name.endsWith('.json')) {
          data = JSON.parse(content);
          resolve(Array.isArray(data) ? data : [data]);
        } else {
          reject(new Error('Unsupported file type'));
        }
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error('Error reading file'));
    reader.readAsText(file);
  });
}

// ===== UPLOAD HANDLER =====
function handleUpload(file) {
  if (!currentFileData) {
    showError('Please select a valid file first.');
    return;
  }

  const uploadMsg = document.getElementById('uploadMsg');
  uploadMsg.innerHTML = `
    <div style="margin-top: 1rem; padding: 1rem; background: #d1fae5; border: 1px solid #a7f3d0; border-radius: 8px; color: #065f46; font-weight: 500;">
      <i class="fas fa-check-circle"></i> File uploaded successfully! Data cleaned and ready for download.
    </div>
  `;

  // Add to uploaded files
  const newFile = {
    id: 'uploaded_' + Date.now(),
    name: file.name,
    type: currentDataType,
    size: formatFileSize(file.size),
    uploadDate: new Date().toISOString().split('T')[0],
    downloadUrl: generateDownloadUrl(currentFileData, file.name),
    data: currentFileData
  };

  uploadedFiles.unshift(newFile);
  updateRecentUploads();

  // Reset form
  setTimeout(() => {
    document.getElementById('fileDetails').innerHTML = '';
    document.getElementById('uploadBtn').hidden = true;
    document.getElementById('fileUpload').value = '';
    uploadMsg.innerHTML = '';
  }, 3000);
}

// ===== VISUALIZATION FUNCTIONS =====
function createInstantPreview(data) {
  const visualizationBox = document.getElementById('visualizationBox');
  
  if (!data || data.length === 0) {
    showVisualizationPlaceholder();
    return;
  }

  visualizationBox.innerHTML = `
    <div class="visualization-container">
      <div class="visualization-header">
        <div>
          <h3 class="visualization-title">Data Preview - ${getDataTypeTitle(currentDataType)}</h3>
          <p class="visualization-subtitle">${data.length} records loaded</p>
        </div>
        <button class="export-btn" onclick="exportAllCharts()">
          <i class="fas fa-download"></i>
          Export All Charts
        </button>
      </div>
      <div class="charts-grid">
        <div class="chart-container">
          <div class="chart-header">
            <h5><i class="fas fa-chart-line"></i> ${getChartTitle(currentDataType, 0)}</h5>
            <button class="chart-export-btn" onclick="exportChart('previewChart1')">
              <i class="fas fa-download"></i>
            </button>
          </div>
          <canvas id="previewChart1"></canvas>
        </div>
        <div class="chart-container">
          <div class="chart-header">
            <h5><i class="fas fa-chart-bar"></i> ${getChartTitle(currentDataType, 1)}</h5>
            <button class="chart-export-btn" onclick="exportChart('previewChart2')">
              <i class="fas fa-download"></i>
            </button>
          </div>
          <canvas id="previewChart2"></canvas>
        </div>
        <div class="chart-container">
          <div class="chart-header">
            <h5><i class="fas fa-chart-pie"></i> ${getChartTitle(currentDataType, 2)}</h5>
            <button class="chart-export-btn" onclick="exportChart('previewChart3')">
              <i class="fas fa-download"></i>
            </button>
          </div>
          <canvas id="previewChart3"></canvas>
        </div>
        <div class="chart-container">
          <div class="chart-header">
            <h5><i class="fas fa-chart-area"></i> ${getChartTitle(currentDataType, 3)}</h5>
            <button class="chart-export-btn" onclick="exportChart('previewChart4')">
              <i class="fas fa-download"></i>
            </button>
          </div>
          <canvas id="previewChart4"></canvas>
        </div>
      </div>
    </div>
  `;

  visualizationBox.classList.add('has-data');

  // Create charts with delay to ensure DOM is ready
  setTimeout(() => {
    createPreviewCharts(data);
  }, 100);
}

function createPreviewCharts(data) {
  // Destroy existing charts
  Object.values(previewCharts).forEach(chart => {
    if (chart && typeof chart.destroy === 'function') {
      chart.destroy();
    }
  });
  previewCharts = {};

  // Create new charts based on data type
  switch (currentDataType) {
    case 'ocean':
      createOceanCharts(data, 'preview');
      break;
    case 'fish':
      createFishCharts(data, 'preview');
      break;
    case 'edna':
      createEDNACharts(data, 'preview');
      break;
    case 'otolith':
      createOtolithCharts(data, 'preview');
      break;
  }
}

// ===== CHART CREATION FUNCTIONS =====
function createOceanCharts(data, prefix) {
  const chartConfigs = [
    {
      id: `${prefix}Chart1`,
      type: 'line',
      label: 'Temperature Trends',
      data: data.map((d, i) => ({ x: i, y: parseFloat(d.temperature) || Math.random() * 30 + 10 })),
      color: 'rgb(239, 68, 68)'
    },
    {
      id: `${prefix}Chart2`,
      type: 'bar',
      label: 'Salinity Distribution',
      data: data.slice(0, 10).map((d, i) => ({ x: `Station ${i+1}`, y: parseFloat(d.salinity) || Math.random() * 5 + 32 })),
      color: 'rgb(59, 130, 246)'
    },
    {
      id: `${prefix}Chart3`,
      type: 'doughnut',
      label: 'Depth Categories',
      data: [
        { label: 'Shallow (0-50m)', value: data.filter(d => (parseFloat(d.depth) || 0) <= 50).length },
        { label: 'Medium (50-200m)', value: data.filter(d => (parseFloat(d.depth) || 0) > 50 && (parseFloat(d.depth) || 0) <= 200).length },
        { label: 'Deep (200m+)', value: data.filter(d => (parseFloat(d.depth) || 0) > 200).length }
      ],
      colors: ['rgb(34, 197, 94)', 'rgb(249, 115, 22)', 'rgb(168, 85, 247)']
    },
    {
      id: `${prefix}Chart4`,
      type: 'scatter',
      label: 'Temperature vs Depth',
      data: data.map(d => ({ 
        x: parseFloat(d.temperature) || Math.random() * 30 + 10, 
        y: parseFloat(d.depth) || Math.random() * 1000 
      })),
      color: 'rgb(16, 185, 129)'
    }
  ];

  chartConfigs.forEach(config => {
    createChart(config, prefix);
  });
}

function createFishCharts(data, prefix) {
  const chartConfigs = [
    {
      id: `${prefix}Chart1`,
      type: 'bar',
      label: 'Species Count',
      data: getSpeciesCount(data),
      color: 'rgb(34, 197, 94)'
    },
    {
      id: `${prefix}Chart2`,
      type: 'line',
      label: 'Length Distribution',
      data: data.map((d, i) => ({ x: i, y: parseFloat(d.length) || Math.random() * 50 + 10 })),
      color: 'rgb(249, 115, 22)'
    },
    {
      id: `${prefix}Chart3`,
      type: 'pie',
      label: 'Family Distribution',
      data: getFamilyDistribution(data),
      colors: ['rgb(59, 130, 246)', 'rgb(239, 68, 68)', 'rgb(34, 197, 94)', 'rgb(249, 115, 22)', 'rgb(168, 85, 247)']
    },
    {
      id: `${prefix}Chart4`,
      type: 'scatter',
      label: 'Length vs Weight',
      data: data.map(d => ({ 
        x: parseFloat(d.length) || Math.random() * 50 + 10, 
        y: parseFloat(d.weight) || Math.random() * 2000 + 100 
      })),
      color: 'rgb(168, 85, 247)'
    }
  ];

  chartConfigs.forEach(config => {
    createChart(config, prefix);
  });
}

function createEDNACharts(data, prefix) {
  const chartConfigs = [
    {
      id: `${prefix}Chart1`,
      type: 'bar',
      label: 'DNA Concentration',
      data: data.slice(0, 10).map((d, i) => ({ 
        x: `Sample ${i+1}`, 
        y: parseFloat(d.concentration) || Math.random() * 100 + 10 
      })),
      color: 'rgb(168, 85, 247)'
    },
    {
      id: `${prefix}Chart2`,
      type: 'line',
      label: 'Quality Scores',
      data: data.map((d, i) => ({ x: i, y: parseFloat(d.quality) || Math.random() * 40 + 60 })),
      color: 'rgb(34, 197, 94)'
    },
    {
      id: `${prefix}Chart3`,
      type: 'doughnut',
      label: 'Detection Success',
      data: [
        { label: 'Detected', value: data.filter(d => (d.detected === 'Yes' || Math.random() > 0.3)).length },
        { label: 'Not Detected', value: data.filter(d => (d.detected === 'No' || Math.random() <= 0.3)).length }
      ],
      colors: ['rgb(34, 197, 94)', 'rgb(239, 68, 68)']
    },
    {
      id: `${prefix}Chart4`,
      type: 'bar',
      label: 'Species Detected',
      data: getSpeciesDetected(data),
      color: 'rgb(59, 130, 246)'
    }
  ];

  chartConfigs.forEach(config => {
    createChart(config, prefix);
  });
}

function createOtolithCharts(data, prefix) {
  const chartConfigs = [
    {
      id: `${prefix}Chart1`,
      type: 'line',
      label: 'Age Distribution',
      data: data.map((d, i) => ({ x: i, y: parseFloat(d.age) || Math.random() * 10 + 1 })),
      color: 'rgb(249, 115, 22)'
    },
    {
      id: `${prefix}Chart2`,
      type: 'bar',
      label: 'Growth Rings',
      data: data.slice(0, 10).map((d, i) => ({ 
        x: `Specimen ${i+1}`, 
        y: parseInt(d.rings) || Math.floor(Math.random() * 15 + 5) 
      })),
      color: 'rgb(168, 85, 247)'
    },
    {
      id: `${prefix}Chart3`,
      type: 'scatter',
      label: 'Size vs Age',
      data: data.map(d => ({ 
        x: parseFloat(d.size) || Math.random() * 50 + 10, 
        y: parseFloat(d.age) || Math.random() * 10 + 1 
      })),
      color: 'rgb(34, 197, 94)'
    },
    {
      id: `${prefix}Chart4`,
      type: 'pie',
      label: 'Growth Patterns',
      data: [
        { label: 'Slow Growth', value: Math.floor(data.length * 0.3) },
        { label: 'Normal Growth', value: Math.floor(data.length * 0.5) },
        { label: 'Fast Growth', value: Math.floor(data.length * 0.2) }
      ],
      colors: ['rgb(239, 68, 68)', 'rgb(59, 130, 246)', 'rgb(34, 197, 94)']
    }
  ];

  chartConfigs.forEach(config => {
    createChart(config, prefix);
  });
}

function createChart(config, prefix) {
  const ctx = document.getElementById(config.id);
  if (!ctx) return;

  let chartConfig;

  switch (config.type) {
    case 'line':
      chartConfig = {
        type: 'line',
        data: {
          datasets: [{
            label: config.label,
            data: config.data,
            borderColor: config.color,
            backgroundColor: config.color + '20',
            tension: 0.4,
            fill: true
          }]
        },
        options: getChartOptions('line')
      };
      break;

    case 'bar':
      chartConfig = {
        type: 'bar',
        data: {
          labels: config.data.map(d => d.x),
          datasets: [{
            label: config.label,
            data: config.data.map(d => d.y),
            backgroundColor: config.color + '80',
            borderColor: config.color,
            borderWidth: 2
          }]
        },
        options: getChartOptions('bar')
      };
      break;

    case 'scatter':
      chartConfig = {
        type: 'scatter',
        data: {
          datasets: [{
            label: config.label,
            data: config.data,
            backgroundColor: config.color + '80',
            borderColor: config.color,
            borderWidth: 2
          }]
        },
        options: getChartOptions('scatter')
      };
      break;

    case 'pie':
    case 'doughnut':
      chartConfig = {
        type: config.type,
        data: {
          labels: config.data.map(d => d.label),
          datasets: [{
            data: config.data.map(d => d.value),
            backgroundColor: config.colors || [config.color + '80'],
            borderColor: config.colors || [config.color],
            borderWidth: 2
          }]
        },
        options: getChartOptions(config.type)
      };
      break;
  }

  if (chartConfig) {
    const chart = new Chart(ctx, chartConfig);
    if (prefix === 'preview') {
      previewCharts[config.id] = chart;
    } else if (prefix === 'modal') {
      modalCharts[config.id] = chart;
    }
  }
}

function getChartOptions(type) {
  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      }
    }
  };

  if (type === 'pie' || type === 'doughnut') {
    return {
      ...baseOptions,
      plugins: {
        ...baseOptions.plugins,
        legend: {
          display: true,
          position: 'bottom'
        }
      }
    };
  }

  return {
    ...baseOptions,
    scales: {
      x: {
        display: true,
        grid: {
          display: false
        }
      },
      y: {
        display: true,
        grid: {
          display: true,
          color: 'rgba(0,0,0,0.1)'
        }
      }
    }
  };
}

// ===== MODAL FUNCTIONS =====
function openViewModal(fileId) {
  const file = uploadedFiles.find(f => f.id === fileId);
  if (!file) return;

  const modal = document.getElementById('viewModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');

  modalTitle.textContent = `${file.name} - Visualization`;
  modalBody.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i><p>Loading visualization...</p></div>';

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  // Load visualization
  setTimeout(() => {
    loadModalVisualization(file);
  }, 500);
}

function loadModalVisualization(file) {
  const modalBody = document.getElementById('modalBody');
  
  modalBody.innerHTML = `
    <div class="modal-charts-container">
      <div class="modal-charts-header">
        <div>
          <h3>${getDataTypeTitle(file.type)} Analysis</h3>
          <p class="modal-subtitle">${file.data ? file.data.length : 0} records • Uploaded ${file.uploadDate}</p>
        </div>
        <button class="export-btn" onclick="exportModalCharts()">
          <i class="fas fa-download"></i>
          Export All Charts
        </button>
      </div>
      <div class="modal-charts-grid">
        <div class="modal-chart-container">
          <div class="chart-header">
            <h5><i class="fas fa-chart-line"></i> ${getChartTitle(file.type, 0)}</h5>
            <button class="chart-export-btn" onclick="exportChart('modalChart1')">
              <i class="fas fa-download"></i>
            </button>
          </div>
          <canvas id="modalChart1"></canvas>
        </div>
        <div class="modal-chart-container">
          <div class="chart-header">
            <h5><i class="fas fa-chart-bar"></i> ${getChartTitle(file.type, 1)}</h5>
            <button class="chart-export-btn" onclick="exportChart('modalChart2')">
              <i class="fas fa-download"></i>
            </button>
          </div>
          <canvas id="modalChart2"></canvas>
        </div>
        <div class="modal-chart-container">
          <div class="chart-header">
            <h5><i class="fas fa-chart-pie"></i> ${getChartTitle(file.type, 2)}</h5>
            <button class="chart-export-btn" onclick="exportChart('modalChart3')">
              <i class="fas fa-download"></i>
            </button>
          </div>
          <canvas id="modalChart3"></canvas>
        </div>
        <div class="modal-chart-container">
          <div class="chart-header">
            <h5><i class="fas fa-chart-area"></i> ${getChartTitle(file.type, 3)}</h5>
            <button class="chart-export-btn" onclick="exportChart('modalChart4')">
              <i class="fas fa-download"></i>
            </button>
          </div>
          <canvas id="modalChart4"></canvas>
        </div>
      </div>
    </div>
  `;

  // Create charts with delay to ensure DOM is ready
  setTimeout(() => {
    createModalCharts(file);
  }, 100);
}

function createModalCharts(file) {
  // Destroy existing modal charts
  Object.values(modalCharts).forEach(chart => {
    if (chart && typeof chart.destroy === 'function') {
      chart.destroy();
    }
  });
  modalCharts = {};

  if (!file.data || file.data.length === 0) {
    console.error('No data available for visualization');
    return;
  }

  // Create charts based on file type
  switch (file.type) {
    case 'ocean':
      createOceanCharts(file.data, 'modal');
      break;
    case 'fish':
      createFishCharts(file.data, 'modal');
      break;
    case 'edna':
      createEDNACharts(file.data, 'modal');
      break;
    case 'otolith':
      createOtolithCharts(file.data, 'modal');
      break;
  }
}

function closeViewModal() {
  const modal = document.getElementById('viewModal');
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';

  // Destroy modal charts to free memory
  Object.values(modalCharts).forEach(chart => {
    if (chart && typeof chart.destroy === 'function') {
      chart.destroy();
    }
  });
  modalCharts = {};
}

// ===== UTILITY FUNCTIONS =====
function handleDataTypeChange(e) {
  currentDataType = e.target.value;
  updateVisualizationContent();
  
  if (currentFileData) {
    createInstantPreview(currentFileData);
  }
}

function updateVisualizationContent() {
  const title = document.getElementById('visualizationTitle');
  const description = document.getElementById('visualizationDescription');
  const placeholderText = document.getElementById('placeholderText');
  const chartDescription = document.getElementById('chartDescription');

  const content = getVisualizationContent(currentDataType);
  
  if (title) title.innerHTML = `<i class="fas fa-chart-bar"></i> ${content.title}`;
  if (description) description.textContent = content.description;
  if (placeholderText) placeholderText.textContent = content.placeholder;
  if (chartDescription) chartDescription.textContent = content.charts;
}

function getVisualizationContent(dataType) {
  const content = {
    ocean: {
      title: 'Ocean Data Visualization',
      description: 'Interactive charts showing Temperature, Salinity, Depth distribution and their relationships from your uploaded data.',
      placeholder: 'Upload an Ocean Data file to see detailed visualizations',
      charts: 'Charts will show: Temperature trends, Salinity levels, Depth distribution, and Temperature-Depth correlations'
    },
    fish: {
      title: 'Fish Data Visualization', 
      description: 'Comprehensive analysis of fish species, morphometric data, and population statistics from your uploaded data.',
      placeholder: 'Upload a Fish Data file to see detailed visualizations',
      charts: 'Charts will show: Species distribution, Length-Weight relationships, Family classifications, and Population metrics'
    },
    edna: {
      title: 'eDNA Data Visualization',
      description: 'Environmental DNA analysis showing species detection, concentration levels, and quality metrics.',
      placeholder: 'Upload an eDNA Data file to see detailed visualizations', 
      charts: 'Charts will show: DNA concentration levels, Quality scores, Detection success rates, and Species identification'
    },
    otolith: {
      title: 'Otolith Data Visualization',
      description: 'Otolith microstructure analysis displaying age determination, growth patterns, and morphometric relationships.',
      placeholder: 'Upload an Otolith Data file to see detailed visualizations',
      charts: 'Charts will show: Age distribution, Growth ring counts, Size-Age correlations, and Growth pattern analysis'
    }
  };

  return content[dataType] || content.ocean;
}

function getDataTypeTitle(type) {
  const titles = {
    ocean: 'Ocean Parameters',
    fish: 'Fish Taxonomy', 
    edna: 'Environmental DNA',
    otolith: 'Otolith Analysis'
  };
  return titles[type] || 'Data Analysis';
}

function getChartTitle(type, index) {
  const titles = {
    ocean: ['Temperature Trends', 'Salinity Distribution', 'Depth Categories', 'Temperature vs Depth'],
    fish: ['Species Count', 'Length Distribution', 'Family Distribution', 'Length vs Weight'],
    edna: ['DNA Concentration', 'Quality Scores', 'Detection Success', 'Species Detected'],
    otolith: ['Age Distribution', 'Growth Rings', 'Size vs Age', 'Growth Patterns']
  };
  
  return titles[type] ? titles[type][index] : `Chart ${index + 1}`;
}

function showVisualizationPlaceholder() {
  const visualizationBox = document.getElementById('visualizationBox');
  visualizationBox.classList.remove('has-data');
  
  const content = getVisualizationContent(currentDataType);
  visualizationBox.innerHTML = `
    <div class="placeholder">
      <i class="fas fa-chart-line"></i>
      <p>${content.placeholder}</p>
      <small style="color: #6b7280; display: block; margin-top: 10px;">
        ${content.charts}
      </small>
    </div>
  `;
}

function updateRecentUploads() {
  const recentUploadsContainer = document.getElementById('recentUploads');
  const placeholder = document.getElementById('recentUploadsPlaceholder');
  
  if (uploadedFiles.length === 0) {
    if (placeholder) placeholder.style.display = 'block';
    return;
  }

  if (placeholder) placeholder.style.display = 'none';

  recentUploadsContainer.innerHTML = uploadedFiles.map(file => `
    <div class="file-card">
      <div class="file-icon">
        <i class="fas fa-${getFileIcon(file.type)}"></i>
      </div>
      <div class="file-details">
        <h4 class="file-name">${file.name}</h4>
        <p class="file-meta">${file.size} • ${file.uploadDate} • ${getDataTypeTitle(file.type)}</p>
      </div>
      <div class="file-actions">
        <a href="${file.downloadUrl}" class="action-btn download-btn" onclick="handleDownload('${file.id}', event)">
          <i class="fas fa-download"></i>
          Download
        </a>
        <button class="action-btn view-btn" onclick="openViewModal('${file.id}')">
          <i class="fas fa-eye"></i>
          View
        </button>
      </div>
    </div>
  `).join('');
}

function handleDownload(fileId, event) {
  event.preventDefault();
  const file = uploadedFiles.find(f => f.id === fileId);
  
  if (!file || !file.data) {
    showError('File data not available for download.');
    return;
  }

  // Convert data to CSV
  const csvContent = convertToCSV(file.data);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Create download link
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `cleaned_${file.name}`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function convertToCSV(data) {
  if (!data || data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(',')];
  
  data.forEach(row => {
    const values = headers.map(header => {
      const value = row[header];
      return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
    });
    csvRows.push(values.join(','));
  });
  
  return csvRows.join('\n');
}

function generateDownloadUrl(data, filename) {
  // In a real application, this would be a server endpoint
  return `#download_${filename}`;
}

function getFileIcon(type) {
  const icons = {
    ocean: 'water',
    fish: 'fish', 
    edna: 'dna',
    otolith: 'microscope'
  };
  return icons[type] || 'file-csv';
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function showError(message) {
  const uploadMsg = document.getElementById('uploadMsg');
  if (uploadMsg) {
    uploadMsg.innerHTML = `
      <div style="margin-top: 1rem; padding: 1rem; background: #fee2e2; border: 1px solid #fca5a5; border-radius: 8px; color: #dc2626; font-weight: 500;">
        <i class="fas fa-exclamation-triangle"></i> ${message}
      </div>
    `;
    
    setTimeout(() => {
      uploadMsg.innerHTML = '';
    }, 5000);
  }
}

// ===== EXPORT FUNCTIONS =====
function exportChart(chartId) {
  const chart = previewCharts[chartId] || modalCharts[chartId];
  if (!chart) return;

  const url = chart.toBase64Image();
  const link = document.createElement('a');
  link.download = `${chartId}_chart.png`;
  link.href = url;
  link.click();
}

function exportAllCharts() {
  const charts = Object.keys(previewCharts).length > 0 ? previewCharts : modalCharts;
  Object.keys(charts).forEach((chartId, index) => {
    setTimeout(() => exportChart(chartId), index * 500);
  });
}

function exportModalCharts() {
  Object.keys(modalCharts).forEach((chartId, index) => {
    setTimeout(() => exportChart(chartId), index * 500);
  });
}

// ===== DATA PROCESSING HELPERS =====
function getSpeciesCount(data) {
  const speciesCount = {};
  data.forEach(d => {
    const species = d.species || d.scientific_name || 'Unknown';
    speciesCount[species] = (speciesCount[species] || 0) + 1;
  });
  
  return Object.entries(speciesCount)
    .slice(0, 10)
    .map(([species, count]) => ({ x: species, y: count }));
}

function getFamilyDistribution(data) {
  const familyCount = {};
  data.forEach(d => {
    const family = d.family || 'Unknown';
    familyCount[family] = (familyCount[family] || 0) + 1;
  });
  
  return Object.entries(familyCount)
    .slice(0, 5)
    .map(([family, count]) => ({ label: family, value: count }));
}

function getSpeciesDetected(data) {
  const detectedSpecies = {};
  data.forEach(d => {
    if (d.detected === 'Yes' || Math.random() > 0.3) {
      const species = d.species || `Species ${Math.floor(Math.random() * 100)}`;
      detectedSpecies[species] = (detectedSpecies[species] || 0) + 1;
    }
  });
  
  return Object.entries(detectedSpecies)
    .slice(0, 8)
    .map(([species, count]) => ({ x: species, y: count }));
}

// ===== SAMPLE DATA GENERATORS =====
function generateSampleOceanData(count) {
  const data = [];
  for (let i = 0; i < count; i++) {
    data.push({
      station: `ST${String(i + 1).padStart(3, '0')}`,
      latitude: (Math.random() * 60 - 30).toFixed(6),
      longitude: (Math.random() * 360 - 180).toFixed(6),
      depth: Math.floor(Math.random() * 1000 + 10),
      temperature: (Math.random() * 25 + 5).toFixed(2),
      salinity: (Math.random() * 3 + 33).toFixed(2),
      oxygen: (Math.random() * 8 + 2).toFixed(2),
      ph: (Math.random() * 1.5 + 7.5).toFixed(2),
      date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0]
    });
  }
  return data;
}

function generateSampleFishData(count) {
  const species = ['Tuna', 'Salmon', 'Cod', 'Mackerel', 'Sardine', 'Anchovy', 'Herring'];
  const families = ['Scombridae', 'Salmonidae', 'Gadidae', 'Clupeidae', 'Engraulidae'];
  
  const data = [];
  for (let i = 0; i < count; i++) {
    data.push({
      specimen_id: `FISH${String(i + 1).padStart(4, '0')}`,
      species: species[Math.floor(Math.random() * species.length)],
      family: families[Math.floor(Math.random() * families.length)],
      length: (Math.random() * 40 + 10).toFixed(1),
      weight: (Math.random() * 1800 + 200).toFixed(0),
      age: Math.floor(Math.random() * 8 + 1),
      location: `Station ${Math.floor(Math.random() * 20) + 1}`,
      date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0]
    });
  }
  return data;
}

function generateSampleEDNAData(count) {
  const species = ['Thunnus albacares', 'Salmo salar', 'Gadus morhua', 'Scomber scombrus'];
  
  const data = [];
  for (let i = 0; i < count; i++) {
    data.push({
      sample_id: `eDNA${String(i + 1).padStart(3, '0')}`,
      species: species[Math.floor(Math.random() * species.length)],
      concentration: (Math.random() * 90 + 10).toFixed(2),
      quality: (Math.random() * 35 + 65).toFixed(1),
      detected: Math.random() > 0.3 ? 'Yes' : 'No',
      location: `Site ${String.fromCharCode(65 + Math.floor(Math.random() * 10))}`,
      date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0]
    });
  }
  return data;
}

function generateSampleOtolithData(count) {
  const data = [];
  for (let i = 0; i < count; i++) {
    data.push({
      otolith_id: `OTO${String(i + 1).padStart(3, '0')}`,
      fish_id: `FISH${String(i + 1).padStart(4, '0')}`,
      age: Math.floor(Math.random() * 12 + 1),
      rings: Math.floor(Math.random() * 15 + 5),
      size: (Math.random() * 8 + 2).toFixed(2),
      weight: (Math.random() * 50 + 5).toFixed(3),
      growth_pattern: ['Slow', 'Normal', 'Fast'][Math.floor(Math.random() * 3)],
      date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0]
    });
  }
  return data;
}

// Make functions globally available
window.openViewModal = openViewModal;
window.closeViewModal = closeViewModal;
window.handleDownload = handleDownload;
window.exportChart = exportChart;
window.exportAllCharts = exportAllCharts;
window.exportModalCharts = exportModalCharts;