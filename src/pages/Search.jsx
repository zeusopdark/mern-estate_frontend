import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ListingItem from "../components/ListingItem";
const url = import.meta.env.URL;
const Search = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [listing, setListing] = useState("");
  const [showMore, setShowMore] = useState(false);
  const [searchParams, setSearchParams] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at",
    order: "desc",
  });

  const handleChange = (e) => {
    if (
      e.target.name === "all" ||
      e.target.name === "rent" ||
      e.target.name === "sale"
    ) {
      setSearchParams((prevParams) => ({
        ...prevParams,
        type: e.target.name,
      }));
    } else if (e.target.name === "searchTerm") {
      setSearchParams((prevParams) => ({
        ...prevParams,
        searchTerm: e.target.value,
      }));
    } else if (
      e.target.name === "parking" ||
      e.target.name === "furnished" ||
      e.target.name === "offer"
    ) {
      setSearchParams((prevParams) => ({
        ...prevParams,
        [e.target.name]: e.target.checked,
      }));
    } else {
      const sort = e.target.value.split("_")[0] || "created_at";
      const order = e.target.value.split("_")[1] || "desc";
      setSearchParams({
        ...searchParams,
        sort,
        order,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();

    urlParams.set("searchTerm", searchParams.searchTerm);
    urlParams.set("type", searchParams.type);
    urlParams.set("parking", searchParams.parking);
    urlParams.set("furnished", searchParams.furnished);
    urlParams.set("offer", searchParams.offer);
    urlParams.set("sort", searchParams.sort);

    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if (
      searchTermUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSearchParams({
        searchTerm: searchTermUrl || "",
        type: typeFromUrl || "",
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
      });
    }
    const fetchListings = async () => {
      setShowMore(false);
      const searchQuery = urlParams.toString();
      try {
        setLoading(true);
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };
        const { data } = await axios.get(
          `${url}/api/listing/get?${searchQuery}`,
          config
        );
        if (data.length > 8) {
          setShowMore(true);
        }
        setLoading(false);
        setListing(data);
      } catch (err) {
        setLoading(false);
        console.log(err.response.data.message);
      }
    };
    fetchListings();
  }, [location.search]);

  const onShowMoreClick = async () => {
    setShowMore(false);
    const numberOfListings = listing.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { res } = await axios.get(
      `${url}/api/listing/get?${searchQuery}`,
      config
    );
    setListing([...listing, res]);
    if (data.length < 9) {
      setShowMore(false);
    } else {
      setShowMore(true);
    }
  };
  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term :
              <input
                type="text"
                name="searchTerm"
                value={searchParams.searchTerm}
                placeholder="Search..."
                onChange={handleChange}
                className="border rounded-lg p-3 ml-2 w-half"
              />
            </label>
          </div>

          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Type:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                name="all"
                onChange={handleChange}
                checked={searchParams.type === "all"}
                className="w-5"
              />
              <span>Rent & Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                onChange={handleChange}
                checked={searchParams.type === "rent"}
                name="rent"
                className="w-5"
              />
              <span>Rent </span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                onChange={handleChange}
                checked={searchParams.type === "sale"}
                name="sale"
                className="w-5"
              />
              <span>Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                onChange={handleChange}
                checked={searchParams.offer}
                name="offer"
                className="w-5"
              />
              <span>Offer</span>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Amenities:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                onChange={handleChange}
                checked={searchParams.parking}
                name="parking"
                className="w-5"
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                onChange={handleChange}
                checked={searchParams.furnished}
                name="furnished"
                className="w-5"
              />
              <span>Furnished </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <select
              onChange={handleChange}
              defaultValue={"created_at_desc"}
              name="sort_order"
              className="border rounded-lg p-3"
            >
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to high</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>
          <button className="w-full bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95">
            Search
          </button>
        </form>
      </div>
      <div className="flex-1">
        <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">
          Listing Results :
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && listing.length === 0 && (
            <p className="text-xl text-slate-700">No Listing Found</p>
          )}
          {loading && (
            <p className="text-xl text-slate-700 text-center w-full">
              Loading....
            </p>
          )}
          {!loading &&
            listing.length > 0 &&
            listing.map((list) => (
              <ListingItem key={list._id} listing={list} />
            ))}
          {showMore && (
            <button
              className="text-green-700 hover:underline p-7 text-center w-full"
              onClick={onShowMoreClick}
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
