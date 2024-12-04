import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import "./Navbar.scss";

function Navbar() {
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(false);

  const { pathname } = useLocation();

  const isActive = () => {
    window.scrollY > 0 ? setActive(true) : setActive(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", isActive);
    return () => {
      window.removeEventListener("scroll", isActive);
    };
  }, []);

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await newRequest.post("/auth/logout");
      localStorage.setItem("currentUser", null);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={active || pathname !== "/" ? "navbar active" : "navbar"}>
      <div className="container">
        <div className="logo">
          <Link className="link" to="/">
            <span className="text">freelancer</span>
          </Link>
        </div>
        <div className="links">
          {/* {!currentUser?.isSeller && <span>Satıcı Olun</span>} */}
          {currentUser ? (
            <div className="user" onClick={() => setOpen(!open)}>
              <img src={currentUser.img || "/img/noavatar.jpg"} alt="" />
              <span>{currentUser?.username}</span>
              {open && (
                <div className="options">
                  {currentUser.isSeller && (
                    <>
                      <Link className="link" to="/mygigs">
                        İlanlar
                      </Link>
                      <Link className="link" to="/add">
                        Yeni İlan Ekle
                      </Link>
                    </>
                  )}
                  <Link className="link" to="/orders">
                    Teklifler
                  </Link>
                  <Link className="link" to="/messages">
                    Mesajlar
                  </Link>
                  <Link className="link" onClick={handleLogout}>
                    Çıkış Yap
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="link">Giriş Yap</Link>
              <Link className="link" to="/register">
                <button>Üye Ol</button>
              </Link>
            </>
          )}
        </div>
      </div>
      {(active || pathname !== "/") && (
        <>
          <hr />
          <div className="menu">
            <Link className="link menuLink" to="/">
              Grafik & Tasarım
            </Link>
            <Link className="link menuLink" to="/">
              Video & Animasyon
            </Link>
            <Link className="link menuLink" to="/">
              Yazma & Çeviri
            </Link>
            <Link className="link menuLink" to="/">
              AI Hizmetleri
            </Link>
            <Link className="link menuLink" to="/">
              Dijital Market
            </Link>
            <Link className="link menuLink" to="/">
              Müzik & Ses
            </Link>
            <Link className="link menuLink" to="/">
              Programlama & Teknoloji
            </Link>
            <Link className="link menuLink" to="/">
              İşletme
            </Link>
            <Link className="link menuLink" to="/">
              Yaşam Tarzı
            </Link>
          </div>
          <hr />
        </>
      )}
    </div>
  );
}

export default Navbar;
