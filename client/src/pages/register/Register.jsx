import React, { useState } from "react";
import upload from "../../utils/upload";
import "./Register.scss";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";

function Register() {
  const [file, setFile] = useState(null);
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    img: "",
    country: "",
    isSeller: false,
    desc: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleSeller = (e) => {
    setUser((prev) => {
      return { ...prev, isSeller: e.target.checked };
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = await upload(file);
    try {
      await newRequest.post("/auth/register", {
        ...user,
        img: url,
      });
      navigate("/")
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="register">
      <form onSubmit={handleSubmit}>
        <div className="left">
          <h1>Yeni Hesap Oluştur</h1>
          <label htmlFor="">Kullanıcı Adı</label>
          <input
            name="username"
            type="text"
            placeholder="kadir"
            onChange={handleChange}
          />
          <label htmlFor="">Email</label>
          <input
            name="email"
            type="email"
            placeholder="email"
            onChange={handleChange}
          />
          <label htmlFor="">Şifre</label>
          <input name="password" type="password" onChange={handleChange} />
          <label htmlFor="">Profil Resmi</label>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          <label htmlFor="">Ülke</label>
          <input
            name="country"
            type="text"
            placeholder="Türkiye"
            onChange={handleChange}
          />
          <button type="submit">Üye Ol</button>
        </div>
        <div className="right">
          <h1>Satıcı Olmak İstiyorum</h1>
          <div className="toggle">
            <label htmlFor="">Satıcı Hesabını Etkinleştirin</label>
            <label className="switch">
              <input type="checkbox" onChange={handleSeller} />
              <span className="slider round"></span>
            </label>
          </div>
          <label htmlFor="">Telefon Numarası</label>
          <input
            name="phone"
            type="text"
            placeholder="+90 555 555 55 55"
            onChange={handleChange}
          />
          <label htmlFor="">Açıklama</label>
          <textarea
            placeholder="Kendin ile alakalı kısa bir açıklama"
            name="desc"
            id=""
            cols="30"
            rows="10"
            onChange={handleChange}
          ></textarea>
        </div>
      </form>
    </div>
  );
}

export default Register;
