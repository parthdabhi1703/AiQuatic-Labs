document.addEventListener("DOMContentLoaded", () => {
  // --- [ELEMENT SELECTION] ---
  const dropAreaEl = document.getElementById("dropArea");
  const fileEl = document.getElementById("fileUpload");
  const browseBtnEl = document.getElementById("browseBtn");
  const detailsEl = document.getElementById("fileDetails");
  const uploadBtnEl = document.getElementById("uploadBtn");
  const msgEl = document.getElementById("uploadMsg");
  const visualizationBox = document.getElementById("visualizationBox");
  const recentUploadsEl = document.getElementById("recentUploads");
  const recentUploadsPlaceholder = document.getElementById(
    "recentUploadsPlaceholder"
  );

  let selectedFile = null;
  let activeCharts = [];
  
  // Load recent uploads on page load
  loadRecentUploads();

  // --- Data Type Change Handler ---
  const dataTypeRadios = document.querySelectorAll('input[name="dataType"]');
  dataTypeRadios.forEach(radio => {
    radio.addEventListener('change', handleDataTypeChange);
  });

  function handleDataTypeChange() {
    const selectedDataType = document.querySelector('input[name="dataType"]:checked').value;
    updateVisualizationContent(selectedDataType);
  }

  function updateVisualizationContent(dataType) {
    const titleEl = document.getElementById('visualizationTitle');
    const descriptionEl = document.getElementById('visualizationDescription');
    const placeholderEl = document.getElementById('placeholderText');
    const chartDescEl = document.getElementById('chartDescription');

    switch(dataType) {
      case 'fish':
        if (titleEl) titleEl.innerHTML = '<i class="fas fa-chart-bar"></i> Fish Data Visualization';
        if (descriptionEl) descriptionEl.textContent = 'Interactive charts showing Families Distribution, Population by Habitat (or Taxonomic group), Species Discovery Timeline and Conservation Status from your uploaded data.';
        if (placeholderEl) placeholderEl.textContent = 'Upload a Fish Data file to see detailed visualizations';
        if (chartDescEl) chartDescEl.textContent = 'Charts will show: Family distribution, Species by taxonomic groups, Population quantities, and Organism diversity';
        break;
      case 'ocean':
      default:
        if (titleEl) titleEl.innerHTML = '<i class="fas fa-chart-bar"></i> Ocean Data Visualization';
        if (descriptionEl) descriptionEl.textContent = 'Interactive charts showing Temperature, Salinity distributions, geographic analysis, and temperature-salinity relationships from your uploaded data.';
        if (placeholderEl) placeholderEl.textContent = 'Upload an Ocean Data file to see detailed visualizations';
        if (chartDescEl) chartDescEl.textContent = 'Charts will show: Temperature trends, Salinity levels, Geographic temperature & salinity analysis, and Temperature-Salinity correlations';
        break;
    }
  }

  // --- File Selection & Instant Preview ---
  const handleFileSelect = (file) => {
    selectedFile = file;
    showFileDetails(selectedFile);

    if (file.type === "text/csv" || file.name.endsWith(".csv")) {
      setVisualizationPlaceholder(
        "Parsing your file for preview...",
        "fas fa-spinner fa-spin"
      );

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          if (results.data && results.data.length > 0) {
            const selectedDataType = document.querySelector('input[name="dataType"]:checked').value;
            if (selectedDataType === 'fish') {
              renderFishDataCharts(results.data);
            } else {
              renderOceanDataCharts(results.data);
            }
          } else {
            setVisualizationPlaceholder(
              "Could not find data in the CSV to preview.",
              "fas fa-exclamation-circle"
            );
          }
        },
        error: function (error) {
          setVisualizationPlaceholder(
            "Could not parse the CSV file for preview.",
            "fas fa-times-circle"
          );
        },
      });
    } else {
      destroyCharts();
      setVisualizationPlaceholder(
        "Instant preview is only available for CSV files.",
        "fas fa-info-circle"
      );
    }
  };

  if (browseBtnEl && fileEl) {
    browseBtnEl.addEventListener("click", () => fileEl.click());
    fileEl.addEventListener("change", () => {
      if (fileEl.files.length > 0) {
        handleFileSelect(fileEl.files[0]);
      }
    });
  }

  if (dropAreaEl) {
    dropAreaEl.addEventListener("dragover", (e) => e.preventDefault());
    dropAreaEl.addEventListener("drop", (e) => {
      e.preventDefault();
      if (e.dataTransfer.files.length > 0) {
        fileEl.files = e.dataTransfer.files;
        handleFileSelect(e.dataTransfer.files[0]);
      }
    });
  }

  // --- Upload Button Logic ---
  if (uploadBtnEl) {
    uploadBtnEl.addEventListener("click", async () => {
      if (!selectedFile) {
        msgEl.innerHTML = `<span style="color:#ef4444;">❌ Please select a file first.</span>`;
        return;
      }
      uploadBtnEl.disabled = true;
      uploadBtnEl.textContent = "Processing...";
      
      // Enhanced progress indicators
      const progressSteps = [
        "🔍 Analyzing file format...",
        "🧹 Cleaning and validating data...",
        "🗺️ Detecting geographic locations...",
        "💾 Saving to database...",
        "✨ Finalizing upload..."
      ];
      
      let currentStep = 0;
      msgEl.innerHTML = `<div style="color:#3b82f6;font-weight:500;">${progressSteps[currentStep]}</div>`;
      
      // Progress animation
      const progressInterval = setInterval(() => {
        currentStep = (currentStep + 1) % progressSteps.length;
        msgEl.innerHTML = `<div style="color:#3b82f6;font-weight:500;">${progressSteps[currentStep]}</div>`;
      }, 2000);

      const formData = new FormData();
      formData.append("dataset", selectedFile);
      formData.append(
        "dataType",
        document.querySelector('input[name="dataType"]:checked').value
      );

      try {
        const startTime = Date.now();
        const res = await fetch(`${window.API_CONFIG.BASE_URL}/upload`, {
          method: "POST",
          body: formData,
        });
        
        clearInterval(progressInterval);
        const data = await res.json();
        const processingTime = ((Date.now() - startTime) / 1000).toFixed(1);

        if (res.ok) {
          msgEl.innerHTML = `<div style="color:#10b981;font-weight:500;">
            ✅ ${data.message}<br>
            <small style="color:#6b7280;">Processed in ${processingTime}s</small>
          </div>`;
          addRecentUpload(data);
          resetUploadUI();
        } else {
          // [BUG FIX] Do NOT clear the charts on error. Just show the message.
          msgEl.innerHTML = `<span style="color:#ef4444;">❌ Error: ${
            data.message || "An unknown error occurred."
          }</span>`;
        }
      } catch (err) {
        clearInterval(progressInterval);
        // [BUG FIX] Do NOT clear the charts on error. Just show the message.
        msgEl.innerHTML = `<span style="color:#ef4444;">❌ Upload failed. Cannot connect to the server.</span>`;
      } finally {
        uploadBtnEl.disabled = false;
        uploadBtnEl.textContent = "Upload";
      }
    });
  }

  // --- Load recent uploads from server ---
  async function loadRecentUploads() {
    try {
      const response = await fetch(`${window.API_CONFIG.BASE_URL}/recent-uploads`);
      const recentUploads = await response.json();
      
      if (recentUploads.length === 0) {
        if (recentUploadsPlaceholder) {
          recentUploadsPlaceholder.style.display = "block";
        }
        return;
      }
      
      if (recentUploadsPlaceholder) {
        recentUploadsPlaceholder.style.display = "none";
      }
      
      // Clear existing uploads
      const existingCards = recentUploadsEl.querySelectorAll('.file-card');
      existingCards.forEach(card => card.remove());
      
      // Add each upload (limit to 5 most recent files)
      recentUploads.slice(0, 5).forEach(upload => {
        addRecentUploadCard(upload);
      });
      
    } catch (error) {
      console.error("Error loading recent uploads:", error);
    }
  }

  // --- Function to add the cleaned file card ---
  function addRecentUploadCard(upload) {
    if (!recentUploadsEl) return;

    const fileCard = document.createElement("div");
    fileCard.className = "file-card";
    
    const uploadDate = new Date(upload.uploadDate).toLocaleDateString();
    
    // Generate download filename with _Cleaned suffix
    const originalName = upload.originalFilename;
    const downloadFilename = originalName.replace(/\.(csv|CSV)$/i, '_Cleaned.csv');

    fileCard.innerHTML = `
      <div class="file-icon"><i class="fas fa-file-csv"></i></div>
      <div class="file-details">
          <p class="file-name">${upload.originalFilename} (Cleaned)</p>
          <p class="file-meta">Uploaded: ${uploadDate} | Processed: ${upload.recordsProcessed} records | Saved: ${upload.recordsSaved} records</p>
      </div>
      <div class="file-actions">
          <button class="action-btn view-btn" onclick="openViewModal('${upload._id}')">
              <i class="fas fa-eye"></i> View
          </button>
          <a href="${window.API_CONFIG.BASE_URL}/download/${upload.cleanedFilename}" 
             class="action-btn download-btn" 
             download="${downloadFilename}">
              <i class="fas fa-download"></i> Download
          </a>
      </div>
    `;
    recentUploadsEl.appendChild(fileCard);
  }
  
  // --- Function to add new upload after successful upload ---
  function addRecentUpload(data) {
    if (!recentUploadsEl) return;
    if (recentUploadsPlaceholder)
      recentUploadsPlaceholder.style.display = "none";

    // Create upload object in the same format as from server
    const upload = {
      _id: data.uploadId,
      originalFilename: data.originalFilename,
      cleanedFilename: data.cleanedFilename,
      recordsProcessed: data.recordsProcessed,
      recordsSaved: data.recordsSaved,
      uploadDate: new Date().toISOString()
    };

    addRecentUploadCard(upload);
  }

  // --- Helper Functions ---
  function showFileDetails(file) {
    if (!file) return;
    detailsEl.textContent = `Selected: ${file.name} (${(
      file.size / 1024
    ).toFixed(2)} KB)`;
    browseBtnEl.hidden = true;
    uploadBtnEl.hidden = false;
    msgEl.textContent = "";
  }
  function resetUploadUI() {
    uploadBtnEl.hidden = true;
    browseBtnEl.hidden = false;
    fileEl.value = "";
    selectedFile = null;
    detailsEl.textContent = "";
  }
  function setVisualizationPlaceholder(message, iconClass) {
    destroyCharts(); // This is the correct place to destroy charts
    visualizationBox.className = "visualization-box";
    visualizationBox.innerHTML = `<div class="placeholder"><i class="${iconClass}"></i><p>${message}</p></div>`;
  }
  function destroyCharts() {
    activeCharts.forEach((chart) => chart.destroy());
    activeCharts = [];
  }

  // --- Fish Data Visualization Function ---
  function renderFishDataCharts(fishData) {
    destroyCharts();
    visualizationBox.className = "visualization-box has-data";
    visualizationBox.innerHTML = `
      <div class="visualization-container">
        <div class="visualization-header">
          <h4 class="visualization-title">
            <i class="fas fa-chart-area"></i> Instant Data Preview
          </h4>
          <button class="export-btn" onclick="exportAllCharts('fish')" title="Export All Charts">
            <i class="fas fa-download"></i> Export Charts
          </button>
        </div>
        <p class="visualization-subtitle">
          Previewing <strong style="color:#059669;">${fishData.length} records</strong> from your uploaded file
        </p>
        <div class="charts-grid">
          <div class="chart-container">
            <div class="chart-header">
              <h5><i class="fas fa-sitemap"></i> Family Distribution</h5>
              <button class="chart-export-btn" onclick="exportSingleChart('familyChart', 'Fish_Family_Distribution')" title="Export Chart">
                <i class="fas fa-download"></i>
              </button>
            </div>
            <canvas id="familyChart"></canvas>
          </div>
          <div class="chart-container">
            <div class="chart-header">
              <h5><i class="fas fa-layer-group"></i> Species by Taxonomic Groups</h5>
              <button class="chart-export-btn" onclick="exportSingleChart('taxonomyChart', 'Fish_Taxonomic_Groups')" title="Export Chart">
                <i class="fas fa-download"></i>
              </button>
            </div>
            <canvas id="taxonomyChart"></canvas>
          </div>
          <div class="chart-container">
            <div class="chart-header">
              <h5><i class="fas fa-chart-bar"></i> Population Quantities</h5>
              <button class="chart-export-btn" onclick="exportSingleChart('populationChart', 'Fish_Population_Quantities')" title="Export Chart">
                <i class="fas fa-download"></i>
              </button>
            </div>
            <canvas id="populationChart"></canvas>
          </div>
          <div class="chart-container">
            <div class="chart-header">
              <h5><i class="fas fa-project-diagram"></i> Organism Diversity</h5>
              <button class="chart-export-btn" onclick="exportSingleChart('diversityChart', 'Fish_Organism_Diversity')" title="Export Chart">
                <i class="fas fa-download"></i>
              </button>
            </div>
            <canvas id="diversityChart"></canvas>
          </div>
        </div>
        
        <!-- Interactive Location Map -->
        <div class="preview-map-container">
          <div class="preview-map-header">
            <h5><i class="fas fa-map-marked-alt"></i> Data Locations</h5>
          </div>
          <div id="previewMap" class="preview-map"></div>
        </div>
      </div>`;

    const getFieldValue = (record, fieldNames) => {
      for (let field of fieldNames) {
        if (record[field] !== undefined && record[field] !== null && record[field] !== '') {
          return record[field];
        }
      }
      return null;
    };

    // Extract fish data fields
    const families = fishData
      .map((d) => getFieldValue(d, ["Family", "family"]))
      .filter((f) => f !== null);
    
    const classes = fishData
      .map((d) => getFieldValue(d, ["Class", "class"]))
      .filter((c) => c !== null);

    const quantities = fishData
      .map((d) => {
        const qty = getFieldValue(d, ["organismQuantity", "organism_quantity", "quantity", "count"]);
        return qty ? parseFloat(qty) : null;
      })
      .filter((q) => q !== null && !isNaN(q));

    const species = fishData
      .map((d) => getFieldValue(d, ["Species", "species", "scientificName", "scientific_name"]))
      .filter((s) => s !== null);

    // Family Distribution Chart
    const familyCtx = document.getElementById("familyChart");
    if (familyCtx && families.length > 0) {
      const familyCounts = {};
      families.forEach(family => {
        familyCounts[family] = (familyCounts[family] || 0) + 1;
      });
      const topFamilies = Object.entries(familyCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 8);

      activeCharts.push(
        new Chart(familyCtx, {
          type: "doughnut",
          data: {
            labels: topFamilies.map(([family]) => family),
            datasets: [{
              data: topFamilies.map(([, count]) => count),
              backgroundColor: [
                "#10b981", "#3b82f6", "#f59e0b", "#ef4444",
                "#8b5cf6", "#06d6a0", "#f72585", "#4cc9f0"
              ],
              borderWidth: 2,
              borderColor: "#ffffff"
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: "bottom" } }
          }
        })
      );
    }

    // Taxonomic Groups Chart
    const taxonomyCtx = document.getElementById("taxonomyChart");
    if (taxonomyCtx && classes.length > 0) {
      const classCounts = {};
      classes.forEach(cls => {
        classCounts[cls] = (classCounts[cls] || 0) + 1;
      });
      const labels = fishData.map((d, index) => d.eventID || `Record_${index + 1}`).slice(0, 10);

      activeCharts.push(
        new Chart(taxonomyCtx, {
          type: "bar",
          data: {
            labels: Object.keys(classCounts).slice(0, 10),
            datasets: [{
              label: "Species Count by Class",
              data: Object.values(classCounts).slice(0, 10),
              backgroundColor: "rgba(59,130,246,0.7)",
              borderColor: "#3b82f6",
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true, title: { display: true, text: "Count" } } }
          }
        })
      );
    }

    // Population Quantities Chart
    const populationCtx = document.getElementById("populationChart");
    if (populationCtx && quantities.length > 0) {
      const labels = fishData
        .filter((d, index) => quantities[index] !== undefined)
        .map((d, index) => d.eventID || `Record_${index + 1}`)
        .slice(0, 15);

      activeCharts.push(
        new Chart(populationCtx, {
          type: "line",
          data: {
            labels: labels,
            datasets: [{
              label: "Organism Quantity",
              data: quantities.slice(0, 15),
              borderColor: "#ef4444",
              backgroundColor: "rgba(239,68,68,0.1)",
              fill: true,
              tension: 0.4
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true, title: { display: true, text: "Quantity" } } }
          }
        })
      );
    }

    // Diversity Chart (Species Distribution)
    const diversityCtx = document.getElementById("diversityChart");
    if (diversityCtx && species.length > 0) {
      const speciesCounts = {};
      species.forEach(sp => {
        speciesCounts[sp] = (speciesCounts[sp] || 0) + 1;
      });
      
      const diversityData = fishData.slice(0, 50).map((d, index) => ({
        x: index + 1,
        y: getFieldValue(d, ["organismQuantity", "organism_quantity", "quantity", "count"]) || 0
      }));

      activeCharts.push(
        new Chart(diversityCtx, {
          type: "scatter",
          data: {
            datasets: [{
              label: "Organism Distribution",
              data: diversityData,
              backgroundColor: "rgba(139,92,246,0.7)"
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: { type: "linear", position: "bottom", title: { display: true, text: "Record Number" } },
              y: { title: { display: true, text: "Organism Quantity" } }
            }
          }
        })
      );
    }

    // Initialize the preview map and add data points
    initializePreviewMap(fishData, 'fish');
  }

  // --- Ocean Data Visualization Function ---
  function renderOceanDataCharts(oceanData) {
    destroyCharts();
    visualizationBox.className = "visualization-box has-data";
    visualizationBox.innerHTML = `
      <div class="visualization-container">
        <div class="visualization-header">
          <h4 class="visualization-title">
            <i class="fas fa-chart-area"></i> Instant Data Preview
          </h4>
          <button class="export-btn" onclick="exportAllCharts('ocean')" title="Export All Charts">
            <i class="fas fa-download"></i> Export Charts
          </button>
        </div>
        <p class="visualization-subtitle">
          Previewing <strong style="color:#059669;">${oceanData.length} records</strong> from your uploaded file
        </p>
        <div class="charts-grid">
          <div class="chart-container">
            <div class="chart-header">
              <h5><i class="fas fa-thermometer-half"></i> Temperature Distribution (°C)</h5>
              <button class="chart-export-btn" onclick="exportSingleChart('tempChart', 'Ocean_Temperature_Distribution')" title="Export Chart">
                <i class="fas fa-download"></i>
              </button>
            </div>
            <canvas id="tempChart"></canvas>
          </div>
          <div class="chart-container">
            <div class="chart-header">
              <h5><i class="fas fa-map-marker-alt"></i> Average Depth by Locality</h5>
              <button class="chart-export-btn" onclick="exportSingleChart('salinityChart', 'Ocean_Average_Depth_by_Locality')" title="Export Chart">
                <i class="fas fa-download"></i>
              </button>
            </div>
            <canvas id="salinityChart"></canvas>
          </div>
          <div class="chart-container">
            <div class="chart-header">
              <h5><i class="fas fa-chart-bar"></i> Average Temperature & Salinity by Locality</h5>
              <button class="chart-export-btn" onclick="exportSingleChart('depthChart', 'Ocean_Avg_Temp_Salinity_by_Locality')" title="Export Chart">
                <i class="fas fa-download"></i>
              </button>
            </div>
            <canvas id="depthChart"></canvas>
          </div>
          <div class="chart-container">
            <div class="chart-header">
              <h5><i class="fas fa-thermometer-half"></i> Temperature vs Salinity</h5>
              <button class="chart-export-btn" onclick="exportSingleChart('tempSalinityScatterChart', 'Ocean_Temperature_vs_Salinity')" title="Export Chart">
                <i class="fas fa-download"></i>
              </button>
            </div>
            <canvas id="tempSalinityScatterChart"></canvas>
          </div>
        </div>
        
        <!-- Interactive Location Map -->
        <div class="preview-map-container">
          <div class="preview-map-header">
            <h5><i class="fas fa-map-marked-alt"></i> Data Locations</h5>
          </div>
          <div id="previewMap" class="preview-map"></div>
        </div>
      </div>`;
    const getFieldValue = (record, fieldNames) => {
      for (let field of fieldNames) {
        if (record[field] !== undefined && record[field] !== null) {
          const value = parseFloat(record[field]);
          if (!isNaN(value)) return value;
        }
      }
      return null;
    };
    const temperatures = oceanData
      .map((d) =>
        getFieldValue(d, ["Temperature_C", "Temperature (C)", "temperature_C", "Temperature", "temp"])
      )
      .filter((t) => t !== null);

    const oxygenLevels = oceanData
      .map((d) =>
        getFieldValue(d, [
          "Oxygen Concentration (mg/L)",
          "oxygen_concentration_mgL",
          "Dissolved O₂",
          "oxygen",
        ])
      )
      .filter((o) => o !== null);

    const salinities = oceanData
      .map((d) =>
        getFieldValue(d, [
          "Salinity(PSU)",
          "sea_water_salinity",
          "Salinity",
          "psu",
        ])
      )
      .filter((s) => s !== null);
    const depths = oceanData
      .map((d) =>
        getFieldValue(d, ["Depth in meter", "DepthInMeters", "Depth", "depth"])
      )
      .filter((d) => d !== null);
    const labels = oceanData
      .map((d) => d.eventDate || d.eventID || "Unknown")
      .slice(0, 30); // match Python top 30

    const tempCtx = document.getElementById("tempChart");
    if (tempCtx && temperatures.length > 0 && oxygenLevels.length > 0) {
      activeCharts.push(
        new Chart(tempCtx, {
          type: "line",
          data: {
            labels: labels,
            datasets: [
              {
                label: "Temperature (°C)",
                data: temperatures.slice(0, 30),
                borderColor: "rgba(231,107,243,1)", // pastel purple
                backgroundColor: "rgba(231,107,243,0.2)",
                fill: true,
                tension: 0.4, // smooth curve (spline-like)
                borderWidth: 3,
                pointRadius: 4,
              },
              {
                label: "Dissolved O₂ (mg/L)",
                data: oxygenLevels.slice(0, 30),
                borderColor: "rgba(0,176,246,1)", // pastel blue
                backgroundColor: "rgba(0,176,246,0.2)",
                fill: true,
                tension: 0.4,
                borderWidth: 3,
                pointRadius: 4,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: "Temperature & Dissolved Oxygen (Top 30 Records)",
              },
              legend: {
                display: true,
                labels: { usePointStyle: true },
              },
            },
            scales: {
              x: {
                title: { display: true, text: "Collection Date" },
              },
              y: {
                title: { display: true, text: "Values" },
                beginAtZero: false,
              },
            },
          },
        })
      );
    }
    const salinityCtx = document.getElementById("salinityChart");
    if (salinityCtx && oceanData.length > 0) {
      // Calculate average depth by locality
      const localityDepthMap = {};
      
      oceanData.forEach((record) => {
        const locality = record.locality || record.Locality || "Unknown";
        const depth = getFieldValue(record, ["Depth in meter", "DepthInMeters", "Depth", "depth"]);
        
        if (depth !== null) {
          if (!localityDepthMap[locality]) {
            localityDepthMap[locality] = { totalDepth: 0, count: 0 };
          }
          localityDepthMap[locality].totalDepth += depth;
          localityDepthMap[locality].count += 1;
        }
      });
      
      // Calculate averages and prepare data
      const localityLabels = [];
      const averageDepths = [];
      
      // Modern gradient colors for a professional look
      const gradientColors = [
        "rgba(99, 102, 241, 0.8)",   // Indigo
        "rgba(59, 130, 246, 0.8)",   // Blue  
        "rgba(16, 185, 129, 0.8)",   // Emerald
        "rgba(245, 158, 11, 0.8)",   // Amber
        "rgba(239, 68, 68, 0.8)",    // Red
        "rgba(139, 92, 246, 0.8)",   // Violet
        "rgba(236, 72, 153, 0.8)",   // Pink
        "rgba(20, 184, 166, 0.8)",   // Teal
        "rgba(251, 146, 60, 0.8)",   // Orange
        "rgba(34, 197, 94, 0.8)",    // Green
        "rgba(168, 85, 247, 0.8)",   // Purple
        "rgba(14, 165, 233, 0.8)",   // Sky
        "rgba(132, 204, 22, 0.8)",   // Lime
        "rgba(251, 113, 133, 0.8)",  // Rose
        "rgba(45, 212, 191, 0.8)"    // Cyan
      ];
      
      const borderColors = [
        "rgba(99, 102, 241, 1)",     // Indigo
        "rgba(59, 130, 246, 1)",     // Blue
        "rgba(16, 185, 129, 1)",     // Emerald
        "rgba(245, 158, 11, 1)",     // Amber
        "rgba(239, 68, 68, 1)",      // Red
        "rgba(139, 92, 246, 1)",     // Violet
        "rgba(236, 72, 153, 1)",     // Pink
        "rgba(20, 184, 166, 1)",     // Teal
        "rgba(251, 146, 60, 1)",     // Orange
        "rgba(34, 197, 94, 1)",      // Green
        "rgba(168, 85, 247, 1)",     // Purple
        "rgba(14, 165, 233, 1)",     // Sky
        "rgba(132, 204, 22, 1)",     // Lime
        "rgba(251, 113, 133, 1)",    // Rose
        "rgba(45, 212, 191, 1)"      // Cyan
      ];
      
      // Sort localities by average depth and take top 30
      const sortedLocalities = Object.entries(localityDepthMap)
        .map(([locality, data]) => ({
          locality,
          avgDepth: Math.round((data.totalDepth / data.count) * 100) / 100
        }))
        .sort((a, b) => b.avgDepth - a.avgDepth)
        .slice(0, 30); // Limit to top 30

      sortedLocalities.forEach(item => {
        localityLabels.push(item.locality);
        averageDepths.push(item.avgDepth);
      });
      
      if (localityLabels.length > 0) {
        activeCharts.push(
          new Chart(salinityCtx, {
            type: "bar",
            data: {
              labels: localityLabels,
              datasets: [
                {
                  label: "Average Depth",
                  data: averageDepths,
                  backgroundColor: gradientColors.slice(0, localityLabels.length),
                  borderColor: borderColors.slice(0, localityLabels.length),
                  borderWidth: 3,
                  borderRadius: 8,
                  borderSkipped: false,
                  hoverBackgroundColor: gradientColors.slice(0, localityLabels.length).map(color => color.replace('0.8', '0.9')),
                  hoverBorderColor: borderColors.slice(0, localityLabels.length),
                  hoverBorderWidth: 4,
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              interaction: {
                intersect: false,
                mode: 'index',
              },
              plugins: {
                legend: {
                  display: false // Hide legend for cleaner look like species count charts
                },
                tooltip: {
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  titleColor: '#fff',
                  bodyColor: '#fff',
                  borderColor: '#374151',
                  borderWidth: 1,
                  cornerRadius: 8,
                  displayColors: true,
                  callbacks: {
                    title: function(context) {
                      return `📍 ${context[0].label}`;
                    },
                    label: function(context) {
                      return `🌊 Average Depth: ${context.parsed.y}m`;
                    }
                  }
                }
              },
              scales: { 
                x: {
                  title: { 
                    display: true, 
                    text: "🏙️ Locality",
                    font: {
                      size: 14,
                      weight: 'bold'
                    },
                    color: '#374151'
                  },
                  ticks: {
                    maxRotation: 45,
                    minRotation: 45,
                    color: '#6B7280',
                    font: {
                      size: 12,
                      weight: '500'
                    }
                  },
                  grid: {
                    display: false
                  }
                },
                y: { 
                  beginAtZero: true, 
                  title: { 
                    display: true, 
                    text: "🌊 Average Depth (meters)",
                    font: {
                      size: 14,
                      weight: 'bold'
                    },
                    color: '#374151'
                  },
                  ticks: {
                    color: '#6B7280',
                    font: {
                      size: 11
                    },
                    callback: function(value) {
                      return value + 'm';
                    }
                  },
                  grid: {
                    color: 'rgba(156, 163, 175, 0.2)',
                    borderDash: [5, 5]
                  }
                } 
              },
            },
          })
        );
      }
    }
    const depthCtx = document.getElementById("depthChart");
    if (depthCtx && oceanData.length > 0) {
      // Calculate average temperature and salinity by locality
      const localityDataMap = {};
      
      oceanData.forEach((record) => {
        const locality = record.locality || record.Locality || "Unknown";
        const temperature = getFieldValue(record, ["Temperature (C)", "temperature_C", "Temperature", "temp"]);
        const salinity = getFieldValue(record, ["Salinity(PSU)", "sea_water_salinity", "Salinity", "psu"]);
        
        if (!localityDataMap[locality]) {
          localityDataMap[locality] = { 
            tempSum: 0, tempCount: 0, 
            salinitySum: 0, salinityCount: 0 
          };
        }
        
        if (temperature !== null) {
          localityDataMap[locality].tempSum += temperature;
          localityDataMap[locality].tempCount += 1;
        }
        
        if (salinity !== null) {
          localityDataMap[locality].salinitySum += salinity;
          localityDataMap[locality].salinityCount += 1;
        }
      });
      
      // Prepare chart data
      const localities = [];
      const avgTemperatures = [];
      const avgSalinities = [];
      
      // Process and sort localities, then take top 30
      const processedData = Object.entries(localityDataMap)
        .filter(([locality, data]) => data.tempCount > 0 || data.salinityCount > 0)
        .map(([locality, data]) => ({
          locality,
          avgTemp: data.tempCount > 0 ? Math.round((data.tempSum / data.tempCount) * 100) / 100 : 0,
          avgSalinity: data.salinityCount > 0 ? Math.round((data.salinitySum / data.salinityCount) * 100) / 100 : 0
        }))
        .sort((a, b) => b.avgTemp - a.avgTemp) // Sort by temperature
        .slice(0, 30); // Limit to top 30

      processedData.forEach(item => {
        localities.push(item.locality);
        avgTemperatures.push(item.avgTemp);
        avgSalinities.push(item.avgSalinity);
      });
      
      if (localities.length > 0) {
        activeCharts.push(
          new Chart(depthCtx, {
            type: "bar",
            data: {
              labels: localities,
              datasets: [
                {
                  label: "temperature_C",
                  data: avgTemperatures,
                  backgroundColor: "rgba(239, 68, 68, 0.7)",
                  borderColor: "rgba(239, 68, 68, 1)",
                  borderWidth: 2,
                  borderRadius: 4,
                  yAxisID: 'y'
                },
                {
                  label: "Salinity",
                  data: avgSalinities,
                  backgroundColor: "rgba(59, 130, 246, 0.7)",
                  borderColor: "rgba(59, 130, 246, 1)",
                  borderWidth: 2,
                  borderRadius: 4,
                  yAxisID: 'y1'
                }
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              interaction: {
                intersect: false,
                mode: 'index',
              },
              plugins: {
                legend: {
                  display: true,
                  position: 'top'
                },
                tooltip: {
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  titleColor: '#fff',
                  bodyColor: '#fff',
                  borderColor: '#374151',
                  borderWidth: 1,
                  cornerRadius: 8,
                  callbacks: {
                    label: function(context) {
                      const label = context.dataset.label;
                      const value = context.parsed.y;
                      if (label === 'temperature_C') {
                        return `🌡️ Temperature: ${value}°C`;
                      } else {
                        return `🌊 Salinity: ${value} PSU`;
                      }
                    }
                  }
                }
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: "locality",
                    font: { size: 12, weight: 'bold' },
                    color: '#374151'
                  },
                  ticks: {
                    maxRotation: 45,
                    minRotation: 45,
                    color: '#6B7280',
                    font: { size: 10 }
                  },
                  grid: { display: false }
                },
                y: {
                  type: 'linear',
                  display: true,
                  position: 'left',
                  title: {
                    display: true,
                    text: "Temperature (°C)",
                    color: 'rgba(239, 68, 68, 1)',
                    font: { size: 12, weight: 'bold' }
                  },
                  ticks: {
                    color: 'rgba(239, 68, 68, 1)',
                    font: { size: 10 }
                  },
                  grid: { color: 'rgba(156, 163, 175, 0.2)' }
                },
                y1: {
                  type: 'linear',
                  display: true,
                  position: 'right',
                  title: {
                    display: true,
                    text: "Salinity (PSU)",
                    color: 'rgba(59, 130, 246, 1)',
                    font: { size: 12, weight: 'bold' }
                  },
                  ticks: {
                    color: 'rgba(59, 130, 246, 1)',
                    font: { size: 10 }
                  },
                  grid: { drawOnChartArea: false }
                }
              },
            },
          })
        );
      }
    }
    const tempSalinityScatterCtx = document.getElementById("tempSalinityScatterChart");
    if (tempSalinityScatterCtx && oceanData.length > 0) {
      const scatterData = oceanData
        .map((d) => {
          const temp = getFieldValue(d, [
            "Temperature (C)",
            "temperature_C",
            "Temperature",
            "temp",
            "temperature"
          ]);
          const salinity = getFieldValue(d, [
            "Salinity",
            "sea_water_salinity", 
            "Salinity (ppt)",
            "Salinity (psu)",
            "salinity",
            "sal"
          ]);
          
          return {
            x: temp,
            y: salinity,
            // Color coding based on temperature for visual appeal
            backgroundColor: temp !== null ? 
              `hsl(${Math.max(0, Math.min(240, 240 - (temp * 8)))}, 70%, 60%)` : 
              'rgba(99, 102, 241, 0.7)'
          };
        })
        .filter((d) => d.x !== null && d.y !== null)
        .slice(0, 150); // Show more points for better scatter visualization
        
      if (scatterData.length > 0) {
        activeCharts.push(
          new Chart(tempSalinityScatterCtx, {
            type: "scatter",
            data: {
              datasets: [
                {
                  label: "Temperature vs Salinity",
                  data: scatterData,
                  backgroundColor: scatterData.map(d => d.backgroundColor),
                  borderColor: 'rgba(59, 130, 246, 0.8)',
                  borderWidth: 1,
                  pointRadius: 6,
                  pointHoverRadius: 8,
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top',
                  labels: {
                    font: { size: 12, weight: 'bold' },
                    padding: 20,
                    usePointStyle: true
                  }
                },
                tooltip: {
                  backgroundColor: 'rgba(0, 0, 0, 0.9)',
                  titleFont: { size: 14, weight: 'bold' },
                  bodyFont: { size: 12 },
                  padding: 12,
                  cornerRadius: 8,
                  callbacks: {
                    label: function(context) {
                      return `Temperature: ${context.parsed.x}°C, Salinity: ${context.parsed.y} ppt`;
                    }
                  }
                }
              },
              scales: {
                x: {
                  type: "linear",
                  position: "bottom",
                  title: { 
                    display: true, 
                    text: "Temperature (°C)",
                    font: { weight: 'bold' }
                  },
                  grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                  },
                  ticks: {
                    font: { weight: 'bold' }
                  }
                },
                y: { 
                  title: { 
                    display: true, 
                    text: "Salinity (ppt)",
                    font: { weight: 'bold' }
                  },
                  grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                  },
                  ticks: {
                    font: { weight: 'bold' }
                  }
                },
              },
            },
          })
        );
      }
    }

    // Initialize the preview map and add data points
    initializePreviewMap(oceanData, 'ocean');
  }
  
  // --- Modal Functions (Global scope) ---
  window.openViewModal = async function(uploadId) {
    const modal = document.getElementById('viewModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    modal.style.display = 'flex';
    modalBody.innerHTML = `
      <div class="loading">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Loading visualization...</p>
      </div>
    `;
    
    try {
      const response = await fetch(`${window.API_CONFIG.BASE_URL}/recent-uploads/view/${uploadId}`);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to load data');
      }
      
      const { upload, data } = result;
      modalTitle.textContent = `${upload.originalFilename} - Data Visualization`;
      
      // Create charts container based on data type
      const isFishData = upload.dataType === 'fish';
      modalBody.innerHTML = `
        <div class="modal-charts-container">
          <div class="modal-charts-header">
            <p class="modal-subtitle">
              Showing <strong style="color:#059669;">${data.length} records</strong> 
              from ${upload.originalFilename} (${upload.dataType} data)
            </p>
            <button class="export-btn" onclick="exportAllModalCharts('${upload.dataType}')" title="Export All Charts">
              <i class="fas fa-download"></i> Export All Charts
            </button>
          </div>
          <div class="modal-charts-grid">
            ${isFishData ? `
              <div class="modal-chart-container">
                <div class="chart-header">
                  <h5><i class="fas fa-sitemap"></i> Family Distribution</h5>
                  <button class="chart-export-btn" onclick="exportSingleChart('modalFamilyChart', 'Modal_Fish_Family_Distribution')" title="Export Chart">
                    <i class="fas fa-download"></i>
                  </button>
                </div>
                <canvas id="modalFamilyChart"></canvas>
              </div>
              <div class="modal-chart-container">
                <div class="chart-header">
                  <h5><i class="fas fa-layer-group"></i> Species by Taxonomic Groups</h5>
                  <button class="chart-export-btn" onclick="exportSingleChart('modalTaxonomyChart', 'Modal_Fish_Taxonomic_Groups')" title="Export Chart">
                    <i class="fas fa-download"></i>
                  </button>
                </div>
                <canvas id="modalTaxonomyChart"></canvas>
              </div>
              <div class="modal-chart-container">
                <div class="chart-header">
                  <h5><i class="fas fa-chart-bar"></i> Population Quantities</h5>
                  <button class="chart-export-btn" onclick="exportSingleChart('modalPopulationChart', 'Modal_Fish_Population_Quantities')" title="Export Chart">
                    <i class="fas fa-download"></i>
                  </button>
                </div>
                <canvas id="modalPopulationChart"></canvas>
              </div>
              <div class="modal-chart-container">
                <div class="chart-header">
                  <h5><i class="fas fa-project-diagram"></i> Organism Diversity</h5>
                  <button class="chart-export-btn" onclick="exportSingleChart('modalDiversityChart', 'Modal_Fish_Organism_Diversity')" title="Export Chart">
                    <i class="fas fa-download"></i>
                  </button>
                </div>
                <canvas id="modalDiversityChart"></canvas>
              </div>
            ` : `
              <div class="modal-chart-container">
                <div class="chart-header">
                  <h5><i class="fas fa-thermometer-half"></i> Temperature Distribution (°C)</h5>
                  <button class="chart-export-btn" onclick="exportSingleChart('modalTempDistChart', 'Modal_Ocean_Temperature_Distribution')" title="Export Chart">
                    <i class="fas fa-download"></i>
                  </button>
                </div>
                <canvas id="modalTempDistChart"></canvas>
              </div>
              <div class="modal-chart-container">
                <div class="chart-header">
                  <h5><i class="fas fa-ruler-vertical"></i> Average Depth by Locality</h5>
                  <button class="chart-export-btn" onclick="exportSingleChart('modalDepthChart', 'Modal_Ocean_Average_Depth_by_Locality')" title="Export Chart">
                    <i class="fas fa-download"></i>
                  </button>
                </div>
                <canvas id="modalDepthChart"></canvas>
              </div>
              <div class="modal-chart-container">
                <div class="chart-header">
                  <h5><i class="fas fa-thermometer-half"></i> Average Temperature & Salinity by Locality</h5>
                  <button class="chart-export-btn" onclick="exportSingleChart('modalTempSalinityChart', 'Modal_Temperature_Salinity_by_Locality')" title="Export Chart">
                    <i class="fas fa-download"></i>
                  </button>
                </div>
                <canvas id="modalTempSalinityChart"></canvas>
              </div>
              <div class="modal-chart-container">
                <div class="chart-header">
                  <h5><i class="fas fa-chart-scatter"></i> Temperature vs Salinity</h5>
                  <button class="chart-export-btn" onclick="exportSingleChart('modalTempSalinityScatterChart', 'Modal_Ocean_Temperature_vs_Salinity')" title="Export Chart">
                    <i class="fas fa-download"></i>
                  </button>
                </div>
                <canvas id="modalTempSalinityScatterChart"></canvas>
              </div>
            `}
          </div>
        </div>
      `;
      
      // Render charts in modal based on data type
      if (isFishData) {
        renderModalFishCharts(data);
      } else {
        renderModalCharts(data);
      }
      
    } catch (error) {
      console.error('Modal error:', error);
      modalBody.innerHTML = `
        <div class="error">
          <i class="fas fa-exclamation-triangle"></i>
          <h4>Unable to Load Visualization</h4>
          <p>This file may not be available for visualization. Possible reasons:</p>
          <ul style="text-align: left; margin: 1rem 0;">
            <li>File was uploaded before visualization feature</li>
            <li>File may have been moved or deleted</li>
            <li>Network connectivity issue</li>
          </ul>
          <p><strong>Solution:</strong> Try downloading the file instead, or re-upload the data for full visualization features.</p>
          <div style="margin-top: 1rem;">
            <button onclick="closeViewModal()" class="action-btn">Close</button>
          </div>
        </div>
      `;
    }
  };
  
  window.closeViewModal = function() {
    const modal = document.getElementById('viewModal');
    modal.style.display = 'none';
    
    // Destroy modal charts
    destroyModalCharts();
  };
  
  // Modal chart instances
  let modalCharts = [];
  
  function renderModalFishCharts(data) {
    destroyModalCharts();
    
    const getFieldValue = (record, fieldNames) => {
      for (let field of fieldNames) {
        if (record[field] !== undefined && record[field] !== null && record[field] !== '') {
          return record[field];
        }
      }
      return null;
    };

    // Extract fish data fields for modal
    const families = data.map((d) => getFieldValue(d, ["Family", "family"])).filter((f) => f !== null);
    const classes = data.map((d) => getFieldValue(d, ["Class", "class"])).filter((c) => c !== null);
    const quantities = data.map((d) => {
      const qty = getFieldValue(d, ["organismQuantity", "organism_quantity", "quantity", "count"]);
      return qty ? parseFloat(qty) : null;
    }).filter((q) => q !== null && !isNaN(q));
    const species = data.map((d) => getFieldValue(d, ["Species", "species", "scientificName", "scientific_name"])).filter((s) => s !== null);

    // Modal Family Distribution Chart
    const familyCtx = document.getElementById("modalFamilyChart");
    if (familyCtx && families.length > 0) {
      const familyCounts = {};
      families.forEach(family => {
        familyCounts[family] = (familyCounts[family] || 0) + 1;
      });
      const topFamilies = Object.entries(familyCounts).sort(([,a], [,b]) => b - a).slice(0, 8);
      modalCharts.push(new Chart(familyCtx, {
        type: "doughnut",
        data: {
          labels: topFamilies.map(([family]) => family),
          datasets: [{
            data: topFamilies.map(([, count]) => count),
            backgroundColor: ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#06d6a0", "#f72585", "#4cc9f0"],
            borderWidth: 2, borderColor: "#ffffff"
          }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom" } } }
      }));
    }

    // Modal Taxonomic Groups Chart
    const taxonomyCtx = document.getElementById("modalTaxonomyChart");
    if (taxonomyCtx && classes.length > 0) {
      const classCounts = {};
      classes.forEach(cls => { classCounts[cls] = (classCounts[cls] || 0) + 1; });
      modalCharts.push(new Chart(taxonomyCtx, {
        type: "bar",
        data: {
          labels: Object.keys(classCounts).slice(0, 10),
          datasets: [{ label: "Species Count by Class", data: Object.values(classCounts).slice(0, 10), backgroundColor: "rgba(59,130,246,0.7)", borderColor: "#3b82f6", borderWidth: 1 }]
        },
        options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, title: { display: true, text: "Count" } } } }
      }));
    }

    // Modal Population Chart
    const populationCtx = document.getElementById("modalPopulationChart");
    if (populationCtx && quantities.length > 0) {
      const labels = data.filter((d, index) => quantities[index] !== undefined).map((d, index) => d.eventID || `Record_${index + 1}`).slice(0, 15);
      modalCharts.push(new Chart(populationCtx, {
        type: "line",
        data: { labels: labels, datasets: [{ label: "Organism Quantity", data: quantities.slice(0, 15), borderColor: "#ef4444", backgroundColor: "rgba(239,68,68,0.1)", fill: true, tension: 0.4 }] },
        options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, title: { display: true, text: "Quantity" } } } }
      }));
    }

    // Modal Diversity Chart
    const diversityCtx = document.getElementById("modalDiversityChart");
    if (diversityCtx && species.length > 0) {
      const diversityData = data.slice(0, 50).map((d, index) => ({ x: index + 1, y: getFieldValue(d, ["organismQuantity", "organism_quantity", "quantity", "count"]) || 0 }));
      modalCharts.push(new Chart(diversityCtx, {
        type: "scatter",
        data: { datasets: [{ label: "Organism Distribution", data: diversityData, backgroundColor: "rgba(139,92,246,0.7)" }] },
        options: { responsive: true, maintainAspectRatio: false, scales: { x: { type: "linear", position: "bottom", title: { display: true, text: "Record Number" } }, y: { title: { display: true, text: "Organism Quantity" } } } }
      }));
    }
  }
  
  function renderModalCharts(data) {
    destroyModalCharts();
    
    const getFieldValue = (record, fieldNames) => {
      for (let field of fieldNames) {
        if (record[field] !== undefined && record[field] !== null) {
          const value = parseFloat(record[field]);
          if (!isNaN(value)) return value;
        }
      }
      return null;
    };

    // 1. Temperature Distribution (°C) Chart
    const tempDistCtx = document.getElementById("modalTempDistChart");
    if (tempDistCtx && data.length > 0) {
      const temperatures = data
        .map((d) => getFieldValue(d, ["Temperature (C)", "temperature_C", "Temperature", "temp"]))
        .filter((t) => t !== null);

      if (temperatures.length > 0) {
        // Create temperature ranges for histogram
        const ranges = [
          { label: "0-5°C", min: 0, max: 5, count: 0 },
          { label: "5-10°C", min: 5, max: 10, count: 0 },
          { label: "10-15°C", min: 10, max: 15, count: 0 },
          { label: "15-20°C", min: 15, max: 20, count: 0 },
          { label: "20-25°C", min: 20, max: 25, count: 0 },
          { label: "25-30°C", min: 25, max: 30, count: 0 },
          { label: "30+°C", min: 30, max: 50, count: 0 }
        ];

        temperatures.forEach(temp => {
          for (let range of ranges) {
            if (temp >= range.min && temp < range.max) {
              range.count++;
              break;
            }
          }
        });

        const labels = ranges.map(r => r.label);
        const counts = ranges.map(r => r.count);

        modalCharts.push(
          new Chart(tempDistCtx, {
            type: "bar",
            data: {
              labels: labels,
              datasets: [{
                label: "Temperature Distribution",
                data: counts,
                backgroundColor: [
                  "rgba(59, 130, 246, 0.8)",   // Blue
                  "rgba(16, 185, 129, 0.8)",   // Emerald  
                  "rgba(245, 158, 11, 0.8)",   // Amber
                  "rgba(239, 68, 68, 0.8)",    // Red
                  "rgba(139, 92, 246, 0.8)",   // Violet
                  "rgba(236, 72, 153, 0.8)",   // Pink
                  "rgba(251, 146, 60, 0.8)"    // Orange
                ],
                borderColor: [
                  "rgba(59, 130, 246, 1)",
                  "rgba(16, 185, 129, 1)",
                  "rgba(245, 158, 11, 1)",
                  "rgba(239, 68, 68, 1)",
                  "rgba(139, 92, 246, 1)",
                  "rgba(236, 72, 153, 1)",
                  "rgba(251, 146, 60, 1)"
                ],
                borderWidth: 2,
                borderRadius: 6
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                tooltip: {
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  callbacks: {
                    title: function(context) {
                      return `🌡️ ${context[0].label}`;
                    },
                    label: function(context) {
                      return `Count: ${context.parsed.y} records`;
                    }
                  }
                }
              },
              scales: {
                x: {
                  title: { display: true, text: "Temperature Range (°C)", font: { weight: 'bold' } },
                  ticks: { font: { weight: 'bold' } }
                },
                y: {
                  beginAtZero: true,
                  title: { display: true, text: "Number of Records", font: { weight: 'bold' } },
                  ticks: { font: { weight: 'bold' } }
                }
              }
            }
          })
        );
      }
    }

    // 2. Average Depth by Locality Chart
    const depthCtx = document.getElementById("modalDepthChart");
    if (depthCtx && data.length > 0) {
      const localityDepthMap = {};
      
      data.forEach(d => {
        const locality = d.locality || d.Locality || d.location || 'Unknown';
        const depth = getFieldValue(d, ["Depth in meter", "DepthInMeters", "Depth", "depth"]);
        
        if (depth !== null) {
          if (!localityDepthMap[locality]) {
            localityDepthMap[locality] = { totalDepth: 0, count: 0 };
          }
          localityDepthMap[locality].totalDepth += depth;
          localityDepthMap[locality].count += 1;
        }
      });

      const localityLabels = [];
      const averageDepths = [];

      // Sort localities by average depth and take top 30
      const sortedLocalities = Object.entries(localityDepthMap)
        .map(([locality, data]) => ({
          locality,
          avgDepth: Math.round((data.totalDepth / data.count) * 100) / 100
        }))
        .sort((a, b) => b.avgDepth - a.avgDepth)
        .slice(0, 30); // Limit to top 30

      sortedLocalities.forEach(item => {
        localityLabels.push(item.locality);
        averageDepths.push(item.avgDepth);
      });

      if (localityLabels.length > 0) {
        modalCharts.push(
          new Chart(depthCtx, {
            type: "bar",
            data: {
              labels: localityLabels,
              datasets: [{
                label: "Average Depth",
                data: averageDepths,
                backgroundColor: "rgba(59, 130, 246, 0.8)",
                borderColor: "rgba(59, 130, 246, 1)",
                borderWidth: 2,
                borderRadius: 6
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                tooltip: {
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  callbacks: {
                    title: function(context) {
                      return `📍 ${context[0].label}`;
                    },
                    label: function(context) {
                      return `🌊 Average Depth: ${context.parsed.y}m`;
                    }
                  }
                }
              },
              scales: {
                x: {
                  title: { display: true, text: "Locality", font: { weight: 'bold' } },
                  ticks: { maxRotation: 45, font: { weight: 'bold' } }
                },
                y: {
                  beginAtZero: true,
                  title: { display: true, text: "Average Depth (meters)", font: { weight: 'bold' } },
                  ticks: { 
                    font: { weight: 'bold' },
                    callback: function(value) {
                      return value + 'm';
                    }
                  }
                }
              }
            }
          })
        );
      }
    }

    // 3. Average Temperature & Salinity by Locality Chart
    const tempSalinityCtx = document.getElementById("modalTempSalinityChart");
    if (tempSalinityCtx && data.length > 0) {
      const localityData = {};
      
      data.forEach(d => {
        const locality = d.locality || d.Locality || d.location || 'Unknown';
        const temp = getFieldValue(d, ["Temperature (C)", "temperature_C", "Temperature", "temp"]);
        const salinity = getFieldValue(d, ["Salinity(PSU)", "sea_water_salinity", "Salinity", "psu"]);
        
        if (!localityData[locality]) {
          localityData[locality] = { temps: [], salinities: [] };
        }
        if (temp !== null) localityData[locality].temps.push(temp);
        if (salinity !== null) localityData[locality].salinities.push(salinity);
      });

      // Process and sort localities, then take top 30
      const processedData = Object.keys(localityData)
        .filter(loc => localityData[loc].temps.length > 0 && localityData[loc].salinities.length > 0)
        .map(loc => {
          const temps = localityData[loc].temps;
          const salinities = localityData[loc].salinities;
          return {
            locality: loc,
            avgTemp: Math.round((temps.reduce((a, b) => a + b, 0) / temps.length) * 100) / 100,
            avgSalinity: Math.round((salinities.reduce((a, b) => a + b, 0) / salinities.length) * 100) / 100
          };
        })
        .sort((a, b) => b.avgTemp - a.avgTemp) // Sort by temperature
        .slice(0, 30); // Limit to top 30

      if (processedData.length > 0) {
        const localities = processedData.map(item => item.locality);
        const avgTemps = processedData.map(item => item.avgTemp);
        const avgSalinities = processedData.map(item => item.avgSalinity);

        modalCharts.push(
          new Chart(tempSalinityCtx, {
            type: 'bar',
            data: {
              labels: localities,
              datasets: [
                {
                  label: 'Average Temperature (°C)',
                  data: avgTemps,
                  backgroundColor: 'rgba(239, 68, 68, 0.8)',
                  borderColor: 'rgba(239, 68, 68, 1)',
                  borderWidth: 2,
                  yAxisID: 'y',
                  borderRadius: 6
                },
                {
                  label: 'Average Salinity (ppt)',
                  data: avgSalinities,
                  backgroundColor: 'rgba(16, 185, 129, 0.8)',
                  borderColor: 'rgba(16, 185, 129, 1)',
                  borderWidth: 2,
                  yAxisID: 'y1',
                  borderRadius: 6
                }
              ]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              interaction: {
                mode: 'index',
                intersect: false,
              },
              plugins: {
                legend: {
                  position: 'top',
                  labels: {
                    font: { size: 12, weight: 'bold' },
                    padding: 20,
                    usePointStyle: true
                  }
                }
              },
              scales: {
                x: {
                  ticks: {
                    font: { weight: 'bold' },
                    maxRotation: 45
                  }
                },
                y: {
                  type: 'linear',
                  display: true,
                  position: 'left',
                  title: {
                    display: true,
                    text: 'Temperature (°C)',
                    font: { weight: 'bold' },
                    color: 'rgba(239, 68, 68, 1)'
                  },
                  ticks: {
                    font: { weight: 'bold' },
                    color: 'rgba(239, 68, 68, 1)'
                  }
                },
                y1: {
                  type: 'linear',
                  display: true,
                  position: 'right',
                  title: {
                    display: true,
                    text: 'Salinity (ppt)',
                    font: { weight: 'bold' },
                    color: 'rgba(16, 185, 129, 1)'
                  },
                  ticks: {
                    font: { weight: 'bold' },
                    color: 'rgba(16, 185, 129, 1)'
                  },
                  grid: {
                    drawOnChartArea: false,
                  }
                }
              }
            }
          })
        );
      }
    }

    // 4. Temperature vs Salinity Scatter Chart  
    const tempSalinityScatterCtx = document.getElementById("modalTempSalinityScatterChart");
    if (tempSalinityScatterCtx && data.length > 0) {
      const scatterData = data
        .map((d) => {
          const temp = getFieldValue(d, ["Temperature (C)", "temperature_C", "Temperature", "temp"]);
          const salinity = getFieldValue(d, ["Salinity(PSU)", "sea_water_salinity", "Salinity", "psu"]);
          
          return {
            x: temp,
            y: salinity,
            backgroundColor: temp !== null ? 
              `hsl(${Math.max(0, Math.min(240, 240 - (temp * 8)))}, 70%, 60%)` : 
              'rgba(99, 102, 241, 0.7)'
          };
        })
        .filter((d) => d.x !== null && d.y !== null)
        .slice(0, 150);
        
      if (scatterData.length > 0) {

        modalCharts.push(
          new Chart(tempSalinityScatterCtx, {
            type: "scatter",
            data: {
              datasets: [{
                label: "Temperature vs Salinity",
                data: scatterData,
                backgroundColor: scatterData.map(d => d.backgroundColor),
                borderColor: 'rgba(59, 130, 246, 0.8)',
                borderWidth: 1,
                pointRadius: 6,
                pointHoverRadius: 8
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top',
                  labels: {
                    font: { size: 12, weight: 'bold' },
                    padding: 20,
                    usePointStyle: true
                  }
                },
                tooltip: {
                  backgroundColor: 'rgba(0, 0, 0, 0.9)',
                  titleFont: { size: 14, weight: 'bold' },
                  bodyFont: { size: 12 },
                  padding: 12,
                  cornerRadius: 8,
                  callbacks: {
                    label: function(context) {
                      return `Temperature: ${context.parsed.x}°C, Salinity: ${context.parsed.y} ppt`;
                    }
                  }
                }
              },
              scales: {
                x: {
                  type: "linear",
                  position: "bottom",
                  title: { 
                    display: true, 
                    text: "Temperature (°C)",
                    font: { weight: 'bold' }
                  },
                  grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                  },
                  ticks: {
                    font: { weight: 'bold' }
                  }
                },
                y: { 
                  title: { 
                    display: true, 
                    text: "Salinity (ppt)",
                    font: { weight: 'bold' }
                  },
                  grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                  },
                  ticks: {
                    font: { weight: 'bold' }
                  }
                }
              }
            }
          })
        );
      }
    }
  }

  
  function destroyModalCharts() {
    modalCharts.forEach((chart) => chart.destroy());
    modalCharts = [];
  }

  // Close modal when clicking outside
  window.addEventListener('click', (event) => {
    const modal = document.getElementById('viewModal');
    if (event.target === modal) {
      closeViewModal();
    }
  });
});

