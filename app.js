let map;
let markers = [];
let reports = [];
let currentPosition = null;
let addingReport = false;
let tempMarker = null;
let unsubscribe = null; // For real-time listener

const categoryIcons = {
    lighting: '💡',
    flooding: '🌊',
    'unsafe-crossing': '⚠️',
    debris: '🚧',
    'extreme-weather': '🌡️',
    other: '📌'
};

const categoryColors = {
    lighting: '#ffd54f',
    flooding: '#4fc3f7',
    'unsafe-crossing': '#ff5252',
    debris: '#ff9800',
    'extreme-weather': '#9c27b0',
    other: '#78909c'
};

// Initialize map
function initMap() {
    map = L.map('map').setView([33.6846, -117.8265], 13); // Default to Irvine, CA
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);

    // Try to get user's location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                currentPosition = [position.coords.latitude, position.coords.longitude];
                map.setView(currentPosition, 14);
                L.marker(currentPosition, {
                    icon: L.divIcon({
                        className: 'user-location-icon',
                        html: '📍',
                        iconSize: [30, 30]
                    })
                }).addTo(map).bindPopup('You are here');
            },
            (error) => {
                console.log('Location access denied, using default location');
            }
        );
    }

    // Load reports from Firestore with real-time updates
    loadReportsFromFirestore();
}

// Load reports from Firestore with real-time listener
function loadReportsFromFirestore() {
    // Set up real-time listener
    unsubscribe = db.collection('reports')
        .orderBy('timestamp', 'desc')
        .onSnapshot((snapshot) => {
            reports = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                reports.push({
                    id: doc.id,
                    ...data,
                    timestamp: data.timestamp.toMillis() // Convert Firestore timestamp
                });
            });
            
            displayReports(document.getElementById('filterCategory').value);
            console.log(`Loaded ${reports.length} reports from Firestore`);
        }, (error) => {
            console.error('Error loading reports:', error);
            // Fallback to localStorage if Firestore fails
            loadReportsFromLocalStorage();
        });
}

// Fallback: Load from localStorage (for offline mode)
function loadReportsFromLocalStorage() {
    const saved = localStorage.getItem('safeSpotReports');
    if (saved) {
        reports = JSON.parse(saved);
        displayReports();
        console.log('Loaded reports from localStorage (offline mode)');
    }
}

// Save report to Firestore
async function saveReportToFirestore(report) {
    try {
        // Convert timestamp to Firestore timestamp
        const firestoreReport = {
            ...report,
            timestamp: firebase.firestore.Timestamp.fromMillis(report.timestamp)
        };
        
        const docRef = await db.collection('reports').add(firestoreReport);
        console.log('Report saved to Firestore with ID:', docRef.id);
        
        // Also save to localStorage as backup
        saveToLocalStorage();
        
        return docRef.id;
    } catch (error) {
        console.error('Error saving to Firestore:', error);
        // Fallback to localStorage
        saveToLocalStorage();
        alert('Report saved locally. Will sync when connection is restored.');
    }
}

// Save to localStorage (backup/offline mode)
function saveToLocalStorage() {
    localStorage.setItem('safeSpotReports', JSON.stringify(reports));
}

