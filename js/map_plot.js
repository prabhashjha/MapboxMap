/*
Generate random numbers. Used for generating different shades of red for CSV files.
*/
function randomFromInterval(from,to)
{
    return Math.floor(Math.random()*(to-from+1)+from);
}
/*
Converting string file from PHP server into object. Used for all types of layers
*/
function StringtoXML(text){
    if (window.ActiveXObject){
        var doc=new ActiveXObject('Microsoft.XMLDOM');
        doc.async='false';
        doc.loadXML(text);
    } else {
        var parser=new DOMParser();
        var doc=parser.parseFromString(text,'text/xml');
    }
    return doc;
}
/*
Used for Hide and Show Control layers. Height and width values should match corresponding, values in CSS of index.html
*/
function setVisibility(id) {
    if(document.getElementById('bt1').value=='Hide Layers'){
	
        document.getElementById('bt1').value = 'Show Layers';
        document.getElementById('layerContents').style.display = 'none';
        document.getElementById(id).style.height = '90px';
        document.getElementById(id).style.width = '120px';
    }
    else{
	
        document.getElementById('bt1').value = 'Hide Layers';
        document.getElementById('layerContents').style.display = 'inline';
        document.getElementById(id).style.height = '450px';
        document.getElementById(id).style.width = '250px';
	
    }
}

var baselayer = L.tileLayer('http://{s}.tiles.mapbox.com/v3/examples.map-9ijuk24y/{z}/{x}/{y}.png');
var map = L.map('map', {
    center: [40, -95], //jackson, Mississippi
    zoom: 4,
    //important configuration for showing wms layer when added at current zoom levels.
    zoomAnimation:false,
    fadeAnimation:false,
    layers: baselayer
});
// ********* Start of highlight for 3 states ************/////////////
    // statesData comes from the 'us-states.js' script included above    
    var statesData_mini = new Object();    
    statesData_mini["type"] = statesData.type;    
    var features = new Array();
    features[0]=statesData.features[0]; //Alabama
   // features[1]=statesData.features[18]; //Louisiana
   // features[2]=statesData.features[24]; //Mississippi
    statesData_mini['features'] = features;
    
    var statesLayer = L.geoJson(statesData_mini,  {
        style: {
            weight: 2,
            opacity: 0.1,
            color: 'white',
            fillOpacity: 0.2,
            fillColor: 'brown'
        },
        onEachFeature: onEachFeature
    }).addTo(map);
    function onEachFeature(feature, layer) {
        layer.on({
            mousemove: mousemove,
            mouseout: mouseout
        });
    }

function mousemove(e) {
        var layer = e.target;
        // highlight feature
        layer.setStyle({
            weight: 3,
            opacity: 0.3,
            fillOpacity: 0.7
        });
        if (!L.Browser.ie && !L.Browser.opera) {
            layer.bringToFront();
        }
    }
    function mouseout(e) {
        statesLayer.resetStyle(e.target);
    }
  // ********* End of highlight for 3 states ************///////////// 
//var legend = L.control({position: 'bottomright'});
var wms_layer_name =[],layerpair=[],legendpair=[], global_legend = {Test: "Test"};


/*
Governs click functionality of all listed layers. layer overlay and legend overlay is controlled by this section.
*/
$(document).on('click', ".maplayer", function() {    
    if (this.checked ==false){
        map.removeLayer(layerpair[this.value]);
    }
    else if (this.checked ==true){
        map.addLayer(layerpair[this.value]);
    }
});
/*
Requesting WMS layer information from server.
*/  
$.ajax({
    url: "index.php?id=wms",
    async: true,
    context: document.body,
    success: function(data) {  
        
        var obj = JSON.parse(data);        
        for(var i=0; i<obj.length;i++)
        {
/*
adding layer information in global variable which is then controlled by click.
*/            
            layerpair[obj[i].title] = L.tileLayer.wms(obj[i].url, {
                format:obj[i].format,
                transparent: obj[i].transparent,
                layers: obj[i].layer
            });
            console.log(layerpair);
/*
Adding div related to WMS layer dynamically, to be displayed in layer information bar.
*/			
                $("#Overlays").append('<input class="maplayer" type="checkbox" value="'+ obj[i].title +'"  name="maplayer">'+ obj[i].title+'<br>');
        }
    }
});
