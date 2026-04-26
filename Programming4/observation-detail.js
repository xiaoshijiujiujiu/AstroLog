// 检查登录状态
function checkLoginStatus() {
    const user = getCurrentUser();
    const userControls = document.getElementById('userControls');
    
    if (user) {
        userControls.innerHTML = `
            <span class="welcome-text">Welcome, ${user.username}!</span>
            <button onclick="logoutUser()" class="logout-btn">Logout</button>
        `;
    } else {
        userControls.innerHTML = `
            <button onclick="window.location.href='login.html'" class="login-btn-header">Login</button>
        `;
    }
}

function getObservationIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}


function getAllObservations() {
    const obsStr = localStorage.getItem('userObservations');
    return obsStr ? JSON.parse(obsStr) : [];
}

function getObservationById(id) {
    const observations = getAllObservations();
    return observations.find(obs => obs.id === id);
}

function incrementViewCount(id) {
    const observations = getAllObservations();
    const observation = observations.find(obs => obs.id === id);
    
    if (observation) {
        if (!observation.viewCount) {
            observation.viewCount = 0;
        }
        
        observation.viewCount += 1;
        
        localStorage.setItem('userObservations', JSON.stringify(observations));
        
        console.log(`View count for ${observation.objectName}: ${observation.viewCount}`);
    }
}

function deleteObservation(id) {
    if (!confirm('Are you sure you want to delete this observation?')) {
        return;
    }
    
    const observations = getAllObservations();
    const filteredObservations = observations.filter(obs => obs.id !== id);
    localStorage.setItem('userObservations', JSON.stringify(filteredObservations));
    
    alert('Observation deleted successfully!');
    window.location.href = 'observations.html';
}


function displayObservationDetail() {
    const observationId = getObservationIdFromUrl();
    
    if (!observationId) {
        alert('No observation ID provided!');
        window.location.href = 'observations.html';
        return;
    }
    
    const observation = getObservationById(observationId);
    
    if (!observation) {
        alert('Observation not found!');
        window.location.href = 'observations.html';
        return;
    }
    
    incrementViewCount(observationId);
    
    const detailContainer = document.getElementById('observationDetail');
    
    const currentUser = getCurrentUser();
    const isMyObservation = currentUser && observation.observer === currentUser.username;
    
    let imageHtml;
    if (observation.imageUrl) {
        imageHtml = `<img src="${observation.imageUrl}" alt="${observation.objectName}" style="width: 100%; height: 100%; object-fit: cover;">`;
    } else {
        imageHtml = `<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #f0f0f0; color: #999; font-size: 18px;">No Image Available</div>`;
    }
    
    let modificationHistory = '';
    if (observation.modifiedDate) {
        modificationHistory = `
            <div style="margin-top: 20px; padding: 15px; background: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
                <h4 style="margin: 0 0 10px 0; color: #856404;">Modification History</h4>
                <p style="margin: 5px 0; color: #856404;">
                    <strong>Modified:</strong> ${new Date(observation.modifiedDate).toLocaleString()}
                </p>
                ${observation.modificationReason ? `
                    <p style="margin: 5px 0; color: #856404;">
                        <strong>Reason:</strong> ${observation.modificationReason}
                    </p>
                ` : ''}
            </div>
        `;
    }
    
    const viewCountDisplay = `
        <p style="margin-top: 10px; color: #999; font-size: 14px;">
            Viewed ${observation.viewCount || 1} time${(observation.viewCount || 1) === 1 ? '' : 's'}
        </p>
    `;
    
    const actionButtons = isMyObservation ? `
        <div style="margin-top: 20px; display: flex; gap: 10px;">
            <button onclick="window.location.href='observations.html'" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">
                ← Back to Observations
            </button>
            <button onclick="window.location.href='edit-observation.html?id=${observation.id}'" style="padding: 10px 20px; background: #ffc107; color: #000; border: none; border-radius: 4px; cursor: pointer;">
                Edit
            </button>
            <button onclick="deleteObservation('${observation.id}')" style="padding: 10px 20px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer;">
                Delete
            </button>
        </div>
    ` : `
        <div style="margin-top: 20px;">
            <button onclick="window.location.href='observations.html'" style="padding: 10px 20px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer;">
                ← Back to Observations
            </button>
        </div>
    `;
    
    detailContainer.innerHTML = `
        <div class="image-box">
            ${imageHtml}
        </div>
        <section class="text-content">
            <h1>${observation.objectName} Observation</h1>
             ${viewCountDisplay}
            <h3>Observer: ${observation.observer}</h3>
           

            <p>${observation.description}</p>

            ${observation.rightAscension || observation.declination ? `
            <h3>Astronomical Coordinates</h3>
            <ul>
                ${observation.rightAscension ? `<li>Right Ascension: ${observation.rightAscension}</li>` : ''}
                ${observation.declination ? `<li>Declination: ${observation.declination}</li>` : ''}
            </ul>
            ` : ''}

            <h3>Observation Location</h3>
            <p>Location Name: ${observation.locationName}</p>
            ${observation.latitude || observation.longitude ? `
            <ul>
                ${observation.latitude ? `<li>Latitude: ${observation.latitude}</li>` : ''}
                ${observation.longitude ? `<li>Longitude: ${observation.longitude}</li>` : ''}
            </ul>
            ` : ''}

            ${observation.weather || observation.equipment || observation.visibility ? `
            <h3>Other Information</h3>
            <ul>
                ${observation.weather ? `<li>Weather: ${observation.weather}</li>` : ''}
                ${observation.equipment ? `<li>Equipment Used: ${observation.equipment}</li>` : ''}
                ${observation.visibility ? `<li>Visibility: ${observation.visibility}</li>` : ''}
            </ul>
            ` : ''}

            <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 14px;">
                Created on: ${new Date(observation.date).toLocaleString()}
            </p>
            
            ${modificationHistory}
            
            ${actionButtons}
        </section>
    `;
}


document.addEventListener('DOMContentLoaded', function() {
    if (!isLoggedIn()) {
        alert('Please login to view observation details!');
        window.location.href = 'login.html';
        return;
    }
    
    checkLoginStatus();
    displayObservationDetail();
});