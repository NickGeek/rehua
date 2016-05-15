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

function submitJSON() {
	var jsonText = document.getElementById('jsonText').value;
	var json = JSON.parse(jsonText);
	var friends = [];
	var sites = [];

	//Add friends
	for (var i = 0; i < json.FSfriends.length; i++) {
		var hash = json.FSfriends[i];
		var friend = {
			hash: hash,
			protocol: 'ipfs'
		}
		friends.push(friend);
	}
	for (var i = 0; i < json.NSfriends.length; i++) {
		var hash = json.NSfriends[i];
		var friend = {
			hash: hash,
			protocol: 'ipns'
		}
		friends.push(friend);
	}

	//Add Sites
	for (var i = 0; i < json.sites.length; i++) {
		var site = json.sites[i];
		if (!site.name || !site.hash || !site.protocol) {
			continue;
		}
		else if (site.protocol != "ipfs" && site.protocol != "ipns") {
			continue;
		}

		sites.push(site);
	}

	//Display friends
	var div = document.getElementById('friends');
	div.innerHTML = "";
	for (var i = 0; i < friends.length; i++) {
		var friend = friends[i];

		var ipfsCheck = "";
		var ipnsCheck = "";
		if (friend.protocol === "ipfs") {
			ipfsCheck = 'checked="true"';
		}
		else {
			ipnsCheck = 'checked="true"';
		}
		div.innerHTML += '<input id="inputFriendHash{0}" type="text" autocomplete=off placeholder="Friend\'s Hash (e.g QmeL2BzYEQE99wqWnVY2pmypHbPeLLcv29hu5nA3ZRS255)" value="{3}" /><input class="inputFriendProtocol{0}" name="inputFriendProtocol{0}" type="radio" value="IPFS" {1} /> IPFS <input class="inputFriendProtocol{0}" name="inputFriendProtocol{0}" type="radio" value="IPNS" {2} /> IPNS'.format(i, ipfsCheck, ipnsCheck, friend.hash);
	}
	div.innerHTML = '<input id="inputFriendHash{0}" type="text" autocomplete=off placeholder="Friend\'s Hash (e.g QmeL2BzYEQE99wqWnVY2pmypHbPeLLcv29hu5nA3ZRS255)" /><input class="inputFriendProtocol{0}" name="inputFriendProtocol{0}" type="radio" value="IPFS" /> IPFS <input class="inputFriendProtocol{0}" name="inputFriendProtocol{0}" type="radio" value="IPNS" checked="true" /> IPNS'.format(friends.length) + div.innerHTML;

	//Display Sites
	var site = sites[i];
	var div = document.getElementById('sites');
	div.innerHTML = "";
	for (var i = 0; i < sites.length; i++) {
		var site = sites[i];

		var ipfsCheck = "";
		var ipnsCheck = "";
		if (site.protocol === "ipfs") {
			ipfsCheck = 'checked="true"';
		}
		else {
			ipnsCheck = 'checked="true"';
		}
		div.innerHTML += '<input id="inputName{0}" type="text" autocomplete=off placeholder="Website Name" value="{1}" /> <input id="inputSiteHash{0}" type="text" autocomplete=off placeholder="Website Hash (e.g QmeL2BzYEQE99wqWnVY2pmypHbPeLLcv29hu5nA3ZRS255)" value="{2}" /> <input class="inputSiteProtocol{0}" name="inputSiteProtocol{0}" type="radio" value="IPFS" {3} /> IPFS <input class="inputSiteProtocol{0}" name="inputSiteProtocol{0}" type="radio" value="IPNS" {4} /> IPNS</div>'.format(i, site.name, site.hash, ipfsCheck, ipnsCheck);
	}
	div.innerHTML = '<input id="inputName{0}" type="text" autocomplete=off placeholder="Website Name" /> <input id="inputSiteHash{0}" type="text" autocomplete=off placeholder="Website Hash (e.g QmeL2BzYEQE99wqWnVY2pmypHbPeLLcv29hu5nA3ZRS255)" /> <input class="inputSiteProtocol{0}" name="inputSiteProtocol{0}" type="radio" value="IPFS" checked="true" /> IPFS <input class="inputSiteProtocol{0}" name="inputSiteProtocol{0}" type="radio" value="IPNS" /> IPNS</div>'.format(sites.length) + div.innerHTML;
}

function makeJSON() {
	var friendsDiv = document.getElementById('friends');
	var sitesDiv = document.getElementById('sites');

	var friendsInputs = friendsDiv.getElementsByTagName('input');
	var sitesInputs = sitesDiv.getElementsByTagName('input');
	var friendIDs = [];
	var siteIDs = [];

	for (var i = 0; i < friendsInputs.length; i++) {
		var element = friendsInputs[i];
		try {
			var id = parseInt(element.id.match(/\d+$/)[0], 10);
		}
		catch(e) {
			continue;
		}
		console.log("Friend: {0}".format(element.id));
		if (id.length > 0)
			friendIDs.push(id);
	}

	for (var i = 0; i < sitesInputs.length; i++) {
		var element = sitesInputs[i];
		try {
			var id = parseInt(element.id.match(/\d+$/)[0], 10);
		}
		catch(e) {
			continue;
		}
		console.log("Site: {0}".format(element.id));
		siteIDs.push(id);
	}

	//Remove duplicates. Thanks to http://stackoverflow.com/a/14821032/998467
	friendIDs = friendIDs.filter(function(v, i, a) { return a.indexOf (v) == i });
	siteIDs = siteIDs.filter(function(v, i, a) { return a.indexOf (v) == i });

	//Create arrays to turn into JSON
	var sites = [];
	var FSfriends = [];
	var NSfriends = [];

	for (var i = 0; i < friendIDs.length; i++) {
		var id = friendIDs[i];
		var hash = document.getElementById("inputFriendHash"+id).value;
		var protocol = document.querySelector('input[name="inputFriendProtocol{0}"]:checked'.format(id)).value;

		if (hash.length > 0 && protocol.length > 0) {
			if (protocol === "IPFS") {
				FSfriends.push(hash);
			}
			else if (protocol === "IPNS") {
				NSfriends.push(hash);
			}
		}
	}

	for (var i = 0; i < siteIDs.length; i++) {
		console.log(siteIDs);
		var id = siteIDs[i];
		var hash = document.getElementById("inputSiteHash"+id).value;
		var name = document.getElementById("inputName"+id).value;
		var protocol = document.querySelector('input[name="inputSiteProtocol{0}"]:checked'.format(id)).value.toLowerCase();

		if (hash.length > 0 && protocol.length > 0 && name.length > 0) {
			var site = {
				name: name,
				protocol: protocol,
				hash: hash
			};
			sites.push(site);
		}
	}

	var toBeConverted = {
		sites: sites,
		FSfriends: FSfriends,
		NSfriends: NSfriends
	};
	document.getElementById('jsonText').value = JSON.stringify(toBeConverted);
	submitJSON();
}