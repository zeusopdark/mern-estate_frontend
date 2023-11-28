import React from "react";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import axios from "axios";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
const url = import.meta.env.URL;

const OAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);
      const information = {
        name: result.user.displayName,
        email: result.user.email,
        photo: result.user.photoURL,
      };
      const config = {
        headers: { "Content-Type": "application/json" },
      };
      const { data } = await axios.post(`${url}/api/auth/google`, {
        config,
        information,
      });
      dispatch(signInSuccess(data.rest));
      localStorage.setItem("token", data.token);
      navigate("/");
    } catch (err) {
      console.log("Could not sign in with google", err);
    }
  };
  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95"
    >
      Continue with Google
    </button>
  );
};

export default OAuth;
