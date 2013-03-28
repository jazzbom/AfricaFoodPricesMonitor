/**
 * 
 */
package model;

/**
 * @author jayBhosle
 *
 */


import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

import weka.classifiers.evaluation.NumericPrediction;
import weka.classifiers.functions.GaussianProcesses;
import weka.classifiers.timeseries.WekaForecaster;
import weka.classifiers.timeseries.core.TSLagMaker;
import weka.core.Instances;
import weka.core.converters.DatabaseLoader;

import au.com.bytecode.opencsv.CSVReader;

import com.cartodb.CartoDBClientIF;
import com.cartodb.CartoDBException;
import com.cartodb.impl.ApiKeyCartoDBClient;
import com.cartodb.impl.CartoDBClient;
import com.cartodb.model.CartoDBResponse;

public class AfricaDbPriceUpdator {

	private CartoDBClientIF cartoDBCLient;
	private String[] countries = {"KENYA","TANZANIA","UGANDA","RWANDA","BURUNDI"};
	private String[] crops =  {"Maize","Sorghum", "Wheat", "Rice"};
	
//	String[] countries = {"KENYA"};// remove later
//	String[] crops =  {"Maize"};
	
	public int avgDur = 30;  

	private PreparedStatement preparedStatement;
	
    private Connection conn ;
    
    DatabaseLoader db ;
    
    
	//Constructor
	public AfricaDbPriceUpdator() throws CartoDBException, ClassNotFoundException, SQLException 
	{	
			// Embedded H2DB conection settings
			Class.forName("org.h2.Driver");
			this.conn = DriverManager.getConnection("jdbc:h2:~/test", "sa", "");
			this.preparedStatement = null;
			
			//CartoDB connection settings
			this.cartoDBCLient= new ApiKeyCartoDBClient("jazzbom","748ccc1a0e8cb5bbd1489b29510fb70f60513fff");
			
			// Weka db data loader settings
			try {
				this.db = new DatabaseLoader();
			} catch (Exception e) {
				e.printStackTrace();
				System.out.println("Weka SQL Database loader error! check embedded H2 DB connection || insert/select stmt issue ");
			}
			this.db.setCustomPropsFile(new File("DatabaseUtils.props"));
			this.db.setUser("sa");
		    this.db.setPassword("");
		
	}
	
	/*
	 * Updates Archive history of prices
	 */
	public void updatorPricesArchive() throws IOException, CartoDBException, ParseException
	{
		System.out.println(countries.length +" cropsleng= "+crops.length);
		
		for(int i=0; i < countries.length; i++ )
		{	
			
			for(int j=0; j < crops.length; j++ ) 
			{
				String crop = crops[j];
				CartoDBResponse<Map<String, Object>> req = cartoDBCLient.request("SELECT market_name FROM africa_commodities_history where country = '"+countries[i]+"' group by market_name");
				System.out.println("total- "+req.getTotal_rows());
				
				Map<String,Date> marketDates = new TreeMap<String,Date>();
				
				for(int k1=0; k1 < req.getTotal_rows(); k1++)
				{
					
					try{
					String market = (String)req.getRows().get(k1).get("market_name");
					CartoDBResponse<Map<String, Object>> seq = cartoDBCLient.request("SELECT market_name,date FROM africa_commodities_history where market_name='"+market+"' AND commodity='"+crop+"' AND country = '"+countries[i]+"' AND future=false order by date desc limit 1");
					System.out.println("total- "+seq.getTotal_rows());
					String marketName = (String)seq.getRows().get(0).get("market_name");
					String date2 = (String)seq.getRows().get(0).get("date");

					
					Date date = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", Locale.ENGLISH).parse(date2);
					
					System.out.println(marketName+ " "+date);
					
					
					
					marketDates.put(marketName, date);
					
					
					}
					
					catch(IndexOutOfBoundsException e)
					{}
					
				}
				System.out.println(marketDates.entrySet());
				
				String csvFilename = ""+countries[i]+"_"+crops[j]+"_current.csv"; // reads file and feeds data into CartoDB 
			
				CSVReader csvReader = new CSVReader(new FileReader(csvFilename), ',', '\'', 1);
			
				
				String[] col = null;

				
			System.out.println("CartoDB update process started ......"+countries[i]+"_"+crops[j]+"_current.csv");
			
			
			while((col = csvReader.readNext()) != null) 
			{		
				
				String newmarket = col[1];
				Date newDate = new SimpleDateFormat("yyyy-MM-dd", Locale.ENGLISH).parse(col[4]);
				
				System.out.println(newmarket+" --- "+newDate);
				
				Date oldDate = marketDates.get(newmarket);
				
				try{
				if(newDate.after(oldDate)){
					System.out.println("WALALALAL "+newDate+" - - -"+oldDate);
					
					// updates the prices archive from scrapped data
					System.out.println(cartoDBCLient.executeQuery("INSERT INTO africa_commodities_history (commodity,country,date,market_name,retail_price,wholesale_price,future) VALUES ('"+crop+"','"+col[0]+"', to_timestamp(' "+col[4]+" ', 'YYYY MM DD') ,'"+col[1]+"',"+col[2]+","+col[3]+",false) "));
				}
				}
				catch(IndexOutOfBoundsException  | NullPointerException e)
				{
					System.out.println("This Crop doesnt exist yet! ");
					System.out.println(cartoDBCLient.executeQuery("INSERT INTO africa_commodities_history (commodity,country,date,market_name,retail_price,wholesale_price,future) VALUES ('"+crop+"','"+col[0]+"', to_timestamp(' "+col[4]+" ', 'YYYY MM DD') ,'"+col[1]+"',"+col[2]+","+col[3]+",false) "));

				}
				
			}
			
			csvReader.close();	// file reader end
			System.out.println("Update finished");
			
			}
		
		}
	}
	
