/**
 * 
 */
var hull = new L.LatLng(53.775, -0.356);
var xhtoad;
var toadlist;
var toadlayers = [];

function initmap() {
	
	  console.log('map running');
	  // starting latitude and longitude for our map
	  
	 
	  
	  var position = new L.LatLng(0,30);
	
	  // starting zoom
	  var zoom = 4; 

	  var mapboxUrl = 'http://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png';
	    var midnight = new L.TileLayer(mapboxUrl, {
	    	maxZoom: 20,
	    	key: 'e328d58ac6c14fc2b3eaf9cbe762b3a7',
	    	styleId: 36105, 
	    	attribution: "Jay Bhosle"
    });
	  
	  var map = L.map('map', {
		    center: position,
		    zoom: 4,
		    layers: [midnight]
		}); 
	    
	  //popups  
      function onEachFeature(feature, layer) {
    	  
    	
    	  layer.on({
    	        mouseover: highlightFeature,

    	    });
    	  
    	  
    	  //icons class
    	  var LeafIcon = L.Icon.extend({
    		    options: {
        		    iconSize: [20, 20],
        		    iconAnchor: [10, 23],
        		    labelAnchor: [6, -17],
    	  			popupAnchor:  [-3, -76]
    		    }
    		});
    	  
    	  var greenIcon = new LeafIcon({iconUrl: 'images/green_arrow.png'}),
    	      redIcon = new LeafIcon({iconUrl: 'images/red_arrow.png'}),
    	      blueIcon = new LeafIcon({iconUrl: 'images/blue_arrow.png'});

    	  var myIcon2 = L.icon({
    		iconUrl: 'images/transparent.png',
  		    iconSize: [1, 1],
  		    iconAnchor: [10, 23],  
  		    labelAnchor: [3, 2] // as I want the label to appear 2px past the icon (10 + 2 - 6)
  		});
    	  
    	    // does this feature have a property 
    	  var label = "";
    	  var label2 = "";
	      if (feature.properties && feature.properties.market_name){
	    	  label2 += feature.properties.market_name+" <br> ";
	      }
	      if (feature.properties && feature.properties.retail_price){
	            label += feature.properties.wholesale_price;
	      }
//	      if (feature.properties && feature.properties.country){
//	            label += "<b>Country: </b>" + feature.properties.country + "<br>";
//	      }
	      if (label != "")
	      {
	    	  
	    	  layer.setIcon(myIcon2).bindLabel(label2 ,{ noHide: true }).addTo(map).showLabel();
	    	  
	    	  
	    	  if(parseInt(feature.properties.wholesale_price) < parseInt(feature.properties.avg_price))
	    	  { layer.setIcon(greenIcon).bindLabel(label ,{ noHide: true }).addTo(map).showLabel();
	    	  
	    	  }
	    	  else if(parseInt(feature.properties.wholesale_price) >  parseInt(feature.properties.avg_price))
	    	  { layer.setIcon(redIcon).bindLabel(label ,{ noHide: true }).addTo(map).showLabel();
	    	 
	    	  }
	    	  else
	    		layer.setIcon(blueIcon).bindLabel(label ,{ noHide: true }).addTo(map).showLabel();
	    		
	    	  // layer.bindPopup(label);
	    	  
	      }
	     // L.marker([-37.7772, 175.2606]).bindLabel(label ,{ noHide: true }).addTo(map).showLabel();
    	}
      	  

      var maizeLayer = L.geoJson(null,{onEachFeature: onEachFeature});
      var wheatLayer = L.geoJson(null,{onEachFeature: onEachFeature});
      var riceLayer = L.geoJson(null,{onEachFeature: onEachFeature});
      var sorghumLayer = L.geoJson(null,{onEachFeature: onEachFeature});
      
      function remove()
      {
    	  
    	  map.removeLayer( maizeLayer ); 
    	  map.removeLayer( wheatLayer ); 
    	  map.removeLayer( riceLayer ); 
    	  map.removeLayer( sorghumLayer ); 
    	  
      }
      
      //Button with for selecting type of crop
      $('.maize_button').click(function() {
    	  remove();
    	 // alert($(this).attr("id"));  
        	var maize = $(this).attr("id");
    	  $.getJSON(
  	            'http://jazzbom.cartodb.com/api/v2/sql?q=SELECT%20*%20FROM%20african_daily_prices%20where%20commodity=%20%27'+maize+'%27&format=geojson&callback=?',
  	            function(geojson) {
  	          $.each(geojson.features, function(i, feature) {
  	        	maizeLayer.addData(feature);        	
  	            });
  	        });
    	  maizeLayer.addTo(map);
      });
      
      
    //Button with for selecting type of crop
      $('.wheat_button').click(function() {
    	  remove();
    	 // alert($(this).attr("id"));
          
    	  remove();       
      	  var wheat = $(this).attr("id");
      	  
      	 $.getJSON(
   	            'http://jazzbom.cartodb.com/api/v2/sql?q=SELECT%20*%20FROM%20african_daily_prices%20where%20commodity=%20%27'+wheat+'%27&format=geojson&callback=?',
   	            function(geojson) {
   	          $.each(geojson.features, function(i, feature) {
   	        	wheatLayer.addData(feature);        	
   	            });
   	        });
      	wheatLayer.addTo(map);      
      	  
      	  
      });
      
    //Button with for selecting type of crop
      $('.rice_button').click(function() {
    	  remove();
    	 // alert($(this).attr("id"));         
      	  var rice = $(this).attr("id");
      	  
      	 $.getJSON(
   	            'http://jazzbom.cartodb.com/api/v2/sql?q=SELECT%20*%20FROM%20african_daily_prices%20where%20commodity=%20%27'+rice+'%27&format=geojson&callback=?',
   	            function(geojson) {
   	          $.each(geojson.features, function(i, feature) {
   	        	riceLayer.addData(feature);        	
   	            });
   	        });
      	riceLayer.addTo(map);       	  
      });
      
    //Button with for selecting type of crop
      $('.sorghum_button').click(function() {
    	  remove();
    	 // alert($(this).attr("id"));
          
    	  remove();        
      	  var sorghum = $(this).attr("id");
      	  
      	 $.getJSON(
   	            'http://jazzbom.cartodb.com/api/v2/sql?q=SELECT%20*%20FROM%20african_daily_prices%20where%20commodity=%20%27'+sorghum+'%27&format=geojson&callback=?',
   	            function(geojson) {
   	          $.each(geojson.features, function(i, feature) {
   	        	sorghumLayer.addData(feature);        	
   	            });
   	        });
      	sorghumLayer.addTo(map);      
      	  
      	  
      });
      
    	
        //custom display control
        var info = L.control();

        info.onAdd = function (map) {
            this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
            this.update();
            return this._div;
        };

        // method for updating the control based on feature properties given
        info.update = function (props) {


        	
            this._div.innerHTML = '<h2><left>Market Price Data</left></h2>' +  (props ?
            	'<left><h3>'+ props.commodity +' USD/Metric Tonne</h3><table border="0.5" width="100%" align="left" cellspacing="1"><tr><td><left><b> Market - </b></left></td><td><left> ' + props.market_name + ' </left></td></tr><tr><td><left><b> WholeSale Price - </b></left></th><td><left><b> $'+props.wholesale_price+' </b></left></td></tr><tr><td><left><b> Retail Price - </b></left></td>'+
            	'<td><left> $'+props.retail_price+' </left></td></tr><tr><td><left><b> Monthly average wholesale price - </b></left></td><td><left>$'+parseInt(props.avg_price)+'</left></td></tr>'+
            	'</table></left>'
                : '<center>Select a crop from the right panel <p> and hover over a market</center>');
            
        };

        info.addTo(map);
        
        function highlightFeature(e) {
 
            var layer = e.target;
            
           
            
            //console.log('layers--'+layer.feature.properties.market_name); // test to c data on mousevr
            requestChart(layer.feature.properties.country, layer.feature.properties.market_name,layer.feature.properties.wholesale_price,layer.feature.properties.commodity,25);
            info.update(layer.feature.properties);
            
        }
        
        minimal = new L.TileLayer('http://{s}.tiles.mapbox.com/v3/cartodb.map-1nh578vv/{z}/{x}/{y}.png', {
	    	maxZoom: 20,
  
	      attribution: "Jay Bhosle"
	      });
        
        var baseMaps = {
        	    "Minimal": minimal,
        	    "Night View": midnight
        	};

//        	var overlayMaps = {
//        	    "Maize": myLayer
//        	  //  "Minimal": minimal
//        	};
        	       	
        L.control.layers(baseMaps, null,{ position:'bottomleft' }).addTo(map);	
        
        
  	  //http:{s}.tiles.mapbox.com/v3/cartodb.map-1nh578vv/{z}/{x}/{y}.png
		  //'http://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png'
		  //'http://{s}.tiles.mapbox.com/v3/cartodb.map-1nh578vv/{z}/{x}/{y}.png'
	  
	  
	  // is our Leaflet map object
//	  var map = new L.Map('map').setView(position, zoom)
//	    , mapboxUrl = 'http://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png'
//	    //, mapboxUrl = 'http://tile.stamen.com/toner/{z}/{x}/{y}.jpg' 
//	    , midnight = new L.TileLayer(mapboxUrl, {
//	    	maxZoom: 20,
//			key: 'e328d58ac6c14fc2b3eaf9cbe762b3a7',
//			styleId: 36105, 
//	      attribution: "Jay Bhosle"
//	      });
//	  map.addLayer(midnight,true);
        
        
}