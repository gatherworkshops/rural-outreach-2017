$(document).ready( function() {


    var FEED_URL = "https://spreadsheets.google.com/feeds/list/1CuPYRq_8d-BwT6Lm3HLPTv7zt6soeSuRC2wgqsw8Wy0/oui6n6y/public/values?alt=json";
    var CENTER = { lat: -41, lng: 174 };
    var ZOOM = 5;
    
    var map;
    var schools;
    
    
    function initialize() {
       
      createMap();
      loadData();
      
    }
    
    
    /*
    Create the map instance, centered on NZ
    */
    function createMap() {
      
      var mapOptions = {
        zoom: ZOOM,
        center: new google.maps.LatLng(CENTER.lat, CENTER.lng)
      }
      
      map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
      
    }
    
    
    /* 
    Load the JSON data to be displayed on the map
    */
    function loadData() {
        
        console.log("loadData");
        $.ajax({
          dataType: "json",
          url: FEED_URL,
          success: processData
        });
        
    }
    
    
    function processData(data) {
        
        console.log("processData");
        schools = data.feed.entry;
        
        addMarkers();
    }
    
    
    /*
    Create the map markers from the loaded data
    */
    function addMarkers() {
        
        $(schools).each( function() {
            
            var schoolName = this["gsx$schoolname"]["$t"];
            var geoLat = this["gsx$geolatitude"]["$t"];
            var geoLng = this["gsx$geolongitude"]["$t"];
            var areaClass = this["gsx$schoolareaclassification"]["$t"];
            var approved = this["gsx$approved"]["$t"];
            
            var image;
            
            if(approved == "1") {
                image = "star-";
            } else {
                image = "blank-";
            }
            
            if(areaClass == "Rural Area") {
                image += "red.png";
            } else if(areaClass == "Secondary Urban Area") {
                image += "orange.png";
            } else if(areaClass == "Minor Urban Area") {
                image += "yellow.png";
            }else if(areaClass == "Main Urban Area") {
                image += "green.png";
            } else {
                image += "grey.png";
            }
            
            var marker = new google.maps.Marker({
              position: new google.maps.LatLng(geoLat, geoLng),
              map: map,
              title: schoolName,
              icon: image
            });
            
            marker.schoolData = this;
            
            google.maps.event.addListener(marker, 'click', function() {
                showSchoolInfo(marker.schoolData);
            });
            
        });
        
    }
    
    
    function showSchoolInfo(schoolData) {
        
        var schoolName = schoolData["gsx$schoolname"]["$t"];
        var areaClass = schoolData["gsx$schoolareaclassification"]["$t"];
        var info = "";
        
        for(var col in schoolData) {
            
            if( col.indexOf("gsx$") > -1 ) {
                
                info += "<p>";
                info += "<b>"+col.replace("gsx$", "")+"</b><br>";
                info += schoolData[col]["$t"];
                info += "</p>";
                
            }
            
        }
        
        $('#infoPanel').html( 
            '<h2>' + schoolName + '</h2>' +
            '<p>' + areaClass + '</p>' +
            info
            
        );
    }
    
    google.maps.event.addDomListener(window, 'load', initialize);

});