// --- Preview Map Functions ---
let previewMap = null;

function initializePreviewMap(data, dataType) {
  // Destroy existing map if it exists
  if (previewMap) {
    previewMap.remove();
    previewMap = null;
  }

  // Wait for the DOM element to be ready
  setTimeout(() => {
    const mapContainer = document.getElementById('previewMap');
    if (!mapContainer) return;

    // Initialize map
    previewMap = L.map('previewMap').setView([20.0, 77.0], 5); // Center on India

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18
    }).addTo(previewMap);

    // Function to get field value with multiple possible field names
    const getFieldValue = (record, fieldNames) => {
      for (let field of fieldNames) {
        if (record[field] !== undefined && record[field] !== null && record[field] !== '') {
          return record[field];
        }
      }
      return null;
    };

    // Add markers for each data point
    let bounds = [];
    
    data.forEach((record, index) => {
      // Get latitude and longitude
      const lat = parseFloat(
        getFieldValue(record, ['decimalLatitude', 'latitude', 'lat', 'Latitude'])
      );
      const lng = parseFloat(
        getFieldValue(record, ['decimalLongitude', 'longitude', 'lng', 'lon', 'Longitude'])
      );

      if (!isNaN(lat) && !isNaN(lng)) {
        bounds.push([lat, lng]);

        // Create marker with different colors based on data type
        let markerColor = dataType === 'fish' ? '#3b82f6' : '#10b981';
        
        // For ocean data, color code by temperature
        if (dataType === 'ocean') {
          const temp = parseFloat(
            getFieldValue(record, ['Temperature (C)', 'temperature_C', 'Temperature', 'temp'])
          );
          if (!isNaN(temp)) {
            if (temp > 25) markerColor = '#ef4444'; // Red for high temp
            else if (temp < 15) markerColor = '#3b82f6'; // Blue for low temp
          }
        }

        // Create custom marker icon (same as dashboard)
        const customIcon = L.divIcon({
          className: 'custom-marker',
          html: `<div style="background-color: ${markerColor}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8]
        });

        // Create popup content based on data type (same style as dashboard)
        let popupContent = '';
        if (dataType === 'fish') {
          const species = getFieldValue(record, ['Species', 'species', 'scientificName', 'scientific_name']) || 'Unknown Species';
          const family = getFieldValue(record, ['Family', 'family']) || 'Unknown Family';
          const quantity = getFieldValue(record, ['organismQuantity', 'organism_quantity', 'quantity', 'count']) || 'N/A';
          const date = getFieldValue(record, ['eventDate', 'date', 'Date']) || 'Unknown Date';
          
          popupContent = `
            <div class="station-info">
              <h4>🐠 ${species}</h4>
              <div class="species">👨‍👩‍👧‍👦 Family: ${family}</div>
              <div class="temp">📊 Quantity: ${quantity}</div>
              <div class="date">📅 Date: ${date}</div>
              <div class="data-source">📍 Location: ${lat.toFixed(4)}°, ${lng.toFixed(4)}°</div>
              <div class="data-source">📊 Source: Uploaded Dataset</div>
            </div>
          `;
        } else {
          const locality = getFieldValue(record, ['locality', 'location', 'Location']) || 'Unknown Location';
          const temperature = getFieldValue(record, ['Temperature (C)', 'temperature_C', 'Temperature', 'temp']);
          const salinity = getFieldValue(record, ['Salinity(PSU)', 'sea_water_salinity', 'Salinity', 'psu']);
          const depth = getFieldValue(record, ['Depth in meter', 'DepthInMeters', 'Depth', 'depth']);
          const date = getFieldValue(record, ['eventDate', 'date', 'Date']) || 'Unknown Date';
          
          popupContent = `
            <div class="station-info">
              <h4>🌊 ${locality}</h4>
              <div class="temp">🌡️ Temperature: ${temperature !== null ? temperature + '°C' : 'N/A'}</div>
              <div class="salinity">🌊 Salinity: ${salinity !== null ? salinity + ' PSU' : 'N/A'}</div>
              <div class="depth">📏 Depth: ${depth !== null ? depth + 'm' : 'N/A'}</div>
              <div class="date">📅 Date: ${date}</div>
              <div class="data-source">📍 Location: ${lat.toFixed(4)}°, ${lng.toFixed(4)}°</div>
              <div class="data-source">📊 Source: Uploaded Dataset</div>
            </div>
          `;
        }

        // Add marker to map
        L.marker([lat, lng], { icon: customIcon })
          .addTo(previewMap)
          .bindPopup(popupContent, {
            className: 'custom-popup'
          });
      }
    });

    // Fit map to show all data points
    if (bounds.length > 0) {
      previewMap.fitBounds(bounds, { 
        padding: [20, 20],
        maxZoom: 10
      });
    }

    // Invalidate size to ensure proper rendering
    setTimeout(() => {
      if (previewMap) {
        previewMap.invalidateSize();
      }
    }, 100);
  }, 500);
}

// --- Export Functions (Global scope) ---
window.exportSingleChart = function(chartId, filename) {
    const canvas = document.getElementById(chartId);
    if (canvas) {
      const link = document.createElement('a');
      link.download = `${filename}_${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  window.exportAllCharts = function(dataType) {
    const timestamp = new Date().toISOString().split('T')[0];
    if (dataType === 'fish') {
      const chartIds = ['familyChart', 'taxonomyChart', 'populationChart', 'diversityChart'];
      const chartNames = ['Fish_Family_Distribution', 'Fish_Taxonomic_Groups', 'Fish_Population_Quantities', 'Fish_Organism_Diversity'];
      
      chartIds.forEach((id, index) => {
        setTimeout(() => {
          exportSingleChart(id, chartNames[index]);
        }, index * 500); // Stagger downloads to avoid browser blocking
      });
    } else if (dataType === 'ocean') {
      const chartIds = ['tempChart', 'salinityChart', 'tempSalinityChart', 'tempSalinityScatterChart'];
      const chartNames = ['Ocean_Temperature_Distribution', 'Ocean_Salinity_Levels', 'Ocean_Temperature_Salinity_by_Locality', 'Ocean_Temperature_vs_Salinity'];
      
      chartIds.forEach((id, index) => {
        setTimeout(() => {
          exportSingleChart(id, chartNames[index]);
        }, index * 500); // Stagger downloads to avoid browser blocking
      });
    }
  };

  window.exportAllModalCharts = function(dataType) {
    const timestamp = new Date().toISOString().split('T')[0];
    if (dataType === 'fish') {
      const chartIds = ['modalFamilyChart', 'modalTaxonomyChart', 'modalPopulationChart', 'modalDiversityChart'];
      const chartNames = ['Modal_Fish_Family_Distribution', 'Modal_Fish_Taxonomic_Groups', 'Modal_Fish_Population_Quantities', 'Modal_Fish_Organism_Diversity'];
      
      chartIds.forEach((id, index) => {
        setTimeout(() => {
          exportSingleChart(id, chartNames[index]);
        }, index * 500); // Stagger downloads to avoid browser blocking
      });
    } else if (dataType === 'ocean') {
      const chartIds = ['modalTempDistChart', 'modalDepthChart', 'modalTempSalinityChart', 'modalTempSalinityScatterChart'];
      const chartNames = ['Modal_Ocean_Temperature_Distribution', 'Modal_Ocean_Average_Depth_by_Locality', 'Modal_Ocean_Temperature_Salinity_by_Locality', 'Modal_Ocean_Temperature_vs_Salinity'];
      
      chartIds.forEach((id, index) => {
        setTimeout(() => {
          exportSingleChart(id, chartNames[index]);
        }, index * 500); // Stagger downloads to avoid browser blocking
      });
    }
  };