// Display all reports on map
function displayReports(filter = 'all') {
    // Clear existing markers
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    reports.forEach(report => {
        if (filter !== 'all' && report.category !== filter) return;

        const icon = L.divIcon({
            className: 'custom-marker',
            html: `<div style="font-size: 24px; filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.3));">${categoryIcons[report.category]}</div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 30]
        });

        const marker = L.marker([report.lat, report.lng], { icon })
            .addTo(map)
            .bindPopup(createPopupContent(report));
        
        marker.on('click', () => {
            showReportDetails(report);
        });

        markers.push(marker);
    });

    updateStats();
}

// Create popup content
function createPopupContent(report) {
    const severityClass = `severity-${report.severity}`;
    const timeAgo = getTimeAgo(report.timestamp);
    
    return `
        <div class="popup-content">
            <h3>${categoryIcons[report.category]} ${getCategoryName(report.category)}</h3>
            <span class="popup-badge ${severityClass}">${report.severity.toUpperCase()}</span>
            <p><strong>${report.description}</strong></p>
            <p class="popup-time">${timeAgo}</p>
        </div>
    `;
}

// Show detailed report view
function showReportDetails(report) {
    const timeAgo = getTimeAgo(report.timestamp);
    const severityClass = `severity-${report.severity}`;
    
    const details = `
        <div class="report-detail">
            <h3>${categoryIcons[report.category]} ${getCategoryName(report.category)}</h3>
            <div class="detail-row">
                <span class="detail-label">Severity:</span>
                <span class="popup-badge ${severityClass}">${report.severity.toUpperCase()}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Description:</span>
                <span class="detail-value">${report.description}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Reported:</span>
                <span class="detail-value">${timeAgo}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Location:</span>
                <span class="detail-value">${report.lat.toFixed(4)}, ${report.lng.toFixed(4)}</span>
            </div>
        </div>
    `;
    
    document.getElementById('reportDetails').innerHTML = details;
    document.getElementById('viewModal').style.display = 'block';
}

// Get category display name
function getCategoryName(category) {
    const names = {
        lighting: 'Broken Lighting',
        flooding: 'Flooding',
        'unsafe-crossing': 'Unsafe Crossing',
        debris: 'Debris/Obstruction',
        'extreme-weather': 'Extreme Weather',
        other: 'Other'
    };
    return names[category] || category;
}

// Calculate time ago
function getTimeAgo(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${days} day${days > 1 ? 's' : ''} ago`;
}

// Update statistics
function updateStats() {
    const now = Date.now();
    const last24h = reports.filter(r => now - r.timestamp < 86400000).length;
    
    document.getElementById('totalReports').textContent = reports.length;
    document.getElementById('last24h').textContent = last24h;
}

// Event listeners
document.getElementById('addReportBtn').addEventListener('click', () => {
    addingReport = true;
    document.body.style.cursor = 'crosshair';
    alert('Click anywhere on the map to place your report');
});

document.getElementById('myLocationBtn').addEventListener('click', () => {
    if (currentPosition) {
        map.setView(currentPosition, 15);
    } else {
        alert('Location not available. Please enable location access.');
    }
});

document.getElementById('filterCategory').addEventListener('change', (e) => {
    displayReports(e.target.value);
});

// Map click handler for adding reports
map.on('click', (e) => {
    if (!addingReport) return;

    const { lat, lng } = e.latlng;
    
    // Remove temporary marker if exists
    if (tempMarker) {
        map.removeLayer(tempMarker);
    }

    // Add temporary marker
    tempMarker = L.marker([lat, lng], {
        icon: L.divIcon({
            className: 'temp-marker',
            html: '<div style="font-size: 32px;">📍</div>',
            iconSize: [40, 40],
            iconAnchor: [20, 40]
        })
    }).addTo(map);

    // Show modal with location
    document.getElementById('reportModal').style.display = 'block';
    document.getElementById('reportModal').dataset.lat = lat;
    document.getElementById('reportModal').dataset.lng = lng;
    
    addingReport = false;
    document.body.style.cursor = 'default';
});

// Report form submission
document.getElementById('reportForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const modal = document.getElementById('reportModal');
    const lat = parseFloat(modal.dataset.lat);
    const lng = parseFloat(modal.dataset.lng);
    
    const newReport = {
        lat,
        lng,
        category: document.getElementById('category').value,
        description: document.getElementById('description').value,
        severity: document.getElementById('severity').value,
        anonymous: document.getElementById('anonymous').checked,
        timestamp: Date.now()
    };

    // Save to Firestore
    await saveReportToFirestore(newReport);
    
    // Remove temp marker
    if (tempMarker) {
        map.removeLayer(tempMarker);
        tempMarker = null;
    }

    // Reset form and close modal
    document.getElementById('reportForm').reset();
    modal.style.display = 'none';
    
    alert('Report submitted successfully! Everyone can now see it.');
});

// Modal close handlers
document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', function() {
        this.closest('.modal').style.display = 'none';
        if (tempMarker) {
            map.removeLayer(tempMarker);
            tempMarker = null;
        }
    });
});

document.getElementById('cancelBtn').addEventListener('click', () => {
    document.getElementById('reportModal').style.display = 'none';
    document.getElementById('reportForm').reset();
    if (tempMarker) {
        map.removeLayer(tempMarker);
        tempMarker = null;
    }
});

document.getElementById('closeView').addEventListener('click', () => {
    document.getElementById('viewModal').style.display = 'none';
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
        if (tempMarker) {
            map.removeLayer(tempMarker);
            tempMarker = null;
        }
    }
});

// Clean up listener when page unloads
window.addEventListener('beforeunload', () => {
    if (unsubscribe) {
        unsubscribe();
    }
});

// Initialize when page loads
window.addEventListener('load', initMap);
