import Contact from "../../components/Contact";
import Navbar from "../../components/Navbar";
import Intro from "../../components/Intro";
import Project from "../../components/Project";
import About from "../../components/About";
import Footer from "../../components/Footer";
import SocialMedia from "../../components/SocialMedia";
import Experiences from "../../components/Experiences";
import { useEffect, useState } from "react";
import ScreenLoader from "../../components/ScreenLoader";
// import Achievement from "../../components/Achivement.jsx";
function Home() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    // Clean up timeout if component unmounts
    return () => clearTimeout(timer);
  }, []);
  return (
    <div>
      {loading ? (
        <ScreenLoader />
      ) : (
        <>
          <Navbar />
          <div className="bg-primary px-40 sm:px-5">
            <Intro />
            <About />
            <Experiences />
            <Project />
            {/* <Achievement /> */}
            <Contact />
            <Footer />
            <SocialMedia />
          </div>
        </>
      )}
    </div>
  );
}

export default Home;
