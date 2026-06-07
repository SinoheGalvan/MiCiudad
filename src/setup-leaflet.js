import L from 'leaflet'
// leaflet.markercluster uses L as a browser global (window.L).
// This file must be imported before leaflet.markercluster.
window.L = L
