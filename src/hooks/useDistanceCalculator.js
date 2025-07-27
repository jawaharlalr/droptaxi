import { useEffect, useState } from 'react';

export default function useDistanceCalculator({
  sourcePlace,
  destinationPlace,
  vehicleType,
  tripType,
  setSingleTripCost,
  setRoundTripCost,
  setMessage,
}) {
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [cost, setCost] = useState(null);

  useEffect(() => {
    const perKmRates = {
      sedan: { single: 14, round: 13 },
      muv: { single: 18, round: 17 },
      innova: { single: 19, round: 18 },
    };

    const calculate = async () => {
      if (
        !sourcePlace ||
        !destinationPlace ||
        !vehicleType ||
        typeof sourcePlace.location?.lat !== 'function' ||
        typeof sourcePlace.location?.lng !== 'function' ||
        typeof destinationPlace.location?.lat !== 'function' ||
        typeof destinationPlace.location?.lng !== 'function'
      ) {
        return;
      }

      try {
        const service = new window.google.maps.DistanceMatrixService();

        const origin = new window.google.maps.LatLng(
          sourcePlace.location.lat(),
          sourcePlace.location.lng()
        );
        const destination = new window.google.maps.LatLng(
          destinationPlace.location.lat(),
          destinationPlace.location.lng()
        );

        service.getDistanceMatrix(
          {
            origins: [origin],
            destinations: [destination],
            travelMode: window.google.maps.TravelMode.DRIVING,
          },
          (response, status) => {
            if (status === 'OK') {
              const element = response.rows[0].elements[0];
              const meters = element.distance.value;
              const seconds = element.duration.value;

              const kms = meters / 1000;
              const mins = Math.round(seconds / 60);

              const rates = perKmRates[vehicleType];
              if (!rates) {
                setMessage?.('Invalid vehicle type.');
                return;
              }

              const singleTripCost = Math.round(kms * rates.single);
              const roundTripCost = Math.round(kms * rates.round);

              setSingleTripCost?.(singleTripCost);
              setRoundTripCost?.(roundTripCost);

              const finalCost = tripType === 'roundtrip' ? roundTripCost : singleTripCost;

              setDistance(parseFloat(kms.toFixed(2)));
              setDuration(mins);
              setCost(finalCost);
              setMessage?.(
                `Rate: ₹${tripType === 'roundtrip' ? rates.round : rates.single}/km`
              );
            } else {
              console.error('DistanceMatrix failed:', status);
              setMessage?.('Distance request failed. Please try again.');
            }
          }
        );
      } catch (err) {
        console.error('Distance calculation error:', err);
        setMessage?.('Unexpected error occurred while calculating distance.');
      }
    };

    calculate();
  }, [
    sourcePlace,
    destinationPlace,
    vehicleType,
    tripType,
    setSingleTripCost,
    setRoundTripCost,
    setMessage,
  ]);

  return { distance, duration, cost };
}
