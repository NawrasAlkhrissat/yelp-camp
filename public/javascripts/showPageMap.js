const campgrounds = campground.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
const info = JSON.parse(campgrounds);
mapboxgl.accessToken =mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/outdoors-v12',
    zoom: 9,
    center:info.geometry.coordinates,
});
map.addControl(new mapboxgl.NavigationControl());


new mapboxgl.Marker()
        .setLngLat(info.geometry.coordinates)
        .setPopup(
            new mapboxgl.Popup({offset:25})
            .setHTML(
                `<h5>${info.title}</h5><p>${info.location}</p>`
            )
            .setMaxWidth("500px")
        )
        .addTo(map);