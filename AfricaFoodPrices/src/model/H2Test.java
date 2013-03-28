package model;

import java.io.File;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;

import com.cartodb.CartoDBClientIF;
import com.cartodb.impl.ApiKeyCartoDBClient;
import com.cartodb.model.CartoDBResponse;

import weka.classifiers.evaluation.NumericPrediction;
import weka.classifiers.functions.GaussianProcesses;
import weka.classifiers.timeseries.TSForecaster;
import weka.classifiers.timeseries.WekaForecaster;
import weka.classifiers.timeseries.core.TSLagMaker;
import weka.classifiers.timeseries.core.TSLagUser;
import weka.classifiers.timeseries.eval.TSEvaluation;
import weka.core.Instances;
import weka.core.converters.DatabaseLoader;



public class H2Test {

//	
//	public static void main(String args[]) throws Exception
//	{
//		 PreparedStatement preparedStatement = null;
//		 Class.forName("org.h2.Driver");
//	     Connection conn = DriverManager.getConnection("jdbc:h2:~/test", "sa", "");
//
//		preparedStatement = conn.prepareStatement("TRUNCATE table AFRICA_FUTURE_PRICES ");
//		preparedStatement.executeUpdate();    
//		
//		CartoDBClientIF cartoDBCLient;
//		cartoDBCLient= new ApiKeyCartoDBClient("devuser","0496edc11191118b625983ca582aad92c432d807");
//		String[] countries = {"KENYA"};
//		String[] crops =  {"Maize"};
//		
//		for(int i=0; i < countries.length; i++ )
//		{	
//			
//			for(int j=0; j < crops.length; j++ ) 
//			{
//				String crop = crops[j];
//				CartoDBResponse<Map<String, Object>> req = cartoDBCLient.request("select DISTINCT  market_name from  "+countries[i]+"_commodities_history_copy where country ='"+countries[i]+"'");
//				
//				System.out.println("total- "+req.getTotal_rows());
//				
//				for(int k=0; k < req.getTotal_rows(); k++)
//				{
//					String market = (String)req.getRows().get(k).get("market_name");
//					
//					System.out.println("inside");
//					
//
//
//					System.out.println("SELECT DISTINCT on (date) market_name,wholesale_price,date,commodity,future from  "+countries[i]+"_commodities_history_copy where country ='"+countries[i]+"' AND market_name='"+market+"' AND commodity='"+crop+"' AND future= false order by date ");
//					
//					CartoDBResponse<Map<String, Object>> get = cartoDBCLient.request("SELECT DISTINCT on (date) market_name,wholesale_price,date,commodity,future from  "+countries[i]+"_commodities_history_copy where country ='"+countries[i]+"' AND market_name='"+market+"' AND commodity='"+crop+"' AND future= false order by date ");
//					
//					System.out.println("total2- "+get.getTotal_rows());
//					
//					for(int k1=0; k1 < get.getTotal_rows(); k1++)
//					{
//					
//					String market2 = (String)get.getRows().get(k1).get("market_name");
//					String date = (String)get.getRows().get(k1).get("date");
//						
//					System.out.println("INSERT INTO AFRICA_FUTURE_PRICES VALUES('"+market2+"', "+get.getRows().get(k1).get("wholesale_price")+", formatdatetime('"+date+"' ,  'yyyy-MM-dd'  , 'en') )");
//					
//
//					
//					preparedStatement = conn.prepareStatement("INSERT INTO AFRICA_FUTURE_PRICES VALUES(?,?, formatdatetime('"+date+"' ,  'yyyy-MM-dd'  , 'en') )");
//			        preparedStatement.setString(1, market2);
//			        preparedStatement.setInt(2, (int)get.getRows().get(k1).get("wholesale_price"));
//
//			        preparedStatement.executeUpdate();
//			        
//			       
//					}
//					// weka fn here
//					
//					
//					
//				}
//			}
//		}
//		 conn.close();
//		 
//		 try {
//	      
//	      DatabaseLoader db = new DatabaseLoader();
//	  	
//	      db.setCustomPropsFile(new File("DatabaseUtils.props"));
//	  	
//	  //    String[] h = {"-user sa"};
//	  //	
////	  	db.setOptions(h);
//	      db.setUser("sa");
//	      db.setPassword("");
//	      db.setQuery("SELECT DISTINCT * FROM AFRICA_FUTURE_PRICES where market_name='Nakuru' order by DATE limit 320");
//	  		
//	      
//	      
//	      
//	      Instances wine = db.getDataSet();
//	    
//	      //Instances wine = new Instances(new FileReader(data));
//	      
//	      System.out.println(wine);
//	      
//	     // wine.setClassIndex(wine.numAttributes() - 1);
//	      
//	      
//	      // load the wine data
//	     // Instances wine = new Instances(new BufferedReader(new FileReader("wekaFileTest_.arff")));
//
//	      // new forecaster
//	      WekaForecaster forecaster = new WekaForecaster();
//	      
//	      
//
//	      // set the targets we want to forecast. This method calls
//	      // setFieldsToLag() on the lag maker object for us
//	      forecaster.setFieldsToForecast("WHOLESALE_PRICE");
//
//	      // default underlying classifier is SMOreg (SVM) - we'll use
//	      // gaussian processes for regression instead
//	      GaussianProcesses gauss = new GaussianProcesses();
//	      gauss.setOptions(weka.core.Utils.splitOptions("-L 1.0 -N 1 -K weka.classifiers.functions.supportVector.PolyKernel -C 250007 -E 1.0"));
//	      forecaster.setBaseForecaster(gauss);
//
//	      forecaster.getTSLagMaker().setTimeStampField("DATE"); // date time stamp
//	      forecaster.getTSLagMaker().setMinLag(1);
//	      forecaster.getTSLagMaker().setMaxLag(3); // monthly data
//	      
////	      // add a month of the year indicator field
////	      forecaster.getTSLagMaker().setAddMonthOfYear(true);
////
////	      // add a quarter of the year indicator field
////	      forecaster.getTSLagMaker().setAddQuarterOfYear(true);
//	     
//	      forecaster.getTSLagMaker().setPeriodicity( TSLagMaker.Periodicity.DAILY);
//	      //forecaster.getTSLagMaker().setAdjustForTrends(true);
//	      // build the model
//	      
//	      System.out.println("checking if empty -- "+wine.isEmpty());
//	      forecaster.buildForecaster(wine, System.out);
//
//	      // prime the forecaster with enough recent historical data
//	      // to cover up to the maximum lag. In our case, we could just supply
//	      // the 12 most recent historical instances, as this covers our maximum
//	      // lag period
//	      forecaster.primeForecaster(wine);
//	      
//	      
//
//	      double timeDelta = 0;
//	      String dateFormat = null;
//	      String timeStampName = forecaster.getTSLagMaker().getTimeStampField();
//	      dateFormat = wine.attribute(timeStampName).getDateFormat();
//	      SimpleDateFormat format = new SimpleDateFormat(dateFormat);
//	      
//	     // timeStart = wine.instance(0).value(wine.attribute(timeStampName));
//	      
//	  
//	      double timeStart2 = forecaster.getTSLagMaker().getCurrentTimeStampValue();
//
//	      timeDelta = forecaster.getTSLagMaker().getDeltaTime();
//
//	      List<List<NumericPrediction>> forecast = forecaster.forecast(5, System.out);
//	      
//	      
//	      // output the predictions. Outer list is over the steps; inner list is over
//	      // the targets
//	      for (int i = 0; i < 5; i++) {
//	        
//	    	  List<NumericPrediction> predsAtStep = forecast.get(i);
//	        
//	        
//	        for (int j = 0; j < 1; j++) {
//	          NumericPrediction predForTarget = predsAtStep.get(j);
//	          
//	          //dateTime calculator new predictions using TSLagmaker deltaTime function
//	          timeStart2 += (long) timeDelta;
//		      String dateTime = format.format(new Date((long) timeStart2));
//	          
//	          System.out.print("" + predForTarget.predicted() + " "+dateTime);
//	          
//	         // System.out.println(cartoDBCLient.executeQuery("INSERT INTO "+countries[i]+"_commodities_history (commodity,country,date,market_name,retail_price,wholesale_price) VALUES ('"+crop+"','"+col[0]+"', to_timestamp(' "+col[4]+" ', 'YYYY MM DD') ,'"+col[1]+"',"+col[2]+","+col[3]+") "));
//	        
//	        
//	        }
//	        
//	        System.out.println();
//	      }
//	      
//	      
//	
//	      
//	      // we can continue to use the trained forecaster for further forecasting
//	      // by priming with the most recent historical data (as it becomes available).
//	      // At some stage it becomes prudent to re-build the model using current
//	      // historical data.
//
//	    } catch (Exception ex) {
//	      ex.printStackTrace();
//	    }
//	  
//
//		
//		
//		
//		
//		
//		
//		
//		
//		
//		
//		
//		
//		
//		
//		
//		
//		
//		
//		
////	DatabaseLoader db = new DatabaseLoader();
////	
////	db.setCustomPropsFile(new File("DatabaseUtils.props"));
////	
////	String[] h = {"-user sa"};
//////	
//////	db.setOptions(h);
////	db.setUser("sa");
////	db.setPassword("");
////	db.setQuery("INSERT INTO AFRICA_FUTURE_PRICES VALUES('Nairobi', 399, formatdatetime('2012-04-25T00:00:00.000Z' ,  'yyyy-MM-dd'  , 'en') )");
////
////	Instances data = db.getDataSet();
////	System.out.println(data);
//	
//	
//	
//	}
}
