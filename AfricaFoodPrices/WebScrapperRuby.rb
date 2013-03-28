=begin
@author jayBhosle
=end

require 'mechanize'
require 'csv'
require 'date'

#current date
endDate = Time.now.strftime("%Y-%m-%d")

# shift date to the past back
d = Date.parse(Time.now.to_s)
startDate = (d += -23).strftime("%Y-%m-%d")

puts '--Start->>>'+startDate
puts '--End->>>'+endDate

#arrays of countries n crops
countries = %w( KENYA TANZANIA UGANDA RWANDA BURUNDI ) 
crops = %w( Maize Sorghum Wheat Rice )

agent = Mechanize.new
agent.get('http://ratin.net/Ratin_Analysis/market_search.php?id=')

countries.length.times do |countryIndex|
    crops.length.times do |cropIndex|    

      form = agent.page.forms.first # => Mechanize::Form
      form.fields.each { |f| puts f.name }

      country = countries[countryIndex]
      crop = crops[cropIndex]

      form['start_date'] = startDate
      puts form['start_date']

      form['end_date'] = endDate
      puts form['end_date']

      form.field_with(:name => 'view').options[0].select
      puts form['view']

      form.field_with(:name => 'price').options[0].select
      puts form['price']

      form.field_with(:name => 'currency').options[5].select
      puts form['currency']

      form.field_with(:name => 'measure').options[4].select
      puts form['measure']

      form.checkbox_with(:value => country).check
      form.checkbox_with(:value => country).check

      form.checkbox_with(:value => crop).check  

      form.submit
      #form.click_button(form.button_with(:name => 'submit')
  
      agent.page.links.each do |link|
      puts link.uri
      end  


      # using the parser call of mechanize we can use nokogiri methods example
      doc = agent.page.parser.xpath("//table[@id='table-"+crops[cropIndex]+"']")


      #Markets
      tarray = Array.new #temporary array
      rprice = Array.new 
      wprice = Array.new
      dates = Array.new
      
      agent.page.parser.xpath('//tbody/tr').each do |row|
      #tarray = Array.new #temporary array
      row.xpath('th').each do |cell|
        tarray << cell.text #Build array of that row of data.
        end
  
        end

        #rprice
        agent.page.parser.xpath('//tbody/tr').each do |row|
        #tarray = Array.new #temporary array
        row.xpath('td[1]').each do |cell|
        puts cell.text
        rprice << cell.text #Build array of that row of data.
        end

        end

        #wprice
        agent.page.parser.xpath('//tbody/tr').each do |row|
        #tarray = Array.new #temporary array
        row.xpath('td[2]').each do |cell|
        puts cell.text
        wprice << cell.text #Build array of that row of data.
        end

        end

        #dates
        agent.page.parser.xpath('//tbody/tr').each do |row|
        #tarray = Array.new #temporary array
        row.xpath('td[3]').each do |cell|
        puts cell.text
        dates << cell.text #Build array of that row of data.
        end

        end

        puts tarray.length
        puts wprice.length

=begin
doc.xpath('//table//tr').each do |row|
    tarray = [] #temporary array
    row.xpath('td').each do |cell|
        tarray << cell.text #Build array of that row of data.
    end
    csv << tarray #Write that row out to csv file
end

#Retail Price
agent.page.parser.xpath('//tbody').each do |node|
puts node.content

prices << node.text

end
=end


    CSV.open(""+country+"_"+crop+"_current.csv", "w") do |row|
      row << ["Country","Market","RetailPrice","WholesalePrice","Date"]
  
      (0..tarray.length - 1).each do |index|

        row << [country ,tarray[index], rprice[index], wprice[index], dates[index]]
        
        end
        # ...
       end  
       
       
    end 
end