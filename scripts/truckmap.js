// JavaScript Document
function detectBrowser() {
  var useragent = navigator.userAgent;
  var mapdiv = document.getElementById("map_canvas");
    
  if (useragent.indexOf('iPhone') != -1 || useragent.indexOf('Android') != -1 ) {
    mapdiv.style.width = '100%';
    mapdiv.style.height = '10%';
	mapdiv.style.position = 'fixed';
  } else {
    mapdiv.style.width = '600px';
    mapdiv.style.height = '800px';
	mapdiv.style.position = 'fixed';
  }
}
//<![CDATA[
//This section centers map on user's location
// Note that using Google Gears requires loading the Javascript
// at http://code.google.com/apis/gears/gears_init.js

var initialLocation;
var hamptonroads = new google.maps.LatLng(36.906666,-76.278763);
var browserSupportFlag =  new Boolean();
var map;
var infoWindow;
var users = [];

function initialize() {
	var useragent = navigator.userAgent;
  var mapdiv = document.getElementById("map_canvas");
	var mapOptions = {
    zoom: 11,
	panControl: false,
  zoomControl: true,
  zoomControlOptions: {
  	position: google.maps.ControlPosition.LEFT_TOP
  },
  mapTypeControl: false,
  scaleControl: false,
  streetViewControl: false,
  overviewMapControl: false,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }	
if (useragent.indexOf('iPhone') != -1 || useragent.indexOf('Android') != -1 ) {	
  mapOptions = {
    zoom: 11,
	panControl: false,
  zoomControl: true,
  zoomControlOptions: {
  	position: google.maps.ControlPosition.RIGHT_CENTER
  },
  mapTypeControl: false,
  scaleControl: false,
  streetViewControl: false,
  overviewMapControl: false,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
} else {
mapOptions = {
    zoom: 11,
	panControl: false,
  zoomControl: true,
  zoomControlOptions: {
  	position: google.maps.ControlPosition.LEFT_TOP
  },
  mapTypeControl: false,
  scaleControl: false,
  streetViewControl: false,
  overviewMapControl: false,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }	
}

// Create map
	var	map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
var styles = [
  {
    stylers: [
      { hue: "#4171a3" },
      { saturation: -20 }
    ]
  },{
    featureType: "road",
    elementType: "geometry",
    stylers: [
      { lightness: 100 },
      { visibility: "simplified" }
    ]
  },{
    featureType: "road",
    elementType: "labels",
    stylers: [
      { hue: "#d2a404" },
	  { lightness: 0 },
      { visibility: "on" }
    ]
  }
];

map.setOptions({styles: styles});
var latitude = '';
var longitude = '';
  //var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

  // Try W3C Geolocation (Preferred)
  if(navigator.geolocation) {
    browserSupportFlag = true;
    navigator.geolocation.getCurrentPosition(function(position) {
		latitude = position.coords.latitude;
		longitude = position.coords.longitude;
      var initialLocation = new google.maps.LatLng(latitude, longitude);
      map.setCenter(initialLocation);
    }, function() {
      handleNoGeolocation(browserSupportFlag);
    });
  // Try Google Gears Geolocation
  } else if (google.gears) {
    browserSupportFlag = true;
    var geo = google.gears.factory.create('beta.geolocation');
    geo.getCurrentPosition(function(position) {
		latitude = position.coords.latitude;
		longitude = position.coords.longitude;
      initialLocation = new google.maps.LatLng(latitude, longitude);
      map.setCenter(initialLocation);
	  
    }, function() {
      handleNoGeoLocation(browserSupportFlag);
    });
  // Browser doesn't support Geolocation
  } else {
    browserSupportFlag = false;
    handleNoGeolocation(browserSupportFlag);
  }
  
  function handleNoGeolocation(errorFlag) {
    if (errorFlag == true) {
      alert("Geolocation service failed.");
      initialLocation = hamptonroads;
    } else {
      alert("Your browser doesn't support geolocation. We've placed you in Hampton Roads.");
      initialLocation = hamptonroads;
    }
    map.setCenter(initialLocation);
  }

//END MAP-CENTERING SECTION

//map.setCenter(hamptonroads);
var infoWindow = new google.maps.InfoWindow;


//DEFINES THE USER OR LIST AND NUMBER OF TWEETS
	$(function () {
		JQTWEET = {
	     
	    // Set twitter hash/user, number of tweets & id/class to append tweets
	    // You need to clear tweet-date.txt before toggle between hash and user
	    // for multiple hashtags, you can separate the hashtag with OR, eg:
	    // hash: '%23jquery OR %23css'			    
	   search: '', //leave this blank if you want to show user's tweet
	    user: 'foodtruckshr', //username
		slug: 'food-trucks', //list slug
	    numTweets: 1000, //number of tweets
	    //appendTo: '#jstwitter',
	    //useGridalicious: true,
	   // template: '<div class="item">{IMG}<div class="tweet-wrapper"><span class="text">{TEXT}</span>\
	     //          <span class="time"><a href="{URL}" target="_blank">{AGO}</a></span>\
	     //          by <span class="user">{USER}</span> at <span>{LON}</span> <span>{LAT}</span></div></div>',
	     
	    // core function of jqtweet
	    // https://dev.twitter.com/docs/using-search
	    loadTweets: function() {

	        var request;
	         
	        // different JSON request {hash|user}
	        if (JQTWEET.search) {
            request = {
                q: JQTWEET.search,
                count: JQTWEET.numTweets,
                api: 'search_tweets'
            }
	        } else {
            request = {
      q: JQTWEET.user,
      count: JQTWEET.numTweets,
      list_id: '95057151',
      api: 'lists_statuses'
  }
	        }
//AJAX REQUEST
	        $.ajax({
	            url: 'grabtweets.php',
	            type: 'POST',
	            dataType: 'json',
	            data: request,
	            success: function(data, textStatus, xhr) {
					
		             if (data.httpstatus == 200) {
		            	if (JQTWEET.search) data = data.statuses;

	                var lng, lat, name;	         
	                	                
	              
//PLOTTING THE POINTS                  
	                  for (var i = 0; i < JQTWEET.numTweets; i++) {		
	                  	
					    try {
							if (data[i].coordinates.coordinates[0]) {
							
	                     // if (data[i].entities['hashtags']) {
//	                        hasht = data[i].entities['hashtags'][0].text;
//							
//	                      }
//	                    } catch (e) {  
//	                      //no hashtag
//	                    }
						
						//if (hasht != 'hrva') {
						//end try hashtag
	                    //img = '';
						//alert(hasht);
						
	                    //url = 'http://twitter.com/' + data[i].user.screen_name + '/status/' + data[i].id_str;
						lng = data[i].coordinates.coordinates[0];
						lat = data[i].coordinates.coordinates[1];
						
						//var latitude = lar;
						//var longitude = lng;
						//if (lng != 'null'){
							try {
						if (lng != null){
							name = data[i].user.screen_name;
							
							var profpic = data[i].user.profile_image_url;
						tweet = JQTWEET.ify.clean(data[i].text);
						howlong = JQTWEET.timeAgo(data[i].created_at);
						var point = new google.maps.LatLng(
							parseFloat(lat),
							parseFloat(lng));
		 				 var image = 'FoodTruckIcon.png';
						 if (name == 'Panavoir') {
							menulink = 'http://www.panavoir.com'; 
						 } else if (name == 'dddickenson') {
							 menulink = 'http://ddaviddickenson.com';
						 }
						 
						 
		  				content = '<div class="truckinfo"><div class="infohead"><div class="profimg"><img src="' + profpic + '" /></div><p class="truckname">' + name + '</p></div><p class="tweet-text">' + tweet + '</p><p>' + howlong + '</p><p class="menu-link"><a href="' + menulink + '"  target="_blank">Menu</a></p><p class="directions"><a href="https://maps.google.com/maps?saddr=' + latitude + ',' + longitude + '&daddr=' + lat + ',' + lng + '" target="_blank">Directions</a></p></div>';
          				var marker = new google.maps.Marker({
            				map: map,
            				position: point,
							//title: name,
							icon: image
							            
         				 });
						//} else { 
						//do nothing
						//}
						
          				bindInfoWindow(marker, map, infoWindow, content);
					 } 
						 
						}
						catch (e) {
							
						}
						
          				
						}
						
	                    } catch (e) {  
	                      //no hashtag
	                    } 
						
					  }
					   
					  }				  
			
					//} else alert('no data');
				},
				
				
			  });
			  
			}, 
			
			  /**
	      * relative time calculator FROM TWITTER
	      * @param {string} twitter date string returned from Twitter API
	      * @return {string} relative time like "2 minutes ago"
	      */
			timeAgo: function(dateString) {
	        var rightNow = new Date();
	        var then = new Date(dateString);
	         
	        if ($.browser.msie) {
	            // IE can't parse these crazy Ruby dates
	            then = Date.parse(dateString.replace(/( \+)/, ' UTC$1'));
	        }
	 
	        var diff = rightNow - then;
	 
	        var second = 1000,
	        minute = second * 60,
	        hour = minute * 60,
	        day = hour * 24,
	        week = day * 7;
	 
	        if (isNaN(diff) || diff < 0) {
	            return ""; // return blank string if unknown
	        }
	 
	        if (diff < second * 2) {
	            // within 2 seconds
	            return "right now";
	        }
	 
	        if (diff < minute) {
	            return Math.floor(diff / second) + " seconds ago";
	        }
	 
	        if (diff < minute * 2) {
	            return "about 1 minute ago";
	        }
	 
	        if (diff < hour) {
	            return Math.floor(diff / minute) + " minutes ago";
	        }
	 
	        if (diff < hour * 2) {
	            return "about 1 hour ago";
	        }
	 
	        if (diff < day) {
	            return  Math.floor(diff / hour) + " hours ago";
	        }
	 
	        if (diff > day && diff < day * 2) {
	            return "yesterday";
	        }
	 
	        if (diff < day * 365) {
	            return Math.floor(diff / day) + " days ago";
	        }
	 
	        else {
	            return "over a year ago";
	        }
	    }, //timeAgo
		
		/**
	      * The Twitalinkahashifyer!
	      * http://www.dustindiaz.com/basement/ify.html
	      * Eg:
	      * ify.clean('your tweet text');
	      */
	    ify:  {
	      link: function(tweet) {
	        return tweet.replace(/\b(((https*\:\/\/)|www\.)[^\"\']+?)(([!?,.\)]+)?(\s|$))/g, function(link, m1, m2, m3, m4) {
	          var http = m2.match(/w/) ? 'http://' : '';
	          return '<a class="twtr-hyperlink" target="_blank" href="' + http + m1 + '">' + ((m1.length > 25) ? m1.substr(0, 24) + '...' : m1) + '</a>' + m4;
	        });
	      },
	 
	      at: function(tweet) {
	        return tweet.replace(/\B[@＠]([a-zA-Z0-9_]{1,20})/g, function(m, username) {
	          return '<a target="_blank" class="twtr-atreply" href="http://twitter.com/intent/user?screen_name=' + username + '">@' + username + '</a>';
	        });
	      },
	 
	      list: function(tweet) {
	        return tweet.replace(/\B[@＠]([a-zA-Z0-9_]{1,20}\/\w+)/g, function(m, userlist) {
	          return '<a target="_blank" class="twtr-atreply" href="http://twitter.com/' + userlist + '">@' + userlist + '</a>';
	        });
	      },
	 
	      hash: function(tweet) {
	        return tweet.replace(/(^|\s+)#(\w+)/gi, function(m, before, hash) {
	          return before + '<a target="_blank" class="twtr-hashtag" href="http://twitter.com/search?q=%23' + hash + '">#' + hash + '</a>';
	        });
	      },
	 
	      clean: function(tweet) {
	        return this.hash(this.at(this.list(this.link(tweet))));
	      }
	    } // ify
		}
			 			  

	});
	
	//DEFINES THE USER OR LIST AND NUMBER OF TWEETS
	
	
       
    function bindInfoWindow(marker, map, infoWindow, content) {
      google.maps.event.addListener(marker, 'click', function() {
        infoWindow.setContent(content);
        infoWindow.open(map, marker);
      });
    }
	
	google.maps.event.addListener(map, 'click', function() {
    infoWindow.close();
  }); 

$(function () {
	
	JQTWEET.loadTweets();
});
}
google.maps.event.addDomListener(window, 'load', initialize);


// Close the open infobox on map click
		
		

    function doNothing() {}
