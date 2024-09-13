const map = L.map('map').setView([12.2383, -1.5616], 7); // Centrer sur le Burkina Faso

// Configuration de la carte avec OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Définir les limites du Burkina Faso pour limiter la vue
const burkinaBounds = [[9.4106, -5.4707], [15.0840, 2.4089]]; // Sud-Ouest et Nord-Est
map.setMaxBounds(burkinaBounds);
map.on('drag', function() {
  map.panInsideBounds(burkinaBounds, { animate: false });
});

// Charger le fichier places.geojson
fetch('places.geojson')
  .then(response => response.json())
  .then(data => {
    // Vider la liste avant de la remplir
    const list = document.getElementById('list');
    list.innerHTML = '';

    data.features.forEach(feature => {
      const name = feature.properties.Lieu; // Nom du lieu
      const type = feature.properties.Type; // Type du lieu
      const ville = feature.properties.Ville; // Ville
      const coordinates = feature.geometry.coordinates; // Coordonnées du lieu
      
      if (name && type && ville) {
        // Créer un marqueur pour le lieu
        const marker = L.marker([coordinates[1], coordinates[0]]).addTo(map);
        marker.bindPopup(`<b>${name}</b><br>${type}<br>${ville}`);

        // Créer un élément dans la liste
        const listItem = document.createElement('div');
        listItem.className = 'item';
        listItem.textContent = `${name} (${type}) - ${ville}`; // Afficher le nom, type et ville

        // Gérer le clic sur l'élément de la liste
        listItem.onclick = () => {
          map.setView([coordinates[1], coordinates[0]], 15); // Centrer la carte sur le lieu
          marker.openPopup(); // Ouvrir la popup du marqueur
        };

        // Ajouter l'élément à la liste
        list.appendChild(listItem);
      } else {
        console.warn(`Propriétés manquantes: Nom=${name}, Type=${type}, Ville=${ville}`);
      }
    });
  })
  .catch(error => console.error('Erreur lors du chargement des données GeoJSON:', error));
