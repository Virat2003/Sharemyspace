import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { categories } from "../data";
import { setListings } from "../redux/state";
import "../styles/Listing.css";
import ListingCard from "./ListingCard";
import Loader from "./Loader";

const Listings = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState("All");

  const listings = useSelector((state) => state.listings);

  const getFeedListings = async () => {
    try {
      const response = await fetch(
        selectedCategory !== "All"
          ? `http://localhost:3001/properties/?category=${selectedCategory}`
          : "http://localhost:3001/properties",
        {
          method: "GET",
        }
      );
      const data = await response.json();
      dispatch(setListings({ listings: data }));
      setLoading(false);
    } catch (err) {
      console.log("failed fetching listings:", err.message);
    }
  };

  useEffect(() => {
    getFeedListings();
  }, [selectedCategory]);

  console.log(listings);

  return (
    <>
      <div className="category-list">
        {categories?.map((category, index) => (
          <div
            className={`category`}
            key={index}
            onClick={() => setSelectedCategory(category.label)}
          >
            <div className="category_icon">{category.icon}</div>
            <p>{category.label}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="listings">
          {listings.map(
            (
              {_id,
              creator,
              listingPhotoPaths,
              city,
              state,
              country,
              category,
              type,
              price
              }) => (
              <ListingCard
                _id = {_id}
                creator = {creator}
                listingPhotoPaths = {listingPhotoPaths}
                city = {city}
                state = {state}
                country = {country}
                category = {category}
                type = {type}
                price = {price}
              />
            )
          )}
        </div>
      )}
    </>
  );
};

export default Listings;