	void updateCurrentPrices() throws CartoDBException
	{
		
		System.out.println(countries.length +" cropsleng= "+crops.length);
		
		for(int i=0; i < countries.length; i++ )
		{		
			for(int j=0; j < crops.length; j++ ) 
			{
				String country = countries[i];
				String crop = crops[j];
				CartoDBResponse<Map<String, Object>> res = cartoDBCLient.request("SELECT commodity,market_name FROM african_daily_prices where country='"+country+"'");//AND commodity ='"+crop+"'");
				System.out.println("total- "+res.getTotal_rows());

				for(int c=0; c < res.getTotal_rows(); c++)
				{
					System.out.println("----> "+res.getRows().get(c).get("market_name"));			
					String market = (String)res.getRows().get(c).get("market_name");
					//String commodity = (String)res.getRows().get(c).get("commodity");					
					System.out.println("----> "+crop);
					
					System.out.println("update african_daily_prices SET date = subquery.date,retail_price= subquery.retail_price,wholesale_price = subquery.wholesale_price from (SELECT * FROM africa_commodities_history where market_name='"+market+"' AND commodity='"+crop+"' AND country='"+country+"' AND future=false order by date DESC limit 1)AS subquery where african_daily_prices.market_name = subquery.market_name AND african_daily_prices.commodity = subquery.commodity");
					
					System.out.println(cartoDBCLient.executeQuery(" Update african_daily_prices SET date = subquery.date,retail_price= subquery.retail_price,wholesale_price = subquery.wholesale_price from (SELECT * FROM africa_commodities_history where market_name='"+market+"' AND commodity='"+crop+"' AND country='"+country+"' AND future=false order by date DESC limit 1)AS subquery where african_daily_prices.market_name = subquery.market_name AND african_daily_prices.commodity = subquery.commodity") );
				
				
					
				}
			}
		}
		
		
	}
	
	
	
