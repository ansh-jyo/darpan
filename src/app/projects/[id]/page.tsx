"use client";

import {
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  Building2,
  CheckCircle2,
  Clock3,
  IndianRupee,
  MapPin,
  ShieldAlert,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import Link from "next/link";
import { useEffect, useState } from "react";

import { getProject } from "@/lib/api";
import { Project } from "@/types/project";

interface ProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ProjectPage({
  params,
}: ProjectPageProps) {
  const [project, setProject] =
    useState<Project | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [notFound, setNotFound] =
    useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadProject() {
      try {
        const { id } =
          await params;

        const data =
          await getProject(id);

        if (!mounted) return;

        if (!data) {
          setNotFound(true);
        } else {
          setProject(data);
        }
      } catch (error) {
        console.error(
          "Failed to load project:",
          error
        );

        if (mounted) {
          setNotFound(true);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadProject();

    return () => {
      mounted = false;
    };
  }, [params]);

  /* =========================================
     LOADING
  ========================================= */

  if (loading) {
    return (
      <main className="darpan-app">

        <aside className="sidebar">
          <ProjectSidebar />
        </aside>

        <section className="main-area">

          <header className="top-header">

            <div>

              <div className="breadcrumb">
                PROJECTS / INTELLIGENCE
              </div>

              <h1>
                Project Intelligence
              </h1>

            </div>

            <div className="data-refresh">

              <div className="refresh-dot" />

              Data snapshot

              <strong>
                April 2026
              </strong>

            </div>

          </header>

          <div className="dashboard-content">

            <div className="project-loading">

              <div className="loading-spinner" />

              <span>
                Loading project intelligence...
              </span>

            </div>

          </div>

        </section>

      </main>
    );
  }

  /* =========================================
     NOT FOUND
  ========================================= */

  if (notFound || !project) {
    return (
      <main className="darpan-app">

        <aside className="sidebar">
          <ProjectSidebar />
        </aside>

        <section className="main-area">

          <header className="top-header">

            <div>

              <div className="breadcrumb">
                PROJECTS
              </div>

              <h1>
                Project Intelligence
              </h1>

            </div>

          </header>

          <div className="dashboard-content">

            <div className="project-not-found">

              <AlertTriangle size={30} />

              <h2>
                Project not found
              </h2>

              <p>
                The requested project could
                not be found in the DARPAN
                data layer.
              </p>

              <Link
                href="/projects"
                className="back-link"
              >
                <ArrowLeft size={15} />
                Back to projects
              </Link>

            </div>

          </div>

        </section>

      </main>
    );
  }

  /* =========================================
     CALCULATIONS
  ========================================= */

  const progressGap =
    project.progress.financial -
    project.progress.physical;

  const riskLabel =
    project.risk.level === "critical"
      ? "Critical risk"
      : project.risk.level === "high"
      ? "High risk"
      : project.risk.level === "medium"
      ? "Medium risk"
      : "Low risk";

  return (
    <main className="darpan-app">

      {/* =====================================
          SIDEBAR
      ====================================== */}

      <aside className="sidebar">
        <ProjectSidebar />
      </aside>

      {/* =====================================
          MAIN
      ====================================== */}

      <section className="main-area">

        <header className="top-header">

          <div>

            <div className="breadcrumb">
              PROJECTS / INTELLIGENCE
            </div>

            <h1>
              Project Intelligence
            </h1>

          </div>

          <div className="data-refresh">

            <div className="refresh-dot" />

            Data snapshot

            <strong>
              April 2026
            </strong>

          </div>

        </header>

        <div className="dashboard-content">

          {/* BACK */}

          <Link
            href="/projects"
            className="back-link"
          >
            <ArrowLeft size={15} />
            Back to projects
          </Link>

          {/* =================================
              PROJECT HERO
          ================================== */}

          <section className="project-hero">

            <div className="project-heading">

              <div className="large-project-icon">
                <Building2 size={25} />
              </div>

              <div>

                <div className="project-id">
                  {project.id}
                </div>

                <h2>
                  {project.name}
                </h2>

                <div className="project-meta">

                  <span>
                    <MapPin size={12} />
                    {project.state}
                  </span>

                  <span>
                    <Building2 size={12} />
                    {project.sector}
                  </span>

                  <span>
                    {project.ministry}
                  </span>

                </div>

              </div>

            </div>

            {/* RISK SCORE */}

            <div className="project-risk">

              <div className="risk-score-label">
                DARPAN RISK SCORE
              </div>

              <div className="risk-score">
                {project.risk.overall}

                <span>
                  /100
                </span>

              </div>

              <div className="risk-score-status">

                <span className="risk-dot" />

                {riskLabel}

              </div>

            </div>

          </section>

          {/* =================================
              RISK + EXECUTION
          ================================== */}

          <div className="project-grid">

            {/* RISK */}

            <section className="panel project-risk-panel">

              <div className="panel-label">
                RISK FINGERPRINT
              </div>

              <h3>
                Current risk composition
              </h3>

              <div className="risk-metrics">

                <RiskMetric
                  label="Schedule risk"
                  value={
                    project.risk.schedule
                  }
                  icon={
                    <Clock3 size={17} />
                  }
                />

                <RiskMetric
                  label="Cost risk"
                  value={
                    project.risk.cost
                  }
                  icon={
                    <IndianRupee size={17} />
                  }
                />

                <RiskMetric
                  label="Implementation"
                  value={
                    project.risk
                      .implementation
                  }
                  icon={
                    <ShieldAlert size={17} />
                  }
                />

              </div>

            </section>

            {/* EXECUTION */}

            <section className="panel progress-panel">

              <div className="panel-label">
                EXECUTION HEALTH
              </div>

              <h3>
                Physical vs financial progress
              </h3>

              <ProgressRow
                label="Physical progress"
                value={
                  project.progress.physical
                }
              />

              <ProgressRow
                label="Financial progress"
                value={
                  project.progress.financial
                }
              />

              <div className="progress-insight">

                {progressGap >= 0 ? (
                  <TrendingUp size={14} />
                ) : (
                  <TrendingDown size={14} />
                )}

                <span>

                  {progressGap >= 0
                    ? `Financial progress is ahead of physical progress by ${progressGap} percentage points.`
                    : `Physical progress is ahead of financial progress by ${Math.abs(
                        progressGap
                      )} percentage points.`}

                </span>

              </div>

            </section>

          </div>

          {/* =================================
              FINANCIAL + WARNING
          ================================== */}

          <div className="project-grid">

            {/* FINANCIAL */}

            <section className="panel">

              <div className="panel-label">
                COST POSITION
              </div>

              <h3>
                Project financial exposure
              </h3>

              <div className="financial-grid">

                <FinancialMetric
                  label="Approved cost"
                  value={formatCrore(
                    project.financial
                      .approvedCost
                  )}
                />

                <FinancialMetric
                  label="Revised cost"
                  value={formatCrore(
                    project.financial
                      .revisedCost
                  )}
                  danger
                />

                <FinancialMetric
                  label="Cumulative expenditure"
                  value={formatCrore(
                    project.financial
                      .expenditure
                  )}
                />

              </div>

            </section>

            {/* WARNING */}

            <section className="panel warning-panel">

              <div className="warning-icon">
                <AlertTriangle
                  size={19}
                />
              </div>

              <div>

                <div className="panel-label">
                  PRIMARY EARLY WARNING
                </div>

                <h3>
                  {project.primaryRiskDriver ??
                    "No major warning detected"}
                </h3>

                <p>

                  {project.warnings.length >
                  0
                    ? project.warnings[0]
                        .description
                    : "Current project trajectory does not indicate a major active warning."}

                </p>

              </div>

              <Link
                href="/warnings"
                className="warning-investigate-link"
              >
                View warnings →
              </Link>

            </section>

          </div>

          {/* =================================
              PREDICTIVE INTELLIGENCE
          ================================== */}

          <section className="panel prediction-panel">

            <div className="panel-header">

              <div>

                <div className="panel-label">
                  PREDICTIVE INTELLIGENCE
                </div>

                <h3>
                  What DARPAN sees ahead
                </h3>

              </div>

              <span className="prediction-badge">

                <TrendingUp size={13} />

                {project.warnings.length >
                0
                  ? "Early warning active"
                  : "Monitoring normally"}

              </span>

            </div>

            <div className="prediction-grid">

              <Prediction
                title="Cost overrun probability"
                value={`${project.prediction.costOverrunProbability}%`}
                description="Estimated probability of cost escalation"
              />

              <Prediction
                title="Time overrun probability"
                value={`${project.prediction.timeOverrunProbability}%`}
                description="Estimated probability of schedule deviation"
              />

              <Prediction
                title="Implementation risk"
                value={`${project.prediction.implementationRiskProbability}%`}
                description="Estimated execution pressure"
              />

            </div>

          </section>

          {/* =================================
              NEXT MODULES
          ================================== */}

          <div className="next-modules">

            <ModuleCard
              icon={
                <TrendingUp size={19} />
              }
              title="Risk trajectory"
              description="Understand how project risk has evolved."
            />

            <ModuleCard
              icon={
                <BarChart3 size={19} />
              }
              title="Peer benchmarking"
              description="Compare this project with similar projects."
            />

            <ModuleCard
              icon={
                <AlertTriangle size={19} />
              }
              title="Anomaly investigation"
              description="Inspect unusual project behaviour."
            />

            <ModuleCard
              icon={
                <CheckCircle2 size={19} />
              }
              title="Intervention plan"
              description="Identify recommended intervention areas."
            />

          </div>

        </div>

      </section>

    </main>
  );
}

/* =========================================
   SIDEBAR
========================================= */

function ProjectSidebar() {
  return (
    <>
      <div className="brand">

        <div className="brand-mark">
          <span>द</span>
        </div>

        <div>

          <div className="brand-name">
            DARPAN
          </div>

          <div className="brand-subtitle">
            Infrastructure Intelligence
          </div>

        </div>

      </div>

      <div className="sidebar-section-label">
        PROJECT INTELLIGENCE
      </div>

      <nav className="sidebar-nav">

        <Link
          href="/"
          className="nav-item"
        >
          <BarChart3 size={18} />
          <span>
            Dashboard
          </span>
        </Link>

        <Link
          href="/projects"
          className="nav-item nav-active"
        >
          <Building2 size={18} />
          <span>
            Projects
          </span>
        </Link>

        <Link
          href="/warnings"
          className="nav-item"
        >
          <AlertTriangle size={18} />
          <span>
            Early Warnings
          </span>
        </Link>

        <Link
          href="/investigation"
          className="nav-item"
        >
          <ShieldAlert size={18} />
          <span>
            Investigation
          </span>
        </Link>

      </nav>

      <div className="sidebar-spacer" />

      <div className="system-status">

        <div className="status-pulse">
          <span />
        </div>

        <div>

          <div className="status-title">
            Analytics engine
          </div>

          <div className="status-value">
            Operational
          </div>

        </div>

      </div>

      <div className="sidebar-footer">

        <div className="footer-symbol">
          D
        </div>

        <div>

          <div className="footer-name">
            DARPAN v0.1
          </div>

          <div className="footer-text">
            Predictive monitoring
          </div>

        </div>

      </div>
    </>
  );
}

/* =========================================
   RISK METRIC
========================================= */

function RiskMetric({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="risk-metric">

      <div className="risk-metric-icon">
        {icon}
      </div>

      <div className="risk-metric-info">

        <span>
          {label}
        </span>

        <strong>
          {value}
        </strong>

      </div>

      <div className="metric-bar">

        <span
          style={{
            width: `${value}%`,
          }}
        />

      </div>

    </div>
  );
}

/* =========================================
   PROGRESS ROW
========================================= */

function ProgressRow({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="progress-row">

      <div>

        <span>
          {label}
        </span>

        <strong>
          {value}%
        </strong>

      </div>

      <div className="progress-track">

        <span
          style={{
            width: `${value}%`,
          }}
        />

      </div>

    </div>
  );
}

/* =========================================
   FINANCIAL METRIC
========================================= */

function FinancialMetric({
  label,
  value,
  danger,
}: {
  label: string;
  value: string;
  danger?: boolean;
}) {
  return (
    <div className="financial-metric">

      <span>
        {label}
      </span>

      <strong
        className={
          danger
            ? "financial-danger"
            : ""
        }
      >
        {value}
      </strong>

    </div>
  );
}

/* =========================================
   PREDICTION
========================================= */

function Prediction({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="prediction-card">

      <span>
        {title}
      </span>

      <strong>
        {value}
      </strong>

      <small>
        {description}
      </small>

    </div>
  );
}

/* =========================================
   MODULE CARD
========================================= */

function ModuleCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      className="module-card"
    >

      <div className="module-icon">
        {icon}
      </div>

      <div>

        <strong>
          {title}
        </strong>

        <span>
          {description}
        </span>

      </div>

      <b>
        →
      </b>

    </button>
  );
}

/* =========================================
   FORMAT CURRENCY
========================================= */

function formatCrore(
  value: number
) {
  return `₹${value.toLocaleString(
    "en-IN"
  )} Cr`;
}