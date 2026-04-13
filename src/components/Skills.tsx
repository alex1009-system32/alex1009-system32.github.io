function Skills() {
  const skills = [
    "Java",
    "JavaFX",
    "Spring Boot",
    "JavaScript",
    "React",
    "Node.js",
    "Express.js",
    "PostgreSQL",
    "Git",
    "Docker",
  ];

  skills.sort((a, b) => a.localeCompare(b));

  return (
    <>
      <div className="font-mono uppercase mt-12 mb-6">
        <div className="text-2xl  text-wood-950 underline decoration-2 decoration-wood-800 selection:bg-wood-800">
          02. SKILLS
        </div>
      </div>
      <div className="text-wood-900 font-mono">
        <div className="p-5 border border-sand-800 flex flex-wrap">
          {skills.map((skill) => (
            <div className="m-1 px-3 py-1 border border-wood-900">{skill}</div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Skills;
