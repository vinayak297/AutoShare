import { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, addDoc, onSnapshot, serverTimestamp } from "firebase/firestore";
import { useParams } from "react-router-dom";

function Chat() {

  const { rideId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {

    const messagesRef = collection(db, "rides", rideId, "messages");

    const unsubscribe = onSnapshot(messagesRef, (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data());
      setMessages(data);
    });

    return () => unsubscribe();

  }, [rideId]);

  async function sendMessage() {

    if (!text) return;

    const messagesRef = collection(db, "rides", rideId, "messages");

    await addDoc(messagesRef, {
      sender: "User",
      text: text,
      timestamp: serverTimestamp()
    });

    setText("");
  }

  return (
    <div>

      <h2>Ride Chat</h2>

      <div>
        {messages.map((msg, index) => (
          <p key={index}>
            <b>{msg.sender}</b>: {msg.text}
          </p>
        ))}
      </div>

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type message..."
      />

      <button onClick={sendMessage}>
        Send
      </button>

    </div>
  );
}

export default Chat;