import { useState } from "react";
import { useGraphContext } from "@/hooks/useGraphContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

export default function ControlPanel() {
  const { 
    users, 
    addUser, 
    removeUser, 
    addDebt, 
    findInfluentialUser, 
    lookupDebt, 
    resetDebtLookup,
    influentialUser,
    debtLookup,
    exportGraph,
    generateRandomGraph
  } = useGraphContext();

  const [newUser, setNewUser] = useState("");
  const [lender, setLender] = useState("");
  const [borrower, setBorrower] = useState("");
  const [amount, setAmount] = useState("");
  const [lookupLender, setLookupLender] = useState("");
  const [lookupBorrower, setLookupBorrower] = useState("");
  const [activeTab, setActiveTab] = useState("manual");
  const [randomUsers, setRandomUsers] = useState("5");
  const [randomEdges, setRandomEdges] = useState("8");
  const [minAmount, setMinAmount] = useState("50");
  const [maxAmount, setMaxAmount] = useState("500");

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUser.trim()) {
      addUser(newUser.trim());
      setNewUser("");
    }
  };

  const handleRemoveUser = (name: string) => {
    removeUser(name);
  };

  const handleAddDebt = (e: React.FormEvent) => {
    e.preventDefault();
    if (lender && borrower && amount) {
      addDebt(lender, borrower, parseFloat(amount));
      // Reset form
      setLender("");
      setBorrower("");
      setAmount("");
    }
  };

  const handleLookupDebt = (e: React.FormEvent) => {
    e.preventDefault();
    if (lookupLender && lookupBorrower) {
      lookupDebt(lookupLender, lookupBorrower);
    }
  };

  const handleGenerateRandom = () => {
    generateRandomGraph(
      parseInt(randomUsers), 
      parseInt(randomEdges), 
      parseFloat(minAmount), 
      parseFloat(maxAmount)
    );
  };

  const handleStartGraph = () => {
    // Graph is already started when users are added
    // This is just for UI feedback
    console.log("Graph started with users:", users);
  };

  return (
    <div className="w-full lg:w-1/3 space-y-6">
      {/* Graph Creation Card */}
      <Card className="bg-gradient-to-br from-violet-100 to-indigo-50 rounded-xl shadow-md border border-indigo-100 create-graph-section">
        <CardContent className="p-6">
          <CardTitle className="font-heading font-semibold text-xl mb-4 flex items-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
            <div className="bg-gradient-to-br from-indigo-600 to-violet-500 p-2 rounded-md shadow-md mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
              </svg>
            </div>
            Create Graph
          </CardTitle>
          
          {/* Tab Navigation */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4 grid grid-cols-2 w-full bg-white/50 rounded-md p-1">
              <TabsTrigger 
                value="manual" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-violet-500 data-[state=active]:text-white rounded-md transition-all duration-300"
              >
                Manual
              </TabsTrigger>
              <TabsTrigger 
                value="random" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-violet-500 data-[state=active]:text-white rounded-md transition-all duration-300"
              >
                Random
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="manual" className="space-y-4">
              <div>
                <Label className="block text-sm font-medium mb-1">Starting Users</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {users.map(user => (
                    <span key={user.id} className="bg-secondary-50 px-2 py-1 rounded text-sm flex items-center">
                      {user.name}
                      <button 
                        onClick={() => handleRemoveUser(user.name)}
                        className="ml-1 text-secondary-500 hover:text-debt-500"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <form onSubmit={handleAddUser} className="flex">
                  <Input
                    type="text"
                    placeholder="Add user"
                    value={newUser}
                    onChange={(e) => setNewUser(e.target.value)}
                    className="flex-1 border rounded-l-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  />
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white px-3 py-2 rounded-r-lg transition-all duration-200 shadow-sm"
                  >
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Add
                    </div>
                  </Button>
                </form>
              </div>
              
              <Button
                onClick={handleStartGraph}
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <div className="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  Start Graph
                </div>
              </Button>
            </TabsContent>
            
            <TabsContent value="random" className="space-y-4">
              <div className="text-sm text-gray-800 font-medium mb-4 p-3 bg-white/70 rounded-lg border border-indigo-100">
                <p>Generate a random graph with customizable number of users and transactions.</p>
              </div>

              <div className="space-y-4 mb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="randomUsers" className="block text-sm font-medium text-gray-800 mb-1">
                      Number of Users
                    </Label>
                    <Input
                      id="randomUsers"
                      type="number"
                      min="2"
                      max="15"
                      value={randomUsers}
                      onChange={(e) => setRandomUsers(e.target.value)}
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <Label htmlFor="randomEdges" className="block text-sm font-medium text-gray-800 mb-1">
                      Number of Transactions
                    </Label>
                    <Input
                      id="randomEdges"
                      type="number"
                      min="1"
                      max="30"
                      value={randomEdges}
                      onChange={(e) => setRandomEdges(e.target.value)}
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500 focus:outline-none"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="minAmount" className="block text-sm font-medium text-gray-800 mb-1">
                      Min Amount ($)
                    </Label>
                    <Input
                      id="minAmount"
                      type="number"
                      min="1"
                      max="1000"
                      step="10"
                      value={minAmount}
                      onChange={(e) => setMinAmount(e.target.value)}
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxAmount" className="block text-sm font-medium text-gray-800 mb-1">
                      Max Amount ($)
                    </Label>
                    <Input
                      id="maxAmount"
                      type="number"
                      min="1"
                      max="10000"
                      step="10"
                      value={maxAmount}
                      onChange={(e) => setMaxAmount(e.target.value)}
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
              
              <Button
                onClick={handleGenerateRandom}
                className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <div className="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Generate Random Graph
                </div>
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Add Debt Transaction Card */}
      <Card className="bg-gradient-to-br from-emerald-100 to-teal-50 rounded-xl shadow-md border border-emerald-100">
        <CardContent className="p-6">
          <CardTitle className="font-heading font-semibold text-xl mb-4 flex items-center bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">
            <div className="bg-gradient-to-br from-emerald-600 to-teal-500 p-2 rounded-md shadow-md mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
              </svg>
            </div>
            Add Debt Transaction
          </CardTitle>
          
          <form onSubmit={handleAddDebt} className="space-y-4">
            <div>
              <Label htmlFor="lender" className="block text-sm font-medium mb-1">Lender</Label>
              <Select 
                value={lender} 
                onValueChange={setLender}
              >
                <SelectTrigger id="lender" className="w-full border rounded-lg px-3 py-2">
                  <SelectValue placeholder="Select Lender" />
                </SelectTrigger>
                <SelectContent>
                  {users.length > 0 ? (
                    users.map(user => (
                      <SelectItem key={user.id} value={user.name}>{user.name}</SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-users">No users available</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="borrower" className="block text-sm font-medium mb-1">Borrower</Label>
              <Select 
                value={borrower} 
                onValueChange={setBorrower}
              >
                <SelectTrigger id="borrower" className="w-full border rounded-lg px-3 py-2">
                  <SelectValue placeholder="Select Borrower" />
                </SelectTrigger>
                <SelectContent>
                  {users.length > 0 ? (
                    users.map(user => (
                      <SelectItem key={user.id} value={user.name}>{user.name}</SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-users">No users available</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="amount" className="block text-sm font-medium mb-1">Amount ($)</Label>
              <Input
                type="number"
                id="amount"
                min="1"
                step="0.01"
                placeholder="100.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:outline-none"
              />
            </div>
            
            <Button
              type="submit"
              disabled={!lender || !borrower || !amount || lender === borrower}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                </svg>
                Add Transaction
              </div>
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {/* Lookup Debt Card */}
      <Card className="bg-gradient-to-br from-blue-100 to-sky-50 rounded-xl shadow-md border border-blue-100">
        <CardContent className="p-6">
          <CardTitle className="font-heading font-semibold text-xl mb-4 flex items-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-sky-600">
            <div className="bg-gradient-to-br from-blue-600 to-sky-500 p-2 rounded-md shadow-md mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            Lookup Debt
          </CardTitle>
          
          <form onSubmit={handleLookupDebt} className="space-y-4">
            <div>
              <Label htmlFor="lookup-lender" className="block text-sm font-medium mb-1">From User</Label>
              <Select 
                value={lookupLender} 
                onValueChange={setLookupLender}
              >
                <SelectTrigger id="lookup-lender" className="w-full border rounded-lg px-3 py-2">
                  <SelectValue placeholder="Select User" />
                </SelectTrigger>
                <SelectContent>
                  {users.length > 0 ? (
                    users.map(user => (
                      <SelectItem key={user.id} value={user.name}>{user.name}</SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-users">No users available</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="lookup-borrower" className="block text-sm font-medium mb-1">To User</Label>
              <Select 
                value={lookupBorrower} 
                onValueChange={setLookupBorrower}
              >
                <SelectTrigger id="lookup-borrower" className="w-full border rounded-lg px-3 py-2">
                  <SelectValue placeholder="Select User" />
                </SelectTrigger>
                <SelectContent>
                  {users.length > 0 ? (
                    users.map(user => (
                      <SelectItem key={user.id} value={user.name}>{user.name}</SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-users">No users available</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <Button
              type="submit"
              disabled={!lookupLender || !lookupBorrower || lookupLender === lookupBorrower}
              className="w-full bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                </svg>
                Find Debt
              </div>
            </Button>
            
            {debtLookup && (
              <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-sky-50 rounded-lg border border-blue-200 shadow-md animate-fadeIn">
                <div className="flex items-center mb-2">
                  <div className="bg-blue-500 rounded-full w-2 h-2 mr-2 animate-pulse"></div>
                  <p className="text-sm font-medium text-blue-700">
                    Debt from {debtLookup.lender} to {debtLookup.borrower}:
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className={`text-2xl font-bold ${debtLookup.amount !== null ? 'bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-blue-600' : 'text-gray-500'}`}>
                    {debtLookup.amount !== null 
                      ? `$${debtLookup.amount.toFixed(2)}` 
                      : "No debt found"}
                  </p>
                  {debtLookup.amount !== null && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
      
      {/* Analysis Card */}
      <Card className="bg-gradient-to-br from-purple-100 to-fuchsia-50 rounded-xl shadow-md border border-purple-100">
        <CardContent className="p-6">
          <CardTitle className="font-heading font-semibold text-xl mb-4 flex items-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-fuchsia-600">
            <div className="bg-gradient-to-br from-purple-600 to-fuchsia-500 p-2 rounded-md shadow-md mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            Analysis & Export
          </CardTitle>
          
          <div className="space-y-4">
            <Button
              onClick={findInfluentialUser}
              className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
              disabled={users.length < 2}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Find Most Influential User
            </Button>
            
            {influentialUser && (
              <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-fuchsia-50 rounded-lg border border-purple-200 shadow-md animate-fadeIn">
                <div className="flex items-center mb-3">
                  <div className="bg-gradient-to-r from-purple-500 to-fuchsia-500 p-2 rounded-full shadow-md mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-purple-800">Most Influential User</p>
                    <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-fuchsia-600">{influentialUser.name}</h3>
                  </div>
                </div>
                <div className="flex items-center mt-2 bg-white/50 p-2 rounded-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm font-medium text-purple-700">Average Path Length: <span className="text-fuchsia-600 font-semibold">{influentialUser.avgPathLength.toFixed(2)}</span></p>
                </div>
              </div>
            )}
            
            <div className="border-t pt-4 mt-4">
              <Button
                onClick={exportGraph}
                variant="outline"
                className="w-full border-2 border-purple-400 bg-white hover:bg-gradient-to-r hover:from-purple-50 hover:to-fuchsia-50 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-fuchsia-600 py-3 px-4 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center"
                disabled={users.length < 2}
              >
                <div className="bg-gradient-to-r from-purple-500 to-fuchsia-500 p-1.5 rounded-md shadow-sm mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                Export Graph
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}