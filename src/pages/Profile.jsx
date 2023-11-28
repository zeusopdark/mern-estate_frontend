import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailiure,
  deleteUserStart,
  deleteUserSuccess,
  logoutStart,
  logoutSuccess,
  logoutFailiure,
} from "../redux/user/userSlice";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import axios from "axios";
const url = import.meta.env.URL;
import { Link } from "react-router-dom";
const Profile = () => {
  const dispatch = useDispatch();
  const fileRef = useRef();
  const [file, setFile] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [filePerc, setFilePerc] = useState(0);
  const [fileErr, setFileErr] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [formData, setFormData] = useState({
    email: currentUser.email,
    username: currentUser.username,
    password: "",
  });

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const sotrageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(sotrageRef, file);
    uploadTask.on(
      "state changes",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (err) => {
        setFileErr(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json", //
          Authorization: `Bearer ${token}`,
        },
      };
      dispatch(updateUserStart());
      const { data } = await axios.post(
        `${url}/api/user/update/${currentUser._id}`,
        formData,
        config
      );
      console.log(data);
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (err) {
      dispatch(updateUserFailure(err.response.data.message));
    }
  };
  const handleUpdate = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDelete = async () => {
    try {
      dispatch(deleteUserStart());
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json", // Corrected the typo in "application"
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.delete(`${url}/api/user/delete/${currentUser._id}`, config);
      dispatch(deleteUserSuccess());
      localStorage.removeItem("token");
    } catch (err) {
      dispatch(deleteUserFailiure(err.response.data.message));
    }
  };

  const handleSignout = async () => {
    try {
      dispatch(logoutStart());
      localStorage.removeItem("token");
      await axios.get(`${url}/api/auth/signout`);
      dispatch(logoutSuccess());
    } catch (err) {
      dispatch(logoutFailiure(err.response.data.message));
    }
  };

  const handleShowListing = async () => {
    try {
      setShowListingsError(false);
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json", //
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.get(
        `${url}/api/user/listings/${currentUser._id}`,
        config
      );
      setUserListings(data);
    } catch (err) {
      setShowListingsError(true);
      console.log(err);
    }
  };

  const handleDeleteListing = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json", //
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.delete(
        `${url}/api/listing/delete/${id}`,
        config
      );
      setUserListings((prev) => prev.filter((listing) => listing._id !== id));
      console.log(data);
    } catch (err) {
      console.log(err.response.data.message);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          ref={fileRef}
          hidden
          accept="image/"
        />
        <img
          src={formData.avatar || currentUser.avatar}
          onClick={() => fileRef.current.click()}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        <p className="text-sm self-center">
          {fileErr ? (
            <span className="text-red-700">
              Error Image Upload (Image must be less than 2MB)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">Image Successfully Uploaded</span>
          ) : (
            ""
          )}
        </p>

        <input
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg"
          name="username"
          value={formData.username}
          onChange={handleUpdate}
        />
        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg"
          name="email"
          value={formData.email}
          onChange={handleUpdate}
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          name="password"
          value={formData.password}
          onChange={handleUpdate}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading" : "Update"}
        </button>
        <Link
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
          to={"/create-listing"}
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span onClick={handleDelete} className="text-red-600 cursor-pointer">
          Delete Account
        </span>
        <span onClick={handleSignout} className="text-red-600 cursor-pointer">
          Sign Out
        </span>
      </div>
      <p className="text-red-700 mt-5 text-center">{error ? error : ""}</p>
      <p className="text-green-700 mt-5 text-center">
        {updateSuccess ? "Success" : ""}
      </p>
      <button className="text-green-700 w-full" onClick={handleShowListing}>
        Show Listings
      </button>
      <p className="text-red-700 mt-5 text-center">
        {showListingsError ? "Error showing Listings" : ""}
      </p>
      {userListings && userListings.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-2xl font-semibold">
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div
              className="border rounded-lg flex p-3 gap-4 justify-between items-center"
              key={listing._id}
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  className="h-16 w-16 object-contain"
                  alt="listing cover"
                />
              </Link>
              <Link
                className="flex-1 text-slate-500 font-semibold  hover:underline truncate"
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>
              <div className="item-center flex flex-col ">
                <button
                  onClick={() => handleDeleteListing(listing._id)}
                  className="text-red-700 uppercase"
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className="text-green-700 uppercase">Update</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
