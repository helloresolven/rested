function test(data) {
	var k = ""
	$.each(data.items, function(i,item){
		k += item.media.m + "\n"
		$("<img/>").attr("src", item.media.m).appendTo("#jsonresponsebody");
		if ( i == 3 ) return false;
	});
	
	return k;
}

function callback(data) {
	var ol = $("<ol></ol>");
	
	$.each(data, function(i,tweet){
		var t = tweet.text;
		ol.append($("<li></li>").text(t));
	});
	
	ol.appendTo("#jsonresponsebody");	
}