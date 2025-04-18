import { useGraphContext } from "@/hooks/useGraphContext";
import { Button } from "@/components/ui/button";

export default function WelcomeSection() {
  const { resetGraph, setShowTutorial } = useGraphContext();

  const handleCreateNew = () => {
    resetGraph();
    
    // Scroll to create graph section with smooth animation
    const createGraphSection = document.querySelector('.create-graph-section');
    if (createGraphSection) {
      createGraphSection.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  };

  const handleShowTutorial = () => {
    setShowTutorial(true);
  };

  return (
    <section className="mb-12">
      <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-secondary-500 to-primary-700 text-white">
        <div className="absolute inset-0 opacity-10">
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <defs>
              <pattern id="pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M0 20 L40 20" stroke="white" strokeWidth="0.5"></path>
                <path d="M20 0 L20 40" stroke="white" strokeWidth="0.5"></path>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#pattern)"></rect>
          </svg>
        </div>
        <div className="relative p-8 md:p-12 lg:max-w-3xl">
          <h2 className="font-heading text-3xl font-bold mb-4 text-white">Visualize & Simplify Debt Cycles</h2>
          <p className="text-lg mb-6 text-white font-medium">DebtSettler helps you optimize debt networks by simplifying complex chains into the most efficient payment structure.</p>
          <div className="flex flex-wrap gap-4">
            <Button 
              variant="outline"
              className="bg-white text-secondary-600 hover:bg-opacity-90 px-5 py-2 rounded-lg font-medium flex items-center transition-colors shadow-md"
              onClick={handleShowTutorial}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
              Quick Tutorial
            </Button>
            <Button 
              className="bg-primary-500 hover:bg-primary-600 px-5 py-2 rounded-lg font-medium flex items-center transition-colors shadow-md"
              onClick={handleCreateNew}
              id="create-new-btn"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Create New Graph
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
