import { useState } from "react";
import api from "../api/axiosConfig";

export default function AddDog() {
  const [name, setName] = useState("");

  const submit = () => {
    api.post("/dogs", { name })
      .then(() => alert("Dog added"))
      .catch(err => console.error(err));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Add Dog</h1>

      <input
        type="text"
        placeholder="Dog Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button onClick={submit}>Save</button>
    </div>
  );
}
