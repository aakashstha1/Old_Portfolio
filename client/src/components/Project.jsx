import axios from "axios";
import SectionTitle from "./SectionTitle";
import { useEffect, useState } from "react";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { easeOut, motion } from "framer-motion";
function Project() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [projectData, setProjectData] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get(`${API_URL}/project/get`);
        setProjectData(res?.data?.data || []);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProjects();
  }, [API_URL]);

  const visibleProjects = showAll ? projectData : projectData.slice(0, 4);

  return (
    <div id="project">
      <SectionTitle title="Projects" />
      <div className="py-10">
        <div className="container mx-auto p-10 backdrop-blur-md bg-silver bg-opacity-30 shadow-lg rounded-lg">
          {projectData.length > 0 ? (
            <>
              <div className="grid grid-cols-4 sm:grid-cols-1 gap-8">
                {visibleProjects.map((project, index) => (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{
                      duration: 0.8,
                      delay: index * 0.2,
                      ease: easeOut,
                    }}
                    key={project._id}
                    className="relative group rounded-lg overflow-hidden"
                  >
                    <img
                      src={project.imgURL}
                      alt={project.title}
                      className="w-full h-60 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-primary bg-opacity-90 flex flex-col gap-5 justify-center items-center opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out p-4 text-center">
                      <h3 className="text-white text-base font-bold mb-2">
                        {project.title}
                      </h3>

                      <div className="flex gap-6 text-white text-3xl">
                        {project.githubURL && (
                          <a
                            href={project.githubURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="GitHub"
                          >
                            <i className="fab fa-github"></i>
                          </a>
                        )}
                        {project.figmaURL && (
                          <a
                            href={project.figmaURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Figma"
                          >
                            <i className="fab fa-figma"></i>
                          </a>
                        )}
                        {project.websiteURL && (
                          <a
                            href={project.websiteURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Website"
                          >
                            <i className="fas fa-globe"></i>
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {projectData.length > 4 && (
                <div className="flex justify-center items-center mt-10 px-4">
                  {showAll && (
                    <button
                      onClick={() => setShowAll(false)}
                      className="bg-primary text-secondary px-6 py-2 rounded hover:bg-opacity-80 transition-all"
                    >
                      Show Less <UpOutlined />
                    </button>
                  )}
                  {!showAll && (
                    <button
                      onClick={() => setShowAll(true)}
                      className="bg-primary text-secondary px-6 py-2 rounded hover:bg-opacity-80 transition-all"
                    >
                      View All <DownOutlined />
                    </button>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-white text-lg font-medium py-12">
              No projects yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Project;
