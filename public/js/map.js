mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
        container: 'map',
        // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
        style: 'mapbox://styles/mapbox/streets-v12',
        center: userListing.geometry.coordinates,
        zoom: 9
});

console.log(userListing.geometry.coordinates);

const marker = new mapboxgl.Marker({color:'red'})
        .setLngLat(userListing.geometry.coordinates)
        .setPopup(new mapboxgl.Popup({ offset: 25 })
                .setHTML(`<h4>${userListing.location}</h4><p>Exact location provided after booking!</p>`))
    .addTo(map)
