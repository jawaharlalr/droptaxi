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
    if (!sourcePlaceId || !destinationPlaceId || !vehicleType) return;

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
          setMessage('Distance request failed. Please try again.');
          console.error('Distance Matrix error:', status, response);
          return;
        }

        const result = response?.rows?.[0]?.elements?.[0];
        if (!result || result.status !== 'OK') {
          setMessage('Unable to calculate distance for this route.');
          console.warn('Distance Matrix result:', result);
          return;
        }

        const distanceInKm = result.distance.value / 1000;
        const durationInMin = result.duration.value / 60;

        const rates = {
          sedan: { single: 14, round: 13 },
          muv: { single: 18, round: 17 },
          innova: { single: 19, round: 18 },
        };

        const rate = rates[vehicleType];
        if (!rate) {
          setMessage('Invalid vehicle type.');
          return;
        }

        const singleCost = Math.round(distanceInKm * rate.single);
        const roundCost = Math.round(distanceInKm * rate.round);
        const cost = tripType === 'round' ? roundCost : singleCost;

        // Set state with parsed numbers
        setDistance(parseFloat(distanceInKm.toFixed(2))); // float for summary math
        setDuration(Math.round(durationInMin));           // integer minutes
        setCost(cost);
        setMessage('');

        // Optional setters
        setSingleTripCost?.(singleCost);
        setRoundTripCost?.(roundCost);
      }
    );
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
