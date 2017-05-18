var amataMap = new Class({    
    initialize: function(container,startLat,startLong,startZoom,markerIcon,markerShadow){
		if (GBrowserIsCompatible()) {
			var map = new GMap2($(container));
			map.setCenter(new GLatLng(startLat,startLong), startZoom);
			map.addControl(new GSmallMapControl());
			map.addControl(new GMapTypeControl());

			var tinyIcon = new GIcon();
			tinyIcon.image = markerIcon;
			tinyIcon.shadow = markerShadow;
			tinyIcon.iconSize = new GSize(12, 20);
			tinyIcon.shadowSize = new GSize(22, 20);
			tinyIcon.iconAnchor = new GPoint(6, 20);
			tinyIcon.infoWindowAnchor = new GPoint(5, 1);

			markerOptions = { icon:tinyIcon };
			for (var i = 0; i < points.length; i++) {				
				var latlng = new GLatLng(points[i].lat,points[i].lng);
				map.addOverlay(this.createMarker(latlng,markerOptions,points[i].text));	
			}
			window.addEvent('unload',function(){GUnload();});
  		}
	},
	createMarker:function(point,newMarkerOptions,markerText) {
		markerOptions = newMarkerOptions;
		var marker = new GMarker(point, markerOptions);
		marker.cityName = markerText;
		GEvent.addListener(marker, "click", function() {
    		marker.openInfoWindowHtml('<span style="color: #4b699c; font-size: 12px; font-weight: bold;">' + marker.cityName + '</span>');
		});
		return marker;
	}
});