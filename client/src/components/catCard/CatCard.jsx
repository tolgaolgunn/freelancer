import React from "react";
import { Link } from "react-router-dom";
import "./CatCard.scss";

function CatCard({ card }) {
  return (
    <Link to={`/gigs?cat=${card.link}`} className="catCard">
      <div>
        <img src={card.img} alt={card.title || "Category Image"} />
        <span className="desc">{card.desc}</span>
        <span className="title">{card.title}</span>
      </div>
    </Link>
  );
}

export default CatCard;

