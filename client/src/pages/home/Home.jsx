import React from "react";
import "./Home.scss";
import Featured from "../../components/featured/Featured";
import Slide from "../../components/slide/Slide";
import CatCard from "../../components/catCard/CatCard";
import ProjectCard from "../../components/projectCard/ProjectCard";
import { cards, projects } from "../../data";

function Home() {
  return (
    <div className="home">
      <Featured />
      <Slide slidesToShow={5} arrowsScroll={5}>
        {cards.map((card) => (
          <CatCard key={card.id} card={card} />
        ))}
      </Slide>
      <div className="features">
        <div className="container">
          <div className="item">
            <h1>Serbest çalışan yeteneklerle dolu bir dünya parmaklarınızın ucunda</h1>
            <div className="title">
              <img src="./img/check.png" alt="" />
              Her bütçe için en iyisi
            </div>
            <p>
              Her fiyat için yüksek kaliteli hizmetler bulun. Saatlik ücret yok, sadece proje bazlı fiyatlandırma.
            </p>
            <div className="title">
              <img src="./img/check.png" alt="" />
              Hızlı yapılan kaliteli işs
            </div>
            <p>
              Projeniz üzerinde çalışmak için doğru serbest çalışanı bulun.
            </p>
            <div className="title">
              <img src="./img/check.png" alt="" />
              Her seferinde güvenli ödemeler
            </div>
            <p>
              Her zaman ne kadar ödeyeceğinizi önceden bilin. Ödemeniz siz işi onaylayana kadar bekler.
            </p>
            <div className="title">
              <img src="./img/check.png" alt="" />
              7/24 Destek
            </div>
            <p>
            Her fiyat için yüksek kaliteli hizmetler bulun. Saatlik ücret yok, sadece proje bazlı fiyatlandırma.
            </p>
          </div>
          <div className="item">
            <video src="./img/kadirabi.mp4" controls />
          </div>
        </div>
      </div>
      <div className="explore">
        <div className="container">
          <h1>Pazarları Keşfedin</h1>
          <div className="items">
            <div className="item">
              <img
                src="https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/graphics-design.d32a2f8.svg"
                alt=""
              />
              <div className="line"></div>
              <span>Grafik & Tasarım</span>
            </div>
            <div className="item">
              <img
                src="https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/online-marketing.74e221b.svg"
                alt=""
              />
              <div className="line"></div>

              <span>Dijital Market</span>
            </div>
            <div className="item">
              <img
                src="https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/writing-translation.32ebe2e.svg"
                alt=""
              />
              <div className="line"></div>
              <span>Yazma & Çeviri</span>
            </div>
            <div className="item">
              <img
                src="https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/video-animation.f0d9d71.svg"
                alt=""
              />
              <div className="line"></div>
              <span>Video & Animasyon</span>
            </div>
            <div className="item">
              <img
                src="https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/music-audio.320af20.svg"
                alt=""
              />
              <div className="line"></div>
              <span>Müzik & Ses</span>
            </div>
            <div className="item">
              <img
                src="https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/programming.9362366.svg"
                alt=""
              />
              <div className="line"></div>
              <span>Programlama & Teknoloji</span>
            </div>
            <div className="item">
              <img
                src="https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/business.bbdf319.svg"
                alt=""
              />
              <div className="line"></div>
              <span>İşletme</span>
            </div>
            <div className="item">
              <img
                src="https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/lifestyle.745b575.svg"
                alt=""
              />
              <div className="line"></div>
              <span>Yaşam Tarzı</span>
            </div>
            <div className="item">
              <img
                src="https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/data.718910f.svg"
                alt=""
              />
              <div className="line"></div>
              <span>Veri</span>
            </div>
            <div className="item">
              <img
                src="https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/photography.01cf943.svg"
                alt=""
              />
              <div className="line"></div>
              <span>Fotoğraf</span>
            </div>
          </div>
        </div>
      </div>
      <div className="features dark">
        <div className="container">
          <div className="item">
            <h1>
              freelancer <i>işletme</i>
            </h1>
            <h1>
              Takımlar için tasarlanmış iş çözümü
            </h1>
            <p>
              İşletmelere özel araçlar ve avantaajlarla dolu özel bir deneyime yükseltin.
            </p>
            <div className="title">
              <img src="./img/check.png" alt="" />
              Kanıtlanmış iş deneyimine sahip serbest çalışanlarla bağlantı kurun.
            </div>

            <div className="title">
              <img src="./img/check.png" alt="" />
              Bir müşteri başarı yöneticisi tarafından mükemmel yeteneklerle eşleştirilin.
            </div>

            <div className="title">
              <img src="./img/check.png" alt="" />
              Tek bir güçlü çalışma alanıyla ekip çalışmasını yönetin ve üretkenliği artırın
            </div>
          </div>
          <div className="item">
            <img
              src="https://fiverr-res.cloudinary.com/q_auto,f_auto,w_870,dpr_2.0/v1/attachments/generic_asset/asset/d9c17ceebda44764b591a8074a898e63-1599597624768/business-desktop-870-x2.png"
              alt=""
            />
          </div>
        </div>
      </div>
      <Slide slidesToShow={4} arrowsScroll={4}>
        {projects.map((card) => (
          <ProjectCard key={card.id} card={card} />
        ))}
      </Slide>
    </div>
  );
}

export default Home;
