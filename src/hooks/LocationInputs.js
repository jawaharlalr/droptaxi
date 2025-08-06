/* global google */
import React, { useEffect } from 'react';
import loadGoogleMapsAPI from '../utils/loadGoogleMapsAPI';

const LocationInputs = ({
  onSourcePlaceSelect,
  onDestinationPlaceSelect,
  pickupError,
  dropError,
}) => {
  useEffect(() => {
    let cancelled = false;

    loadGoogleMapsAPI().then(async () => {
      if (cancelled || !window.google?.maps?.importLibrary) return;

      await google.maps.importLibrary('places');

      const initAutocomplete = (elementId, onSelect) => {
        const container = document.getElementById(elementId);
        if (!container) {
          console.warn(`Container not found: #${elementId}`);
          return;
        }

        container.innerHTML = '';

        const input = new google.maps.places.PlaceAutocompleteElement({
          includedRegionCodes: ['IN'],
        });

        input.addEventListener('gmp-select', async ({ placePrediction }) => {
          const place = placePrediction.toPlace();
          await place.fetchFields({
            fields: ['displayName', 'location', 'formattedAddress'],
          });

          const addressText = `${place.displayName || ''}, ${place.formattedAddress || ''}`.toLowerCase();

          // Block Chennai
          if (addressText.includes('chennai')) {
            alert('Please select a location outside Chennai.');
            input.clear(); // optional: clears the field
            return;
          }

          const lat =
            typeof place.location?.lat === 'function'
              ? place.location.lat()
              : place.location?.lat;

          const lng =
            typeof place.location?.lng === 'function'
              ? place.location.lng()
              : place.location?.lng;

          const data = {
            address: `${place.displayName || ''}, ${place.formattedAddress || ''}`.trim(),
            location: {
              lat,
              lng,
            },
          };

          if (typeof onSelect === 'function') {
            onSelect(data);
          } else {
            console.warn(`onSelect is not a function for #${elementId}`);
          }
        });

        container.appendChild(input);
      };

      initAutocomplete('pickup-input', onSourcePlaceSelect);
      initAutocomplete('drop-input', onDestinationPlaceSelect);
    });

    return () => {
      cancelled = true;
    };
  }, [onSourcePlaceSelect, onDestinationPlaceSelect]);

  return (
    <div className="space-y-4">
      {/* Pickup */}
      <div>
        <label className="block mb-1 text-sm text-gray-300">Pickup Location</label>
        <div
          id="pickup-input"
          className={`overflow-hidden rounded-md ${
            pickupError ? 'ring-2 ring-red-500' : ''
          }`}
        />
        {pickupError && (
          <p className="mt-1 text-sm text-red-400">{pickupError}</p>
        )}
      </div>

      {/* Drop */}
      <div>
        <label className="block mb-1 text-sm text-gray-300">Drop Location</label>
        <div
          id="drop-input"
          className={`overflow-hidden rounded-md ${
            dropError ? 'ring-2 ring-red-500' : ''
          }`}
        />
        {dropError && (
          <p className="mt-1 text-sm text-red-400">{dropError}</p>
        )}
      </div>
    </div>
  );
};

export default LocationInputs;
