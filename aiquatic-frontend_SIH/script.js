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
        if (descriptionEl) descriptionEl.textContent = 'Interactive charts showing Temperature, Salinity, Depth distribution and their relationships from your uploaded data.';
        if (placeholderEl) placeholderEl.textContent = 'Upload an Ocean Data file to see detailed visualizations';
        if (chartDescEl) chartDescEl.textContent = 'Charts will show: Temperature trends, Salinity levels, Depth distribution, and Temperature-Depth correlations';
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
      uploadBtnEl.textContent = "Cleaning & Uploading...";
      msgEl.innerHTML = "";

      const formData = new FormData();
      formData.append("dataset", selectedFile);
      formData.append(
        "dataType",
        document.querySelector('input[name="dataType"]:checked').value
      );

      try {
        const res = await fetch(`${window.API_CONFIG.BASE_URL}/upload`, {
          method: "POST",
          body: formData,
        });
        const data = await res.json();

        if (res.ok) {
          msgEl.innerHTML = `<span style="color:#10b981;font-weight:500;">✅ ${data.message}</span>`;
          addRecentUpload(data);
          resetUploadUI();
        } else {
          // [BUG FIX] Do NOT clear the charts on error. Just show the message.
          msgEl.innerHTML = `<span style="color:#ef4444;">❌ Error: ${
            data.message || "An unknown error occurred."
          }</span>`;
        }
      } catch (err) {
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
        <h4 class="visualization-title">
          <i class="fas fa-chart-area"></i> Instant Data Preview
        </h4>
        <p class="visualization-subtitle">
          Previewing <strong style="color:#059669;">${fishData.length} records</strong> from your uploaded file
        </p>
        <div class="charts-grid">
          <div class="chart-container"><h5><i class="fas fa-sitemap"></i> Family Distribution</h5><canvas id="familyChart"></canvas></div>
          <div class="chart-container"><h5><i class="fas fa-layer-group"></i> Species by Taxonomic Groups</h5><canvas id="taxonomyChart"></canvas></div>
          <div class="chart-container"><h5><i class="fas fa-chart-bar"></i> Population Quantities</h5><canvas id="populationChart"></canvas></div>
          <div class="chart-container"><h5><i class="fas fa-project-diagram"></i> Organism Diversity</h5><canvas id="diversityChart"></canvas></div>
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
  }

  // --- Ocean Data Visualization Function ---
  function renderOceanDataCharts(oceanData) {
    destroyCharts();
    visualizationBox.className = "visualization-box has-data";
    visualizationBox.innerHTML = `
      <div class="visualization-container">
        <h4 class="visualization-title">
          <i class="fas fa-chart-area"></i> Instant Data Preview
        </h4>
        <p class="visualization-subtitle">
          Previewing <strong style="color:#059669;">${oceanData.length} records</strong> from your uploaded file
        </p>
        <div class="charts-grid">
          <div class="chart-container"><h5><i class="fas fa-thermometer-half"></i> Temperature Distribution (°C)</h5><canvas id="tempChart"></canvas></div>
          <div class="chart-container"><h5><i class="fas fa-tint"></i> Salinity Levels (PSU)</h5><canvas id="salinityChart"></canvas></div>
          <div class="chart-container"><h5><i class="fas fa-arrows-alt-v"></i> Depth Distribution (m)</h5><canvas id="depthChart"></canvas></div>
          <div class="chart-container"><h5><i class="fas fa-project-diagram"></i> Temperature vs Depth</h5><canvas id="tempDepthChart"></canvas></div>
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
        getFieldValue(d, ["Temperature (C)", "temperature_C", "Temperature", "temp"])
      )
      .filter((t) => t !== null);
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
      .map((d, index) => d.eventID || `Rec_${index + 1}`)
      .slice(0, 15);
    const tempCtx = document.getElementById("tempChart");
    if (tempCtx && temperatures.length > 0) {
      activeCharts.push(
        new Chart(tempCtx, {
          type: "line",
          data: {
            labels: labels,
            datasets: [
              {
                label: "Temperature (°C)",
                data: temperatures.slice(0, 15),
                borderColor: "#ef4444",
                backgroundColor: "rgba(239,68,68,0.1)",
                fill: true,
                tension: 0.4,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: false, title: { display: true, text: "°C" } } },
          },
        })
      );
    }
    const salinityCtx = document.getElementById("salinityChart");
    if (salinityCtx && salinities.length > 0) {
      activeCharts.push(
        new Chart(salinityCtx, {
          type: "bar",
          data: {
            labels: labels,
            datasets: [
              {
                label: "Salinity (PSU)",
                data: salinities.slice(0, 15),
                backgroundColor: "rgba(59,130,246,0.7)",
                borderColor: "#3b82f6",
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: false, title: { display: true, text: "PSU" } } },
          },
        })
      );
    }
    const depthCtx = document.getElementById("depthChart");
    if (depthCtx && depths.length > 0) {
      const depthRanges = ["0-100m", "101-500m", "501-1000m", "1000m+"];
      const depthCounts = [0, 0, 0, 0];
      depths.forEach((depth) => {
        if (depth <= 100) depthCounts[0]++;
        else if (depth <= 500) depthCounts[1]++;
        else if (depth <= 1000) depthCounts[2]++;
        else depthCounts[3]++;
      });
      activeCharts.push(
        new Chart(depthCtx, {
          type: "doughnut",
          data: {
            labels: depthRanges,
            datasets: [
              {
                data: depthCounts,
                backgroundColor: ["#10b981", "#3b82f6", "#f59e0b", "#ef4444"],
                borderWidth: 2,
                borderColor: "#ffffff",
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: "bottom" } },
          },
        })
      );
    }
    const tempDepthCtx = document.getElementById("tempDepthChart");
    if (tempDepthCtx && oceanData.length > 0) {
      const scatterData = oceanData
        .map((d) => ({
          x: getFieldValue(d, [
            "Depth in meter",
            "DepthInMeters",
            "Depth",
            "depth",
          ]),
          y: getFieldValue(d, [
            "Temperature (C)",
            "temperature_C",
            "Temperature",
            "temp",
          ]),
        }))
        .filter((d) => d.x !== null && d.y !== null)
        .slice(0, 100);
      if (scatterData.length > 0) {
        activeCharts.push(
          new Chart(tempDepthCtx, {
            type: "scatter",
            data: {
              datasets: [
                {
                  label: "Temp vs Depth",
                  data: scatterData,
                  backgroundColor: "rgba(139,92,246,0.7)",
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: {
                  type: "linear",
                  position: "bottom",
                  title: { display: true, text: "Depth (meters)" },
                },
                y: { title: { display: true, text: "Temperature (°C)" } },
              },
            },
          })
        );
      }
    }
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
          </div>
          <div class="modal-charts-grid">
            ${isFishData ? `
              <div class="modal-chart-container">
                <h5><i class="fas fa-sitemap"></i> Family Distribution</h5>
                <canvas id="modalFamilyChart"></canvas>
              </div>
              <div class="modal-chart-container">
                <h5><i class="fas fa-layer-group"></i> Species by Taxonomic Groups</h5>
                <canvas id="modalTaxonomyChart"></canvas>
              </div>
              <div class="modal-chart-container">
                <h5><i class="fas fa-chart-bar"></i> Population Quantities</h5>
                <canvas id="modalPopulationChart"></canvas>
              </div>
              <div class="modal-chart-container">
                <h5><i class="fas fa-project-diagram"></i> Organism Diversity</h5>
                <canvas id="modalDiversityChart"></canvas>
              </div>
            ` : `
              <div class="modal-chart-container">
                <h5><i class="fas fa-thermometer-half"></i> Temperature Distribution (°C)</h5>
                <canvas id="modalTempChart"></canvas>
              </div>
              <div class="modal-chart-container">
                <h5><i class="fas fa-tint"></i> Salinity Levels (PSU)</h5>
                <canvas id="modalSalinityChart"></canvas>
              </div>
              <div class="modal-chart-container">
                <h5><i class="fas fa-arrows-alt-v"></i> Depth Distribution (m)</h5>
                <canvas id="modalDepthChart"></canvas>
              </div>
              <div class="modal-chart-container">
                <h5><i class="fas fa-project-diagram"></i> Temperature vs Depth</h5>
                <canvas id="modalTempDepthChart"></canvas>
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
      modalBody.innerHTML = `
        <div class="error">
          <i class="fas fa-exclamation-triangle"></i>
          <p>Error loading visualization: ${error.message}</p>
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

    const temperatures = data
      .map((d) =>
        getFieldValue(d, ["Temperature (C)", "temperature_C", "Temperature", "temp"])
      )
      .filter((t) => t !== null);
    const salinities = data
      .map((d) =>
        getFieldValue(d, [
          "Salinity(PSU)",
          "sea_water_salinity",
          "Salinity",
          "psu",
        ])
      )
      .filter((s) => s !== null);
    const depths = data
      .map((d) =>
        getFieldValue(d, ["Depth in meter", "DepthInMeters", "Depth", "depth"])
      )
      .filter((d) => d !== null);
    const labels = data
      .map((d, index) => d.eventID || `Rec_${index + 1}`)
      .slice(0, 15);

    // Temperature Chart
    const tempCtx = document.getElementById("modalTempChart");
    if (tempCtx && temperatures.length > 0) {
      modalCharts.push(
        new Chart(tempCtx, {
          type: "line",
          data: {
            labels: labels,
            datasets: [
              {
                label: "Temperature (°C)",
                data: temperatures.slice(0, 15),
                borderColor: "#ef4444",
                backgroundColor: "rgba(239,68,68,0.1)",
                fill: true,
                tension: 0.4,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: false, title: { display: true, text: "°C" } } },
          },
        })
      );
    }

    // Salinity Chart
    const salinityCtx = document.getElementById("modalSalinityChart");
    if (salinityCtx && salinities.length > 0) {
      modalCharts.push(
        new Chart(salinityCtx, {
          type: "bar",
          data: {
            labels: labels,
            datasets: [
              {
                label: "Salinity (PSU)",
                data: salinities.slice(0, 15),
                backgroundColor: "rgba(59,130,246,0.7)",
                borderColor: "#3b82f6",
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: false, title: { display: true, text: "PSU" } } },
          },
        })
      );
    }

    // Depth Chart
    const depthCtx = document.getElementById("modalDepthChart");
    if (depthCtx && depths.length > 0) {
      const depthRanges = ["0-100m", "101-500m", "501-1000m", "1000m+"];
      const depthCounts = [0, 0, 0, 0];
      depths.forEach((depth) => {
        if (depth <= 100) depthCounts[0]++;
        else if (depth <= 500) depthCounts[1]++;
        else if (depth <= 1000) depthCounts[2]++;
        else depthCounts[3]++;
      });
      modalCharts.push(
        new Chart(depthCtx, {
          type: "doughnut",
          data: {
            labels: depthRanges,
            datasets: [
              {
                data: depthCounts,
                backgroundColor: ["#10b981", "#3b82f6", "#f59e0b", "#ef4444"],
                borderWidth: 2,
                borderColor: "#ffffff",
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: "bottom" } },
          },
        })
      );
    }

    // Temperature vs Depth Chart
    const tempDepthCtx = document.getElementById("modalTempDepthChart");
    if (tempDepthCtx && data.length > 0) {
      const scatterData = data
        .map((d) => ({
          x: getFieldValue(d, [
            "Depth in meter",
            "DepthInMeters",
            "Depth",
            "depth",
          ]),
          y: getFieldValue(d, [
            "Temperature (C)",
            "temperature_C",
            "Temperature",
            "temp",
          ]),
        }))
        .filter((d) => d.x !== null && d.y !== null)
        .slice(0, 100);
      if (scatterData.length > 0) {
        modalCharts.push(
          new Chart(tempDepthCtx, {
            type: "scatter",
            data: {
              datasets: [
                {
                  label: "Temp vs Depth",
                  data: scatterData,
                  backgroundColor: "rgba(139,92,246,0.7)",
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: {
                  type: "linear",
                  position: "bottom",
                  title: { display: true, text: "Depth (meters)" },
                },
                y: { title: { display: true, text: "Temperature (°C)" } },
              },
            },
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