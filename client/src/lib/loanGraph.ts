import { GraphData, GraphUser, GraphDebt } from '@shared/schema';

interface DebtMapEntry {
  lender: string;
  borrower: string;
  amount: number;
}

export class LoanGraph {
  private userToID: Map<string, number>;
  private idToUser: string[];
  private adj: Map<number, Map<number, number>>;
  private debtMap: Map<string, number>;
  private userCount: number;

  constructor() {
    this.userToID = new Map();
    this.idToUser = [];
    this.adj = new Map();
    this.debtMap = new Map();
    this.userCount = 0;
  }

  private getDebtKey(u: number, v: number): string {
    return `${this.idToUser[u]}->${this.idToUser[v]}`;
  }

  reset(): void {
    this.userToID = new Map();
    this.idToUser = [];
    this.adj = new Map();
    this.debtMap = new Map();
    this.userCount = 0;
  }

  setUsers(users: GraphUser[]): void {
    this.reset();
    users.forEach(user => {
      this.addUser(user.name);
    });
  }

  addUser(user: string): void {
    if (!this.userToID.has(user)) {
      this.userToID.set(user, this.userCount++);
      this.idToUser.push(user);
      this.adj.set(this.userToID.get(user)!, new Map());
    }
  }

  addLoan(lender: string, borrower: string, amount: number): void {
    if (lender === borrower) return;

    this.addUser(lender);
    this.addUser(borrower);
    const u = this.userToID.get(lender)!;
    const v = this.userToID.get(borrower)!;

    if (!this.adj.has(u)) {
      this.adj.set(u, new Map());
    }

    const adjU = this.adj.get(u)!;
    adjU.set(v, (adjU.get(v) || 0) + amount);
    this.debtMap.set(this.getDebtKey(u, v), adjU.get(v)!);

    this.simplifyGraph();
  }

  addLoanRaw(lender: string, borrower: string, amount: number): void {
    if (lender === borrower) return;

    this.addUser(lender);
    this.addUser(borrower);
    const u = this.userToID.get(lender)!;
    const v = this.userToID.get(borrower)!;

    if (!this.adj.has(u)) {
      this.adj.set(u, new Map());
    }

    const adjU = this.adj.get(u)!;
    adjU.set(v, (adjU.get(v) || 0) + amount);
    this.debtMap.set(this.getDebtKey(u, v), adjU.get(v)!);
  }

  simplifyGraph(): void {
    const netBalance = new Map<number, number>();

    // Calculate net balance for each user
    for (let u = 0; u < this.userCount; u++) {
      const adjU = this.adj.get(u);
      if (!adjU) continue;

      for (const [v, amt] of adjU.entries()) {
        netBalance.set(u, (netBalance.get(u) || 0) - amt);
        netBalance.set(v, (netBalance.get(v) || 0) + amt);
      }
    }

    // Clear adjacency list and debt map
    this.adj.clear();
    this.debtMap.clear();

    // Initialize new adj maps
    for (let i = 0; i < this.userCount; i++) {
      this.adj.set(i, new Map());
    }

    // Create creditors and debtors lists
    const creditors: [number, number][] = [];
    const debtors: [number, number][] = [];

    for (const [id, bal] of netBalance.entries()) {
      if (bal > 0.001) {
        creditors.push([id, bal]);
      } else if (bal < -0.001) {
        debtors.push([id, -bal]);
      }
    }

    // Match debtors with creditors
    let i = 0, j = 0;
    while (i < debtors.length && j < creditors.length) {
      const [debtor, debtAmount] = debtors[i];
      const [creditor, creditAmount] = creditors[j];
      
      const settle = Math.min(debtAmount, creditAmount);

      const adjDebtor = this.adj.get(debtor)!;
      adjDebtor.set(creditor, settle);
      this.debtMap.set(this.getDebtKey(debtor, creditor), settle);

      debtors[i][1] -= settle;
      creditors[j][1] -= settle;

      if (debtors[i][1] < 0.001) i++;
      if (creditors[j][1] < 0.001) j++;
    }
  }

  lookupDebt(lender: string, borrower: string): number | null {
    if (!this.userToID.has(lender) || !this.userToID.has(borrower)) {
      return null;
    }
    
    const u = this.userToID.get(lender)!;
    const v = this.userToID.get(borrower)!;
    const key = this.getDebtKey(u, v);
    
    return this.debtMap.has(key) ? this.debtMap.get(key)! : null;
  }

