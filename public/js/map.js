mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    // You can add layers to the predetermined slots within the Standard style basemap.
    style: 'mapbox://styles/mapbox/standard', // Style URL
    center: coordinates, // starting position Longitude & Latitude
    zoom: 9,
});

// Create a default Marker and add it to the map.
const marker1 = new mapboxgl.Marker({color: 'red'})
.setLngLat(coordinates)
.setPopup(
    new  mapboxgl.Popup({offset: 25})
    .setHTML(`<h6>${title}</h6><p>Exact place after booking`)
)
.addTo(map);