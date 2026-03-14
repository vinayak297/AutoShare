import { db } from "./firebase";
import { collection, getDocs, addDoc, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { useState, useEffect } from "react";
import './App.css';

const currentUser = "user1";
const userName = "user1";

function App() {

  const [rides, setRides] = useState([]);
  const [standName, setStandName] = useState("");
  const [destination, setDestination] = useState("");
  const [capacity, setCapacity] = useState(4);

  const myRides = rides.filter((ride) => ride.creatorId === currentUser);
  const availableRides = rides.filter(
  (ride) =>
    !ride.passengerNames?.includes(userName) &&
    ride.creatorId !== userName &&
    ride.passengers < ride.capacity
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

<div className="app">

  <header className="header">
    🚖 AutoShare
  </header>

  {/* Create Ride */}

  <div className="create-section">

    <input
      type="text"
      placeholder="Stand Name"
      value={standName}
      onChange={(e)=>setStandName(e.target.value)}
    />

    <input
      type="text"
      placeholder="Destination"
      value={destination}
      onChange={(e)=>setDestination(e.target.value)}
    />

    <input
      type="number"
      value={capacity}
      onChange={(e)=>setCapacity(e.target.value)}
    />

    <button onClick={createRide}>
      Create Ride
    </button>

  </div>

  {/* Rides */}

  <div className="rides-container">

    {/* My Rides */}

    <div className="rides-column">
      <h2>My Rides</h2>

      {myRides.map((ride) => (

        <div key={ride.id} className="ride-card">

          <div className="route">
            🚖 {ride.standName} → {ride.destination}
          </div>

          <div className="ride-details">
            👥 {ride.passengers}/{ride.capacity} seats
          </div>

          <div className="time">
            {formatDateTime(ride.createdAt)}
          </div>

        </div>

      ))}

    </div>

    {/* Available Rides */}

    <div className="rides-column">
      <h2>Available</h2>

      {availableRides.map((ride) => (

        <div key={ride.id} className="ride-card">

          <div className="route">
            🚖 {ride.standName} → {ride.destination}
          </div>

          <div className="ride-details">
            👥 {ride.passengers}/{ride.capacity} seats
          </div>

          <div className="time">
            {formatDateTime(ride.createdAt)}
          </div>

          <button
            className="join-btn"
            disabled={ride.passengers >= ride.capacity}
            onClick={()=>joinRide(ride)}
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