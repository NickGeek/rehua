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

	//Display friends and sites
	for (var i = 0; i < friends.length; i++) {
		var friend = friends[i];
		var div = document.getElementById('friends');
		if (i === 0)
			div.innerHTML = "";

		var ipfsCheck = "";
		var ipnsCheck = "";
		if (friend.protocol === "ipfs") {
			ipfsCheck = 'checked="true"';
		}
		else {
			ipnsCheck = 'checked="true"';
		}
		div.innerHTML += '<input id="inputFriendHash{0}" type="text" autocomplete=off placeholder="Friend\'s Hash (e.g QmeL2BzYEQE99wqWnVY2pmypHbPeLLcv29hu5nA3ZRS255)" value="{3}" /><input class="inputFriendProtocol{0}" name="inputFriendProtocol" type="radio" value="IPFS" {1} /> IPFS<input class="inputFriendProtocol{0}" name="inputFriendProtocol" type="radio" value="IPNS" {2} /> IPNS'.format(i, ipfsCheck, ipnsCheck, friend.hash);
	}
	div.innerHTML = '<input id="inputFriendHash{0}" type="text" autocomplete=off placeholder="Friend\'s Hash (e.g QmeL2BzYEQE99wqWnVY2pmypHbPeLLcv29hu5nA3ZRS255)" /><input class="inputFriendProtocol{0}" name="inputFriendProtocol" type="radio" value="IPFS" /> IPFS<input class="inputFriendProtocol{0}" name="inputFriendProtocol" type="radio" value="IPNS" checked /> IPNS'.format(friends.length) + div.innerHTML;
}