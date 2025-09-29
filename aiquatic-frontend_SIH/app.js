(function () {
  // === Dashboard Charts ===
  if (window.Chart) {
    // Temperature Chart
    const tempChartEl = document.getElementById("tempChart");
    if (tempChartEl) {
      new Chart(tempChartEl, {
        type: "line",
        data: {
          labels:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
          datasets:[{ 
            label:"Ocean Temperature (°C)", 
            data:[20.2,21.8,24.01,26,27.5,28,28.7,27.45,26.2,25.3,23.3,22.2],
            borderColor:"#3b82f6", 
            backgroundColor:"rgba(59,130,246,0.1)", 
            fill:true, 
            tension:0.4,
            borderWidth: 3,
            pointBackgroundColor: "#3b82f6",
            pointBorderColor: "#ffffff",
            pointBorderWidth: 2,
            pointRadius: 5
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top'
            }
          },
          scales: {
            y: {
              beginAtZero: false,
              grid: {
                color: '#f1f5f9'
              }
            },
            x: {
              grid: {
                color: '#f1f5f9'
              }
            }
          }
        }
      });
    }

    // Species Chart
    const speciesChartEl = document.getElementById("speciesChart");
    if (speciesChartEl) {
      new Chart(speciesChartEl, {
        type:"bar",
        data:{
          labels:["Arabian Sea","Bay of Bengal","Indian Ocean","Pacific","Atlantic"],
          datasets:[{ 
            label:"Species Count", 
            data:[522,776,854,410,301],
            backgroundColor:["#3b82f6","#10b981","#f59e0b","#8b5cf6","#ef4444"],
            borderRadius: 8,
            borderSkipped: false
          }]
        },
        options:{ 
          responsive: true,
          maintainAspectRatio: false,
          plugins:{ 
            legend:{ display:false } 
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: '#f1f5f9'
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          }
        }
      });
    }

    // Ocean Parameters Charts
    const salinityChartEl = document.getElementById("salinityChart");
    if (salinityChartEl) {
      new Chart(salinityChartEl, {
        type:"line",
        data:{
          labels:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
          datasets:[{ 
            label:"Salinity (PSU)", 
            data:[34.1,34,33.8,34.5,35,34.2,33.7,34.1,34.3,34.5,34.2,34.0],
            borderColor:"#10b981", 
            backgroundColor:"rgba(16,185,129,0.1)", 
            fill:true,
            tension:0.4,
            borderWidth: 3,
            pointBackgroundColor: "#10b981",
            pointBorderColor: "#ffffff",
            pointBorderWidth: 2,
            pointRadius: 5
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: false,
              grid: {
                color: '#f1f5f9'
              }
            },
            x: {
              grid: {
                color: '#f1f5f9'
              }
            }
          }
        }
      });
    }

    const phChartEl = document.getElementById("phChart");
    if (phChartEl) {
      new Chart(phChartEl, {
        type:"bar",
        data:{
          labels:["Surface","Mid Depth","Deep"],
          datasets:[{ 
            label:"pH Levels", 
            data:[8.1,7.9,7.6], 
            backgroundColor:["#f59e0b","#6366f1","#3b82f6"],
            borderRadius: 8,
            borderSkipped: false
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: {
              beginAtZero: false,
              min: 7.0,
              grid: {
                color: '#f1f5f9'
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          }
        }
      });
    }

    // Additional Ocean Parameter Charts
    const tempDepthChartEl = document.getElementById("tempDepthChart");
    if (tempDepthChartEl) {
      new Chart(tempDepthChartEl, {
        type:"line",
        data:{
          labels:["0m","50m","100m","200m","500m","1000m"],
          datasets:[{ 
            label:"Temperature (°C)", 
            data:[26,24,18,12,8,4],
            borderColor:"#ef4444", 
            backgroundColor:"rgba(239,68,68,0.1)", 
            fill:true,
            tension:0.4,
            borderWidth: 3
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }

    const oxygenChartEl = document.getElementById("oxygenChart");
    if (oxygenChartEl) {
      new Chart(oxygenChartEl, {
        type:"doughnut",
        data:{
          labels:["High (>8mg/L)","Medium (5-8mg/L)","Low (<5mg/L)"],
          datasets:[{ 
            data:[43,35,22],
            backgroundColor:["#10b981","#f59e0b","#ef4444"]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }

    // Fish Taxonomy Charts
    const fishChartEl = document.getElementById("fishChart");
    if (fishChartEl) {
      new Chart(fishChartEl, {
        type:"pie",
        data:{
          labels:["Clupeidae","Scombridae","Carangidae","Engraulidae","Others"],
          datasets:[{ 
            data:[253,177,143,101,88],
            backgroundColor:["#ef4444","#3b82f6","#10b981","#f59e0b","#8b5cf6"]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }

    const habitatChartEl = document.getElementById("habitatChart");
    if (habitatChartEl) {
      new Chart(habitatChartEl, {
        type:"bar",
        data:{
          labels:["Reef","Open Ocean","Deep Sea","Coastal"],
          datasets:[{ 
            label:"Population", 
            data:[648,889,531,795], 
            backgroundColor:"#06b6d4",
            borderRadius: 8,
            borderSkipped: false
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          }
        }
      });
    }

    // Additional Fish Charts
    const discoveryChartEl = document.getElementById("discoveryChart");
    if (discoveryChartEl) {
      new Chart(discoveryChartEl, {
        type:"line",
        data:{
          labels:["2018","2019","2020","2021","2022","2023","2024"],
          datasets:[{ 
            label:"New Species", 
            data:[8,12,15,9,18,24,16],
            borderColor:"#8b5cf6", 
            backgroundColor:"rgba(139,92,246,0.1)", 
            fill:true,
            tension:0.4,
            borderWidth: 3
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }

    const conservationChartEl = document.getElementById("conservationChart");
    if (conservationChartEl) {
      new Chart(conservationChartEl, {
        type:"doughnut",
        data:{
          labels:["Least Concern","Near Threatened","Vulnerable","Endangered","Critical"],
          datasets:[{ 
            data:[1222,847,444,156,42],
            backgroundColor:["#10b981","#f59e0b","#ff6b35","#ef4444","#991b1b"]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }

    // DNA/eDNA Charts
    const dnaChartEl = document.getElementById("dnaChart");
    if (dnaChartEl) {
      new Chart(dnaChartEl, {
        type:"line",
        data:{
          labels:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
          datasets:[{ 
            label:"DNA Samples", 
            data:[1231,1347,1417,1623,1552,1763,1892,1650,1731,1899,1840,1986],
            borderColor:"#8b5cf6", 
            backgroundColor:"rgba(139,92,246,0.1)", 
            fill:true,
            tension:0.4,
            borderWidth: 3,
            pointBackgroundColor: "#8b5cf6",
            pointBorderColor: "#ffffff",
            pointBorderWidth: 2,
            pointRadius: 5
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }

    const ednaChartEl = document.getElementById("ednaChart");
    if (ednaChartEl) {
      new Chart(ednaChartEl, {
        type:"doughnut",
        data:{
          labels:["Region A","Region B","Region C","Region D","Region E","Region F"],
          datasets:[{ 
            data:[1207,1503,943,1756,2312,1039],
            backgroundColor:["#3b82f6","#10b981","#f59e0b","#ef4444","#8b5cf6","#ec4899"]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }

    // Additional DNA Charts
    const diversityChartEl = document.getElementById("diversityChart");
    if (diversityChartEl) {
      new Chart(diversityChartEl, {
        type:"radar",
        data:{
          labels:["Region A","Region B","Region C","Region D","Region E","Region F"],
          datasets:[{ 
            label:"Diversity Index", 
            data:[0.85,0.92,0.78,0.88,0.95,0.82],
            borderColor:"#10b981", 
            backgroundColor:"rgba(16,185,129,0.2)",
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            r: {
              beginAtZero: true,
              max: 1.0
            }
          }
        }
      });
    }

    const statusChartEl = document.getElementById("statusChart");
    if (statusChartEl) {
      new Chart(statusChartEl, {
        type:"bar",
        data:{
          labels:["Processed","In Progress","Queued","Failed"],
          datasets:[{ 
            label:"Samples", 
            data:[18648,4263,3050,2730],
            backgroundColor:["#10b981","#f59e0b","#6b7280","#ef4444"],
            borderRadius: 8,
            borderSkipped: false
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          }
        }
      });
    }

    // Otolith Charts
    const ageChartEl = document.getElementById("ageChart");
    if (ageChartEl) {
      new Chart(ageChartEl, {
        type:"bar",
        data:{
          labels:["1 year","2 years","3 years","4 years","5 years","6+ years"],
          datasets:[{ 
            label:"Fish Count", 
            data:[450,620,580,480,320,180],
            backgroundColor:"#3b82f6",
            borderRadius: 8,
            borderSkipped: false
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          }
        }
      });
    }

    const sizeAgeChartEl = document.getElementById("sizeAgeChart");
    if (sizeAgeChartEl) {
      new Chart(sizeAgeChartEl, {
        type:"scatter",
        data:{
          datasets:[{ 
            label:"Size vs Age", 
            data:[
              {x:1,y:8},{x:2,y:10},{x:3,y:12},{x:4,y:14},{x:5,y:16},{x:6,y:18},
              {x:1,y:7},{x:2,y:11},{x:3,y:13},{x:4,y:15},{x:5,y:17},{x:6,y:19}
            ],
            backgroundColor:"#10b981",
            borderColor:"#059669"
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              title: {
                display: true,
                text: 'Age (years)'
              }
            },
            y: {
              title: {
                display: true,
                text: 'Otolith Size (mm)'
              }
            }
          }
        }
      });
    }

    const growthChartEl = document.getElementById("growthChart");
    if (growthChartEl) {
      new Chart(growthChartEl, {
        type:"line",
        data:{
          labels:["1","2","3","4","5","6","7"],
          datasets:[
            { 
              label:"Species A", 
              data:[5,8,12,15,18,20,22],
              borderColor:"#3b82f6", 
              backgroundColor:"rgba(59,130,246,0.1)"
            },
            { 
              label:"Species B", 
              data:[6,10,14,17,19,21,23],
              borderColor:"#10b981", 
              backgroundColor:"rgba(16,185,129,0.1)"
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              title: {
                display: true,
                text: 'Age (years)'
              }
            },
            y: {
              title: {
                display: true,
                text: 'Size (mm)'
              }
            }
          }
        }
      });
    }

    const monthlyChartEl = document.getElementById("monthlyChart");
    if (monthlyChartEl) {
      new Chart(monthlyChartEl, {
        type:"bar",
        data:{
          labels:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
          datasets:[{ 
            label:"Samples Collected", 
            data:[280,320,450,380,520,480,550,420,390,460,350,290],
            backgroundColor:"#f59e0b",
            borderRadius: 8,
            borderSkipped: false
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          }
        }
      });
    }
  }

  // === Hamburger Menu ===
  const menuBtn = document.querySelector(".hamburger");
  const sidebar = document.querySelector(".sidebar");

  if (menuBtn && sidebar) {
    menuBtn.addEventListener("click", () => {
      sidebar.classList.toggle("show");
      menuBtn.classList.toggle("open");
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener("click", (e) => {
      if (window.innerWidth <= 768) {
        if (!sidebar.contains(e.target) && !menuBtn.contains(e.target)) {
          sidebar.classList.remove("show");
          menuBtn.classList.remove("open");
        }
      }
    });
  }

  // === Search Modal ===
  const searchBtn = document.getElementById("searchBtn");
  const searchModal = document.getElementById("searchModal");
  const closeBtn = document.getElementById("closeSearch");
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");

  if (searchBtn && searchModal && closeBtn && searchInput && searchResults) {
    searchBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      searchModal.style.display = "flex";
      searchInput.focus();
    });

    closeBtn.addEventListener("click", () => {
      searchModal.style.display = "none";
      searchInput.value = "";
      showAllResults();
    });

    // Close modal when clicking outside
    searchModal.addEventListener("click", (e) => {
      if (e.target === searchModal) {
        searchModal.style.display = "none";
        searchInput.value = "";
        showAllResults();
      }
    });

    // Search functionality
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase().trim();
      const resultItems = searchResults.querySelectorAll(".result-item");
      
      if (query === "") {
        showAllResults();
        return;
      }

      let hasResults = false;
      resultItems.forEach(item => {
        const searchData = item.getAttribute("data-search").toLowerCase();
        const text = item.textContent.toLowerCase();
        
        if (searchData.includes(query) || text.includes(query)) {
          item.style.display = "block";
          hasResults = true;
        } else {
          item.style.display = "none";
        }
      });

      // Show "no results" message if needed
      if (!hasResults) {
        if (!searchResults.querySelector('.no-results')) {
          const noResults = document.createElement('div');
          noResults.className = 'no-results result-item';
          noResults.style.color = '#64748b';
          noResults.style.fontStyle = 'italic';
          noResults.textContent = `No results found for "${query}"`;
          searchResults.appendChild(noResults);
        }
      } else {
        const noResults = searchResults.querySelector('.no-results');
        if (noResults) {
          noResults.remove();
        }
      }
    });

    function showAllResults() {
      const resultItems = searchResults.querySelectorAll(".result-item");
      resultItems.forEach(item => {
        if (!item.classList.contains('no-results')) {
          item.style.display = "block";
        }
      });
      
      const noResults = searchResults.querySelector('.no-results');
      if (noResults) {
        noResults.remove();
      }
    }

    // Handle result item clicks
    searchResults.addEventListener("click", (e) => {
      const resultItem = e.target.closest(".result-item");
      if (resultItem && !resultItem.classList.contains('no-results')) {
        searchModal.style.display = "none";
        searchInput.value = "";
        showAllResults();
        
        // Here you could add navigation logic based on the result
        console.log("Selected:", resultItem.textContent.trim());
      }
    });

    // Close search with Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && searchModal.style.display === "flex") {
        searchModal.style.display = "none";
        searchInput.value = "";
        showAllResults();
      }
    });
  }

  // === Export Chart Function ===
  window.exportChart = function(chartId) {
    const canvas = document.getElementById(chartId);
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${chartId}_chart.png`;
      link.href = url;
      link.click();
    }
  };

  // === Responsive Sidebar ===
  function handleResize() {
    const sidebar = document.querySelector('.sidebar');
    const hamburger = document.querySelector('.hamburger');
    
    if (window.innerWidth > 768) {
      if (sidebar) sidebar.classList.remove('show');
      if (hamburger) hamburger.classList.remove('open');
    }
  }

  window.addEventListener('resize', handleResize);

  // === Ocean Monitoring Stations Map ===
  let oceanMap = null;
  let stationMarkers = [];
  let csvMarkers = [];
  let allMarkers = [];
  let currentLayer = 'all';

  // Initialize the map
  function initOceanMap() {
    const mapElement = document.getElementById('oceanMap');
    if (!mapElement) return;

    // Initialize map centered on Indian Ocean
    oceanMap = L.map('oceanMap').setView([15.0, 80.0], 6);

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18
    }).addTo(oceanMap);

    // Indian Ocean monitoring stations data
const monitoringStations = [
  {
    name: "Mumbai Coastal Station",
    lat: 19.0760,
    lng: 72.8777,
    species: "Mackerel",
    temperature: "28.5°C",
    salinity: "35 PSU",
    type: "coastal"
  },
  {
    name: "Goa Marine Observatory", 
    lat: 15.2993,
    lng: 74.1240,
    species: "Pomfret",
    temperature: "29.2°C", 
    salinity: "34 PSU",
    type: "coastal"
  },
  {
    name: "Chennai Bay Station",
    lat: 13.0827,
    lng: 80.2707,
    species: "Sardine",
    temperature: "27.8°C",
    salinity: "33 PSU", 
    type: "bay"
  },
  {
    name: "Kochi Monitoring Point",
    lat: 9.9312,
    lng: 76.2673,
    species: "Tuna",
    temperature: "30.1°C",
    salinity: "35 PSU",
    type: "coastal"
  },
  {
    name: "Vizag Deep Sea Station",
    lat: 17.6868,
    lng: 83.2185,
    species: "Barracuda",
    temperature: "26.4°C",
    salinity: "36 PSU",
    type: "deep_sea"
  },
  {
    name: "Bay of Bengal Monitoring Station",
    lat: 16.5,
    lng: 88.0,
    species: "Mackerel", 
    temperature: "27.1°C",
    salinity: "35 PSU",
    type: "deep_sea"
  },
  {
    name: "Andaman Sea Observatory",
    lat: 11.7401,
    lng: 92.6586,
    species: "Snapper",
    temperature: "29.8°C",
    salinity: "34 PSU",
    type: "island"
  },
  {
    name: "Kolkata Port Station",
    lat: 22.5726,
    lng: 88.3639,
    species: "Hilsa",
    temperature: "25.9°C",
    salinity: "32 PSU",
    type: "port"
  },
  {
    name: "Mangalore Coastal Point",
    lat: 12.9141,
    lng: 74.8560,
    species: "Kingfish",
    temperature: "28.7°C", 
    salinity: "34 PSU",
    type: "coastal"
  },
  {
    name: "Paradip Marine Station",
    lat: 20.2648,
    lng: 86.6249,
    species: "Pomfret",
    temperature: "26.8°C",
    salinity: "35 PSU",
    type: "port"
  },
  {
    name: "Lakshadweep Agatti Station",
    lat: 10.8600,
    lng: 72.1800,
    species: "Reef Fish",
    temperature: "27.9°C",
    salinity: "36 PSU",
    type: "island"
  },
  {
    name: "Kavaratti Marine Base",
    lat: 10.5667,
    lng: 72.6369,
    species: "Snapper",
    temperature: "28.4°C",
    salinity: "35 PSU",
    type: "island"
  },
  {
    name: "Port Blair Marine Station",
    lat: 11.6234,
    lng: 92.7265,
    species: "Grouper",
    temperature: "29.0°C",
    salinity: "34 PSU",
    type: "island"
  },
  {
    name: "Nicobar Deep Sea Point",
    lat: 7.5000,
    lng: 93.8000,
    species: "Tuna",
    temperature: "26.7°C",
    salinity: "36 PSU",
    type: "deep_sea"
  },
  {
    name: "Daman Coastal Station",
    lat: 20.3974,
    lng: 72.8328,
    species: "Anchovy",
    temperature: "28.1°C",
    salinity: "34 PSU",
    type: "coastal"
  },
  {
    name: "Tuticorin Gulf Station",
    lat: 8.7642,
    lng: 78.1348,
    species: "Mullet",
    temperature: "29.3°C",
    salinity: "35 PSU",
    type: "bay"
  },
  {
    name: "Puducherry Bay Point",
    lat: 11.9416,
    lng: 79.8083,
    species: "Sardine",
    temperature: "28.0°C",
    salinity: "33 PSU",
    type: "bay"
  },
  {
    name: "Gujarat Okha Station",
    lat: 22.4700,
    lng: 69.0700,
    species: "Pomfret",
    temperature: "27.5°C",
    salinity: "36 PSU",
    type: "coastal"
  },
  {
    name: "Sundarbans Delta Station",
    lat: 21.9497,
    lng: 89.1833,
    species: "Hilsa",
    temperature: "26.2°C",
    salinity: "31 PSU",
    type: "bay"
  },
  {
    name: "Cuddalore Marine Station",
    lat: 11.7500,
    lng: 79.7500,
    species: "Mackerel",
    temperature: "28.6°C",
    salinity: "34 PSU",
    type: "bay"
  }
];

    // Add markers for each static station
    monitoringStations.forEach(station => {
      const marker = L.marker([station.lat, station.lng])
        .addTo(oceanMap)
        .bindPopup(`
          <div class="station-info">
            <h4>${station.name}</h4>
            <div class="species">🐟 Species: ${station.species}</div>
            <div class="temp">🌡️ Temperature: ${station.temperature}</div>
            <div class="salinity">🌊 Salinity: ${station.salinity}</div>
            <div class="data-source">📊 Source: Static Data</div>
          </div>
        `, {
          className: 'custom-popup'
        });

      // Store marker with station data for filtering
      marker.stationData = station;
      marker.stationData.source = "static";
      stationMarkers.push(marker);
      allMarkers.push(marker);
    });

    // Load CSV data and add markers
    loadCSVData();

    // Add custom control for legend
    const legend = L.control({position: 'bottomright'});
    legend.onAdd = function(map) {
      const div = L.DomUtil.create('div', 'legend');
      div.innerHTML = `
        <div style="background: rgba(255,255,255,0.9); padding: 10px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h4 style="margin: 0 0 8px 0; color: #1e293b;">Data Sources</h4>
          <div><span style="color: #3b82f6;">🔵</span> Static Stations</div>
          <div><span style="color: #10b981;">🟢</span> Marine Research Data</div> 
          <div><span style="color: #f59e0b;">🟡</span> High Temperature</div>
          <div><span style="color: #ef4444;">🔴</span> High Salinity</div>
        </div>
      `;
      return div;
    };
    legend.addTo(oceanMap);
  }

  // Load embedded marine research data directly
  function loadCSVData() {
    console.log('Loading embedded marine research data...');
    
    // Use embedded data from leaflet-data.js (complete dataset)
    const embeddedData = window.EMBEDDED_LEAFLET_DATA || [];
    
    if (embeddedData.length === 0) {
      console.warn('No embedded marine research data available');
      return;
    }

    console.log('Successfully loaded embedded data:', embeddedData.length, 'marine research records');
    
    // Process embedded data and add markers to map
    embeddedData.forEach(row => {
      const lat = parseFloat(row.decimalLatitude);
      const lon = parseFloat(row.decimalLongitude);
      const temperature = parseFloat(row.Temperature_C);
      const salinity = parseFloat(row.sea_water_salinity);

      if (!isNaN(lat) && !isNaN(lon)) {
        // Create custom icon based on data values
        let iconColor = '#10b981'; // Default green for marine data
        let markerType = 'csv';
        
        if (temperature > 25) {
          iconColor = '#f59e0b'; // Orange for high temperature
          markerType = 'high_temp';
        }
        if (salinity > 35) {
          iconColor = '#ef4444'; // Red for high salinity
          markerType = 'high_salinity';
        }

        // Create custom icon
        const customIcon = L.divIcon({
          className: 'custom-marker',
          html: `<div style="background-color: ${iconColor}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8]
        });

        const popupContent = `
          <div class="station-info">
            <h4>Event ID: ${row.eventID}</h4>
            <div class="species">🐠 Species: ${row.scientificName}</div>
            <div class="location">📍 Location: ${row.locality}</div>
            <div class="temp">🌡️ Temperature: ${row.Temperature_C}°C</div>
            <div class="salinity">🌊 Salinity: ${row.sea_water_salinity} PSU</div>
            <div class="oxygen">💨 Dissolved O₂: ${row.oxygen_concentration_mgL} mg/L</div>
            <div class="depth">📏 Depth: ${row.DepthInMeters}m</div>
            <div class="date">📅 Date: ${row.eventDate}</div>
            <div class="data-source">📊 Source: Marine Research Dataset</div>
          </div>
        `;

        const marker = L.marker([lat, lon], { icon: customIcon })
          .addTo(oceanMap)
          .bindPopup(popupContent, {
            className: 'custom-popup'
          });

        // Store marker with data for filtering
        marker.stationData = {
          name: `Event ${row.eventID}`,
          lat: lat,
          lng: lon,
          species: row.scientificName,
          temperature: row.Temperature_C,
          salinity: row.sea_water_salinity,
          oxygen: row.oxygen_concentration_mgL,
          depth: row.DepthInMeters,
          locality: row.locality,
          eventDate: row.eventDate,
          type: markerType,
          source: "embedded"
        };

        csvMarkers.push(marker);
        allMarkers.push(marker);
      }
    });

    console.log('Added', csvMarkers.length, 'marine research markers to map');
  }

  // Fallback to CSV sources
  function tryLoadFromCSVSources() {
    return new Promise((resolve, reject) => {
      const csvSources = [
        "leaflet_data.csv", // Local file (works when served via HTTP)
        "https://raw.githubusercontent.com/parthdabhi1703/AiQuatic-Labs/main/sample_data/leaflet_data.csv", // GitHub raw URL
        "../sample_data/leaflet_data.csv" // Relative path
      ];

      function tryLoadCSV(sourceIndex = 0) {
        if (sourceIndex >= csvSources.length) {
          reject(new Error('Failed to load CSV from all sources'));
          return;
        }

        console.log(`Trying CSV source ${sourceIndex + 1}/${csvSources.length}: ${csvSources[sourceIndex]}`);

        Papa.parse(csvSources[sourceIndex], {
          download: true,
          header: true,
          skipEmptyLines: true,
      complete: function(results) {
        console.log('CSV data loaded:', results.data.length, 'records');
        
        results.data.forEach(row => {
          const lat = parseFloat(row.decimalLatitude);
          const lon = parseFloat(row.decimalLongitude);
          const temperature = parseFloat(row.Temperature_C);
          const salinity = parseFloat(row.sea_water_salinity);

          if (!isNaN(lat) && !isNaN(lon)) {
            // Create custom icon based on data values
            let iconColor = '#10b981'; // Default green for CSV data
            let markerType = 'csv';
            
            if (temperature > 25) {
              iconColor = '#f59e0b'; // Orange for high temperature
              markerType = 'high_temp';
            }
            if (salinity > 35) {
              iconColor = '#ef4444'; // Red for high salinity
              markerType = 'high_salinity';
            }

            // Create custom icon
            const customIcon = L.divIcon({
              className: 'custom-marker',
              html: `<div style="background-color: ${iconColor}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
              iconSize: [16, 16],
              iconAnchor: [8, 8]
            });

            const popupContent = `
              <div class="station-info">
                <h4>Event ID: ${row.eventID}</h4>
                <div class="species">� Species: ${row.scientificName}</div>
                <div class="location">📍 Location: ${row.locality}</div>
                <div class="temp">🌡️ Temperature: ${row.Temperature_C}°C</div>
                <div class="salinity">🌊 Salinity: ${row.sea_water_salinity} PSU</div>
                <div class="oxygen">💨 Dissolved O₂: ${row.oxygen_concentration_mgL} mg/L</div>
                <div class="depth">📏 Depth: ${row.DepthInMeters}m</div>
                <div class="date">📅 Date: ${row.eventDate}</div>
                <div class="data-source">📊 Source: CSV Data</div>
              </div>
            `;

            const marker = L.marker([lat, lon], { icon: customIcon })
              .addTo(oceanMap)
              .bindPopup(popupContent, {
                className: 'custom-popup'
              });

            // Store marker with data for filtering
            marker.stationData = {
              name: `Event ${row.eventID}`,
              lat: lat,
              lng: lon,
              species: row.scientificName,
              temperature: row.Temperature_C,
              salinity: row.sea_water_salinity,
              oxygen: row.oxygen_concentration_mgL,
              depth: row.DepthInMeters,
              locality: row.locality,
              eventDate: row.eventDate,
              type: markerType,
              source: "csv"
            };

            csvMarkers.push(marker);
            allMarkers.push(marker);
          }
        });

            console.log('Successfully loaded CSV data:', results.data.length, 'records');
            processMapData(results.data, 'CSV Data');
            resolve(results.data);
          },
          error: function(error) {
            console.error(`Error loading CSV from source ${sourceIndex}:`, error);
            tryLoadCSV(sourceIndex + 1);
          }
        });
      }

      // Start trying to load CSV
      tryLoadCSV();
    });
  }

  // Process and add map data (works for both API and CSV data)
  function processMapData(data, dataSource = 'API Data') {
    data.forEach(row => {
      const lat = parseFloat(row.decimalLatitude || row.lat || row.latitude);
      const lon = parseFloat(row.decimalLongitude || row.lng || row.longitude);
      const temperature = parseFloat(row.Temperature_C || row.temperature);
      const salinity = parseFloat(row.sea_water_salinity || row.salinity);

      if (!isNaN(lat) && !isNaN(lon)) {
        // Create custom icon based on data values
        let iconColor = '#10b981'; // Default green for data
        let markerType = 'csv';
        
        if (temperature > 25) {
          iconColor = '#f59e0b'; // Orange for high temperature
          markerType = 'high_temp';
        }
        if (salinity > 35) {
          iconColor = '#ef4444'; // Red for high salinity
          markerType = 'high_salinity';
        }

        // Create custom icon
        const customIcon = L.divIcon({
          className: 'custom-marker',
          html: `<div style="background-color: ${iconColor}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8]
        });

        const popupContent = `
          <div class="station-info">
            <h4>Event ID: ${row.eventID || row.id || 'N/A'}</h4>
            <div class="species">🐠 Species: ${row.scientificName || row.species || 'Unknown'}</div>
            <div class="location">📍 Location: ${row.locality || row.location || 'Unknown'}</div>
            <div class="temp">🌡️ Temperature: ${temperature}°C</div>
            <div class="salinity">🌊 Salinity: ${salinity} PSU</div>
            <div class="oxygen">💨 Dissolved O₂: ${row.oxygen_concentration_mgL || row.oxygen || 'N/A'} mg/L</div>
            <div class="depth">📏 Depth: ${row.DepthInMeters || row.depth || 'N/A'}m</div>
            <div class="date">📅 Date: ${row.eventDate || row.date || 'N/A'}</div>
            <div class="data-source">📊 Source: ${dataSource}</div>
          </div>
        `;

        const marker = L.marker([lat, lon], { icon: customIcon })
          .addTo(oceanMap)
          .bindPopup(popupContent, {
            className: 'custom-popup'
          });

        // Store marker with data for filtering
        marker.stationData = {
          name: `Event ${row.eventID || row.id || 'Unknown'}`,
          lat: lat,
          lng: lon,
          species: row.scientificName || row.species || 'Unknown',
          temperature: temperature,
          salinity: salinity,
          oxygen: row.oxygen_concentration_mgL || row.oxygen,
          depth: row.DepthInMeters || row.depth,
          locality: row.locality || row.location,
          eventDate: row.eventDate || row.date,
          type: markerType,
          source: "csv"
        };

        csvMarkers.push(marker);
        allMarkers.push(marker);
      }
    });

    console.log('Added', csvMarkers.length, 'markers to map from', dataSource);
  }

  // Fallback data in case CSV loading fails
  function loadFallbackData() {
    console.log('Loading embedded fallback data');
    
    // Use embedded data from leaflet-data.js
    const fallbackData = window.EMBEDDED_LEAFLET_DATA || [];
    
    if (fallbackData.length === 0) {
      console.warn('No embedded fallback data available');
      return;
    }

    // Process fallback data same way as other data
    processMapData(fallbackData, 'Embedded Data');
  }

  // Toggle map layers based on button clicks
  window.toggleMapLayer = function(layer) {
    if (!oceanMap || !allMarkers) return;
    
    currentLayer = layer;
    
    // Update button active states
    document.querySelectorAll('.map-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    event.target.closest('.map-btn').classList.add('active');

    // Show/hide markers based on layer
    allMarkers.forEach(marker => {
      const station = marker.stationData;
      let showMarker = false;

      switch(layer) {
        case 'temperature':
          // Show markers with temperature > 25°C (includes both static and CSV data)
          const temp = parseFloat(station.temperature);
          showMarker = !isNaN(temp) && temp > 25;
          break;
        case 'salinity': 
          // Show markers with salinity > 34 PSU (includes both static and CSV data)
          const salinity = parseFloat(station.salinity);
          showMarker = !isNaN(salinity) && salinity > 34;
          break;
        case 'csv':
          // Show only embedded marine research data markers
          showMarker = station.source === 'embedded';
          break;
        case 'all':
        default:
          showMarker = true;
          break;
      }

      if (showMarker) {
        marker.addTo(oceanMap);
      } else {
        oceanMap.removeLayer(marker);
      }
    });
  };

  // Initialize map when page loads
  if (document.getElementById('oceanMap')) {
    document.addEventListener('DOMContentLoaded', function() {
      // Delay initialization to ensure Leaflet is loaded
      setTimeout(initOceanMap, 500);
    });
  }

})();
