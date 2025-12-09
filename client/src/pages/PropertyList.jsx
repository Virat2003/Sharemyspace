import "../styles/List.css";
import {useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import ListingCard from "../components/ListingCard";
import { setPropertyList } from "../redux/state";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import Footer from "../components/Footer";


const PropertyList = () => {

  const [loading, setLoading] = useState(true)


  /* function to fetch the property list*/
  const user = useSelector((state) => state.user);
  const propertyList = user?.propertyList;


  const dispatch = useDispatch()
  const getPropertyList = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/users/${user._id}/properties`,
        {
          method: "GET",
        }
      );

      const data = await response.json();
      dispatch(setPropertyList(data));
      setLoading(false);
    } catch (err) {
      console.log("Fetch all properties failed", err.message);
    }
  };



  useEffect(() => {
    getPropertyList()
  }, []);

  return loading ? <Loader /> : (
    <>
      <Navbar />
      <h1 className="title-list">Your Space List</h1>
      <div className="list">
        {propertyList?.map(
          ({
            _id,
            creator,
            listingPhotoPaths,
            city,
            state,
            country,
            category,
            type,
            price,
            booking = false,
          }) => (
            <ListingCard
              _id={_id}
              creator={creator}
              listingPhotoPaths={listingPhotoPaths}
              city={city}
              state={state}
              country={country}
              category={category}
              type={type}
              price={price}
              booking={booking}
            />
          )
        )}
      </div>
      <Footer />
    </>
  );
};

export default PropertyList;
