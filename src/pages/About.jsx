import {
  BookOpen,
  Feather,
  Heart,
  Users,
  ArrowDown,
  Sparkles,
} from "lucide-react";

import "./About.css";

function About() {
  return (
    <div className="about-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="about-hero">

        <div className="about-hero-pattern"></div>

        <div className="about-container">

          <div className="about-hero-content">

            <span className="about-eyebrow">
              ABOUT VIYAZHAM PUBLICATION
            </span>

            <h1>
              Where stories
              <span> find a voice.</span>
            </h1>

            <p>
              A space created for stories, writers and ideas that
              connect literature with the human experience.
            </p>

            <div className="about-scroll">
              <ArrowDown size={16} />
              Explore our story
            </div>

          </div>

          <div className="about-hero-symbol">
            <Feather size={110} strokeWidth={0.8} />
          </div>

        </div>

      </section>


      {/* =====================================================
          INTRODUCTION
      ===================================================== */}

      <section className="about-introduction">

        <div className="about-container">

          <div className="about-intro-grid">

            <div className="about-section-number">
              <span>01</span>
              <div></div>
              OUR PURPOSE
            </div>

            <div className="about-intro-content">

              <span className="about-eyebrow">
                LITERATURE & HUMANITY
              </span>

              <h2>
                A story doesn't end
                <em> when the page ends.</em>
              </h2>

              <p className="about-lead">
                A meaningful story can continue its journey inside
                the life of the person who reads it.
              </p>

              <p>
                Literature gives us an opportunity to look at people,
                relationships and society from different perspectives.
                Through stories, ordinary moments can become meaningful
                experiences and familiar emotions can find a voice.
              </p>

              <p>
                At Viyazham Publication, we want this space to bring
                readers closer to books and the voices behind them,
                creating an inviting place to discover and experience
                Tamil literary works.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          VALUES
      ===================================================== */}

      <section className="about-values">

        <div className="about-container">

          <div className="about-values-heading">

            <span className="about-eyebrow">
              WHAT MATTERS
            </span>

            <h2>
              Stories with
              <em> something to say.</em>
            </h2>

          </div>


          <div className="about-values-grid">

            <article className="about-value-card">

              <div className="about-value-icon">
                <Heart size={24} />
              </div>

              <span>01</span>

              <h3>
                Anbu
              </h3>

              <h4>
                அன்பு
              </h4>

              <p>
                Stories can remind us of the love and kindness that
                connect people with one another.
              </p>

            </article>


            <article className="about-value-card">

              <div className="about-value-icon">
                <Users size={24} />
              </div>

              <span>02</span>

              <h3>
                Humanity
              </h3>

              <h4>
                மனிதநேயம்
              </h4>

              <p>
                Literature can help us understand people, their emotions
                and the humanity that exists within everyday relationships.
              </p>

            </article>


            <article className="about-value-card">

              <div className="about-value-icon">
                <Sparkles size={24} />
              </div>

              <span>03</span>

              <h3>
                Harmony
              </h3>

              <h4>
                சமூக நல்லிணக்கம்
              </h4>

              <p>
                Stories can encourage readers to think about compassion,
                understanding and harmony within society.
              </p>

            </article>


            <article className="about-value-card">

              <div className="about-value-icon">
                <BookOpen size={24} />
              </div>

              <span>04</span>

              <h3>
                Tamil Literature
              </h3>

              <h4>
                தமிழ் இலக்கியம்
              </h4>

              <p>
                We want readers to discover literary voices and experience
                the ideas, emotions and perspectives carried through their
                writing.
              </p>

            </article>

          </div>

        </div>

      </section>


      {/* =====================================================
          LITERARY PHILOSOPHY
      ===================================================== */}

      <section className="about-philosophy">

        <div className="about-container">

          <div className="philosophy-card">

            <div className="philosophy-icon">
              <Feather size={28} />
            </div>

            <span className="about-eyebrow">
              THE POWER OF A STORY
            </span>

            <blockquote>
              “ஒரு சிறுகதை தனது இலக்கியப் பயணத்தை முடிப்பதில்லை;
              வாசகரின் வாழ்க்கைக்குள் தனது பயணத்தைத் தொடங்குகிறது.”
            </blockquote>

            <p>
              — முனைவர் கு. காமராஜ்
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          READER EXPERIENCE
      ===================================================== */}

      <section className="about-reader">

        <div className="about-container">

          <div className="about-reader-grid">

            <div>

              <span className="about-eyebrow">
                FOR READERS
              </span>

              <h2>
                Discover.
                <br />
                Read.
                <br />
                <em>Feel.</em>
              </h2>

            </div>

            <div className="about-reader-text">

              <p>
                Every reader brings their own memories and experiences
                to a story. That is what makes reading personal.
              </p>

              <p>
                Our website is designed to make discovering books,
                exploring authors and reading literary works simple
                and enjoyable.
              </p>

              <div className="reader-points">

                <div>
                  <span>01</span>
                  <strong>Discover books</strong>
                </div>

                <div>
                  <span>02</span>
                  <strong>Explore authors</strong>
                </div>

                <div>
                  <span>03</span>
                  <strong>Experience stories</strong>
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section className="about-final">

        <div className="about-container">

          <Feather
            className="about-final-feather"
            size={38}
          />

          <span className="about-eyebrow">
            VIYAZHAM PUBLICATION
          </span>

          <h2>
            Every story
            <br />
            <em>deserves to be read.</em>
          </h2>

          <p>
            Step into a world of books, writers and stories.
          </p>

        </div>

      </section>

    </div>
  );
}

export default About;