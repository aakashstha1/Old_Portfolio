import { Image } from "antd";
import SectionTitle from "../SectionTitle";
import PropTypes from "prop-types";

ProjectDetails.propTypes = {
  projectData: PropTypes.shape({
    title: PropTypes.string.isRequired,
    imgURL: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    githubURL: PropTypes.string,
    figmaURL: PropTypes.string,
    websiteURL: PropTypes.string,
    techUsed: PropTypes.array.isRequired,
  }).isRequired,
};

function ProjectDetails({ projectData }) {
  const techUsed = projectData.techUsed || [];
  const style = { fontFamily: "Montserrat" };

  return (
    <div>
      <div className="flex flex-col gap-5 ">
        {/* Top div */}
        <div className="flex gap-6">
          {/* Top left div */}
          <div className="w-1/3 h-80 rounded-lg overflow-hidden border-2 border-[rgba(255,255,255,0.5)] border-r-[rgba(255,255,255,0.2)] border-b-[rgba(255,255,255,0.2)]">
            <Image
              width={400}
              height={320}
              src={projectData.imgURL}
              alt={projectData.title}
              className="object-cover w-full h-full border-2 border-[rgba(255,255,255,0.5)] "
            />
          </div>

          {/* Top right div */}
          <div className="w-2/3 bg-[rgba(255,255,255,0.1)] rounded-lg shadow-[0_25px_45px_rgba(0,0,0,0.2)] backdrop-blur-[10px] border-2 border-[rgba(255,255,255,0.5)] border-r-[rgba(255,255,255,0.2)] border-b-[rgba(255,255,255,0.2)] p-5">
            <h1 className="text-secondary text-3xl font-bold">
              {projectData.title}
            </h1>
            <hr />
            <div className="flex gap-6 py-5">
              {projectData.githubURL && (
                <a
                  href={projectData.githubURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-secondary text-white px-3 py-2 font-semibold flex justify-center items-center rounded-md"
                >
                  Github &nbsp; <i className="fa-brands fa-github text-xl"></i>
                </a>
              )}

              {projectData.figmaURL && (
                <a
                  href={projectData.figmaURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-secondary text-white px-3 py-2 font-semibold flex justify-center items-center rounded-md"
                >
                  Figma &nbsp; <i className="fa-brands fa-figma text-xl"></i>
                </a>
              )}

              {projectData.websiteURL && (
                <a
                  href={projectData.websiteURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-secondary text-white px-3 py-2 font-semibold flex justify-center items-center rounded-md"
                >
                  Website &nbsp;<i className="fa-solid fa-globe text-xl"></i>
                </a>
              )}
            </div>

            <hr />
            <h1 className="text-white font-bold text-xl pt-5">
              Technology Used:
            </h1>
            <div className="flex flex-wrap gap-5 mt-5 overflow-x-auto ">
              {techUsed.map((tech, index) => (
                <div
                  key={index}
                  className="border border-secondary text-white pt-2 px-6 group relative"
                >
                  <h1>{tech}</h1>
                  <div className="absolute inset-1 blur opacity-75 border "></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Description div  */}
        <div className="bg-[rgba(255,255,255,0.1)] rounded-lg shadow-[0_25px_45px_rgba(0,0,0,0.2)] backdrop-blur-[10px] border-2 border-[rgba(255,255,255,0.5)] border-r-[rgba(255,255,255,0.2)] border-b-[rgba(255,255,255,0.2)] pl-5">
          <SectionTitle title="Description" />
          <pre className="pb-10 pl-10 text-gray-100 leading-6" style={style}>
            {projectData.description}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetails;
