import { createContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { GraphData, GraphUser, GraphDebt } from '@shared/schema';
import { LoanGraph } from '@/lib/loanGraph';
import { apiRequest } from '@/lib/queryClient';

interface GraphContextType {
  users: GraphUser[];
  rawGraph: GraphData;
  simplifiedGraph: GraphData;
  transactions: {
    id: number;
    lender: string;
    borrower: string;
    amount: number;
    timestamp: string;
  }[];
  viewType: 'simplified' | 'raw';
  showTutorial: boolean;
  influentialUser: { name: string; avgPathLength: number } | null;
  debtLookup: { lender: string; borrower: string; amount: number | null } | null;
  addUser: (name: string) => void;
  removeUser: (name: string) => void;
  addDebt: (lender: string, borrower: string, amount: number) => void;
  setViewType: (type: 'simplified' | 'raw') => void;
  findInfluentialUser: () => void;
  lookupDebt: (lender: string, borrower: string) => void;
  resetDebtLookup: () => void;
  resetGraph: () => void;
  generateRandomGraph: (
    numUsers?: number,
    numEdges?: number,
    minAmount?: number,
    maxAmount?: number
  ) => void;
  exportGraph: () => void;
  setShowTutorial: (show: boolean) => void;
}

export const GraphContext = createContext<GraphContextType>({
  users: [],
  rawGraph: { nodes: [], links: [] },
  simplifiedGraph: { nodes: [], links: [] },
  transactions: [],
  viewType: 'simplified',
  showTutorial: false,
  influentialUser: null,
  debtLookup: null,
  addUser: () => {},
  removeUser: () => {},
  addDebt: () => {},
  setViewType: () => {},
  findInfluentialUser: () => {},
  lookupDebt: () => {},
  resetDebtLookup: () => {},
  resetGraph: () => {},
  generateRandomGraph: () => {},
  exportGraph: () => {},
  setShowTutorial: () => {},
});

interface GraphProviderProps {
  children: ReactNode;
}

export const GraphProvider = ({ children }: GraphProviderProps) => {
  const [loanGraph] = useState(() => new LoanGraph());
  const [users, setUsers] = useState<GraphUser[]>([]);
  const [rawGraph, setRawGraph] = useState<GraphData>({ nodes: [], links: [] });
  const [simplifiedGraph, setSimplifiedGraph] = useState<GraphData>({ nodes: [], links: [] });
  const [transactions, setTransactions] = useState<{id: number; lender: string; borrower: string; amount: number; timestamp: string}[]>([]);
  const [viewType, setViewType] = useState<'simplified' | 'raw'>('simplified');
  const [showTutorial, setShowTutorial] = useState(false);
  const [influentialUser, setInfluentialUser] = useState<{ name: string; avgPathLength: number } | null>(null);
  const [debtLookup, setDebtLookup] = useState<{ lender: string; borrower: string; amount: number | null } | null>(null);

  // Initialize the graph data from the backend
  const fetchGraphData = useCallback(async () => {
    try {
      const response = await apiRequest('GET', '/api/graph', undefined);
      const data = await response.json();
      
      setUsers(data.users);
      setRawGraph(data.rawGraph);
      setSimplifiedGraph(data.simplifiedGraph);
      setTransactions(data.transactions);
      
      // Update the local LoanGraph instance with the data
      loanGraph.setUsers(data.users);
      data.transactions.forEach((tx: any) => {
        loanGraph.addLoanRaw(tx.lender, tx.borrower, tx.amount);
      });
      
    } catch (error) {
      console.error('Failed to fetch graph data:', error);
    }
  }, [loanGraph]);

  useEffect(() => {
    fetchGraphData();
  }, [fetchGraphData]);

  const addUser = async (name: string) => {
    if (!name.trim() || users.some(u => u.name === name)) return;
    
    try {
      const response = await apiRequest('POST', '/api/users', { name });
      const newUser = await response.json();
      
      setUsers(prevUsers => [...prevUsers, newUser]);
      loanGraph.addUser(name);
      
      // Update graph data
      setRawGraph(prevGraph => ({
        ...prevGraph,
        nodes: [...prevGraph.nodes, { id: newUser.id, name }]
      }));
      
      setSimplifiedGraph(prevGraph => ({
        ...prevGraph,
        nodes: [...prevGraph.nodes, { id: newUser.id, name }]
      }));
      
    } catch (error) {
      console.error('Failed to add user:', error);
    }
  };

  const removeUser = async (name: string) => {
    try {
      const user = users.find(u => u.name === name);
      if (!user) return;
      
      await apiRequest('DELETE', `/api/users/${user.id}`, undefined);
      
      setUsers(prevUsers => prevUsers.filter(u => u.name !== name));
      
      // Update the graphs
      setRawGraph(prevGraph => ({
        ...prevGraph,
        nodes: prevGraph.nodes.filter(n => n.name !== name),
        links: prevGraph.links.filter(l => {
          const sourceNode = prevGraph.nodes.find(n => n.id === l.source);
          const targetNode = prevGraph.nodes.find(n => n.id === l.target);
          return sourceNode?.name !== name && targetNode?.name !== name;
        })
      }));
      
      setSimplifiedGraph(prevGraph => ({
        ...prevGraph,
        nodes: prevGraph.nodes.filter(n => n.name !== name),
        links: prevGraph.links.filter(l => {
          const sourceNode = prevGraph.nodes.find(n => n.id === l.source);
          const targetNode = prevGraph.nodes.find(n => n.id === l.target);
          return sourceNode?.name !== name && targetNode?.name !== name;
        })
      }));
      
      // Remove from transactions
      setTransactions(prevTx => 
        prevTx.filter(tx => tx.lender !== name && tx.borrower !== name)
      );
      
    } catch (error) {
      console.error('Failed to remove user:', error);
    }
  };

  const addDebt = async (lender: string, borrower: string, amount: number) => {
    if (lender === borrower || amount <= 0) return;
    
    try {
      const response = await apiRequest('POST', '/api/debts', { 
        lender, 
        borrower, 
        amount 
      });
      
      const data = await response.json();
      
      // Update transactions
      setTransactions(prev => [
        ...prev, 
        {
          id: data.id,
          lender,
          borrower,
          amount,
          timestamp: new Date().toISOString()
        }
      ]);
      
      // Update local graph state
      loanGraph.addLoan(lender, borrower, amount);
      
      // Get updated graphs
      const rawGraphData = loanGraph.getRawGraph();
      const simplifiedGraphData = loanGraph.getSimplifiedGraph();
      
      setRawGraph(rawGraphData);
      setSimplifiedGraph(simplifiedGraphData);
      
      // Always switch to raw view when adding a new transaction
      setViewType('raw');
      
    } catch (error) {
      console.error('Failed to add debt:', error);
    }
  };

  const findInfluentialUser = async () => {
    try {
      const response = await apiRequest('GET', '/api/graph/influential-user', undefined);
      const data = await response.json();
      
      setInfluentialUser({
        name: data.name,
        avgPathLength: data.avgPathLength
      });
      
    } catch (error) {
      console.error('Failed to find influential user:', error);
      setInfluentialUser(null);
    }
  };

  const lookupDebt = async (lender: string, borrower: string) => {
    try {
      const response = await apiRequest('GET', `/api/debts/lookup?lender=${lender}&borrower=${borrower}`, undefined);
      const data = await response.json();
      
      setDebtLookup({
        lender,
        borrower,
        amount: data.amount
      });
      
    } catch (error) {
      console.error('Failed to lookup debt:', error);
      setDebtLookup({
        lender,
        borrower,
        amount: null
      });
    }
  };

  const resetDebtLookup = () => {
    setDebtLookup(null);
  };

  const resetGraph = async () => {
    try {
      await apiRequest('DELETE', '/api/graph', undefined);
      
      loanGraph.reset();
      setUsers([]);
      setRawGraph({ nodes: [], links: [] });
      setSimplifiedGraph({ nodes: [], links: [] });
      setTransactions([]);
      setInfluentialUser(null);
      setDebtLookup(null);
      
    } catch (error) {
      console.error('Failed to reset graph:', error);
    }
  };

  const generateRandomGraph = async (
    numUsers = 5,
    numEdges = 8,
    minAmount = 50,
    maxAmount = 500
  ) => {
    try {
      const response = await apiRequest('POST', '/api/graph/random', {
        numUsers,
        numEdges,
        minAmount,
        maxAmount
      });
      const data = await response.json();
      
      setUsers(data.users);
      setRawGraph(data.rawGraph);
      setSimplifiedGraph(data.simplifiedGraph);
      setTransactions(data.transactions);
      
      // Update local graph instance
      loanGraph.reset();
      data.users.forEach((user: GraphUser) => {
        loanGraph.addUser(user.name);
      });
      
      data.transactions.forEach((tx: any) => {
        loanGraph.addLoanRaw(tx.lender, tx.borrower, tx.amount);
      });
      
      // Always switch to raw view when generating a random graph
      setViewType('raw');
      
    } catch (error) {
      console.error('Failed to generate random graph:', error);
    }
  };

  const exportGraph = async () => {
    try {
      const response = await apiRequest('GET', `/api/graph/export?type=${viewType}`, undefined);
      const data = await response.json();
      
      // Create a downloadable link
      const blob = new Blob([data.dot], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `debt_graph_${viewType}.dot`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
    } catch (error) {
      console.error('Failed to export graph:', error);
    }
  };

  return (
    <GraphContext.Provider
      value={{
        users,
        rawGraph,
        simplifiedGraph,
        transactions,
        viewType,
        showTutorial,
        influentialUser,
        debtLookup,
        addUser,
        removeUser,
        addDebt,
        setViewType,
        findInfluentialUser,
        lookupDebt,
        resetDebtLookup,
        resetGraph,
        generateRandomGraph,
        exportGraph,
        setShowTutorial,
      }}
    >
      {children}
    </GraphContext.Provider>
  );
};
