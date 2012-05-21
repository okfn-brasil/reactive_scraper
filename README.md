# Reactive Scraper
Reactive Scraper is a way to make scrape data from website using javascript.

# How to
You need go to a reactivescraper.herokuapp.com or download and install reactive scraper in you computer(I will explain it after). On Reactive Scraper homepage you need put you target, a url website and press Go! 

The next page there are 2 main box, the code box on left and you target in right box. Basically you write javascript code (can use jQuery) to get the data, like:

	var importantText = $("#important-text p").text();

To save (temporarily) your collected data you can use datahub.save method, that method reveice a object params, think this object like a row in database, like it:

	datahub.save({
		text: $("#content .body").text(),
		author: $("#content .author").text(),
		date: $("#content date").text()
	});


After when you have all data you need save it and share, We use the **datahub** to save and share the data, for it you need have a login in datahub, it's very easy, we need only your api key, you can get the api key in datahub.io/en/user/me, and configure in code it: 
 
  datahub.config = {
		dataset: "mydatasetX",
		api_key: "PUTMYAPIKEYHERE",
  };

Always when the save code run, when update the config if you use only a dataset you should put the config code on top of code, but you can use many put the new config when you change it, for example:

  datahub.config = {
		dataset: "example-law",
		api_key: "PUTMYAPIKEYHERE",
  };
  $("#laws li").each(function(){
		datahub.save({
			number: $(this).find(".number").text(),
			author: $(this).find(".author").text(),
			text: $(this).find(".body").text()
		});
	});
	
  datahub.config = {
		dataset: "example-authors-law",
		api_key: "PUTMYAPIKEYHERE",
  };

  $(".author").each(function(){
		datahub.save({
			name: $(this).find(".name").text(),
			age: $(this).find(".age").text(),
			party: $(this).find(".party").text()
		});
	});

In this example the first data will be save on *example-law* dataset and the outher on *example-authors-law*
