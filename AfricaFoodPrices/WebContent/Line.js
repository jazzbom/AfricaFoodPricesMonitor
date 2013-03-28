Ext.require('Ext.chart.*');
Ext.require(['Ext.Window', 'Ext.fx.target.Sprite', 'Ext.layout.container.Fit', 'Ext.window.MessageBox']);


Ext.define('User', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'wholesale_price',
        type: 'string'
    }, {
        name: 'date',
        dateFormat:'c',
        type: 'date'
    }]
});

Ext.onReady(function () {
	console.log('------1-------->') ;
	

	
	var jsonRequestUrl = 'http://devuser.localhost.lan:8080/api/v1/sql?q=select%20wholesale_price,date%20from%20kenya_commodities_history_copy%20where%20market_name=%27Mombasa%27%20LIMIT%2010';
	console.log('--------2------>') ;
	
	
//	function getStore (jsonRequestUrl) {
//		var store = new Ext.data.JsonStore ({
//			storeId: 'user',
//	        model: 'User',
//	        autoLoad: 'true',
//		    proxy    : new Ext.data.HttpProxy({ url: jsonRequestUrl, method: 'POST' }),
//		    root     : 'rows',
//		    successProperty : 'success',
//		    totalProperty   : "total_rows",
//		  //  idProperty      : "id",
//	
//		    fields : [
//		        {name: 'wholesale_price', type: 'string', mapping: 'wholesale_price'},
//		       // {name: 'date', dateFormat:'c', type: 'date', mapping: 'date'}
//		    ]
//		});
//		store.load();
//		console.log(store) ;
//		return store;
//		}
	
	
	var user = Ext.create('Ext.data.Store', {
        storeId: 'user',
        model: 'User',
        autoLoad: 'true',
        proxy: {
            type: 'ajax',
            url: jsonRequestUrl,
            reader: {
                type: 'json',
                root: 'rows'
            }
        }
    });
	
	
    //store1.loadData(generateData(8));
    
    var chart = Ext.create('Ext.chart.Chart', {
            xtype: 'chart',
            style: 'background:#fff',
            animate: true,
            store: user,
            id: 'user',
            shadow: true,
            legend: {
                position: 'right'
            },
//            axes: [{
//                type: 'Numeric',
//                minimum: 0,
//                position: 'left',
//                fields: ['wholesale_price'],
//                title: 'Number of Hits',
//                minorTickSteps: 1,
//                grid: {
//                    odd: {
//                        opacity: 1,
//                        fill: '#ddd',
//                        stroke: '#bbb',
//                        'stroke-width': 0.5
//                    }
//                }
//            }, {
//                type: 'Category',
//                position: 'bottom',
//                fields: ['date'],
//                title: 'Month of the Year'
//            }],
//            series: [{
//                type: 'line',
//                highlight: {
//                    size: 7,
//                    radius: 7
//                },
//                axis: 'left',
//                xField: 'date',
//                yField: 'wholesale_price',
//                markerConfig: {
//                    type: 'cross',
//                    size: 4,
//                    radius: 4,
//                    'stroke-width': 0
//                }
//            }]
            axes: [{
                type: 'Numeric',
                position: 'bottom',
                fields: ['wholesale_price'],
//                label: {
//                    renderer: Ext.util.Format.numberRenderer('0,0')
//                },
                title: 'Sample Values',
                grid: true,
                minimum: 386
            }, {
                type: 'Category',
                position: 'left',
                fields: ['date'],
                title: 'Sample Metrics'
            }],
            series: [{
                type: 'line',
                highlight: {
                    size: 7,
                    radius: 7
                },
                axis: 'left',
                xField: 'date',
                yField: 'wholesale_price',
                markerConfig: {
                    type: 'cross',
                    size: 4,
                    radius: 4,
                    'stroke-width': 0
                }
            }]
        });


    var win = Ext.create('widget.panel', {
        width: 800,
        height: 600,
        minHeight: 400,
        minWidth: 550,
        hidden: false,
        maximizable: true,
        title: 'Line Chart',
        renderTo: Ext.getBody(),
        layout: 'fit',
        tbar: [{
            text: 'Save Chart',
            handler: function() {
                Ext.MessageBox.confirm('Confirm Download', 'Would you like to download the chart as an image?', function(choice){
                    if(choice == 'yes'){
                        chart.save({
                            type: 'image/png'
                        });
                    }
                });
            }
        }, {
            text: 'Reload Data',
            handler: function() {
                store1.loadData(generateData(8));
            }
        }],
        items: chart
    });
});
