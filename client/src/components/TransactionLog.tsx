import { useGraphContext } from "@/hooks/useGraphContext";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function TransactionLog() {
  const { transactions } = useGraphContext();

  // Format timestamp for display
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  // Get initial for avatar
  const getInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <Card className="bg-white rounded-xl shadow-sm">
      <CardContent className="p-6">
        <CardTitle className="font-heading font-semibold text-lg mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 1H6v8l4-2 4 2V6z" clipRule="evenodd" />
          </svg>
          Transaction Log
        </CardTitle>
        
        <div className="overflow-hidden rounded-lg border border-secondary-100">
          <Table>
            <TableHeader className="bg-secondary-50">
              <TableRow>
                <TableHead className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">#</TableHead>
                <TableHead className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Lender</TableHead>
                <TableHead className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Borrower</TableHead>
                <TableHead className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Amount</TableHead>
                <TableHead className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white divide-y">
              {transactions.map((transaction, index) => (
                <TableRow key={transaction.id}>
                  <TableCell className="px-4 py-3 whitespace-nowrap text-sm text-secondary-500">{index + 1}</TableCell>
                  <TableCell className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-medium">
                        {getInitial(transaction.lender)}
                      </div>
                      <div className="ml-3 text-sm font-medium text-secondary-700">{transaction.lender}</div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-debt-100 flex items-center justify-center text-debt-600 font-medium">
                        {getInitial(transaction.borrower)}
                      </div>
                      <div className="ml-3 text-sm font-medium text-secondary-700">{transaction.borrower}</div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 whitespace-nowrap text-sm font-medium text-debt-500">
                    ${transaction.amount.toFixed(2)}
                  </TableCell>
                  <TableCell className="px-4 py-3 whitespace-nowrap text-sm text-secondary-500">
                    {formatTimestamp(transaction.timestamp)}
                  </TableCell>
                </TableRow>
              ))}
              
              {transactions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="px-4 py-8 text-center text-sm text-secondary-500">
                    No transactions recorded yet. Add a debt transaction to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
