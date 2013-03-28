
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">

<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Insert title here</title>
<link rel="stylesheet" href="leaflet.css" />
 <!--[if lte IE 8]>
     <link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet-0.5/leaflet.ie.css" />
 <![endif]-->
<link rel="stylesheet" href="mainstyle.css" />

  <link rel="stylesheet" href="http://libs.cartocdn.com/cartodb.js/v2/themes/css/cartodb.css" />
  

 <script src="leaflet.js"></script>
 
 <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>
<script src="http://code.highcharts.com/highcharts.js"></script>

<script src="gray.js"></script>
<script src="chart.js"></script> 

 
 <script src="leaflet.label.js"></script>
<link href="leaflet.label.css" rel="stylesheet"/>
 
<script src="leaf.js" type="text/javascript" ></script>	
<script src="http://libs.cartocdn.com/cartodb.js/v2/cartodb.js"></script>
<script src="cartoDbDataFetcher.js" type="text/javascript" ></script>

</head>
<body onload="initmap()";>


<div id="pageWrapper">

	<div id="container"></div>
	<div id="mapContainer">

		<div id="map" ></div>
		
		<div id="right"> 
		
		
		
		<form action="">
		
		<input type="radio" name="Maize" value="Maize" id="Maize" onclick="fetchCartoData(this.value)">Maize<br>
		<input type="radio" name="Wheat" value="Wheat" id="Wheat" onclick="fetchCartoData(this.value)">Wheat<br>
		<input type="radio" name="Rice" value="Rice" id="Rice" onclick="fetchCartoData(this.value)">Rice<br>
		<input type="radio" name="Beans" value="Beans" id="Beans" onclick="fetchCartoData(this.value)">Beans<br>
		</form>
		
		
		
		</div>

	</div>

</div>




</body>
</html>
