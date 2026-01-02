export type DashboardOverview = {
  totalBooks: number;
  totalCopies: number;
  availableCopies: number;
  loanedCopies: number;
  maintenanceCopies: number;
  activeLoans: number;
  overdueLoans: number;
  totalUsers: number;
  activeUsers: number;
  lostBooks: number;
  unpaidFinesAmount: number;
  collectedFinesThisMonth: number;
}
