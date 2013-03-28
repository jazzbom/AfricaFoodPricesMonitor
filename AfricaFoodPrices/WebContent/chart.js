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
           enabled: true
           
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
//        	plotBands: [{ // mark the weekend
//        		from: 0,
//        		to: 2000,
//        		events: {
//                    click: function(e) {
//                      //  $('#report').html(e.type);
//                       // new Messi('This is a message with Messi.', {title: 'Title'});
//                    	 
//                    	        alert('hello');
//                    	        e.preventDefault();
//                    	
//                    }
//                }
//            }],
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
    		//console.log(val.wholesale_price) ;
//    		console.log(data.rows[0]) ;
//    		shift = options.series[0].data.rows.length > 20;
    	   // obj_g = val_g;
    		//options.series[0].data = parseInt(val.wholesale_price);
    	
    	//	mycars[i] = parseInt(val.wholesale_price);
    		console.log(val.wholesale_price+' raw- '+val.date) ;
    		
    		var date = new Date(val.date).getTime();
    		console.log('Dateeee- '+date) ;
    		
//    		var dateOnly = new Date(date + (24 * 60 * 60 * 1000)).getDate();
//    		console.log(' kk '+dateOnly);
    		
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
//         options.xAxis.addPlotBand({
//        	 from:mycars[16],
//             to: mycars[25],
//             color: '#FCFFC5',
//             id: 'plot-band-1'
//         });
    	 	
    	  
//    	 $.getJSON(url,  function(data) {
//    			options.series[0].data = data.rows;
//    			var chart = new Highcharts.Chart(options);
//    		    });
    	//options.series[0].data = parseInt(data.wholesale_price);
         console.log(date4Plot);
    	// console.log('sorted '+date4Plot.sort());
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


//    chart.xAxis[0].addPlotBand({
//      	 from: Date.UTC(2013, 2, 14),
//           to:  Date.UTC(2013, 2, 28),
//           color: '#FCFFC5',
//           id: 'plot-band-1'
//       });
    
   // try jqplot
//    var cosPoints = [];
//    for (var i=0; i<2*Math.PI; i+=0.4){ 
//      cosPoints.push([i, Math.cos(i)]); 
//    }
//    console.log(cosPoints) ;
    

//  chart = new Highcharts.Chart({
//  chart: {
//      renderTo: 'container',
//      defaultSeriesType: 'spline',
//      events: {
//          load: requestData
//      }
//  },
//  title: {
//      text: 'Live random data'
//  },
//  xAxis: {
//      type: 'datetime',
//      tickPixelInterval: 150,
//      maxZoom: 20 * 1000
//  },
//  yAxis: {
//      minPadding: 0.2,
//      maxPadding: 0.2,
//      title: {
//          text: 'Value',
//          margin: 80
//      }
//  },
//  series: [{
//      name: 'Random data',
//      data: []
//  }]
//});        
//    
//    
//    function requestData() {
//    	$.getJSON(url, function(data_g) {
//    	$.each(data_g.rows, function(key_g, val_g) {
//    	    obj_g = val_g;
//    	     options.series[0].addPoint({
//    	        name: 'Wholesale',
//    	        y: obj_g.wholesale_price
//    	});
//    	console.log(obj_g.wholesale_price)
//    	});
//    	});
//    }
    
   
    
  
}




/**
 * Request data from the server, add it to the graph and set a timeout to request again
 */
//function requestData() {
//    $.ajax({
//        url: 'http://devuser.localhost.lan:8080/api/v1/sql?q=select%20wholesale_price%20from%20kenya_commodities_history_copy%20where%20market_name=%27Nairobi%27%20LIMIT%2010',
//        success: function(point) {
//            var series = chart.series[0],
//                shift = series.data.length > 20; // shift if the series is longer than 20
//
//
//
//
//            // add the point
//            chart.series[0].addPoint(point, true, shift);
//            
//            // call it again after one second
//            //setTimeout(requestData, 1000);    
//        },
//        cache: false
//    });
//}
//
//$(document).ready(function() {
//    chart = new Highcharts.Chart({
//        chart: {
//            renderTo: 'container',
//            defaultSeriesType: 'spline',
//            events: {
//                load: requestData
//            }
//        },
//        title: {
//            text: 'Live random data'
//        },
//        xAxis: {
//            type: 'datetime',
//            tickPixelInterval: 150,
//            maxZoom: 20 * 1000
//        },
//        yAxis: {
//            minPadding: 0.2,
//            maxPadding: 0.2,
//            title: {
//                text: 'Value',
//                margin: 80
//            }
//        },
//        series: [{
//            name: 'Random data',
//            data: []
//        }]
//    });        
//});
 

