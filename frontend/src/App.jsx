import { useMemo } from "react";
import { Menubar } from "primereact/menubar";
import { Card } from "primereact/card";
import { Chart } from "primereact/chart";

export default function App() {
  const menuItems = useMemo(() => ([
    { label: "Dashboard", icon: "pi pi-home" },
    { label: "Clientes", icon: "pi pi-users" },
    { label: "Ordens", icon: "pi pi-briefcase" },
    { label: "Configurações", icon: "pi pi-cog" },
  ]), []);

  const chartData = useMemo(() => ({
    labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
    datasets: [{
      label: "Faturamento",
      data: [1200, 1900, 3000, 2500, 4200, 4800],
      backgroundColor: "rgba(54, 162, 235, 0.5)",
      borderColor: "#36A2EB",
      borderWidth: 2,
    }]
  }), []);

  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: "#111827" } } },
    scales: {
      x: { ticks: { color: "#374151" }, grid: { color: "#e5e7eb" } },
      y: { ticks: { color: "#374151" }, grid: { color: "#f3f4f6" } }
    }
  }), []);

  return (
    <div className="p-3" style={{ maxWidth: 1280, margin: "0 auto" }}>
      <Menubar model={menuItems} start={<strong>NestHost ERP</strong>} />
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(12, 1fr)",
        gap: "1rem",
        marginTop: "1rem"
      }}>
        <Card title="Clientes Ativos" subTitle="Este mês" style={{ gridColumn: "span 4" }}>
          <h2 style={{ margin: 0, fontSize: 32 }}>128</h2>
        </Card>
        <Card title="Ordens em aberto" subTitle="Hoje" style={{ gridColumn: "span 4" }}>
          <h2 style={{ margin: 0, fontSize: 32 }}>23</h2>
        </Card>
        <Card title="Faturamento" subTitle="Últimos 30 dias" style={{ gridColumn: "span 4" }}>
          <h2 style={{ margin: 0, fontSize: 32 }}>R$ 42.300</h2>
        </Card>

        <Card title="Desempenho Financeiro" style={{ gridColumn: "span 12", height: 360 }}>
          <div style={{ position: "relative", height: "100%" }}>
            <Chart type="bar" data={chartData} options={chartOptions} />
          </div>
        </Card>
      </div>
    </div>
  );
}
