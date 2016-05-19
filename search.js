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

sites = {};
pendingFriends = [];
usedFriends = [];
baseURL = window.location.href;
query = "";

function search(list = baseURL.substring(0, baseURL.lastIndexOf("/") + 1)+'/list.json') {
	http.get(list, function(res) {
		var json = JSON.parse(res);
		console.log(json);

		//Add friends
		for (var i = 0; i < json.FSfriends.length; i++) {
			var hash = json.FSfriends[i];
			if (pendingFriends.indexOf(hash) === -1 && usedFriends.indexOf(hash) === -1) {
				var friend = {
					hash: hash,
					protocol: 'ipfs'
				}
				pendingFriends.push(friend);
			}
		}
		for (var i = 0; i < json.NSfriends.length; i++) {
			var hash = json.NSfriends[i];
			if (pendingFriends.indexOf(hash) === -1 && usedFriends.indexOf(hash) === -1) {
				var friend = {
					hash: hash,
					protocol: 'ipns'
				}
				pendingFriends.push(friend);
			}
		}

		//Add sites
		for (var i = 0; i < json.sites.length; i++) {
			var site = json.sites[i];
			console.log(site);
			if (!site.name || !site.hash || !site.protocol) {
				continue;
			}
			else if (site.protocol != "ipfs" && site.protocol != "ipns") {
				continue;
			}

			var query_terms = query.toLowerCase().split(" ");
			var matched = false;
			for (var j = 0; j < query_terms.length; j++) {
				var q = query_terms[j];
				if (site.name.toLowerCase().indexOf(q.toLowerCase()) > -1)
					matched = true;
			}

			if (!matched && site.hash !== query)
				continue;
			
			if (sites[site.hash]) {
				sites[site.hash].popularity++;
			}
			else {
				site.popularity = 1;
				site.url = "{0}/{1}/{2}".format(window.location.href.split('/')[0], site.protocol, site.hash);
				sites[site.hash] = site;
			}
		}

		displayResults();
	});

	function displayResults() {
		var resultsDiv = document.getElementById('results');
		if (Object.keys(sites).length === 0 && pendingFriends.length === 0) {
			resultsDiv.innerHTML = "<h3>No results found for: <em>{0}</em> 😞</h3>".format(query);
			resultsDiv.innerHTML += "<p style='text-align: right;'><em><a href='javascript:searchDeeper();'>Search Deeper</a><em><p>";
		}
		else if (Object.keys(sites).length === 0 && pendingFriends.length > 0) {
			resultsDiv.innerHTML = "<h3>Nothing found so far. Expanding scope of the search…</h3>";
			searchDeeper();
		}
		else if (Object.keys(sites).length > 0) {
			resultsDiv.innerHTML = "";
			var sitesList = [];
			for (hash in sites) {
				var site = sites[hash];
				sitesList.push(site);
			}

			var sortedSitesList = sitesList.slice(0);
			sortedSitesList.sort(function(a, b) {
				return b.popularity - a.popularity;
			});

			for (var i = 0; i < sortedSitesList.length; i++) {
				var site = sortedSitesList[i]

				if (i > 0)
					resultsDiv.innerHTML += "<br /><br />";
				resultsDiv.innerHTML += "<h3><a href='{0}'>{1}</a></h3><em class='hash'>/{2}/{3}</em>".format(site.url, site.name, site.protocol, site.hash);
			}
			resultsDiv.innerHTML += "<p style='text-align: right;'><em><a href='javascript:searchDeeper();'>Search Deeper</a><em><p>";
		}
	}
}

function searchDeeper() {
	console.log(pendingFriends);
	for (var i = 0; i < pendingFriends.length; i++) {
		var friend = pendingFriends[i];
		var list = "{0}/{1}/{2}".format(location.origin, friend.protocol, friend.hash);

		search(list)
	}
	pendingFriends = [];
}

function runSearch() {
	var resultsDiv = document.getElementById('results');
	resultsDiv.innerHTML = "<h3>Searching…</h3>";
	sites = {};
	pendingFriends = [];
	usedFriends = [];
	query = document.getElementById('query').value;
	search();
}