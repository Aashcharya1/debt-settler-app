import type { Express } from "express";
import { createServer, type Server } from "http";
import { LoanGraph } from "./loanGraph";

// Initialize graph
const loanGraph = new LoanGraph();
const rawLoanGraph = new LoanGraph();

// Store transactions
interface Transaction {
  id: number;
  lender: string;
  borrower: string;
  amount: number;
  timestamp: string;
}

let transactions: Transaction[] = [];
let nextTransactionId = 1;

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // Get graph data
  app.get('/api/graph', (req, res) => {
    const users = loanGraph.getUsers().map((name, id) => ({ id, name }));
    const rawGraph = rawLoanGraph.getRawGraph();
    const simplifiedGraph = loanGraph.getSimplifiedGraph();
    
    res.json({
      users,
      rawGraph,
      simplifiedGraph,
      transactions
    });
  });

  // Add user
  app.post('/api/users', (req, res) => {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    
    loanGraph.addUser(name);
    rawLoanGraph.addUser(name);
    
    const userId = loanGraph.getUserId(name);
    
    res.status(201).json({ id: userId, name });
  });

  // Delete user
  app.delete('/api/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const userName = loanGraph.getUserName(userId);
    
    if (!userName) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Remove user from graphs
    loanGraph.removeUser(userName);
    rawLoanGraph.removeUser(userName);
    
    // Remove transactions involving this user
    transactions = transactions.filter(tx => tx.lender !== userName && tx.borrower !== userName);
    
    res.status(200).json({ success: true });
  });

  // Add debt
  app.post('/api/debts', (req, res) => {
    const { lender, borrower, amount } = req.body;
    
    if (!lender || !borrower || !amount) {
      return res.status(400).json({ error: 'Lender, borrower, and amount are required' });
    }
    
    if (lender === borrower) {
      return res.status(400).json({ error: 'Lender and borrower cannot be the same' });
    }
    
    if (amount <= 0) {
      return res.status(400).json({ error: 'Amount must be positive' });
    }
    
    // Add to raw graph first
    rawLoanGraph.addLoanRaw(lender, borrower, amount);
    
    // Add to simplified graph (which will auto-simplify)
    loanGraph.addLoan(lender, borrower, amount);
    
    // Record transaction
    const transaction = {
      id: nextTransactionId++,
      lender,
      borrower,
      amount,
      timestamp: new Date().toISOString()
    };
    
    transactions.push(transaction);
    
    res.status(201).json(transaction);
  });
  
  // Lookup debt between users
  app.get('/api/debts/lookup', (req, res) => {
    const { lender, borrower } = req.query;
    
    if (!lender || !borrower) {
      return res.status(400).json({ error: 'Lender and borrower are required' });
    }
    
    // Get from simplified graph
    const debtAmount = loanGraph.lookupDebt(lender as string, borrower as string);
    
    res.json({ amount: debtAmount });
  });
  
  // Find most influential user
  app.get('/api/graph/influential-user', (req, res) => {
    const result = loanGraph.findMostInfluentialUser();
    
    if (!result) {
      return res.status(404).json({ error: 'No influential user found' });
    }
    
    res.json(result);
  });
  
  // Generate random graph
  app.post('/api/graph/random', (req, res) => {
    // Get parameters from request body with defaults
    const numUsers = req.body.numUsers || 5;
    const numEdges = req.body.numEdges || 8;
    const minAmount = req.body.minAmount || 50;
    const maxAmount = req.body.maxAmount || 500;
    
    // Reset graphs
    loanGraph.reset();
    rawLoanGraph.reset();
    transactions = [];
    
    // List of possible user names
    const possibleUsers = [
      'Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Frank',
      'Grace', 'Heidi', 'Ivan', 'Julia', 'Kevin', 'Laura',
      'Mike', 'Nancy', 'Oscar', 'Patricia', 'Quinn', 'Rachel',
      'Sam', 'Tina', 'Ursula', 'Victor', 'Whitney', 'Xavier', 'Yvonne', 'Zack'
    ];
    
    // Select only the number of users requested
    const selectedUsers = possibleUsers.slice(0, Math.min(numUsers, possibleUsers.length));
    
    // Add users to both graphs
    selectedUsers.forEach(user => {
      loanGraph.addUser(user);
      rawLoanGraph.addUser(user);
    });
    
    // Generate random transactions based on specified edges count
    for (let i = 0; i < numEdges; i++) {
      const u = Math.floor(Math.random() * selectedUsers.length);
      let v = Math.floor(Math.random() * selectedUsers.length);
      
      // Ensure lender and borrower are different
      while (u === v) {
        v = Math.floor(Math.random() * selectedUsers.length);
      }
      
      const lender = selectedUsers[u];
      const borrower = selectedUsers[v];
      
      // Random amount between minAmount and maxAmount
      const amount = minAmount + Math.floor(Math.random() * (maxAmount - minAmount + 1));
      
      // Add to raw graph
      rawLoanGraph.addLoanRaw(lender, borrower, amount);
      
      // Add to simplified graph
      loanGraph.addLoan(lender, borrower, amount);
      
      // Record transaction
      transactions.push({
        id: nextTransactionId++,
        lender,
        borrower,
        amount,
        timestamp: new Date().toISOString()
      });
    }
    
    // Return data
    const users = loanGraph.getUsers().map((name, id) => ({ id, name }));
    const rawGraph = rawLoanGraph.getRawGraph();
    const simplifiedGraph = loanGraph.getSimplifiedGraph();
    
    res.json({
      users,
      rawGraph,
      simplifiedGraph,
      transactions
    });
  });
  
  // Reset graph
  app.delete('/api/graph', (req, res) => {
    loanGraph.reset();
    rawLoanGraph.reset();
    transactions = [];
    nextTransactionId = 1;
    
    res.json({ success: true });
  });
  
  // Export graph to DOT format
  app.get('/api/graph/export', (req, res) => {
    const type = req.query.type || 'simplified';
    const isSimplified = type === 'simplified';
    
    const dotContent = isSimplified
      ? loanGraph.exportDOT(true)
      : rawLoanGraph.exportDOT(false);
    
    res.json({ dot: dotContent });
  });

  const httpServer = createServer(app);

  return httpServer;
}
