import { useEffect, useState } from "react";
import SectionTitle from "./SectionTitle";
import axios from "axios";

function Experiences() {
  const [selectedPeriod, setSelectedPeriod] = useState(0);
  const API_URL = import.meta.env.VITE_API_URL;
  const [experienceData, setExperienceData] = useState([]);

  const fetchExperiences = async () => {
    try {
      const res = await axios.get(`${API_URL}/exp/get`);
      setExperienceData(res?.data?.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  return (
    <div id="experience">
      <SectionTitle title="Experience" />
      {experienceData.length > 0 ? (
        <div className="flex py-10 gap-20 sm:flex-col">
          {/* Left Section - Experience Periods */}
          <div className="flex flex-col gap-5 border-l-2 border-slate-600 w-1/2 sm:flex-row sm:overflow-x-scroll sm:w-full sm:border-none">
            {experienceData.map((experience, index) => (
              <div
                key={index}
                onClick={() => {
                  setSelectedPeriod(index);
                }}
                className="cursor-pointer"
              >
                <h1
                  className={`text-xl font-semibold px-5 ${
                    selectedPeriod === index
                      ? "text-secondary border-secondary border-l-4 bg-[#1a7f5a31] -ml-[2.85px] py-2"
                      : "text-silver"
                  }`}
                >
                  {experience.period}
                </h1>
              </div>
            ))}
          </div>

          {/* Right Section - Selected Experience Details */}
          {experienceData.length > 0 && (
            <div className="flex flex-col gap-5">
              <h1 className="text-secondary text-2xl font-bold">
                {experienceData[selectedPeriod].title}
              </h1>
              <h1 className="text-white text-md">
                {experienceData[selectedPeriod].company}
              </h1>
              <p className="text-silver">
                {experienceData[selectedPeriod].description}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center text-white text-lg font-medium py-12">
          No experience yet.
        </div>
      )}
    </div>
  );
}

export default Experiences;