	void calculateAvg() throws CartoDBException
	{
		
		for(int i=0; i < countries.length; i++ )
		{		
			for(int j=0; j < crops.length; j++ ) 
			{
				String country = countries[i];
				String crop = crops[j];
				CartoDBResponse<Map<String, Object>> res = cartoDBCLient.request("SELECT commodity,market_name FROM african_daily_prices where country='"+country+"'");
				System.out.print("total- "+res.getTotal_rows());
				for(int c=0; c < res.getTotal_rows(); c++)
				{
					System.out.println("----> "+res.getRows().get(c).get("market_name"));
					
					String market = (String)res.getRows().get(c).get("market_name");
				//	String commodity = (String)res.getRows().get(c).get("commodity");
					
					//System.out.println("----> "+res.getRows().get(c).get("commodity"));
					System.out.println(crop);
					System.out.println(" SELECT avg(wholesale_price) OVER() FROM "+country+"_commodities_history WHERE date > (NOW() - INTERVAL '"+avgDur+" day' ) AND market_name = '"+market+"' AND commodity ='"+crop+"' group by market_name,date,country,wholesale_price LIMIT 1 ");
					try{
					// calculates average price index
					CartoDBResponse<Map<String, Object>> rus = cartoDBCLient.request(" SELECT avg(wholesale_price) OVER() FROM africa_commodities_history WHERE date > (NOW() - INTERVAL '"+avgDur+" day' ) AND market_name = '"+market+"' AND commodity ='"+crop+"' AND country='"+country+"' AND future=false group by market_name,date,country,wholesale_price LIMIT 1 ");
					//System.out.println("--running--> "+rus.getTotal_rows());

					System.out.println("UPDATE african_daily_prices SET (avg_price) = ( round( CAST(float8 '"+rus.getRows().get(0).get("avg")+"' as integer), 0) ) WHERE market_name = '"+market+"' AND commodity= '"+crop+"'"  );
					System.out.println(cartoDBCLient.executeQuery("UPDATE african_daily_prices SET (avg_price) = ( round( CAST(float8 '"+rus.getRows().get(0).get("avg")+"' as numeric), 2) ) WHERE market_name = '"+market+"' AND commodity= '"+crop+"'"  )  );
					}
					catch(IndexOutOfBoundsException e)
					{
						System.out.println("This crop data doesn't exist moving on.....");
					}
					
					
					
				}

			}
		}
		System.out.println(" current prices updated with average prices ");
	}
	
	/*
	 * Note: TO BE USED on new installations only
	 */
	void insertNewData() throws IOException, CartoDBException
	{
		
		
		for(int i=0; i < countries.length; i++ )
		{		
			for(int j=0; j < crops.length; j++ ) 
			{

				String csvFilename = "F:/AfricaProjectEclipse/RubyTest/"+countries[i]+"_"+crops[j]+"_history.csv"; // reads file and feeds data into CartoDB 
				//String csvFilename = "F:/AfricaProjectEclipse/RubyTest/"+countries[i]+"_"+crops[j]+"_current.csv";
				CSVReader csvReader = new CSVReader(new FileReader(csvFilename), ',', '\'', 1);
				String country = countries[i];
				String crop = crops[j];
				String[] col = null;

				
				System.out.println("CartoDB insert new records.. process started ......"+countries[i]+"_"+crops[j]+"_history.csv");
			
			
				while((col = csvReader.readNext()) != null) 
					{		
					try {
						//System.out.println(cartoDBCLient.executeQuery("INSERT INTO african_daily_prices (commodity,country,date,market_name,retail_price,wholesale_price) VALUES ('"+crop+"','"+col[0]+"', to_timestamp(' "+col[4]+" ', 'YYYY MM DD') ,'"+col[1]+"',"+col[2]+","+col[3]+") "));
						System.out.println(cartoDBCLient.executeQuery("INSERT INTO africa_commodities_history (commodity,country,date,market_name,retail_price,wholesale_price,future) VALUES ('"+crop+"','"+col[0]+"', to_timestamp(' "+col[4]+" ', 'YYYY MM DD') ,'"+col[1]+"',"+col[2]+","+col[3]+",false) "));
					} catch (IndexOutOfBoundsException  | NullPointerException e ) {
						//System.out.println(cartoDBCLient.executeQuery("INSERT INTO african_daily_prices (commodity,country,date,market_name,retail_price,wholesale_price) VALUES ('"+crop+"','"+col[0]+"', to_timestamp(' "+col[4]+" ', 'YYYY MM DD') ,'"+col[1]+"',"+col[2]+","+col[3]+") "));

						System.out.println(cartoDBCLient.executeQuery("INSERT INTO africa_commodities_history (commodity,country,date,market_name,retail_price,wholesale_price,future) VALUES ('"+crop+"','"+col[0]+"', to_timestamp(' "+col[4]+" ', 'YYYY MM DD') ,'"+col[1]+"',"+col[2]+","+col[3]+",false) "));

					}
					}
				csvReader.close();	// file reader end
				System.out.println("Insertion finished");
				
				
			}
		}
		
		
	}
	
	
	
