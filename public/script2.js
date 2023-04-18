// Initialize and add the map
/*global google*/


let map;
let markers = [];
let drawingManager;
var selectedShapeList = [];
var coordenadas= [];

function setSelection(shape) {
    selectedShapeList.push(shape);
}

function deleteSelectedShape() {
    if (selectedShapeList) {
        for (let i = 0; i < selectedShapeList.length; i++) {
            selectedShapeList[i].setMap(null);
        }
    }

}

function setMapOnAll(map) {
    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
    markers =[];
}

function deleteMarkers(){
    setMapOnAll(null);
    deleteSelectedShape();
}



function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: -17.78629, lng: -63.18117 },
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    drawingManager = new google.maps.drawing.DrawingManager({
        drawingControl: true,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: [
                google.maps.drawing.OverlayType.POLYGON,
            ]
        },
        polygonOptions: {
            clickable: true,
            draggable: true,
            editable: true,
            fillColor: "#ADFF2F",
            fillOpacity: 0.5
        }
    });

    drawingManager.setMap(map);

    google.maps.event.addListener(drawingManager,'polygoncomplete',function (event){

        var len= event.getPath().getLength();

        for (var i=0;i<len;i++) {
            //console.log(event.getPath().getAt(i).toUrlValue(5));
            var coord = event.getPath().getAt(i).toUrlValue(5);
            let arr = coord.split(',')
            var location = new google.maps.LatLng(arr[0], arr[1]);
           //  const marker = new google.maps.Marker({
           //      position: location,
           //      map,
           //  });
           // markers.push(marker);
            const coordi = {

                "lat": parseFloat(arr[0]),
                "lng": parseFloat(arr[1])
            }
            coordenadas.push(coordi);

        };

        // coordenadas = [
        //     { lat: -17.76766, lng: -63.17147},
        //     {lat: -17.7809, lng: -63.16512},
        //     { lat: -17.78417, lng: -63.17413 },
        //     { lat: -17.76619, lng: -63.16736 },
        // ];
        console.log(coordenadas);

        var coordenadas1 = calcularPedro(coordenadas);
        event.setPath(coordenadas1);
        coordenadas= [];



    })

    google.maps.event.addListener(drawingManager,'overlaycomplete',function (e){
        if (e.type != google.maps.drawing.OverlayType.MARKER) {
            // Switch back to non-drawing mode after drawing a shape.
            drawingManager.setDrawingMode(null);

            // Add an event listener that selects the newly-drawn shape when the user
            // mouses down on it.
            var newShape = e.overlay;
            newShape.type = e.type;
            google.maps.event.addListener(newShape, 'click', function() {
                setSelection(newShape);
            });
            setSelection(newShape);
        }


    })

    document
        .getElementById("delete-markers")
        .addEventListener("click", deleteMarkers);
    //Adds a marker at the center of the map.
}



function calcularPedro(coordenadas) {
    // Definir la lista de coordenadas
    /*let coordenadas = [
        { latitud: 40.7128, longitud: -74.0060 },
        { latitud: 37.7749, longitud: -122.4194 },
        { latitud: 41.8781, longitud: -87.6298 },
        { latitud: 34.0522, longitud: -118.2437 },
    ];*/

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
    console.log("Coordenadas ordenadas:");
    for (let i = 0; i < coordenadas.length; i++) {
        console.log(`(${coordenadas[i].lat}, ${coordenadas[i].lng})`);
    }
    return coordenadas;
}



window.initMap = initMap;