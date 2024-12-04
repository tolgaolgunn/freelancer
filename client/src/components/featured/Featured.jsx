import React, { useState } from "react";
import "./Featured.scss";
import { useNavigate } from "react-router-dom";

function Featured() {
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate(`/gigs?search=${input}`);
  };
  return (
    <div className="featured">
      <div className="container">
        <div className="left">
          <h1>
            İşletmeniz için mükemmel <span>freelance</span> hizmetlerini bulun.
          </h1>
          <div className="search">
            <div className="searchInput">
              <img src="./img/search.png" alt="" />
              <input
                type="text"
                placeholder='Mobil Uygulama Oluştur'
                onChange={(e) => setInput(e.target.value)}
              />
            </div>
            <button onClick={handleSubmit}>Ara</button>
          </div>
          <div className="popular">
            <span>Popüler:</span>
            <a href="http://localhost:5173/gigs?cat=design"><button>Tasarım</button></a>
            <a href="http://localhost:5173/gigs?cat=wordpress"><button>WordPress</button></a>
            <a href="http://localhost:5173/gigs?cat=logo"><button>Logo Tasarımı</button></a>
            <a href="http://localhost:5173/gigs?cat=ai"><button>AI Hizmetleri</button></a>
          </div>
        </div>
        <div className="right">
          <img src="./img/man.png" alt="" />
        </div>
      </div>
    </div>
  );
}

export default Featured;
