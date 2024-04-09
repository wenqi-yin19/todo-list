import React, { useEffect, useRef } from 'react';

function MapView({ latitude, longitude }) {
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current && !isNaN(latitude) && !isNaN(longitude)) { 
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: latitude, lng: longitude }, 
        zoom: 12 
      });

      new window.google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map: map,
        title: 'Task Location'
      });
    }
  }, [latitude, longitude]);

  return <div ref={mapRef} style={{ width: '100%', height: '250px' }} />; 
}

export default MapView;
