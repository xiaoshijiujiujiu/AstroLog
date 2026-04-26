function getAllObservations() {
    const obsStr = localStorage.getItem('userObservations');
    return obsStr ? JSON.parse(obsStr) : [];
}

function getTopPopularObservations() {
    const observations = getAllObservations();
    
    // Sorting
    const sorted = observations.sort((a, b) => {
        const viewsA = a.viewCount || 0;
        const viewsB = b.viewCount || 0;
        return viewsB - viewsA;
    });
    return sorted.slice(0, 5);
}

function createGalleryItem(observation) {
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';
    galleryItem.style.cursor = 'pointer';
    
    if (observation.imageUrl) {
        const img = document.createElement('img');
        img.className = 'gallery-img';
        img.src = observation.imageUrl;
        img.alt = observation.objectName;
        galleryItem.appendChild(img);
    } else {
        const placeholder = document.createElement('div');
        placeholder.className = 'gallery-img';
        placeholder.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            font-size: 18px;
            text-align: center;
            padding: 20px;
            font-weight: bold;
        `;
        placeholder.textContent = observation.objectName;
        galleryItem.appendChild(placeholder);
    }
    
    galleryItem.addEventListener('click', function() {
        window.location.href = `observation-detail.html?id=${observation.id}`;
    });
    
    return galleryItem;
}

function loadPopularObservations() {
    const popularGallery = document.getElementById('popularGallery');
    
    if (!popularGallery) {
        console.error('Popular gallery container not found!');
        return;
    }
    
    const topObservations = getTopPopularObservations();
    
    console.log(`Found ${topObservations.length} popular observations`);
    
    if (topObservations.length > 0) {
        popularGallery.innerHTML = '';
        topObservations.forEach(observation => {
            const galleryItem = createGalleryItem(observation);
            popularGallery.appendChild(galleryItem);
        });
        
        console.log(`Loaded ${topObservations.length} popular observations`);
    } else {
        console.log('No user observations yet, showing static gallery');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('Home page loaded!');
    loadPopularObservations();
});