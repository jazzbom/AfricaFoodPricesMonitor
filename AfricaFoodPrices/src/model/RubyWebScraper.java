/**
 * 
 */
package model;

/**
 * @author jazzbom
 *
 */

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.Reader;
import java.util.Map;
import java.util.Set;

import org.jruby.embed.LocalVariableBehavior;
import org.jruby.embed.ScriptingContainer;

public class RubyWebScraper {

	public RubyWebScraper() {
		System.setProperty("jruby.home", "C:/jruby-1.7.2");
	}

	void runScarpper()
	{
		System.out.println("WebScraping process started ......");
		
		ScriptingContainer container = new ScriptingContainer(LocalVariableBehavior.PERSISTENT);
		
		File f = new File("WebScrapperRuby.rb");
    	try {
			BufferedReader br = new BufferedReader(new FileReader(f));
			Reader h = (Reader) br;
			container.runScriptlet(h, "WebScrapperRuby");
			
			
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		}
    	System.out.println("scraping finished!");
	}
	

}
