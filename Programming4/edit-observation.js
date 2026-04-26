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

function updateObservation(id, updatedData) {
    const observations = getAllObservations();
    const index = observations.findIndex(obs => obs.id === id);
    
    if (index !== -1) {
        observations[index] = updatedData;
        localStorage.setItem('userObservations', JSON.stringify(observations));
        return true;
    }
    
    return false;
}

function loadObservationData() {
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
    
 const currentUser = getCurrentUser();
    if (!currentUser || observation.observer !== currentUser.username) {
        alert('You can only edit your own observations!');
        window.location.href = 'observations.html';
        return;
    }
    
    document.getElementById('objectName').value = observation.objectName;
    document.getElementById('description').value = observation.description;
    document.getElementById('rightAscension').value = observation.rightAscension || '';
    document.getElementById('declination').value = observation.declination || '';
    document.getElementById('locationName').value = observation.locationName;
    document.getElementById('latitude').value = observation.latitude || '';
    document.getElementById('longitude').value = observation.longitude || '';
    document.getElementById('weather').value = observation.weather || '';
    document.getElementById('equipment').value = observation.equipment || '';
    document.getElementById('visibility').value = observation.visibility || '';
    
    if (observation.imageUrl) {
        const preview = document.getElementById('currentImagePreview');
        preview.innerHTML = `
            <img src="${observation.imageUrl}" alt="Current image" style="max-width: 200px; max-height: 200px; border-radius: 4px; border: 2px solid #ddd;">
        `;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('edit-observation.js loaded!');
    
    if (!isLoggedIn()) {
        alert('Please login first!');
        window.location.href = 'login.html';
        return;
    }

    checkLoginStatus();

    loadObservationData();

const imageUpload = document.getElementById('imageUpload');
let newImageUrl = '';

if (imageUpload) {
    imageUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert('Image is too large! Please select an image smaller than 2MB.');
                imageUpload.value = '';
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(event) {
                const img = new Image();
                img.onload = function() {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;
                    const maxSize = 800;
                    if (width > height) {
                        if (width > maxSize) {
                            height = height * (maxSize / width);
                            width = maxSize;
                        }
                    } else {
                        if (height > maxSize) {
                            width = width * (maxSize / height);
                            height = maxSize;
                        }
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    newImageUrl = canvas.toDataURL('image/jpeg', 0.7);
                    
                    console.log('Image compressed. Original size:', file.size, 'New size:', newImageUrl.length);
                    alert('New image uploaded and compressed successfully!');
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
}
    
    const form = document.getElementById('editObservationForm');
    if (!form) {
        console.error('Form not found!');
        return;
    }
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Form submitted!');
        
        const observationId = getObservationIdFromUrl();
        const originalObservation = getObservationById(observationId);
        
        if (!originalObservation) {
            alert('Observation not found!');
            return;
        }
        
        // 获取表单数据
        const updatedData = {
            id: originalObservation.id,
            objectName: document.getElementById('objectName').value,
            observer: originalObservation.observer,
            description: document.getElementById('description').value,
            rightAscension: document.getElementById('rightAscension').value,
            declination: document.getElementById('declination').value,
            locationName: document.getElementById('locationName').value,
            latitude: document.getElementById('latitude').value || '',
            longitude: document.getElementById('longitude').value || '',
            weather: document.getElementById('weather').value || '',
            equipment: document.getElementById('equipment').value || '',
            visibility: document.getElementById('visibility').value || '',
            imageUrl: newImageUrl || originalObservation.imageUrl,
            date: originalObservation.date,
            viewCount: originalObservation.viewCount || 0,  // Preserve view count
            modifiedDate: new Date().toISOString(),
            modificationReason: document.getElementById('modificationReason').value || ''
        };
        
        console.log('Updated observation data:', updatedData);
  
        if (updateObservation(observationId, updatedData)) {
            alert('Observation updated successfully!');
            window.location.href = `observation-detail.html?id=${observationId}`;
        } else {
            alert('Failed to update observation!');
        }
    });
});