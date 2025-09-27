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
            data:[20,22,24,26,27,28,29,27,26,25,23,21],
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
            data:[520,660,870,410,250],
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
            data:[45,35,20],
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
            data:[250,180,140,100,90],
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
            data:[320,450,210,380], 
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
            data:[1200,850,450,156,42],
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
            data:[1200,1350,1400,1600,1550,1700,1800,1650,1750,1900,1850,2000],
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
          labels:["Region A","Region B","Region C","Region D"],
          datasets:[{ 
            data:[400,350,500,280],
            backgroundColor:["#3b82f6","#10b981","#f59e0b","#ef4444"]
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
            data:[12450,2340,1890,320],
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

})();