//$(function () {
//  var chart;
//  $(document).ready(function() {
//    var options = {
//    		chart: {
//              renderTo: 'container',
//              zoomType: 'x',
//              spacingRight: 20
//          },title:false,
////          title: {
////              text: 'USD to EUR exchange rate from 2006 through 2008'
////          },
////          subtitle: {
////              text: document.ontouchstart === undefined ?
////                  'Click and drag in the plot area to zoom in' :
////                  'Drag your finger over the plot to zoom in'
////          },
//          xAxis: {
//              type: 'datetime',
//              maxZoom: 14 * 24 * 3600000, // fourteen days
//              title: {
//                  text: null
//              }
//          },
//          yAxis: {
//              title: {
//                  text: 'Exchange rate'
//              },
//              showFirstLabel: false
//          },
//          tooltip: {
//              shared: true
//          },
//          legend: {
//              enabled: false
//          },
//          plotOptions: {
//              area: {
//                  fillColor: {
//                      linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
//                      stops: [
//                          [0, Highcharts.getOptions().colors[0]],
//                          [1, 'rgba(2,0,0,0)']
//                      ]
//                  },
//                  lineWidth: 1,
//                  marker: {
//                      enabled: false,
//                      states: {
//                          hover: {
//                              enabled: true,
//                              radius: 5
//                          }
//                      }
//                  },
//                  shadow: false,
//                  states: {
//                      hover: {
//                          lineWidth: 1
//                      }
//                  },
//                  threshold: null
//              }
//          },
//  
//      series: []
//    };  
//
//    $.getJSON('http://devuser.localhost.lan:8080/api/v1/sql?q=select%20wholesale_price%20from%20kenya_commodities_history_copy%20where%20market_name=%27Nairobi%27%20LIMIT%2010', function(data) {
//	  // Populate series
//	  options.series = data;    
//	  // Create the chart   
//
//      // Create the chart
//      var chart = new Highcharts.Chart(options);
//    });
//  });
//});





//(function($){ // encapsulate jQuery
//
//$(function () {
//    var chart;
////    $.getJSON('http://devuser.localhost.lan:8080/api/v1/sql?q=select%20wholesale_price%20from%20kenya_commodities_history_copy%20where%20market_name=%27Nairobi%27%20LIMIT%2010', function(data) {
////    	  // Populate series
////    	  options.series = data;    
////    	  // Create the chart
////    	  chart = new Highcharts.Chart(options);
////    	});
//    var my=0
//    $(document).ready(function() {
//
//    	  $.getJSON('http://devuser.localhost.lan:8080/api/v1/sql?q=select%20wholesale_price%20from%20kenya_commodities_history_copy%20where%20market_name=%27Nairobi%27%20LIMIT%2010', function(data) {
//          	  // Populate series
//          	   my = data;    
//         	  // Create the chart
//
//          	});    
//        chart = new Highcharts.Chart({ 
//        	
//        	
//        	
//            chart: {
//                renderTo: 'container',
//                zoomType: 'x',
//                spacingRight: 20
//            },title:false,
////            title: {
////                text: 'USD to EUR exchange rate from 2006 through 2008'
////            },
////            subtitle: {
////                text: document.ontouchstart === undefined ?
////                    'Click and drag in the plot area to zoom in' :
////                    'Drag your finger over the plot to zoom in'
////            },
//            xAxis: {
//                type: 'datetime',
//                maxZoom: 14 * 24 * 3600000, // fourteen days
//                title: {
//                    text: null
//                }
//            },
//            yAxis: {
//                title: {
//                    text: 'Exchange rate'
//                },
//                showFirstLabel: false
//            },
//            tooltip: {
//                shared: true
//            },
//            legend: {
//                enabled: false
//            },
//            plotOptions: {
//                area: {
//                    fillColor: {
//                        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
//                        stops: [
//                            [0, Highcharts.getOptions().colors[0]],
//                            [1, 'rgba(2,0,0,0)']
//                        ]
//                    },
//                    lineWidth: 1,
//                    marker: {
//                        enabled: false,
//                        states: {
//                            hover: {
//                                enabled: true,
//                                radius: 5
//                            }
//                        }
//                    },
//                    shadow: false,
//                    states: {
//                        hover: {
//                            lineWidth: 1
//                        }
//                    },
//                    threshold: null
//                }
//            },
//    
//        
//            
//            series: [{
//                type: 'area',
//                name: 'USD to EUR',
//                pointInterval: 24 * 3600 * 1000,
//                pointStart: Date.UTC(2006, 0, 01),
//                
//                data: my
//            }]
//        });
//    });
//    
//});
//    	
//    	
//})(jQuery);