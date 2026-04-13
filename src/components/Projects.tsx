import ProjectList from "./ProjectList";

function Projects() {
  return (
    <>
      <div className="font-mono uppercase mt-12 mb-6">
        <div className="text-2xl  text-wood-950 underline decoration-2 decoration-wood-800">
          02. Projects
        </div>
      </div>
      <div>
        <ProjectList username="alex1009-system32" />
      </div>
    </>
  );
}

export default Projects;
