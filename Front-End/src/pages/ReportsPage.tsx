import React from "react";
import { useReportsViewModel } from "../features/reports/hooks/useReportsViewModel";
import ReportsHeader from "../features/reports/components/ReportsHeader";
import StatsGrid from "../features/reports/components/StatsGrid";
import ChartsGrid from "../features/reports/components/ChartsGrid";
import LoansTable from "../features/reports/components/LoansTable";
import ReservasTable from "../features/reports/components/ReservasTable";
import TopBorrowersTable from "../features/reports/components/TopBorrowersTable";
import "./ReportsPage.scss";

const ReportsPage: React.FC = () => {
  const vm = useReportsViewModel();

  return (
    <div className="reports-page">
      <div className="container">
        <ReportsHeader />

        <StatsGrid
          totalLoans={vm.loans.length}
          ativos={vm.ativos}
          atrasados={vm.atrasados}
          reservasAtivas={vm.reservasAtivas}
        />

        <ChartsGrid
          barData={vm.barData}
          barOptions={vm.barOptions}
          donutData={vm.donutData}
          donutOptions={vm.donutOptions}
          totalLoans={vm.loans.length}
        />

        <div className="tables-grid">
          <LoansTable loans={vm.loans} />
          <ReservasTable reservations={vm.reservations} />
          <TopBorrowersTable topBorrowers={vm.topBorrowers} />
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
