import { db } from "./firebase";
import { collection, getDocs, addDoc, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { useState, useEffect } from "react";
import './App.css';

const currentUser = "user1";

function App() {

  const [rides, setRides] = useState([]);
  const [standName, setStandName] = useState("");
  const [destination, setDestination] = useState("");
  const [capacity, setCapacity] = useState(4);

  const myRides = rides.filter((ride) => ride.creatorId === currentUser);
  const availableRides = rides.filter(
  (ride) => ride.creatorId !== currentUser && ride.passengers < ride.capacity
);
  function formatDateTime(timestamp) {
  if (!timestamp) return "";

  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);

  return date.toLocaleString();
}

  useEffect(() => {
    loadRides();
  }, []);

  async function loadRides() {

    const querySnapshot = await getDocs(collection(db, "rides"));

    const ridesData = [];

    querySnapshot.forEach((doc) => {
      ridesData.push({
        id: doc.id,
        ...doc.data()
      });
    });

    setRides(ridesData);
  }

  async function createRide() {

    await addDoc(collection(db, "rides"), {
  standName: standName,
  destination: destination,
  capacity: Number(capacity),
  passengers: 1,
  creatorId: currentUser,
  passengerNames: ["Driver"],
  chatEnabled: true
});

    loadRides();

    setStandName("");
    setDestination("");
  }

  async function joinRide(ride) {

  if (ride.passengers >= ride.capacity) return;

  const name = prompt("Enter your name");

  if (!name) return;

  const rideRef = doc(db, "rides", ride.id);

  await updateDoc(rideRef, {
    passengers: ride.passengers + 1,
    passengerNames: arrayUnion(name)
  });

  loadRides();

  // redirect to chat page
  window.location.href = "/chat/" + ride.id;
}

  return (
    <div>

      <h1>AutoShare</h1>

      {/* Create Ride */}

      <h2>Create Ride</h2>

      <input
        type="text"
        placeholder="Stand Name"
        value={standName}
        onChange={(e) => setStandName(e.target.value)}
      />

      <input
        type="text"
        placeholder="Destination"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
      />

      <input
        type="number"
        placeholder="Capacity"
        value={capacity}
        onChange={(e) => setCapacity(e.target.value)}
      />

      <button onClick={createRide}>
        Create Ride
      </button>

      {/* Rides Columns */}

      <div className="rides-container">

        {/* My Rides Column */}
        <div className="rides-column">
          <h2>My Rides</h2>

          {myRides.map((ride) => (
            <div key={ride.id} className="ride-card">
              <p>{ride.standName} → {ride.destination}</p>
              <p>Passengers: {ride.passengers} / {ride.capacity}</p>
            
              <p>Created: {formatDateTime(ride.createdAt)}</p>
            </div>
          ))}
        </div>

        {/* Available Rides Column */}
        <div className="rides-column">
          <h2>Available Rides</h2>

          {availableRides.map((ride) => (
            <div key={ride.id} className="ride-card">
              <p>{ride.standName} → {ride.destination}</p>
              <p>Passengers: {ride.passengers} / {ride.capacity}</p>
            
              <p>Created: {formatDateTime(ride.createdAt)}</p>

              <button
                disabled={ride.passengers >= ride.capacity}
                onClick={() => joinRide(ride)}
              >
                Join Ride
              </button>

            </div>
          ))}
        </div>

      </div>

    </div>
  );
}

export default App;