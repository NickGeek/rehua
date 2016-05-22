// Thanks to http://stackoverflow.com/a/22076667/998467
var HttpClient = function() {
	this.get = function(aUrl, aCallback) {
		var anHttpRequest = new XMLHttpRequest();
		anHttpRequest.onreadystatechange = function() { 
			if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
				aCallback(anHttpRequest.responseText);
		}

		anHttpRequest.open( "GET", aUrl, true );            
		anHttpRequest.send( null );
	}
}
http = new HttpClient();

// Thanks to http://stackoverflow.com/a/4673436/998467
if (!String.prototype.format) {
	String.prototype.format = function() {
		var args = arguments;
		return this.replace(/{(\d+)}/g, function(match, number) { 
			return typeof args[number] != 'undefined'
				? args[number]
				: match
			;
		});
	};
}

//Thanks to http://stackoverflow.com/a/32002858/998467
var get = function() {
    function urldecode(str) {
        return decodeURIComponent((str+'').replace(/\+/g, '%20'));
    }

    function transformToAssocArray( prmstr ) {
        var get = {};
        var prmarr = prmstr.split("&");
        for ( var i = 0; i < prmarr.length; i++) {
            var tmparr = prmarr[i].split("=");
            get[tmparr[0]] = urldecode(tmparr[1]);
        }
        return get;
    }

    var prmstr = window.location.search.substr(1);
    return prmstr != null && prmstr != "" ? transformToAssocArray(prmstr) : {};
}();

function loadPosts() {
	if (get.hash) {
		http.get("{0}/ipns/{1}".format(window.location.href.split('/')[0], get.hash), function (res) {
			var json = JSON.parse(res);
			if (!json.name || !json.posts)
				return;

			var md = new showdown.Converter();
			var postsDiv = document.getElementById('posts');

			for (var i = 0; i < json.posts.length; i++) {
				var post = json.posts[i];
				if (!post.title || !post.content)
					continue;
				var newHTML = "";

				if (i > 0)
					newHTML = "<hr />";

				var author = "";
				if (!post.author) {
					author = "Anonymous";
				}
				else if (!post.author.name) {
					author = "Anonymous";
				}
				else if (post.author.name) {
					author = post.author.name;
					if (post.author.url)
						author = "<a href='{0}'>".format(post.author.url)+author+"</a>";
				}
				newHTML += "<div id='{0}' class='post'><h1 class='postTitle'><a href='#{0}'>{1}</a></h1> <i class='postInfo'>by {2}</i> <p>{3}</p></div>".format(i, post.title, author, md.makeHtml(post.content));
				postsDiv.innerHTML += newHTML;
			}

			document.title = "{0} | Rehua - A Directory for IPFS".format(json.name, document.title);
			document.getElementById('title').innerHTML = json.name;
		});
	}
}