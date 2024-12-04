import React from "react";
import "./Footer.scss";

function Footer() {
  return (
    <div className="footer">
      <div className="container">
        <div className="top">
          <div className="item">
            <h2>Kategoriler</h2>
            <span>Grafik & Tasarım</span>
            <span>Dijital Pazarlama</span>
            <span>Yazı & Çeviri</span>
            <span>Video & Animasyon</span>
            <span>Müzik & Ses</span>
            <span>Programlama & Teknoloji</span>
            <span>Veri</span>
            <span>İş Dünyası</span>
            <span>Yaşam Tarzı</span>
            <span>Fotoğrafçılık</span>
            <span>Site Haritası</span>
          </div>
          <div className="item">
            <h2>Hakkında</h2>
            <span>Basın & Haberler</span>
            <span>Ortaklıklar</span>
            <span>Gizlilik Politikası</span>
            <span>Hizmet Şartları</span>
            <span>Fikri Mülkiyet Talepleri</span>
            <span>Yatırımcı İlişkileri</span>
            <span>Satış Ekibi ile İletişim</span>
          </div>
          <div className="item">
            <h2>Destek</h2>
            <span>Yardım & Destek</span>
            <span>Güven & Güvenlik</span>
            <span>Freelancer'da Satış Yapmak</span>
            <span>Freelancer'dan Alışveriş</span>
          </div>
          <div className="item">
            <h2>Topluluk</h2>
            <span>Müşteri Başarı Hikayeleri</span>
            <span>Topluluk Merkezi</span>
            <span>Forum</span>
            <span>Etkinlikler</span>
            <span>Blog</span>
            <span>Influencerlar</span>
            <span>Ortaklıklar</span>
            <span>Podcast</span>
            <span>Arkadaşını Davet Et</span>
            <span>Satıcı Ol</span>
            <span>Topluluk Standartları</span>
          </div>
          <div className="item">
            <h2>Freelancer'dan Daha Fazlası</h2>
            <span>Freelancer İş</span>
            <span>Freelancer Pro</span>
            <span>Freelancer Logo Yapıcı</span>
            <span>Freelancer Rehberleri</span>
            <span>İlham Al</span>
            <span>Freelancer Seçim</span>
            <span>ClearVoice</span>
            <span>Freelancer Çalışma Alanı</span>
            <span>Öğren</span>
            <span>Working Not Working</span>
          </div>
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <h2>freelancer</h2>
            <span>© KADİR PAPAKER 2024</span>
          </div>
          <div className="right">
            <div className="social">
              <img src="/img/twitter.png" alt="" />
              <img src="/img/facebook.png" alt="" />
              <img src="/img/linkedin.png" alt="" />
              <img src="/img/pinterest.png" alt="" />
              <img src="/img/instagram.png" alt="" />
            </div>
            <div className="link">
              <img src="/img/language.png" alt="" />
              <span>Türkçe</span>
            </div>
            <div className="link">
              <img src="/img/coin.png" alt="" />
              <span>USD</span>
            </div>
            <img src="/img/accessibility.png" alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
