import AppHeader from "@/components/AppHeader";
import WelcomeSection from "@/components/WelcomeSection";
import ControlPanel from "@/components/ControlPanel";
import VisualizationPanel from "@/components/VisualizationPanel";
import TutorialPopup from "@/components/TutorialPopup";
import { GraphProvider } from "@/contexts/GraphContext";

export default function Home() {
  return (
    <GraphProvider>
      <div className="min-h-screen flex flex-col bg-secondary-50">
        <AppHeader />
        
        <main className="container mx-auto px-4 py-6 flex-1">
          <WelcomeSection />
          
          <div className="flex flex-col lg:flex-row gap-6">
            <ControlPanel />
            <VisualizationPanel />
          </div>
        </main>

        <footer className="bg-white border-t mt-12">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <div className="flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
                  </svg>
                  <span className="font-heading font-semibold text-lg text-secondary-500">DebtSettler</span>
                </div>
                <p className="text-sm text-secondary-500 mt-1">Visualize and simplify debt cycles</p>
              </div>
              
              <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
                <a href="https://github.com/Aashcharya1/Debt-Settler" target="_blank" className="text-sm text-secondary-500 hover:text-primary-600 transition-colors">
                  GitHub
                </a>
                <a href="#" className="text-sm text-secondary-500 hover:text-primary-600 transition-colors">
                  Documentation
                </a>
                <a href="#" className="text-sm text-secondary-500 hover:text-primary-600 transition-colors">
                  About
                </a>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t text-center text-sm text-secondary-500">
              <p>Created by <a href="https://github.com/Aashcharya1" target="_blank" className="text-primary-600 hover:underline">Aashcharya</a> | © {new Date().getFullYear()}</p>
            </div>
          </div>
        </footer>
        
        {/* Tutorial Popup */}
        <TutorialPopup />
      </div>
    </GraphProvider>
  );
}
