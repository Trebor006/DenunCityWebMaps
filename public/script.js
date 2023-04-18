// Initialize and add the map
/*global google*/
let map;

let markers = [];
let markersPoligon= [];
let polygon;
let listaPolygon=[];


function initMap() {
    // eslint-disable-next-line no-undef
    const santacruz = {lat: -17.78629, lng: -63.18117};
    map = new google.maps.Map(document.getElementById("map"), {
        center: santacruz,
        zoom: 15
    });


    map.addListener("click", (event) => {
        //markersPoligon.push(new google.maps.LatLng(event.latLng.lat(),event.latLng.lng()));
        const coordi = {

            "lat": parseFloat(event.latLng.lat()),
            "lng": parseFloat(event.latLng.lng())
        }
        markersPoligon.push(coordi);
        addMarker(event.latLng);

    });


    document
        .getElementById("draw-polygon")
        .addEventListener("click", drawPoligon);
    document
        .getElementById("delete-markers")
        .addEventListener("click", deleteMarkers);

}
function drawPoligon(){
    //console.log(markersPoligon);
    var listaOrdenada= ordenarCoordenadas(markersPoligon);
        let polygonOptions = {
        path: listaOrdenada,
        //strokeColor: "#7CFC00",
    };
    polygon = new google.maps.Polygon(polygonOptions);
    listaPolygon.push(polygon);
    polygon.setMap(map);
    markersPoligon=[];
}



//const imgicon = "/img/green.png";
function addMarker(position) {
    const marker = new google.maps.Marker({
        position,
        //icon: imgicon,
        map,
    });
    markers.push(marker);

}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}


// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
    setMapOnAll(null);
    markers = [];
    listaPolygon.map(ele =>{
        ele.setMap(null);
    });
    // polygon.setMap(null);
    markersPoligon=[];

}

function ordenarCoordenadas(coordenadas){
    // Definir la lista de coordenadas
    // let coordenadas = [
    //     { latitud: 40.7128, longitud: -74.0060 },
    //     { latitud: 37.7749, longitud: -122.4194 },
    //     { latitud: 41.8781, longitud: -87.6298 },
    //     { latitud: 34.0522, longitud: -118.2437 },
    // ];

// Encontrar el centroide de la figura
    let centroide = { lat: 0, lng: 0 };
    for (let i = 0; i < coordenadas.length; i++) {
        centroide.lat += coordenadas[i].lat;
        centroide.lng += coordenadas[i].lng;
    }
    centroide.lat /= coordenadas.length;
    centroide.lng /= coordenadas.length;

// Calcular los ángulos entre cada punto y el centroide
    for (let i = 0; i < coordenadas.length; i++) {
        let vector1 = {
            lat: coordenadas[i].lat - centroide.lat,
            lng: coordenadas[i].lng - centroide.lng,
        };
        let vector2 = { lat: 1, lng: 0 }; // Vector de referencia en el meridiano de Greenwich
        let producto_cruzado =
            vector1.lat * vector2.lng - vector1.lng * vector2.lat;
        let producto_punto =
            vector1.lat * vector2.lat + vector1.lng * vector2.lng;
        coordenadas[i].angulo = Math.atan2(producto_cruzado, producto_punto);
    }

// Ordenar los puntos en función de sus ángulos
    coordenadas.sort(function (a, b) {
        return a.angulo - b.angulo;
    });

// Mostrar los puntos ordenados en la consola
//     console.log("Coordenadas ordenadas:");
//     for (let i = 0; i < coordenadas.length; i++) {
//         console.log(`(${coordenadas[i].lat}, ${coordenadas[i].lng})`);
//     }
    return coordenadas;
}
window.initMap = initMap;