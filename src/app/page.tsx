 "use client";

import {
  AlertTriangle,
  BarChart3,
  Building2,
  ShieldAlert,
  IndianRupee,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { getProjects } from "@/lib/api";
import { Project } from "@/types/project";

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadProjects() {
      try {
        const data = await getProjects();
        if (mounted) setProjects(data);
      } catch (error) {
        console.error("Failed to load projects:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadProjects();

    return () => {
      mounted = false;
    };
  }, []);

  const criticalProjects = useMemo(
    () => projects.filter((p) => p.risk.level === "critical"),
    [projects]
  );

  const highRiskProjects = useMemo(
    () => projects.filter((p) => p.risk.level === "high"),
    [projects]
  );

  const mediumProjects = useMemo(
    () => projects.filter((p) => p.risk.level === "medium"),
    [projects]
  );

  const lowProjects = useMemo(
    () => projects.filter((p) => p.risk.level === "low"),
    [projects]
  );

  const averageRisk = useMemo(() => {
    if (!projects.length) return 0;

    return Math.round(
      projects.reduce((sum, p) => sum + p.risk.overall, 0) /
        projects.length
    );
  }, [projects]);

  const totalApprovedCost = useMemo(
    () =>
      projects.reduce(
        (sum, p) => sum + p.financial.approvedCost,
        0
      ),
    [projects]
  );

  const totalRevisedCost = useMemo(
    () =>
      projects.reduce(
        (sum, p) => sum + p.financial.revisedCost,
        0
      ),
    [projects]
  );

  const costExposure = totalRevisedCost - totalApprovedCost;

  const priorityProjects = useMemo(
    () =>
      [...projects]
        .sort((a, b) => b.risk.overall - a.risk.overall)
        .slice(0, 4),
    [projects]
  );

  const riskCounts = {
    critical: criticalProjects.length,
    high: highRiskProjects.length,
    medium: mediumProjects.length,
    low: lowProjects.length,
  };

  return (
    <main className="darpan-app">
      <aside className="sidebar">
        <DashboardSidebar criticalCount={criticalProjects.length} />
      </aside>

      <section className="main-area">
        <header className="top-header">
          <div>
            <div className="breadcrumb">DARPAN / NATIONAL PORTFOLIO</div>
            <h1>Infrastructure Intelligence</h1>
          </div>

          <div className="header-actions">
            <div className="data-refresh">
              <div className="refresh-dot" />
              Data snapshot
              <strong>April 2026</strong>
            </div>
          </div>
        </header>

        <div className="dashboard-content dashboard-v2">
          {/* HERO */}
          <section className="dash2-hero">
            <div className="dash2-hero-copy">
              <div className="dash2-eyebrow">
                <span />
                LIVE PORTFOLIO INTELLIGENCE
              </div>

              <h2>
                See the risk.{" "}
                <span>Before it becomes a crisis.</span>
              </h2>

              <p>
                A consolidated view of infrastructure project health,
                emerging risk and intervention priorities.
              </p>
            </div>

            <div className="dash2-snapshot">
              <span className="dash2-live-dot" />
              <span>Data snapshot</span>
              <strong>April 2026</strong>
            </div>
          </section>

          {/* KPI CARDS */}
          <section className="dash2-kpis">
            <KpiCard
              icon={<Building2 size={19} />}
              label="Total projects"
              value={loading ? "—" : projects.length.toLocaleString("en-IN")}
              helper="Current monitored portfolio"
            />

            <KpiCard
              icon={<ShieldAlert size={19} />}
              label="High-risk projects"
              value={
                loading
                  ? "—"
                  : (criticalProjects.length + highRiskProjects.length).toLocaleString(
                      "en-IN"
                    )
              }
              helper={
                projects.length
                  ? `${Math.round(
                      ((criticalProjects.length + highRiskProjects.length) /
                        projects.length) *
                        100
                    )}% of monitored portfolio`
                  : "Portfolio risk"
              }
            />

            <KpiCard
              icon={<IndianRupee size={19} />}
              label="Cost exposure"
              value={loading ? "—" : formatCrore(costExposure)}
              helper="Revised minus approved cost"
            />

            <KpiCard
              icon={<AlertTriangle size={19} />}
              label="Active warnings"
              value={loading ? "—" : criticalProjects.length}
              helper="Require monitoring attention"
              danger={criticalProjects.length > 0}
            />
          </section>

          {/* ANALYTICS */}
          <section className="dash2-analytics">
            <RiskDistribution
              counts={riskCounts}
              total={projects.length}
            />

            <RiskTrend averageRisk={averageRisk} />
          </section>

          {/* WARNING + INSIGHT */}
          <section className="dash2-lower-grid">
            <EarlyWarning project={criticalProjects[0]} />

            <section className="dash2-panel dash2-insight-panel">
              <div className="dash2-panel-head">
                <div>
                  <span className="dash2-panel-kicker">
                    PORTFOLIO SIGNAL
                  </span>
                  <h3>What DARPAN sees</h3>
                </div>

                <div className="dash2-signal-badge">
                  <TrendingUp size={13} />
                  Predictive
                </div>
              </div>

              <div className="dash2-insight-list">
                <InsightRow
                  label="Average portfolio risk"
                  value={`${averageRisk}/100`}
                  note={
                    averageRisk >= 70
                      ? "Elevated"
                      : averageRisk >= 45
                      ? "Moderate"
                      : "Controlled"
                  }
                />

                <InsightRow
                  label="Financial vs physical gap"
                  value={
                    projects.length
                      ? `${Math.round(
                          projects.reduce(
                            (sum, p) =>
                              sum +
                              (p.progress.financial -
                                p.progress.physical),
                            0
                          ) / projects.length
                        )} pp`
                      : "—"
                  }
                  note="Portfolio average"
                />

                <InsightRow
                  label="Highest-risk project"
                  value={priorityProjects[0]?.risk.overall ?? "—"}
                  note={priorityProjects[0]?.name ?? "No projects"}
                />
              </div>
            </section>
          </section>

          {/* PRIORITY PROJECTS */}
          <section className="dash2-panel dash2-priority">
            <div className="dash2-panel-head">
              <div>
                <span className="dash2-panel-kicker">
                  PRIORITY QUEUE
                </span>
                <h3>Projects requiring attention</h3>
              </div>

              <Link href="/projects" className="dash2-view-all">
                View all <span>→</span>
              </Link>
            </div>

            {loading ? (
              <div className="dash2-loading">
                <div className="loading-spinner" />
                Loading portfolio intelligence...
              </div>
            ) : (
              <div className="dash2-project-list">
                {priorityProjects.map((project, index) => (
                  <PriorityProjectRow
                    key={project.id}
                    project={project}
                    rank={index + 1}
                  />
                ))}
              </div>
            )}
          </section>

          {/* BOTTOM QUICK ACTIONS */}
          <section className="dash2-actions">
            <Link href="/warnings" className="dash2-action-card">
              <div className="dash2-action-icon warning">
                <AlertTriangle size={17} />
              </div>
              <div>
                <span>EARLY WARNINGS</span>
                <strong>Review predictive signals</strong>
              </div>
              <b>→</b>
            </Link>

            <Link href="/projects" className="dash2-action-card">
              <div className="dash2-action-icon">
                <Building2 size={17} />
              </div>
              <div>
                <span>PROJECT INTELLIGENCE</span>
                <strong>Explore monitored projects</strong>
              </div>
              <b>→</b>
            </Link>

            <Link href="/investigation" className="dash2-action-card">
              <div className="dash2-action-icon">
                <ShieldAlert size={17} />
              </div>
              <div>
                <span>INVESTIGATION</span>
                <strong>Inspect unusual behaviour</strong>
              </div>
              <b>→</b>
            </Link>
          </section>
        </div>
      </section>
    </main>
  );
}

/* =========================================================
   SIDEBAR
========================================================= */

function DashboardSidebar({
  criticalCount,
}: {
  criticalCount: number;
}) {
  return (
    <>
      <div className="brand">
        <div className="brand-mark">
          <span>द</span>
        </div>
        <div>
          <div className="brand-name">DARPAN</div>
          <div className="brand-subtitle">
            Infrastructure Intelligence
          </div>
        </div>
      </div>

      <div className="sidebar-section-label">COMMAND CENTER</div>

      <nav className="sidebar-nav">
        <Link href="/" className="nav-item nav-active">
          <BarChart3 size={18} />
          <span>Dashboard</span>
        </Link>

        <Link href="/projects" className="nav-item">
          <Building2 size={18} />
          <span>Projects</span>
        </Link>

        <Link href="/warnings" className="nav-item">
          <AlertTriangle size={18} />
          <span>Early Warnings</span>
          {criticalCount > 0 && (
            <span className="nav-count">{criticalCount}</span>
          )}
        </Link>

        <Link href="/investigation" className="nav-item">
          <ShieldAlert size={18} />
          <span>Investigation</span>
        </Link>
      </nav>

      <div className="sidebar-spacer" />

      <div className="system-status">
        <div className="status-pulse">
          <span />
        </div>
        <div>
          <div className="status-title">Analytics engine</div>
          <div className="status-value">Operational</div>
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="footer-symbol">D</div>
        <div>
          <div className="footer-name">DARPAN v0.1</div>
          <div className="footer-text">Predictive monitoring</div>
        </div>
      </div>
    </>
  );
}

/* =========================================================
   KPI
========================================================= */

function KpiCard({
  icon,
  label,
  value,
  helper,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  helper: string;
  danger?: boolean;
}) {
  return (
    <article className={`dash2-kpi ${danger ? "danger" : ""}`}>
      <div className="dash2-kpi-top">
        <div className="dash2-kpi-icon">{icon}</div>
        {danger && (
          <span className="dash2-kpi-alert">
            <AlertTriangle size={12} />
          </span>
        )}
      </div>

      <div className="dash2-kpi-value">{value}</div>
      <div className="dash2-kpi-label">{label}</div>
      <div className="dash2-kpi-helper">{helper}</div>
    </article>
  );
}

/* =========================================================
   RISK DISTRIBUTION
========================================================= */

function RiskDistribution({
  counts,
  total,
}: {
  counts: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  total: number;
}) {
  const criticalPct = total ? (counts.critical / total) * 100 : 0;
  const highPct = total ? (counts.high / total) * 100 : 0;
  const mediumPct = total ? (counts.medium / total) * 100 : 0;
  const lowPct = total ? (counts.low / total) * 100 : 0;

  const criticalEnd = criticalPct;
  const highEnd = criticalEnd + highPct;
  const mediumEnd = highEnd + mediumPct;

  return (
    <section className="dash2-panel dash2-risk-panel">
      <div className="dash2-panel-head">
        <div>
          <span className="dash2-panel-kicker">PORTFOLIO HEALTH</span>
          <h3>Risk distribution</h3>
        </div>

        <span className="dash2-mini-badge">
          <span />
          Live
        </span>
      </div>

      <div className="dash2-risk-body">
        <div
          className="dash2-donut"
          style={{
            background: `conic-gradient(
              #b65d55 0 ${criticalEnd}%,
              #c99549 ${criticalEnd}% ${highEnd}%,
              #c7ad62 ${highEnd}% ${mediumEnd}%,
              #5d9c82 ${mediumEnd}% 100%
            )`,
          }}
        >
          <div className="dash2-donut-center">
            <strong>
              {total ? Math.round(((counts.critical + counts.high) / total) * 100) : 0}%
            </strong>
            <span>high risk</span>
          </div>
        </div>

        <div className="dash2-legend">
          <LegendRow
            label="Low risk"
            value={counts.low}
            percentage={lowPct}
            type="low"
          />
          <LegendRow
            label="Medium"
            value={counts.medium}
            percentage={mediumPct}
            type="medium"
          />
          <LegendRow
            label="High"
            value={counts.high}
            percentage={highPct}
            type="high"
          />
          <LegendRow
            label="Critical"
            value={counts.critical}
            percentage={criticalPct}
            type="critical"
          />
        </div>
      </div>

      <div className="dash2-risk-bar">
        <span style={{ width: `${lowPct}%` }} className="low" />
        <span style={{ width: `${mediumPct}%` }} className="medium" />
        <span style={{ width: `${highPct}%` }} className="high" />
        <span style={{ width: `${criticalPct}%` }} className="critical" />
      </div>
    </section>
  );
}

function LegendRow({
  label,
  value,
  percentage,
  type,
}: {
  label: string;
  value: number;
  percentage: number;
  type: "low" | "medium" | "high" | "critical";
}) {
  return (
    <div className="dash2-legend-row">
      <span className={`dash2-legend-dot ${type}`} />
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{Math.round(percentage)}%</small>
    </div>
  );
}

/* =========================================================
   RISK TREND
========================================================= */

function RiskTrend({ averageRisk }: { averageRisk: number }) {
  const points = [
    [0, 76],
    [8, 73],
    [16, 70],
    [24, 71],
    [32, 63],
    [40, 65],
    [48, 58],
    [56, 61],
    [64, 53],
    [72, 56],
    [80, 48],
    [88, 51],
    [96, 43],
    [100, 36],
  ];

  const line = points
    .map(([x, y]) => `${x},${y}`)
    .join(" ");

  const area = `0,100 ${line} 100,100`;

  return (
    <section className="dash2-panel dash2-trend-panel">
      <div className="dash2-panel-head">
        <div>
          <span className="dash2-panel-kicker">RISK TRAJECTORY</span>
          <h3>Portfolio risk trend</h3>
        </div>

        <div className="dash2-trend-value">
          <TrendingUp size={13} />
          <strong>+4.8%</strong>
          <span>vs previous</span>
        </div>
      </div>

      <div className="dash2-chart">
        <div className="dash2-chart-grid">
          <span />
          <span />
          <span />
          <span />
        </div>

        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="dash2-chart-svg"
          aria-label="Portfolio risk trend"
        >
          <polygon points={area} className="dash2-chart-area" />
          <polyline
            points={line}
            fill="none"
            className="dash2-chart-line"
          />
          <circle
            cx="88"
            cy="51"
            r="1.8"
            className="dash2-chart-point"
          />
        </svg>

        <div className="dash2-chart-labels">
          <span>Nov</span>
          <span>Dec</span>
          <span>Jan</span>
          <span>Feb</span>
          <span>Mar</span>
          <span>Apr</span>
        </div>
      </div>

      <div className="dash2-chart-footer">
        <span>Current portfolio risk</span>
        <strong>{averageRisk}/100</strong>
      </div>
    </section>
  );
}

/* =========================================================
   WARNING
========================================================= */

function EarlyWarning({ project }: { project?: Project }) {
  return (
    <section className="dash2-panel dash2-warning-panel">
      <div className="dash2-panel-head">
        <div>
          <span className="dash2-panel-kicker">EARLY WARNING</span>
          <h3>Attention required</h3>
        </div>

        <div className="dash2-warning-head-icon">
          <AlertTriangle size={17} />
        </div>
      </div>

      {project ? (
        <div className="dash2-warning-card">
          <div className="dash2-warning-icon">
            <AlertTriangle size={20} />
          </div>

          <div className="dash2-warning-main">
            <div className="dash2-warning-project">{project.name}</div>

            <div className="dash2-warning-title">
              {project.primaryRiskDriver ?? "Risk signal detected"}
            </div>

            <div className="dash2-warning-meta">
              <span>Risk score</span>
              <strong>{project.risk.overall}/100</strong>
              <span>•</span>
              <span>{project.state}</span>
            </div>

            <Link href={`/projects/${project.id}`}>
              Investigate <span>→</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="dash2-no-warning">
          <TrendingDown size={22} />
          <strong>No critical projects</strong>
          <span>
            Portfolio is currently within monitored thresholds.
          </span>
        </div>
      )}
    </section>
  );
}

/* =========================================================
   INSIGHT
========================================================= */

function InsightRow({
  label,
  value,
  note,
}: {
  label: string;
  value: string | number;
  note: string;
}) {
  return (
    <div className="dash2-insight-row">
      <div>
        <span>{label}</span>
        <small>{note}</small>
      </div>
      <strong>{value}</strong>
    </div>
  );
}

/* =========================================================
   PRIORITY PROJECT
========================================================= */

function PriorityProjectRow({
  project,
  rank,
}: {
  project: Project;
  rank: number;
}) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="dash2-project-row"
    >
      <span className="dash2-rank">
        {String(rank).padStart(2, "0")}
      </span>

      <div className="dash2-project-icon">
        <Building2 size={17} />
      </div>

      <div className="dash2-project-main">
        <strong>{project.name}</strong>
        <span>{project.ministry}</span>
      </div>

      <div className="dash2-project-location">
        <span>Location</span>
        <strong>{project.state}</strong>
      </div>

      <div className="dash2-project-progress">
        <span>Physical</span>
        <strong>{project.progress.physical}%</strong>
        <div>
          <span style={{ width: `${project.progress.physical}%` }} />
        </div>
      </div>

      <div className={`dash2-risk-score ${project.risk.level}`}>
        <strong>{project.risk.overall}</strong>
        <span>{project.risk.level}</span>
      </div>

      <span className="dash2-project-arrow">→</span>
    </Link>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function formatCrore(value: number) {
  return `₹${value.toLocaleString("en-IN")} Cr`;
}
