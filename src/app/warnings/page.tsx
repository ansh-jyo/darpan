"use client";

import {
  AlertTriangle,
  BarChart3,
  Building2,
  CheckCircle2,
  Clock3,
  IndianRupee,
  Search,
  ShieldAlert,
  TrendingUp,
  X,
} from "lucide-react";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { getProjects } from "@/lib/api";
import {
  Project,
  RiskLevel,
} from "@/types/project";

type WarningFilter =
  | "all"
  | "critical"
  | "high"
  | "medium";

interface WarningItem {
  id: string;
  projectId: string;
  projectName: string;
  state: string;
  sector: string;
  ministry: string;

  title: string;
  description: string;

  severity: RiskLevel;

  probability: number;
  riskScore: number;

  driver: string;
}

export default function EarlyWarningsPage() {
  const [projects, setProjects] =
    useState<Project[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [filter, setFilter] =
    useState<WarningFilter>("all");

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    let mounted = true;

    async function loadProjects() {
      try {
        const data =
          await getProjects();

        if (mounted) {
          setProjects(data);
        }
      } catch (error) {
        console.error(
          "Failed to load warnings:",
          error
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadProjects();

    return () => {
      mounted = false;
    };
  }, []);

  /* =========================================
     GENERATE WARNING FEED
  ========================================= */

  const warnings = useMemo<WarningItem[]>(() => {
    const result: WarningItem[] = [];

    projects.forEach((project) => {
      /*
        Explicit backend/model warnings
      */

      project.warnings.forEach((warning) => {
        result.push({
          id: warning.id,
          projectId: project.id,
          projectName: project.name,
          state: project.state,
          sector: project.sector,
          ministry: project.ministry,

          title: warning.title,
          description: warning.description,

          severity: warning.severity,

          probability:
            warning.probability ??
            project.risk.overall,

          riskScore:
            project.risk.overall,

          driver:
            project.primaryRiskDriver ??
            warning.title,
        });
      });

      /*
        Predictive warning generation.

        This is temporary frontend logic.

        Later the ML backend will return
        these warnings directly.
      */

      if (
        project.prediction.timeOverrunProbability >=
        70 &&
        !project.warnings.some(
          (warning) =>
            warning.title
              .toLowerCase()
              .includes("schedule")
        )
      ) {
        result.push({
          id: `P-TIME-${project.id}`,
          projectId: project.id,
          projectName: project.name,
          state: project.state,
          sector: project.sector,
          ministry: project.ministry,

          title:
            "High probability of time overrun",

          description:
            "Predictive trajectory indicates an elevated probability of schedule deviation.",

          severity:
            project.prediction.timeOverrunProbability >=
            80
              ? "critical"
              : "high",

          probability:
            project.prediction
              .timeOverrunProbability,

          riskScore:
            project.risk.overall,

          driver:
            "Schedule deterioration",
        });
      }

      if (
        project.prediction.costOverrunProbability >=
        60
      ) {
        result.push({
          id: `P-COST-${project.id}`,
          projectId: project.id,
          projectName: project.name,
          state: project.state,
          sector: project.sector,
          ministry: project.ministry,

          title:
            "Elevated cost overrun probability",

          description:
            "Current project indicators suggest increased probability of future cost escalation.",

          severity:
            project.prediction.costOverrunProbability >=
            75
              ? "critical"
              : "high",

          probability:
            project.prediction
              .costOverrunProbability,

          riskScore:
            project.risk.overall,

          driver:
            "Cost escalation pressure",
        });
      }

      if (
        project.prediction
          .implementationRiskProbability >=
        60
      ) {
        result.push({
          id: `P-EXEC-${project.id}`,
          projectId: project.id,
          projectName: project.name,
          state: project.state,
          sector: project.sector,
          ministry: project.ministry,

          title:
            "Implementation risk detected",

          description:
            "Execution indicators suggest increasing implementation pressure.",

          severity:
            project.prediction
              .implementationRiskProbability >=
            75
              ? "critical"
              : "high",

          probability:
            project.prediction
              .implementationRiskProbability,

          riskScore:
            project.risk.overall,

          driver:
            "Implementation pressure",
        });
      }
    });

    /*
      Highest risk first.
    */

    return result.sort(
      (a, b) =>
        b.probability -
        a.probability
    );
  }, [projects]);

  /* =========================================
     COUNTS
  ========================================= */

  const criticalCount =
    warnings.filter(
      (warning) =>
        warning.severity === "critical"
    ).length;

  const highCount =
    warnings.filter(
      (warning) =>
        warning.severity === "high"
    ).length;

  const mediumCount =
    warnings.filter(
      (warning) =>
        warning.severity === "medium"
    ).length;

  /* =========================================
     SEARCH + FILTER
  ========================================= */

  const filteredWarnings =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return warnings.filter(
        (warning) => {
          const matchesSearch =
            !query ||
            warning.projectName
              .toLowerCase()
              .includes(query) ||
            warning.title
              .toLowerCase()
              .includes(query) ||
            warning.state
              .toLowerCase()
              .includes(query) ||
            warning.sector
              .toLowerCase()
              .includes(query) ||
            warning.ministry
              .toLowerCase()
              .includes(query);

          const matchesFilter =
            filter === "all" ||
            warning.severity ===
              filter;

          return (
            matchesSearch &&
            matchesFilter
          );
        }
      );
    }, [warnings, search, filter]);

  return (
    <main className="darpan-app">

      {/* =====================================
          SIDEBAR
      ====================================== */}

      <aside className="sidebar">

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
            className="nav-item"
          >
            <Building2 size={18} />
            <span>
              Projects
            </span>
          </Link>

          <div className="nav-item nav-active">
            <AlertTriangle size={18} />
            <span>
              Early Warnings
            </span>

            {criticalCount > 0 && (
              <span className="nav-count">
                {criticalCount}
              </span>
            )}
          </div>

          <div className="nav-item">
            <ShieldAlert size={18} />
            <span>
              Investigation
            </span>
          </div>

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

      </aside>

      {/* =====================================
          MAIN
      ====================================== */}

      <section className="main-area">

        <header className="top-header">

          <div>

            <div className="breadcrumb">
              PROJECT INTELLIGENCE / WARNINGS
            </div>

            <h1>
              Early Warning Center
            </h1>

          </div>

          <div className="data-refresh">

            <div className="refresh-dot" />

            Prediction engine

            <strong>
              Active
            </strong>

          </div>

        </header>

        <div className="dashboard-content warnings-page">

          {/* =====================================
              INTRO
          ====================================== */}

          <section className="warnings-intro">

            <div>

              <div className="section-eyebrow">
                PROACTIVE RISK MONITORING
              </div>

              <h2>
                Early Warning Center
              </h2>

              <p>
                DARPAN identifies emerging project
                risks before they become execution
                failures.
              </p>

            </div>

            <div className="warning-total">

              <AlertTriangle size={17} />

              <div>

                <strong>
                  {warnings.length}
                </strong>

                <span>
                  active signals
                </span>

              </div>

            </div>

          </section>

          {/* =====================================
              SUMMARY
          ====================================== */}

          <section className="warning-summary-grid">

            <WarningSummary
              label="Critical"
              value={criticalCount}
              icon={
                <AlertTriangle size={17} />
              }
              type="critical"
              active={
                filter === "critical"
              }
              onClick={() =>
                setFilter(
                  filter === "critical"
                    ? "all"
                    : "critical"
                )
              }
            />

            <WarningSummary
              label="High"
              value={highCount}
              icon={
                <TrendingUp size={17} />
              }
              type="high"
              active={
                filter === "high"
              }
              onClick={() =>
                setFilter(
                  filter === "high"
                    ? "all"
                    : "high"
                )
              }
            />

            <WarningSummary
              label="Medium"
              value={mediumCount}
              icon={
                <Clock3 size={17} />
              }
              type="medium"
              active={
                filter === "medium"
              }
              onClick={() =>
                setFilter(
                  filter === "medium"
                    ? "all"
                    : "medium"
                )
              }
            />

            <WarningSummary
              label="Monitored"
              value={projects.length}
              icon={
                <CheckCircle2 size={17} />
              }
              type="low"
              active={
                filter === "all"
              }
              onClick={() =>
                setFilter("all")
              }
            />

          </section>

          {/* =====================================
              SEARCH
          ====================================== */}

          <section className="warnings-controls">

            <div className="warning-search">

              <Search size={16} />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search project, warning, state or sector..."
              />

              {search && (
                <button
                  type="button"
                  onClick={() =>
                    setSearch("")
                  }
                >
                  <X size={14} />
                </button>
              )}

            </div>

            <div className="warning-filter-label">
              Showing{" "}
              <strong>
                {filteredWarnings.length}
              </strong>{" "}
              signals
            </div>

          </section>

          {/* =====================================
              WARNING LIST
          ====================================== */}

          <section className="warning-feed">

            {loading ? (
              <WarningLoading />
            ) : filteredWarnings.length ===
              0 ? (
              <NoWarnings
                onReset={() => {
                  setSearch("");
                  setFilter("all");
                }}
              />
            ) : (
              filteredWarnings.map(
                (warning) => (
                  <WarningCard
                    key={warning.id}
                    warning={warning}
                  />
                )
              )
            )}

          </section>

        </div>

      </section>

    </main>
  );
}