	void calculatePriceIndex() throws CartoDBException
	{
		
		System.out.println(cartoDBCLient.executeQuery("TRUNCATE africa_price_index"));
		
		for(int i=0; i < countries.length; i++ )
		{		
			for(int j=0; j < crops.length; j++ ) 
			{
				try{
				String country = countries[i];
				String crop = crops[j];
				CartoDBResponse<Map<String, Object>> req = cartoDBCLient.request("SELECT country,commodity,avg(wholesale_price) OVER() FROM african_daily_prices where  country = '"+country+"' and commodity='"+crop+"' LIMIT 1");
				System.out.println("total- "+req.getTotal_rows());
				
				
				String country2 = (String)req.getRows().get(0).get("country");
				
				String commodity = (String)req.getRows().get(0).get("commodity");
				
				System.out.println("INSERT INTO africa_price_index (commodity,country,price_index) VALUES ('"+commodity+"','"+country2+"',"+req.getRows().get(0).get("avg")+") ");
				
				System.out.println(cartoDBCLient.executeQuery("INSERT INTO africa_price_index (commodity,country,price_index) VALUES ('"+commodity+"','"+country2+"',"+req.getRows().get(0).get("avg")+") "));
				}
				catch(IndexOutOfBoundsException | NullPointerException e)
				{
					System.out.println("This crop data doesn't exist moving on.....");
				}
				
				
				
			}
		}
		
	}
	
	
	
	
	/*
	 * Implements the WEKA machine learning tool (Data Mining) to predict future crops prices
	 */
	void  predictFuturePrices() throws SQLException, CartoDBException
	{
		System.out.println("Generating crop prices predictions....");
		
		for(int i=0; i < countries.length; i++ )
		{	
			
			for(int j=0; j < crops.length; j++ ) 
			{
				String crop = crops[j];
				CartoDBResponse<Map<String, Object>> req = cartoDBCLient.request("select DISTINCT  market_name from  africa_commodities_history where country ='"+countries[i]+"'");
				
				System.out.println("total- "+req.getTotal_rows());
				
				for(int k=0; k < req.getTotal_rows(); k++)
				{
					String market = (String)req.getRows().get(k).get("market_name");
					
					System.out.println("inside");

					System.out.println("SELECT DISTINCT on (date) market_name,wholesale_price,date,commodity,future from  africa_commodities_history where country ='"+countries[i]+"' AND market_name='"+market+"' AND commodity='"+crop+"' AND future= false order by date ");
					try{
					CartoDBResponse<Map<String, Object>> get = cartoDBCLient.request("SELECT DISTINCT on (date) market_name,wholesale_price,date,commodity,future from  africa_commodities_history where country ='"+countries[i]+"' AND market_name='"+market+"' AND commodity='"+crop+"' AND future= false order by date ");
					
				
					System.out.println("total2- "+get.getTotal_rows());
					String date = null;
					for(int k1=1; k1 <= get.getTotal_rows(); k1++)
					{
						try{
						String market2 = (String)get.getRows().get(k1).get("market_name");
						 date = (String)get.getRows().get(k1).get("date");
						int wholesale_price = (int)get.getRows().get(k1).get("wholesale_price");
					
						
							
							
							System.out.println("k-- "+k1);
							System.out.println("k-- "+countries[i]+" ,"+crop+" "+market2+" "+wholesale_price+" "+date);
							
							
							updateH2DBForWeka(countries[i],crop,market2,wholesale_price,date);
							
							} catch (IndexOutOfBoundsException e) {
								System.out.println("k-- "+k1);
								System.out.println(" "+date);
							System.out.println("check updateH2DBForWeka funcion! possible sql data/stmt/conn issue ");
							System.out.println();
							e.printStackTrace();
						
							}
			        
			       
					}
					// weka fn here
					 generatePredictions(countries[i],crop,market);
					}
					catch(IndexOutOfBoundsException e)
					{
						e.printStackTrace();
						System.out.println("This crop data doesn't exist moving on.....");
					}
					
				}
			}
		}
		 conn.close(); // close embedded h2db connection

		
	}
	
