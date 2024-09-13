// Initialisation de la carte
const map = L.map('map').setView([12.35, -1.53], 12);

// Ajouter la couche de tuiles OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Charger le fichier GeoJSON
fetch('places.geojson')
  .then(response => response.json())
  .then(data => {
    // Boucle à travers les lieux du fichier GeoJSON
    data.features.forEach(feature => {
      const name = feature.properties.Lieu; // Propriété 'Lieu'
      const type = feature.properties.Type; // Propriété 'Type'
      const coordinates = feature.geometry.coordinates; // Coordonnées

      console.log(`Nom: ${name}, Type: ${type}, Coordonnées: ${coordinates}`);

      if (name && type) {
        // Créer l'élément de la liste pour le lieu
        const listItem = document.createElement('div');
        listItem.className = 'item';
        listItem.textContent = `${name} (${type})`;

        // Gestionnaire de clic pour afficher le point et déplacer la carte
        listItem.onclick = () => {
          // Créer un marqueur seulement lorsque l'utilisateur clique
          const marker = L.marker([coordinates[1], coordinates[0]]).addTo(map);
          marker.bindPopup(`<b>${name}</b><br>${type}`);
          
          // Centrer la carte sur les coordonnées du lieu
          map.setView([coordinates[1], coordinates[0]], 15);
          
          // Ouvrir la popup pour le marqueur
          marker.openPopup();
        };

        // Ajouter l'élément à la liste
        document.getElementById('list').appendChild(listItem);
      } else {
        console.warn(`Propriétés manquantes: Nom=${name}, Type=${type}`);
      }
    });
  })
  .catch(error => console.error('Erreur lors du chargement des données GeoJSON:', error));
