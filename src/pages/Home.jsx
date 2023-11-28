import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import ListingItem from "../components/ListingItem";
const url = import.meta.env.URL;
import "swiper/css/bundle";
import SwiperCore from "swiper";
const Home = () => {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);
  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const config = { headers: { "Content-Type": "application/json" } };
        const { data } = await axios.get(
          `${url}/api/listing/get?offer=true&limit=4`,
          config
        );
        setOfferListings(data);
        fetchRentListings();
      } catch (err) {
        console.log(err);
      }
    };
    const fetchRentListings = async () => {
      try {
        const config = { headers: { "Content-Type": "application/json" } };
        const { data } = await axios.get(
          `${url}/api/listing/get?type=rent&limit=4`,
          config
        );
        setRentListings(data);
        fetchsaleListings();
      } catch (err) {
        console.log(err);
      }
    };

    const fetchsaleListings = async () => {
      try {
        const config = { headers: { "Content-Type": "application/json" } };
        const { data } = await axios.get(
          `${url}/api/listing/get?type=sale&limit=4`,
          config
        );
        setSaleListings(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchOfferListings();
  }, []);
  return (
    <div>
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto ">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-5xl">
          Find a home that suits your
          <br />
          <span className="text-slate-500">lifestyle.</span>
        </h1>
        <div className="text-gray-400 text-xs sm:text-sm">
          NLP Estate is the best place to find your next perfect place to live.
          <br />
          We have a wide range of properties for you to choose.
          <Link
            className="text-xs sm:tex-sm text-blue-800 font-bold hover:underline"
            to={"/search"}
          >
            Let's Get Started.
          </Link>
        </div>
      </div>

      <Swiper navigation>
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
                className="h-[500px]"
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>

      <div className="max-w-6xl  p-3 flex flex-col  gap-8 my-10 mx-auto">
        {offerListings && offerListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent offers
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={"/search?offer=true"}
              >
                Show more offers
              </Link>
            </div>

            <div className="flex flex-wrap gap-4">
              {offerListings.map((list) => (
                <ListingItem key={list._id} listing={list} />
              ))}
            </div>
          </div>
        )}

        {rentListings && rentListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent places for rent
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={"/search?type=rent"}
              >
                Show more places for rent
              </Link>
            </div>

            <div className="flex flex-wrap gap-4">
              {rentListings.map((list) => (
                <ListingItem key={list._id} listing={list} />
              ))}
            </div>
          </div>
        )}

        {saleListings && saleListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent places for sale
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={"/search?type=sale"}
              >
                Show more places for sale
              </Link>
            </div>

            <div className="flex flex-wrap gap-4">
              {saleListings.map((list) => (
                <ListingItem key={list._id} listing={list} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
