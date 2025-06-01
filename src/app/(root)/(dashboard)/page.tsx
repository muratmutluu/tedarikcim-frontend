import { SectionCards } from "./_components/dashboard-section-cards";
import { DashboardAreaChart } from "./_components/dashboard-area-chart";
import { DashboardHorizontalBarChart } from "./_components/dashboard-horizontal-bar-chart";
import { DashboardBarChart } from "./_components/dashboard-bar-chart";

export default function DashboardPage() {
  return (
    <>
      <SectionCards />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
        <DashboardAreaChart />
        <DashboardHorizontalBarChart type="highest" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_2fr]">
        <DashboardHorizontalBarChart type="lowest" />
        <DashboardBarChart />
      </div>
    </>
  );
}
