import SectionWrapper from "../ui/SectionWrapper";

export default function NowSection() {
  return (
    <SectionWrapper width={1} height={1}>
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-2xl font-bold text-white">Now</h2>
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        </div>
        <p className="text-gray-300 mb-4">co to jest?</p>
        <p className="text-gray-300">Obecnie pracuję jako freelancer</p>
    </SectionWrapper>
  );
}