	/*
	 * updates the Embedded H2 database for use with Weka
	 */
	private void updateH2DBForWeka( String country,String commodity,String market_name, int wholesale_price, String date) 
	{
		try{
		System.out.println("INSERT INTO AFRICA_FUTURE_PRICES VALUES('"+market_name+"', "+wholesale_price+", formatdatetime('"+date+"' ,  'yyyy-MM-dd'  , 'en') )");
		
		preparedStatement = conn.prepareStatement("INSERT INTO AFRICA_FUTURE_PRICES VALUES(?,?, formatdatetime('"+date+"' ,  'yyyy-MM-dd'  , 'en') )");
        preparedStatement.setString(1, market_name);
        preparedStatement.setInt(2,wholesale_price );
        preparedStatement.executeUpdate();
		}
		 catch(IndexOutOfBoundsException | SQLException e)
			{
				System.out.println("data doesn't exist moving on.....");
			}
		
	}
	
	private void generatePredictions(String country,String crop,String market_name)
	{
		try {

			int future_steps_seed = 9;
			
		     // Weka DB data loader
		      db.setQuery("SELECT DISTINCT * FROM AFRICA_FUTURE_PRICES where market_name='"+market_name+"' order by DATE");

		      Instances instanceData = db.getDataSet();
		    
		      //Instances wine = new Instances(new FileReader(data));
		      
		      System.out.println(instanceData);
		      
		     // wine.setClassIndex(wine.numAttributes() - 1);
		
		      // new forecaster
		      WekaForecaster forecaster = new WekaForecaster();
		      
		      // set the targets we want to forecast. This method calls
		      // setFieldsToLag() on the lag maker object for us
		      forecaster.setFieldsToForecast("WHOLESALE_PRICE");

		      // default underlying classifier is SMOreg (SVM) - we'll use
		      // gaussian processes for regression instead
		      GaussianProcesses gauss = new GaussianProcesses();
		      gauss.setOptions(weka.core.Utils.splitOptions("-L 1.0 -N 1 -K weka.classifiers.functions.supportVector.PolyKernel -C 250007 -E 1.0"));
		      forecaster.setBaseForecaster(gauss);

		      forecaster.getTSLagMaker().setTimeStampField("DATE"); // date time stamp
		      forecaster.getTSLagMaker().setMinLag(1);
		      forecaster.getTSLagMaker().setMaxLag(3); // monthly data
		      
		     
		      forecaster.getTSLagMaker().setPeriodicity( TSLagMaker.Periodicity.DAILY);
		      //forecaster.getTSLagMaker().setAdjustForTrends(true);
		      // build the model
		      
		      System.out.println("checking if instance data isEmpty = "+instanceData.isEmpty());
		   if(instanceData.isEmpty() == false) 
		   {   
		      forecaster.buildForecaster(instanceData, System.out);

		      // prime the forecaster with enough recent historical data
		      // to cover up to the maximum lag. In our case, we could just supply
		      // lag period
		      forecaster.primeForecaster(instanceData);
		      
		      

		      double timeDelta = 0;
		      String dateFormat = null;
		      String timeStampName = forecaster.getTSLagMaker().getTimeStampField();
		      dateFormat = instanceData.attribute(timeStampName).getDateFormat();
		      SimpleDateFormat format = new SimpleDateFormat(dateFormat);
		      
		     // timeStart = wine.instance(0).value(wine.attribute(timeStampName));
		      
		  
		      double timeStart2 = forecaster.getTSLagMaker().getCurrentTimeStampValue();

		      timeDelta = forecaster.getTSLagMaker().getDeltaTime();
		      
		      timeStart2 += (long) timeDelta;
		      
		      
		      List<List<NumericPrediction>> forecast = forecaster.forecast(future_steps_seed, System.out);
		      
		      // Delete all previous future predicitons before inserting new predicitons
		      System.out.println(cartoDBCLient.executeQuery("DELETE from africa_commodities_history where country ='"+country+"' AND market_name='"+market_name+"' AND commodity='"+crop+"' AND future=true ")); 
		      
		      // output the predictions. Outer list is over the steps; inner list is over
		      // the targets
		      for (int i = 0; i < future_steps_seed; i++) {
		        
		    	  List<NumericPrediction> predsAtStep = forecast.get(i);
		        
		        
		        for (int j = 0; j < 1; j++) {
		          NumericPrediction predForTarget = predsAtStep.get(j);
		          
		          //dateTime calculator new predictions using TSLagmaker deltaTime function
		          timeStart2 += (long) timeDelta;
			      String dateTime = format.format(new Date((long) timeStart2));
		          
		          System.out.print("" + predForTarget.predicted() + " "+dateTime);
		          
		          int wholesale_future_price = (int)predForTarget.predicted();
		         
		          //System.out.println("----Future--->INSERT INTO africa_commodities_history (commodity,country,date,market_name,wholesale_price,future) VALUES ('"+crop+"','"+country+"', to_timestamp(' "+dateTime+" ', 'YYYY MM DD') ,'"+market_name+"',"+wholesale_future_price+",true");
		          
		          System.out.println("----Future---> INSERT INTO africa_commodities_history (commodity,country,date,market_name,wholesale_price,future) values('"+crop+"','"+country+"', to_timestamp(' "+dateTime+" ', 'YYYY MM DD') ,'"+market_name+"',"+wholesale_future_price+",true)");
		          try{
		        	  
		        	  System.out.println(cartoDBCLient.executeQuery("INSERT INTO africa_commodities_history (commodity,country,date,market_name,wholesale_price,future) values('"+crop+"','"+country+"', to_timestamp(' "+dateTime+" ', 'YYYY MM DD') ,'"+market_name+"',"+wholesale_future_price+",true)"));
		          }
		          catch(IndexOutOfBoundsException e)
					{
						System.out.println("data doesn't exist moving on.....");
					}
		        
		        
		        }
		        
		        System.out.println();
		      }
		      
		      // Truncate all rows of H2DB
		      preparedStatement = conn.prepareStatement("TRUNCATE table AFRICA_FUTURE_PRICES ");
		      preparedStatement.executeUpdate(); 
		   }
		      // we can continue to use the trained forecaster for further forecasting
		      // by priming with the most recent historical data (as it becomes available).
		    } catch (Exception ex) {
		      ex.printStackTrace();
		    }
	}
	
	
	
//	
//	String csvFilename = "file.csv";
//	CSVReader csvReader = new CSVReader(new FileReader(csvFilename), ',', '\'', 1);
//	String[] col = null;
//	int i = 22;
//	while((col = csvReader.readNext()) != null) {
	    
//		//System.out.println(col[4] + " " + col[1] + " " + col[2]+ " " + col[3]);
//		
//	//	System.out.println(col[9] + " " + col[10] + " " + col[2]+ " " + col[3]);
//		
//		//populate a table
//		//System.out.println(cartoDBCLient.executeQuery("INSERT INTO average15days (country,market_name,commodity) VALUES ('"+col[0]+"','"+col[1]+"','Beans') "));
//		//System.out.println(cartoDBCLient.executeQuery("INSERT INTO african_daily_prices (country,date,market_name,retail_price,wholesale_price) VALUES ('"+col[0]+"', to_timestamp(' "+col[4]+" ', 'YYYY MM DD') ,'"+col[1]+"',"+col[2]+","+col[3]+") "));
//		
//		
//		//New update with datetime string to time 
//		//System.out.println(cartoDBCLient.executeQuery("UPDATE african_daily_prices SET (country,date,market_name,retail_price,wholesale_price) = ('"+col[0]+"', to_timestamp(' "+col[4]+" ', 'YYYY MM DD') ,'"+col[1]+"',"+col[2]+","+col[3]+") WHERE cartodb_id ="+i));
//		//(country,date,market_name,retail_price,wholesale_price) = ('"+col[0]+"', to_timestamp(' "+col[4]+" ', 'YYYY MM DD') ,'"+col[1]+"',"+col[2]+","+col[3]+")
//		
//		//updates lat lon
//		//System.out.println(cartoDBCLient.executeQuery("UPDATE kenya_commodities_history SET (commodity) = ('Maize') WHERE cartodb_id ="+i));
////		System.out.println(cartoDBCLient.executeQuery("UPDATE african_daily_prices SET (longitude,latitude) = ("+col[9]+","+col[10]+") WHERE cartodb_id ="+i));
//			
//		//advance update try
//		//System.out.println(cartoDBCLient.executeQuery("UPDATE african_daily_prices SET (longitude,latitude) = ("+col[9]+","+col[10]+") WHERE country = '"+col[0]+"' AND market_name = ' "+col[1]+"'"));
//		
//		
//		//creates new row wit data
//		//System.out.println(cartoDBCLient.executeQuery("INSERT INTO african_daily_prices (retail_price) VALUES ("+col[2]+"""));
//		
//		i++;
//  
//	}
	
//	csvReader.close();
	
}