  findMostInfluentialUser(): { name: string; avgPathLength: number } | null {
    if (this.userCount === 0) return null;

    const avgPathLength: number[] = Array(this.userCount).fill(0);

    for (let src = 0; src < this.userCount; src++) {
      // Initialize distances
      const dist: number[] = Array(this.userCount).fill(Number.MAX_VALUE);
      dist[src] = 0;

      // Priority queue for Dijkstra's (using a simple array for demo purposes)
      const pq: [number, number][] = [[0, src]]; // [distance, node]

      while (pq.length > 0) {
        // Find minimum distance vertex
        let minIdx = 0;
        for (let i = 1; i < pq.length; i++) {
          if (pq[i][0] < pq[minIdx][0]) minIdx = i;
        }

        const [d, u] = pq[minIdx];
        pq.splice(minIdx, 1);

        if (d > dist[u]) continue;

        // Process neighbors
        const adjU = this.adj.get(u);
        if (!adjU) continue;

        for (const [v, cost] of adjU.entries()) {
          if (dist[u] + cost < dist[v]) {
            dist[v] = dist[u] + cost;
            pq.push([dist[v], v]);
          }
        }
      }

      // Calculate average path length for this source
      let sum = 0;
      let reachable = 0;
      for (let i = 0; i < this.userCount; i++) {
        if (i !== src && dist[i] < Number.MAX_VALUE) {
          sum += dist[i];
          reachable++;
        }
      }

      avgPathLength[src] = reachable > 0 ? sum / reachable : Number.MAX_VALUE;
    }

    // Find user with minimum average path length
    let minAvg = Number.MAX_VALUE;
    let influentialUser = -1;
    for (let i = 0; i < this.userCount; i++) {
      if (avgPathLength[i] < minAvg) {
        minAvg = avgPathLength[i];
        influentialUser = i;
      }
    }

    if (influentialUser !== -1) {
      return {
        name: this.idToUser[influentialUser],
        avgPathLength: minAvg
      };
    }

    return null;
  }

  getRawGraph(): GraphData {
    const nodes: GraphUser[] = [];
    const links: GraphDebt[] = [];

    // Add all users as nodes
    for (let i = 0; i < this.idToUser.length; i++) {
      nodes.push({
        id: i,
        name: this.idToUser[i]
      });
    }

    // Create a separate adjacency list for the raw graph
    const rawAdj = new Map<number, Map<number, number>>();
    
    // Deep copy the current adjacency list
    for (const [u, adjMap] of this.adj.entries()) {
      rawAdj.set(u, new Map(adjMap));
    }

    // Add all edges as links
    for (let u = 0; u < this.userCount; u++) {
      const adjU = rawAdj.get(u);
      if (!adjU) continue;

      for (const [v, amt] of adjU.entries()) {
        if (amt > 0.001) {
          links.push({
            source: u,
            target: v,
            amount: amt
          });
        }
      }
    }

    return { nodes, links };
  }

  getSimplifiedGraph(): GraphData {
    // Create a copy and simplify it
    const simplifiedLoanGraph = new LoanGraph();
    
    // Copy users
    for (const user of this.idToUser) {
      simplifiedLoanGraph.addUser(user);
    }
    
    // Copy all edges
    for (let u = 0; u < this.userCount; u++) {
      const adjU = this.adj.get(u);
      if (!adjU) continue;

      for (const [v, amt] of adjU.entries()) {
        if (amt > 0.001) {
          simplifiedLoanGraph.addLoanRaw(this.idToUser[u], this.idToUser[v], amt);
        }
      }
    }
    
    // Simplify the copy
    simplifiedLoanGraph.simplifyGraph();
    
    // Return the graph data
    return simplifiedLoanGraph.getRawGraph();
  }

  exportDOT(isSimplified: boolean = true): string {
    let result = "digraph LoanGraph {\n";
    
    const graph = isSimplified ? this.getSimplifiedGraph() : this.getRawGraph();
    
    for (const link of graph.links) {
      const sourceNode = graph.nodes.find(n => n.id === link.source);
      const targetNode = graph.nodes.find(n => n.id === link.target);
      
      if (sourceNode && targetNode) {
        result += `  "${sourceNode.name}" -> "${targetNode.name}" [label="$${link.amount.toFixed(2)}"];\n`;
      }
    }
    
    result += "}\n";
    return result;
  }

  getAllDebts(): DebtMapEntry[] {
    const debts: DebtMapEntry[] = [];
    
    for (let u = 0; u < this.userCount; u++) {
      const adjU = this.adj.get(u);
      if (!adjU) continue;

      for (const [v, amt] of adjU.entries()) {
        if (amt > 0.001) {
          debts.push({
            lender: this.idToUser[u],
            borrower: this.idToUser[v],
            amount: amt
          });
        }
      }
    }
    
    return debts;
  }
}
