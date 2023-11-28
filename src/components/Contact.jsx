import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
const url = "https://mern-estate-backend.vercel.app";
const Contact = ({ listing }) => {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");
  const handleChange = (e) => {
    setMessage(e.target.value);
  };
  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        const { data } = await axios.get(
          `${url}/api/user/${listing.userRef}`,
          config
        );
        setLandlord(data);
      } catch (err) {
        console.log(err.response.data.message);
      }
    };
    fetchLandlord();
  }, [listing.userRef]);
  return (
    <>
      {landlord && (
        <div className="flex flex-col gap-2">
          <p>
            Contact <span className="font-semibold">{landlord.username}</span>{" "}
            for{" "}
            <span className="font-semibold">{listing.name.toLowerCase()}</span>{" "}
          </p>
          <textarea
            name="message"
            value={message}
            id="message"
            rows="2"
            onChange={handleChange}
            className="w-full border p-3 rounded-lg "
            placeholder="Enter your message here ..."
          ></textarea>
          <Link
            to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message} `}
            className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95"
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
};

export default Contact;
