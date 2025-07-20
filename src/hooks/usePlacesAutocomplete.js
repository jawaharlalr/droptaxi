import { useEffect } from 'react';
import loadGoogleMapsAPI from '../utils/loadGoogleMapsAPI';

const usePlacesAutocomplete = (
  sourceRef,
  destinationRef,
  setSource,
  setSourcePlaceId,
  setDestination,
  setDestinationPlaceId
) => {
  useEffect(() => {
    let sourceElement = null;
    let destinationElement = null;

    const sourceNode = sourceRef.current;
    const destinationNode = destinationRef.current;

    const sourceListener = async (event) => {
      const place = event.placePrediction.toPlace();
      await place.fetchFields({ fields: ['displayName', 'id'] });

      const address = place.displayName?.text || '';
      const placeId = place.id;

      setSource(address);
      setSourcePlaceId(placeId);
    };

    const destinationListener = async (event) => {
      const place = event.placePrediction.toPlace();
      await place.fetchFields({ fields: ['displayName', 'id'] });

      const address = place.displayName?.text || '';
      const placeId = place.id;

      setDestination(address);
      setDestinationPlaceId(placeId);
    };

    const initAutocomplete = async () => {
      try {
        const google = await loadGoogleMapsAPI();
        await google.maps.importLibrary('places');

        if (sourceNode) {
          sourceElement = new google.maps.places.PlaceAutocompleteElement();
          sourceElement.id = 'source-autocomplete';
          sourceElement.className = 'w-full mb-4';
          sourceElement.setAttribute(
            'component-restrictions',
            JSON.stringify({ country: ['IN'] })
          );

          sourceNode.innerHTML = '';
          sourceNode.appendChild(sourceElement);
          sourceElement.addEventListener('gmp-select', sourceListener);
        }

        if (destinationNode) {
          destinationElement = new google.maps.places.PlaceAutocompleteElement();
          destinationElement.id = 'destination-autocomplete';
          destinationElement.className = 'w-full';
          destinationElement.setAttribute(
            'component-restrictions',
            JSON.stringify({ country: ['IN'] })
          );

          destinationNode.innerHTML = '';
          destinationNode.appendChild(destinationElement);
          destinationElement.addEventListener('gmp-select', destinationListener);
        }
      } catch (err) {
        console.error('❌ Failed to initialize PlaceAutocompleteElement:', err);
      }
    };

    initAutocomplete();

    return () => {
      if (sourceElement) sourceElement.removeEventListener('gmp-select', sourceListener);
      if (destinationElement) destinationElement.removeEventListener('gmp-select', destinationListener);
      if (sourceNode) sourceNode.innerHTML = '';
      if (destinationNode) destinationNode.innerHTML = '';
    };
  }, [
    sourceRef,
    destinationRef,
    setSource,
    setSourcePlaceId,
    setDestination,
    setDestinationPlaceId,
  ]);
};

export default usePlacesAutocomplete;
