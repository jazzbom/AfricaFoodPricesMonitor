/**
 * 
 */
package model;

import java.io.IOException;
import java.text.ParseException;

import com.cartodb.CartoDBException;

/**
 * @author jayBhosle
 *
 */
public class ProjectUpdator {

	public static void main(String args[]) throws Exception
	{

		System.out.println("Starting app updates......");
		
		RubyWebScraper runScrapper =  new RubyWebScraper();
		AfricaDbPriceUpdator runUpdates =   new AfricaDbPriceUpdator();
		
//		runScrapper.runScarpper(); // runs the scraper at Ratin.net
	
//		runUpdates.updatorPricesArchive();
//		
//		runUpdates.updateCurrentPrices();
//		runUpdates.calculateAvg();
//		
//		runUpdates.calculatePriceIndex();
//		
	//	runUpdates.predictFuturePrices();
		
		//runUpdates.insertNewData(); // ONLY to be run on NEW INSTALLS
	}
	
	
}
