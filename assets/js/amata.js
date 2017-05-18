window.addEvent('domready', function(){
	if($('slider')){
		new slider('slider','tabs','slider-box-inner');
	}
	if($('amata-dealers-map')){
		new amataMap('amata-dealers-map',
					 58,92,3,
					 '/assets/templates/amata/images/layout/map-marker.png',
					 '/assets/templates/amata/images/layout/map-marker-shadow.png');
	}
});