// src/hooks/usePlacesAutocomplete.js
import { useEffect } from 'react';
import loadGoogleMapsAPI from '../utils/loadGoogleMapsAPI';

const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const usePlacesAutocomplete = (
  sourceRef,
  destinationRef,
  setSource,
  setSourcePlaceId,
  setDestination,
  setDestinationPlaceId
) => {
  useEffect(() => {
    let sourceAutocomplete = null;
    let destinationAutocomplete = null;

    const initAutocomplete = async () => {
      try {
        const google = await loadGoogleMapsAPI(apiKey);

        if (!google?.maps?.places?.Autocomplete) {
          console.error('❌ Autocomplete class not available. Is Places API enabled?');
          return;
        }

        const options = {
          fields: ['place_id', 'formatted_address'],
          componentRestrictions: { country: 'in' },
        };

        if (sourceRef.current) {
          sourceAutocomplete = new google.maps.places.Autocomplete(sourceRef.current, options);
          sourceAutocomplete.addListener('place_changed', () => {
            const place = sourceAutocomplete.getPlace();
            if (place?.place_id && place?.formatted_address) {
              setSource(place.formatted_address);
              setSourcePlaceId(place.place_id);
            }
          });
        }

        if (destinationRef.current) {
          destinationAutocomplete = new google.maps.places.Autocomplete(destinationRef.current, options);
          destinationAutocomplete.addListener('place_changed', () => {
            const place = destinationAutocomplete.getPlace();
            if (place?.place_id && place?.formatted_address) {
              setDestination(place.formatted_address);
              setDestinationPlaceId(place.place_id);
            }
          });
        }
      } catch (err) {
        console.error('❌ Failed to initialize Google Autocomplete:', err);
      }
    };

    if (sourceRef.current && destinationRef.current) {
      initAutocomplete();
    }

    return () => {
      if (window.google?.maps?.event) {
        if (sourceAutocomplete) window.google.maps.event.clearInstanceListeners(sourceAutocomplete);
        if (destinationAutocomplete) window.google.maps.event.clearInstanceListeners(destinationAutocomplete);
      }
    };
  }, [sourceRef, destinationRef, setSource, setSourcePlaceId, setDestination, setDestinationPlaceId]);
};

export default usePlacesAutocomplete;