// JavaScript Document
JQTWEET = {
	     
	    // Set twitter hash/user, number of tweets & id/class to append tweets
	    // You need to clear tweet-date.txt before toggle between hash and user
	    // for multiple hashtags, you can separate the hashtag with OR, eg:
	    // hash: '%23jquery OR %23css'			    
	    search: '', //leave this blank if you want to show user's tweet
	    user: 'dddickenson', //username
	    numTweets: 21, //number of tweets
	    appendTo: '#jstwitter',
	    useGridalicious: true,
	    template: '<div class="item">{IMG}<div class="tweet-wrapper"><span class="text">{TEXT}</span>\
	               <span class="time"><a href="{URL}" target="_blank">{AGO}</a></span>\
	               by <span class="user">{USER}</span> at <span>{LON}</span> <span>{LAT}</span></div></div>',
	     
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
                api: 'statuses_userTimeline'
            }
	        }

	        $.ajax({
	            url: 'grabtweets.php',
	            type: 'POST',
	            dataType: 'json',
	            data: request,
	            success: function(data, textStatus, xhr) {
		            
		            if (data.httpstatus == 200) {
		            	if (JQTWEET.search) data = data.statuses;

	                var text, name, url, lng;	         
	                	                
	                try {
	                  // append tweets into page
	                  for (var i = 0; i < JQTWEET.numTweets; i++) {		
	                  
	                    //img = '';
	                    url = 'http://twitter.com/' + data[i].user.screen_name + '/status/' + data[i].id_str;
						lng = data[i].coordinates.coordinates[0];
						lat = data[i].coordinates.coordinates[1];
						
					  }
					}catch (e) {
	                  //item is less than item count
                  }
					}
				}
			});
		}
}