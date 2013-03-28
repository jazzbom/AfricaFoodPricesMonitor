
 var homeChart;
$(function () {

//var country,market_name,wholesale_price,rows,commodity;

	
	//console.log('data-- '+country+' -- '+market_name+'--'+wholesale_price+'---'+rows);
	
	
	
   

	 // var url = 'http://devuser.localhost.lan:8080/api/v1/sql?q=SELECT%20price_index,country,commodity%20FROM%20africa_price_index%20where%20commodity%20=%20%27Maize%27&callback=?';
	  	
  	//console.log(a[i]);
     


	homeChart = new Highcharts.Chart({
        chart: {
            renderTo: 'container',
            type: 'column',
            backgroundColor: '#323232',
            marginRight: 110
        },
        title: {
            text: 'Africa Food Prices'
        },
        subtitle: {
            text: 'Source: Ratin.net<br>Food Price Index'
        },
        credits: {
        	position: {
                align: 'right',
                x: -25
            },
            text: 'By Jay Bhosle',
        },
        tooltip: {
           enabled: true
           
        },
        xAxis: {
            categories: [
                'BURUNDI',
                'KENYA',
                'RWANDA',
                'TANZANIA',
                'UGANDA'    
            ]
        },
        yAxis: {
            min: 0,
            title: {
                text: 'USD / MT'
            },
        tickInterval: 300
        },
        legend: {
            layout: 'vertical',
            backgroundColor: 'rgba(48, 48, 48, 0.8)',
            align: 'right',
            verticalAlign: 'top',
            x: 0,
            y: 60,
            floating: true,
            shadow: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
//        	yAxis: {
//        	title: {
//        	text: 'USD'
//        	},
//        	labels: {
//        	formatter: function() {
//        	return this.value +'USD'
//        	}
//        	}
//        	}, 
        series: [ ]
	 });

	var maizeCrop = 'Maize';
    		  var maizeUrl = 'http://jazzbom.cartodb.com/api/v2/sql?q=SELECT%20price_index,country,commodity%20FROM%20africa_price_index%20where%20commodity%20=%20%27'+maizeCrop+'%27%20ORDER%20BY%20country&callback=?';

    	        $.getJSON(maizeUrl, function(data) {
    	        	
    	        	
    	        	var maize = {
    	                    id: 'series',
    	                    name: 'Maize',
    	                    data: [],
    	                    color: 'rgba(255,116,0,0.8)'
    	                    }
    	        	

    	        	$.each(data.rows, function(key, val) {
    	        		//console.log('-koko-->'+data.rows[0]) ;
    	        		
    	        		maize.data.push(parseInt(val.price_index));
    	   
    	        	});
    	        	homeChart.addSeries(maize);

    	        	    
    	        });
    		  
    		  
    	        
    	        var wheatCrop = 'Wheat';        
var wheatUrl = 'http://jazzbom.cartodb.com/api/v2/sql?q=SELECT%20price_index,country,commodity%20FROM%20africa_price_index%20where%20commodity%20=%20%27'+wheatCrop+'%27%20ORDER%20BY%20country&callback=?';
    		  	
    	    	//console.log(a[i]);
    	        $.getJSON(wheatUrl, function(data) {    	
    	        	
    	        	var wheat = {
    	                    id: 'series2',
    	                    name: 'Wheat',
    	                    data: [],
    	                    color: 'rgb(165,42,42)'
    	          
    	                    }
    	        	$.each(data.rows, function(key, val) {
    	        			        		
    	        		wheat.data.push(parseInt(val.price_index));
    	   
    	        	});
    	        	homeChart.addSeries(wheat);
   
    	        });
var riceCrop = 'Rice';    	        
var ricetUrl = 'http://jazzbom.cartodb.com/api/v2/sql?q=SELECT%20price_index,country,commodity%20FROM%20africa_price_index%20where%20commodity%20=%20%27'+riceCrop+'%27%20ORDER%20BY%20country&callback=?';
    		  	
    	    	//console.log(a[i]);
    	        $.getJSON(ricetUrl, function(data) {    	
    	        	
    	        	var rice = {
    	                    id: 'series3',
    	                    name: 'Rice',
    	                    data: [],
    	                    color: 'rgb(128,0,0)'
    	              
    	                    }
    	        	$.each(data.rows, function(key, val) {
    	        			        		
    	        		rice.data.push(parseInt(val.price_index));
    	   
    	        	});
    	        	homeChart.addSeries(rice);
   
    	        });  	        

    	        var sorghumCrop = 'Sorghum';    	        
    	        var sorghumUrl = 'http://jazzbom.cartodb.com/api/v2/sql?q=SELECT%20price_index,country,commodity%20FROM%20africa_price_index%20where%20commodity%20=%20%27'+sorghumCrop+'%27%20ORDER%20BY%20country&callback=?';
    	            		  	
    	            	    	//console.log(a[i]);
    	            	        $.getJSON(sorghumUrl, function(data) {    	
    	            	        	
    	            	        	var sorghum = {
    	            	                    id: 'series3',
    	            	                    name: 'Sorghum',
    	            	                    data: [],
    	            	                   color: 'rgb(255,215,0)'
    	            	              
    	            	                    
    	            	                    }
    	            	        	$.each(data.rows, function(key, val) {
    	            	        			        		
    	            	        		sorghum.data.push(parseInt(val.price_index));
    	            	   
    	            	        	});
    	            	        	homeChart.addSeries(sorghum);
    	           
    	            	        });  	      	        
    	        
    	        
//    	      var wheat = [];
//    	      var crop2 = 'Wheat';
//      		  var url = 'http://devuser.localhost.lan:8080/api/v1/sql?q=SELECT%20price_index,country,commodity%20FROM%20africa_price_index%20where%20commodity%20=%20%27'+crop2+'%27&callback=?';
//      		  	
//      	    	//console.log(a[i]);
//      	        $.getJSON(url, function(data) {
//
//      	        	$.each(data.rows, function(key, val) {
//      	        		//console.log('-koko-->'+data.rows[0]) ;
//      	        		
//      	        		wheat.push(parseInt(val.price_index));
//      	   
//      	        	});
//      	        	
////      	        	    console.log('end-->'+maize) ;
//      	        	    options.series[1].data = wheat;
//      	        		options.series[1].name = 'Wheat';
//      	        	    
//      	        	    console.log('end-->'+wheat) ;
//      	        	    chart = new Highcharts.Chart(options);
//      	        });
//    	  
    	

 
  






});