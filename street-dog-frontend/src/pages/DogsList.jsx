import { useEffect, useState } from "react";
import api from "../api/axiosConfig";

export default function DogsList() {
  const [dogs, setDogs] = useState([]);

  useEffect(() => {
    api.get("/dogs")
      .then(res => setDogs(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>All Dogs</h1>
      {dogs.length === 0 ? (
        <p>No dogs found</p>
      ) : (
        dogs.map(d => (
          <div key={d.id} style={{ borderBottom: "1px solid #ddd", padding: "10px" }}>
            <h3>{d.name}</h3>
            <p>Status: {d.status}</p>
          </div>
        ))
      )}
    </div>
  );
}
