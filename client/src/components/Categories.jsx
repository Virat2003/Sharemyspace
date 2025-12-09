import React from "react";
import { categories } from "../data";
import { Link } from "react-router-dom";
import "../styles/Categories.css"



const Categories = () => {
  return (
    <div className="categories">
      <h1>Explore Top Categories</h1>
      <p>
        Explore a wide range of spaces — from cozy rooms and secure parking to
        offices, event venues, and outdoor areas — all in one place
      </p>

      <div className="categories_list">
        {categories?.slice(1,4).map((category, index)=>(
            <Link to={`/properties/category/${category.label}`}>
                <div className="category" key={index}>
                    <img src={category.img} alt={category.label} />
                    <div className="overlay"></div>
                        <div className="category_text">
                            <div className="category_text_icon">{category.icon}</div>
                            <p>{category.label}</p>
                        </div>
                    </div>
            </Link>
        ))}
      </div>
    </div>
  );
};

export default Categories;
