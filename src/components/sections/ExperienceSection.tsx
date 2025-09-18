import SectionWrapper from "../ui/SectionWrapper";

export default function ExperienceSection() {
  return (
    <SectionWrapper width={1} height={3}>
        <h2 className="text-2xl font-bold mb-6 text-white">Doświadczenie</h2>
        <div className="space-y-4">
          <div className="border-l-2 border-blue-500 pl-4">
            <h3 className="font-semibold text-white">Software Engineer</h3>
                  <p className="text-gray-400 text-sm">Straico • 2021 - Obecnie</p>
          </div>
          <div className="border-l-2 border-blue-500 pl-4">
            <h3 className="font-semibold text-white">Software Engineer</h3>
                  <p className="text-gray-400 text-sm">Spot2 • 2021 - Obecnie</p>
          </div>
          <div className="border-l-2 border-blue-500 pl-4">
            <h3 className="font-semibold text-white">Frontend developer</h3>
                  <p className="text-gray-400 text-sm">Imaginamos • 2021 - 2021</p>
          </div>
        </div>
        <button className="text-blue-400 hover:text-blue-300 text-sm mt-4">
          Zobacz więcej
        </button>
    </SectionWrapper>
  );
}
