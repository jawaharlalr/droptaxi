import { useEffect } from 'react';

const useDistanceCalculator = (
  sourcePlaceId,
  destinationPlaceId,
  vehicleType,
  setDistance,
  setDuration,
  setCost,
  setMessage,
  tripType
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
          if (status === 'OK') {
            const result = response.rows[0].elements[0];

            if (result.status === 'OK') {
              let km = result.distance.value / 1000;
              let mins = result.duration.value / 60;

              // If round trip, double distance & duration
              if (tripType === 'round') {
                km *= 2;
                mins *= 2;
              }

              // Fare rates per km
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

              const rate = tripType === 'round' ? rateObj.round : rateObj.single;
              const price = Math.round(km * rate);

              setDistance(km.toFixed(2));
              setDuration(Math.round(mins));
              setCost(price);
              setMessage('');
            } else {
              setMessage('Distance calculation failed.');
            }
          } else {
            setMessage('Google Maps error.');
          }
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
  ]);
};

export default useDistanceCalculator;
