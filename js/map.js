var map;
initMap();

function removeMap()
{
	element = document.getElementById('map');
	if(element != null){
		element.parentNode.removeChild(element);
	}
	
}

function initMap() {
	var myLatlng = new google.maps.LatLng(55.896828, 13.415251);
	var myOptions = {
		zoom: 8,
		center: myLatlng,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map(document.getElementById('map'),myOptions);

	
    var contentString = '<div id="content">'+
        '<div id="siteNotice">'+
        '</div>'+
        '<h1 id="firstHeading" class="firstHeading">Stehags kyrka</h1>'+
        '<div id="bodyContent">'+
        '<p><b>Stehags Kyrka</b>är en kyrka från mitten av elvahundratalet i Östra Onsjö församling, Lunds stift.</p>'+
        '<p>Mer info: <a href="http://www.svenskakyrkan.se/default.aspx?id=645323">'+
        'http://www.svenskakyrkan.se/default.aspx?id=645323</a></p>'+
        '</div>'+
        '</div>';
        
    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });

    var marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        title: 'Stehags Kyrka'
    });
    google.maps.event.addListener(marker, 'click', function() {
      infowindow.open(map,marker);
    });

}