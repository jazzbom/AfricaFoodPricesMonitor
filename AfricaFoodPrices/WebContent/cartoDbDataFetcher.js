
function fetchClick(img) {
	
		console.log('DOM0 click on ' + img.id);
		var commodity ;
  		commodity = img.id;
  		var maizeLayer;
		//Ref. CardoDB API doc											
	    $.getJSON(
	            'http://devuser.localhost.lan:8080/api/v1/sql?q=SELECT%20*%20FROM%20african_daily_prices%20where%20commodity=%20%27'+commodity+'%27&format=geojson&callback=?',
	            function(geojson) {
	          $.each(geojson.features, function(i, feature) {
	        	 
	        	  	maizeLayer = L.geoJson(feature, {
	            	    onEachFeature: onEachFeature
	            	});
	        	  
	        	  
	        	  
	        	 // map.addLayer(maizeLayer,false);
	        	  
//	        	  L.geoJson(feature, {
//	          	    onEachFeature: onEachFeature
//	          	}).addTo(map);
	            
	        	  
	            });
	        });

}

//
//var store = function getData()
//{
//	return fetchClick(img);
//}
//
//console.log('-->'+store);

//
//function fetchCartoData(thevalue)
//        	{
//        		 var x=document.getElementById(thevalue).value;
//        		 alert(x);
//        		
//        	}