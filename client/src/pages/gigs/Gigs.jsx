import React, { useEffect, useRef, useState } from "react";
import "./Gigs.scss";
import GigCard from "../../components/gigCard/GigCard";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useLocation } from "react-router-dom";

function Gigs() {
  const [sort, setSort] = useState("sales");
  const [open, setOpen] = useState(false);
  const minRef = useRef();
  const maxRef = useRef();

  const { search } = useLocation();

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["gigs"],
    queryFn: () =>
      newRequest
        .get(
          `/gigs${search}&min=${minRef.current.value}&max=${maxRef.current.value}&sort=${sort}`
        )
        .then((res) => {
          return res.data;
        }),
  });

  console.log(data);

  const reSort = (type) => {
    setSort(type);
    setOpen(false);
  };

  useEffect(() => {
    refetch();
  }, [sort]);

  const apply = () => {
    refetch();
  };

  return (
    <div className="gigs">
      <div className="container">
        <span className="breadcrumbs">Freelancer  Grafik & Tasarım </span>
        <h1>AI Sanatçıları</h1>
        <p>
          Freelancer'ın AI sanatçılarıyla sanat ve teknolojinin sınırlarını keşfedin.
        </p>
        <div className="menu">
          <div className="left">
            <span>Bütçe</span>
            <input ref={minRef} type="number" placeholder="min" />
            <input ref={maxRef} type="number" placeholder="max" />
            <button onClick={apply}>Uygula</button>
          </div>
          <div className="right">
            <span className="sortBy">Sırala</span>
            <span className="sortType">
              {sort === "sales" ? "En Çok Satan" : "En Yeni"}
            </span>
            <img src="./img/down.png" alt="" onClick={() => setOpen(!open)} />
            {open && (
              <div className="rightMenu">
                {sort === "sales" ? (
                  <span onClick={() => reSort("createdAt")}>En Yeni</span>
                ) : (
                  <span onClick={() => reSort("sales")}>En Çok Satan</span>
                )}
                <span onClick={() => reSort("sales")}>Popüler</span>
              </div>
            )}
          </div>
        </div>
        <div className="cards">
          {isLoading
            ? "Yükleniyor..."
            : error
            ? "Bir şeyler ters gitti!"
            : data.map((gig) => <GigCard key={gig._id} item={gig} />)}
        </div>
      </div>
    </div>
  );
}

export default Gigs;
