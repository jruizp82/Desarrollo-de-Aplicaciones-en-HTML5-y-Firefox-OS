  var map, lat, lng;
  localStorage.cont = (localStorage.cont || "0");

    $(function(){
    	
      $("#inicializar").on('click', function() {
    		initList ();
    		localStorage.cont=0;
    		
      });
      
      function initList() {
    		var r = confirm ('¿Desea borrar el mapa?');
    		if (r == true){
    			localStorage.cont =0;
    			
    			for (var i = 0; i<=10000;i++){
    				localStorage.removeItem(i);
    			}
    			
    			geolocalizar();
    		}
      }

      function enlazarMarcador(e){

       // muestra ruta entre marcas anteriores y actuales
        map.drawRoute({
          origin: [lat, lng],  // origen en coordenadas anteriores
          // destino en coordenadas del click o toque actual
          destination: [e.latLng.lat(), e.latLng.lng()],
          travelMode: 'driving',
          strokeColor: '#000000',
          strokeOpacity: 0.6,
          strokeWeight: 5
        });

        lat = e.latLng.lat();   // guarda coords para marca siguiente
        lng = e.latLng.lng();
        
        var posArr = new Array();
    	posArr[0] = lat;
    	posArr[1] = lng;
    	
    	localStorage.cont= +localStorage.cont +1;
    	localStorage.setItem (localStorage.cont,JSON.stringify(posArr));
    	
        map.addMarker({ lat: lat, lng: lng});  // pone marcador en mapa
      };
      
      function draw (mlat, mlng){
    	  map.drawRoute({
              origin: [lat, lng],  // origen en coordenadas anteriores
              // destino en coordenadas del click o toque actual
              destination: [mlat, mlng],
              travelMode: 'driving',
              strokeColor: '#000000',
              strokeOpacity: 0.6,
              strokeWeight: 5
            });

    	  lat = mlat;   // guarda coords para marca siguiente
          lng = mlng;
    	  map.addMarker({ lat: lat, lng: lng});   // pone marcador en mapa
      }

      function geolocalizar(){
        GMaps.geolocate({
          success: function(position){
          	  if (localStorage.cont>0){
        		  posArr = JSON.parse(localStorage.getItem(0));
        		  lat = posArr[0];
          		  lng = posArr[1];
        	  }else{
        	
        		  lat = position.coords.latitude;
                  lng = position.coords.longitude;
                  var posArr = new Array();
                  posArr[0] = lat;
              	  posArr[1] = lng;
                  localStorage.setItem (0,JSON.stringify(posArr));
        	  }
        	  
            map = new GMaps({  // muestra mapa centrado en coords [lat, lng]
              el: '#map',
              lat: lat,
              lng: lng,
              click: enlazarMarcador,
              tap: enlazarMarcador
            });
            
            map.addMarker({ lat: lat, lng: lng});  // marcador en [lat, lng]
            
            if (localStorage.cont>0){
	            for (var i = 1; i<=localStorage.cont;i++){
	           
	            	var posArr = JSON.parse(localStorage.getItem(i));
	            	if (posArr!=null){
	            		draw (posArr[0],posArr[1]);
	            	}
	            }
            }
          },
          error: function(error) { alert('Geolocalización falla: '+error.message); },
          not_supported: function(){ alert("Su navegador no soporta geolocalización"); },
        });
      };

      geolocalizar();
    });
