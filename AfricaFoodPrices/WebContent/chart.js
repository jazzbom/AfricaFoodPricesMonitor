//$(document).ready(function() {

//var country,market_name,wholesale_price,rows;

function requestChart( country, market_name,wholesale_price,commodity,rows) {
	
	
	console.log('data-- '+country+' -- '+market_name+'--'+wholesale_price+'---'+rows);
	var url = 'http://jazzbom.cartodb.com/api/v2/sql?q=select%20wholesale_price,date%20from%20africa_commodities_history%20where%20market_name=%27'+market_name+'%27%20AND%20commodity=%27'+commodity+'%27%20AND%20country=%27'+country+'%27%20ORDER%20by%20date%20desc%20LIMIT%20'+rows+'&callback=?';
	console.log(url);
    var options = {
        chart: {
            renderTo: 'container',
            type: 'areaspline',
            backgroundColor: '#323232',
            marginRight: 110
        
        },
        title: {
            text: 'Africa Food Prices'
        },
        subtitle: {
            text: 'Source: Ratin.net'
        },
        credits: {
        	position: {
                align: 'right',
                x: -25
            },
            text: 'By Jay Bhosle',
        },
        tooltip: {
           enabled: false
           
        },
        xAxis: {
        	type: 'datetime',
//        	plotBands: [{ // mark the weekend
//        		events: {
//                    click: function(e) {
//                        $('#report').html(e.type);
//                    }
//                }
//            }],
//        	labels: {
//                formatter: function() {
//                	
//                	
//                    return this.name ;
//                }
//            }
        	},
        yAxis: {
        	title: { enabled: true,
                text: 'USD/MT',
                style: {
                    fontWeight: 'normal'
                }},
           
      	    tickInterval: 100
      	    },
      	  legend: {
              layout: 'vertical',
              align: 'right',
              verticalAlign: 'top',
              x: 0,
              y: 80,
              floating: true,
              shadow: true
          },
        	plotOptions: {
        		 series: {
        		        allowPointSelect: false
        		    },
        		line: {
        	        dataLabels: {
        	            enabled: false
        	        }
        	    }
        	},
        plotOptions: {
        	 areaspline: {
                 fillOpacity: 0.5
             }},
        series: [{
        	color: '#DB843D'
        }]
    };
        var i=0;
    $.getJSON(url, function(data) {
    	var mycars = [];
    	var date4Plot= [];
    	var month4Plot =[];
    	var year4Plot = []
    	$.each(data.rows, function(key, val) {
 
    		console.log(val.wholesale_price+' raw- '+val.date) ;
    		
    		var date = new Date(val.date).getTime();
    		console.log('Dateeee- '+date) ;
    		
    		
    		var date2 = new Date(val.date).getDate();
    		
    		//CartoDb2 api issue with json response. Dates being retrieved as decrements of the actual date.. hence need to add +1 to the retrived dates
    		date4Plot.push(date2+1);
    		
    		var month = new Date(val.date).getMonth();
    		month4Plot.push(month);
    		
    		var year = new Date(val.date).getFullYear();
    		year4Plot.push(year);
    		
    		console.log('--------0-0-0-0---'+date2+1+'  '+val.wholesale_price);
    		mycars.push([Date.UTC(year, month, date2+1), val.wholesale_price]);
    		
    	i++;
    	});
    	
    	
    	
    	console.log('-u-->'+mycars) ;
    	options.series[0].data = mycars;
    	
    	// set series name
    	options.series[0].name = country+'<br>'+market_name+'<br>'+commodity;
    	
    	
    	 if(commodity == 'Rice')
     	{
    		 options.yAxis.tickInterval = 500;
     	}
    	 if(wholesale_price >= 610 && commodity != 'Rice')
      	{
     		 options.yAxis.tickInterval = 200;
     		options.yAxis.min = 100;
      	} 

         console.log(date4Plot);
  
        var popup_toolTip;
        var chartPopup;
        var chart = new Highcharts.Chart(options);
        chart.xAxis[0].addPlotBand({
       	 from: Date.UTC(year4Plot[8], month4Plot[8], date4Plot[8]),
            to:  Date.UTC(year4Plot[0], month4Plot[0], date4Plot[0]),
            label: {
                text: 'PREDICTED FUTURE<br></br>PRICES',
                align: 'center',
                style: {
                	color: '#FFF',
        			font: '12px Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
                },
                y: 60
            },
            color: 'rgba(174, 173, 163, 0.2)',//d.blue'rgba(28, 2, 100, 0.5)',//yellow'rgba(251, 244, 50, 0.4)',//red'rgba(250, 38, 5, 0.5)',
            id: 'plot-band-future',
            
            zIndex: 5
            	
        });
        chart.xAxis[0].addPlotBand({
          	 from: Date.UTC(year4Plot[24], month4Plot[24], date4Plot[24]),
               to:  Date.UTC(year4Plot[8], month4Plot[8], date4Plot[8]),
               label: {
                   text: 'PRESENT PRICES',
                   align: 'center',
                   style: {
                   	color: '#FFF',
           			font: '12px Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
                   },
                   y: 60
               },
               events: {
                   
                   mouseover: function(e) {

//           	        e.preventDefault();
                	   popup_toolTip = new Messi('Click on chart to see how we calculated the future prices?', {center: false, viewport: {top: '95px', left: '600px'},width: '250px'});
                	   // popup = new Messi('This is a message with Messi.', {title: 'Title',center: false, viewport: {top: '100px', left: '0px'}});
                       
                   },
                   mouseout: function(e) {
                	   popup_toolTip.unload();
                   },
                   click: function(e){
                	   chartPopup = new Messi('The prices are calculated using a statistical modelling process. The current future prices were calculated using the Gaussian process. External factors like rainfall,temperature,economic conditons could be implemented to create a better prediction model but as of now the prices are purely based on time-series analysis using data mining algorithms. To find out more about the Gaussian Process <a href="http://en.wikipedia.org/wiki/Gaussian_process" >click here</a> to go to its Wikipedia entry.', {title: 'How we calculate the future prices?'});
                       
                   },
                   
               },
               color: 'rgba(174, 173, 163, 0.0)',//d.blue'rgba(28, 2, 100, 0.5)',//yellow'rgba(251, 244, 50, 0.4)',//red'rgba(250, 38, 5, 0.5)',
               id: 'plot-band-present',
               
               zIndex: 5
               	
           });
 
        console.log(date4Plot[8]+' Dat '+date4Plot[0]) ;
        console.log(month4Plot[8]+' Dat '+year4Plot[0]) ;
        // console.log(chart.series.data) ;
       
    });

  
}