/* =========================================
   SUMMARY CARD
========================================= */

function WarningSummary({
  label,
  value,
  icon,
  type,
  active,
  onClick,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  type: RiskLevel;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`warning-summary warning-${type} ${
        active
          ? "warning-summary-active"
          : ""
      }`}
      onClick={onClick}
    >

      <div className="warning-summary-icon">
        {icon}
      </div>

      <div>

        <span>
          {label}
        </span>

        <strong>
          {value}
        </strong>

      </div>

    </button>
  );
}

/* =========================================
   WARNING CARD
========================================= */

function WarningCard({
  warning,
}: {
  warning: WarningItem;
}) {
  return (
    <article
      className={`warning-card warning-card-${warning.severity}`}
    >

      {/* Severity */}

      <div className="warning-severity">

        <div className="warning-severity-icon">
          <AlertTriangle size={17} />
        </div>

        <span>
          {warning.severity}
        </span>

      </div>

      {/* Main */}

      <div className="warning-main">

        <div className="warning-card-project">

          <Building2 size={14} />

          <span>
            {warning.projectName}
          </span>

        </div>

        <h3>
          {warning.title}
        </h3>

        <p>
          {warning.description}
        </p>

        <div className="warning-card-meta">

          <span>
            <span className="meta-label">
              Location
            </span>

            {warning.state}
          </span>

          <span>
            <span className="meta-label">
              Sector
            </span>

            {warning.sector}
          </span>

          <span>
            <span className="meta-label">
              Driver
            </span>

            {warning.driver}
          </span>

        </div>

      </div>

      {/* Probability */}

      <div className="warning-probability">

        <span>
          PREDICTED PROBABILITY
        </span>

        <strong>
          {warning.probability}%
        </strong>

        <div className="probability-track">

          <span
            style={{
              width: `${warning.probability}%`,
            }}
          />

        </div>

        <small>
          Risk score{" "}
          <b>
            {warning.riskScore}/100
          </b>
        </small>

      </div>

      {/* Action */}

      <div className="warning-action">

        <Link
          href={`/projects/${warning.projectId}`}
        >
          Investigate
          <span>
            →
          </span>
        </Link>

      </div>

    </article>
  );
}

/* =========================================
   LOADING
========================================= */

function WarningLoading() {
  return (
    <div className="warning-loading">

      <div className="loading-spinner" />

      <span>
        Analysing project signals...
      </span>

    </div>
  );
}

/* =========================================
   EMPTY
========================================= */

function NoWarnings({
  onReset,
}: {
  onReset: () => void;
}) {
  return (
    <div className="no-warnings">

      <div className="no-warning-icon">
        <CheckCircle2 size={25} />
      </div>

      <h3>
        No matching warnings
      </h3>

      <p>
        No active signals match your current
        search or severity filter.
      </p>

      <button
        type="button"
        onClick={onReset}
      >
        Clear filters
      </button>

    </div>
  );
}