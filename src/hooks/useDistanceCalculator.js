import { useEffect } from 'react';

const useDistanceCalculator = (
  sourcePlaceId,
  destinationPlaceId,
  vehicleType,
  setDistance,
  setDuration,
  setCost,
  setMessage,
  tripType,
  setSingleTripCost,
  setRoundTripCost
) => {
  useEffect(() => {
    if (sourcePlaceId && destinationPlaceId && vehicleType) {
      const service = new window.google.maps.DistanceMatrixService();

      service.getDistanceMatrix(
        {
          origins: [{ placeId: sourcePlaceId }],
          destinations: [{ placeId: destinationPlaceId }],
          travelMode: window.google.maps.TravelMode.DRIVING,
          unitSystem: window.google.maps.UnitSystem.METRIC,
        },
        (response, status) => {
          if (status !== 'OK') {
            setMessage('Google Maps error.');
            return;
          }

          const result = response.rows[0].elements[0];
          if (result.status !== 'OK') {
            setMessage('Distance calculation failed.');
            return;
          }

          const km = result.distance.value / 1000;
          const mins = result.duration.value / 60;

          const rates = {
            sedan: { single: 14, round: 13 },
            muv: { single: 18, round: 17 },
            innova: { single: 19, round: 18 },
          };

          const rateObj = rates[vehicleType];
          if (!rateObj) {
            setMessage('Invalid vehicle type selected.');
            return;
          }

          const singleTripCost = Math.round(km * rateObj.single);
          const roundTripCost = Math.round(km * rateObj.round); // No driver bata

          const finalCost = tripType === 'round' ? roundTripCost : singleTripCost;

          setDistance(km.toFixed(2));
          setDuration(Math.round(mins));
          setCost(finalCost);
          setMessage('');

          if (setSingleTripCost) setSingleTripCost(singleTripCost);
          if (setRoundTripCost) setRoundTripCost(roundTripCost);
        }
      );
    }
  }, [
    sourcePlaceId,
    destinationPlaceId,
    vehicleType,
    tripType,
    setDistance,
    setDuration,
    setCost,
    setMessage,
    setSingleTripCost,
    setRoundTripCost,
  ]);
};

export default useDistanceCalculator;
