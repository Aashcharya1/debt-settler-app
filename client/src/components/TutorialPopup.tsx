import { useGraphContext } from "@/hooks/useGraphContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function TutorialPopup() {
  const { showTutorial, setShowTutorial } = useGraphContext();

  const handleClose = () => {
    setShowTutorial(false);
  };

  return (
    <Dialog open={showTutorial} onOpenChange={setShowTutorial}>
      <DialogContent className="max-w-3xl mx-auto bg-gradient-to-b from-white to-indigo-50 border-indigo-100 shadow-xl rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 flex items-center gap-2">
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-2 rounded-lg shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            DebtSettler Quick Tutorial
          </DialogTitle>
          <DialogDescription className="text-gray-700 mt-2 text-base">
            Learn how to use the debt cycle visualization app in a few simple steps
          </DialogDescription>
        </DialogHeader>

        <div className="p-2 space-y-6 overflow-y-auto max-h-[60vh]">
          <div className="space-y-5">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-indigo-100">
              <h3 className="text-lg font-semibold text-indigo-700 mb-2 flex items-center">
                <span className="bg-indigo-600 text-white w-6 h-6 rounded-full inline-flex items-center justify-center mr-2">1</span>
                Create Your Graph
              </h3>
              <p className="text-gray-700">
                Start by adding users in the "Create Graph" section. Either add users manually or use the random generator for a quick start.
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-indigo-100">
              <h3 className="text-lg font-semibold text-emerald-700 mb-2 flex items-center">
                <span className="bg-emerald-600 text-white w-6 h-6 rounded-full inline-flex items-center justify-center mr-2">2</span>
                Add Debt Transactions
              </h3>
              <p className="text-gray-700">
                Use the "Add Debt Transaction" card to record debts between users. Select a lender, borrower, and enter the amount.
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-indigo-100">
              <h3 className="text-lg font-semibold text-blue-700 mb-2 flex items-center">
                <span className="bg-blue-600 text-white w-6 h-6 rounded-full inline-flex items-center justify-center mr-2">3</span>
                View Visualization
              </h3>
              <p className="text-gray-700">
                The central graph visualizes the debt network. The app automatically simplifies complex debt cycles to minimize the number of transactions needed.
              </p>
              <div className="mt-2 text-sm">
                <p className="text-gray-600 italic">Example: If Alice owes Bob $20 and Bob owes Charlie $15, the simplified graph will show Alice owing Charlie $15 and still owing Bob $5.</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-indigo-100">
              <h3 className="text-lg font-semibold text-purple-700 mb-2 flex items-center">
                <span className="bg-purple-600 text-white w-6 h-6 rounded-full inline-flex items-center justify-center mr-2">4</span>
                View Toggle
              </h3>
              <p className="text-gray-700">
                Toggle between "Raw" and "Simplified" views to see original transactions vs. optimized payment paths.
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-indigo-100">
              <h3 className="text-lg font-semibold text-amber-700 mb-2 flex items-center">
                <span className="bg-amber-600 text-white w-6 h-6 rounded-full inline-flex items-center justify-center mr-2">5</span>
                Analysis Tools
              </h3>
              <p className="text-gray-700">
                Use the "Analysis & Export" section to:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
                <li>Find the most influential user in your debt network</li>
                <li>Look up specific debts between two users</li>
                <li>Export your graph for external use</li>
              </ul>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-center mt-2">
          <Button
            className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white py-2 px-4 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
            onClick={handleClose}
          >
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Got it!
            </div>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}