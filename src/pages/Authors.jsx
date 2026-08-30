import {
  Feather,
  Heart,
  Users,
  Award,
  Quote,
} from "lucide-react";

import "./Authors.css";

function Authors() {
  return (
    <div className="authors-page">

      {/* ================= HERO ================= */}

      <section className="authors-hero">
        <div className="authors-hero-glow"></div>

        <div className="authors-container">

          <div className="authors-hero-content">

            <span className="authors-eyebrow">
              VIYAZHAM PUBLICATION
            </span>

            <h1>
              Voices behind
              <span> the stories.</span>
            </h1>

            <p>
              Meet the writers whose words capture human emotions,
              relationships, society and the many stories of everyday life.
            </p>

          </div>

          <div className="authors-hero-mark">
            <Feather size={90} strokeWidth={1} />
          </div>

        </div>
      </section>


      {/* ================= AUTHOR PROFILE ================= */}

      <section className="author-profile-section">

        <div className="authors-container">

          <div className="author-profile">

            {/* AUTHOR PORTRAIT */}

            <div className="author-portrait-area">

              <div className="portrait-frame">

                <div className="portrait-placeholder">

                  <span>கவிவேந்தர்</span>

                  <strong>
                    செந்தமிழ்ச் சித்தன்
                  </strong>

                </div>

              </div>

              <div className="portrait-caption">
                <Feather size={15} />
                Tamil Literary Writer
              </div>

            </div>


            {/* AUTHOR DETAILS */}

            <div className="author-information">

              <span className="profile-label">
                FEATURED AUTHOR
              </span>

              <h2>
                கவிவேந்தர்
                <br />
                செந்தமிழ்ச் சித்தன்
              </h2>

              <p className="author-role">
                Tamil Writer
              </p>

              <div className="author-divider"></div>

              <p className="author-description">
                கவிவேந்தர் செந்தமிழ்ச் சித்தன் தனது படைப்புகளில்
                மனிதநேயத்தையும் சமூகப் பொறுப்புணர்வையும் வெளிப்படுத்தும்
                படைப்பாளராக அறிமுகப்படுத்தப்படுகிறார்.
              </p>

              <p className="author-description">
                அவரது எழுத்துகள் அன்றாட வாழ்க்கையில் சந்திக்கும்
                மனிதர்களின் உணர்வுகள், உறவுகள், அன்பு, தனிமை மற்றும்
                சமூகச் சிக்கல்களை நெருக்கமாகப் பதிவு செய்கின்றன.   
                                                                 
              </p>
              <p className="describer -name">
                                               -பதிப்பகத்தார்.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ================= WRITING STYLE ================= */}

      <section className="writing-section">

        <div className="authors-container">

          <div className="section-introduction">

            <span className="authors-eyebrow">
              THE WRITING
            </span>

            <h2>
              Stories rooted in
              <em> humanity.</em>
            </h2>

            <p>
              His writing explores ordinary lives and the emotions
              hidden within them.
            </p>

          </div>


          <div className="writing-grid">

            {/* HUMANITY */}

            <article className="writing-card">

              <div className="writing-icon">
                <Heart size={22} />
              </div>

              <span>01</span>

              <h3>
                Humanity
              </h3>

              <p>
                Humaneness is an important element in his writing,
                expressed through the actions, conversations and
                emotions of his characters.
              </p>

            </article>


            {/* RELATIONSHIPS */}

            <article className="writing-card">

              <div className="writing-icon">
                <Users size={22} />
              </div>

              <span>02</span>

              <h3>
                Relationships
              </h3>

              <p>
                Family, love, loneliness and changing relationships
                form important emotional spaces within the stories.
              </p>

            </article>


            {/* REGIONAL VOICE */}

            <article className="writing-card">

              <div className="writing-icon">
                <Feather size={22} />
              </div>

              <span>03</span>

              <h3>
                Regional Voice
              </h3>

              <p>
                His storytelling incorporates the Nellai regional
                dialect, giving the characters a natural connection
                with their surroundings and community.
              </p>

            </article>


            {/* RECOGNITION */}

            <article className="writing-card">

              <div className="writing-icon">
                <Award size={22} />
              </div>

              <span>04</span>

              <h3>
                Literary Recognition
              </h3>

              <p>
                The document notes that the author has received
                awards and prizes from various literary organizations.
              </p>

            </article>

          </div>

        </div>

      </section>


      {/* ================= AUTHOR QUOTE ================= */}

      <section className="author-quote-section">

        <div className="authors-container">

          <div className="author-quote">

            <Quote size={38} />

            <blockquote>
              “மனிதநேயத்தையும் சமூக நல்லிணக்கத்தையும்
              விதைக்கும் படைப்புகள்...”
            </blockquote>

            <p>
              — முனைவர் கு. காமராஜ்
            </p>

          </div>

        </div>

      </section>


      {/* ================= FINAL SECTION ================= */}

      <section className="authors-final-cta">

        <div className="authors-container">

          <span className="authors-eyebrow">
            VIYAZHAM PUBLICATION
          </span>

          <h2>
            Stories begin with
            <br />
            <em>a voice.</em>
          </h2>

          <p>
            Discover the writers and creative voices behind
            Viyazham Publication.
          </p>

        </div>

      </section>

    </div>
  );
}

export default Authors;