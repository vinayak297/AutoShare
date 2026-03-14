import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

function NearbyRides() {

  const [rides, setRides] = useState([]);

  useEffect(() => {
    fetchRides();
  }, []);

  const fetchRides = async () => {
    const querySnapshot = await getDocs(collection(db, "rides"));

    const ridesData = [];

    querySnapshot.forEach((doc) => {
      ridesData.push({
        id: doc.id,
        ...doc.data()
      });
    });

    setRides(ridesData);
  };

  return (
    <div>
      <h2>Nearby Rides</h2>

      {rides.map((ride) => (
        <div key={ride.id}>
          <p>Stand: {ride.stand}</p>
          <p>Destination: {ride.destination}</p>
          <p>Seats: {ride.seats}</p>

          <button>Join Ride</button>
        </div>
      ))}
      
    </div>
  );
}

export default NearbyRides;