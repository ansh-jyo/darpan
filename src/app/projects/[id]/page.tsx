"use client";

import {
  AlertTriangle,
  BarChart3,
  Building2,
  ChevronDown,
  Search,
  ShieldAlert,
  SlidersHorizontal,
  X,
} from "lucide-react";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { getProjects } from "@/lib/api";
import { Project, RiskLevel, ProjectStatus } from "@/types/project";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] =
    useState<"all" | RiskLevel>("all");

  const [stateFilter, setStateFilter] =
    useState("all");

  const [sectorFilter, setSectorFilter] =
    useState("all");

  const [statusFilter, setStatusFilter] =
    useState<"all" | ProjectStatus>("all");

  useEffect(() => {
    let mounted = true;

    async function loadProjects() {
      try {
        const data = await getProjects();

        if (mounted) {
          setProjects(data);
        }
      } catch (error) {
        console.error(
          "Failed to load projects:",
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
     FILTER OPTIONS
  ========================================= */

  const states = useMemo(() => {
    return Array.from(
      new Set(projects.map((project) => project.state))
    ).sort();
  }, [projects]);

  const sectors = useMemo(() => {
    return Array.from(
      new Set(projects.map((project) => project.sector))
    ).sort();
  }, [projects]);

  /* =========================================
     FILTERED PROJECTS
  ========================================= */

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesSearch =
        !query ||
        project.name.toLowerCase().includes(query) ||
        project.id.toLowerCase().includes(query) ||
        project.ministry.toLowerCase().includes(query) ||
        project.state.toLowerCase().includes(query) ||
        project.sector.toLowerCase().includes(query);

      const matchesRisk =
        riskFilter === "all" ||
        project.risk.level === riskFilter;

      const matchesState =
        stateFilter === "all" ||
        project.state === stateFilter;

      const matchesSector =
        sectorFilter === "all" ||
        project.sector === sectorFilter;

      const matchesStatus =
        statusFilter === "all" ||
        project.status === statusFilter;

      return (
        matchesSearch &&
        matchesRisk &&
        matchesState &&
        matchesSector &&
        matchesStatus
      );
    });
  }, [
    projects,
    search,
    riskFilter,
    stateFilter,
    sectorFilter,
    statusFilter,
  ]);

  /* =========================================
     SUMMARY
  ========================================= */

  const criticalCount = projects.filter(
    (project) =>
      project.risk.level === "critical"
  ).length;

  const highCount = projects.filter(
    (project) =>
      project.risk.level === "high"
  ).length;

  const mediumCount = projects.filter(
    (project) =>
      project.risk.level === "medium"
  ).length;

  const lowCount = projects.filter(
    (project) =>
      project.risk.level === "low"
  ).length;

  const hasFilters =
    search !== "" ||
    riskFilter !== "all" ||
    stateFilter !== "all" ||
    sectorFilter !== "all" ||
    statusFilter !== "all";

  function resetFilters() {
    setSearch("");
    setRiskFilter("all");
    setStateFilter("all");
    setSectorFilter("all");
    setStatusFilter("all");
  }

  return (
    <main className="darpan-app">

      {/* =================================
          SIDEBAR
      ================================== */}

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

          <div className="nav-item nav-active">
            <Building2 size={18} />
            <span>
              Projects
            </span>

            <span className="nav-status-dot" />
          </div>

          <div className="nav-item">
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

      {/* =================================
          MAIN
      ================================== */}

      <section className="main-area">

        {/* HEADER */}

        <header className="top-header">

          <div>

            <div className="breadcrumb">
              PROJECTS / PORTFOLIO
            </div>

            <h1>
              Project Portfolio
            </h1>

          </div>

          <div className="header-actions">

            <div className="data-refresh">
              <div className="refresh-dot" />
              Data snapshot
              <strong>
                April 2026
              </strong>
            </div>

          </div>

        </header>

        {/* CONTENT */}

        <div className="dashboard-content projects-page">

          {/* =================================
              PAGE INTRO
          ================================== */}

          <section className="projects-intro">

            <div>

              <div className="section-eyebrow">
                NATIONAL INFRASTRUCTURE PORTFOLIO
              </div>

              <h2>
                Projects
              </h2>

              <p>
                Search, filter and prioritise infrastructure
                projects using DARPAN risk intelligence.
              </p>

            </div>

            <div className="portfolio-total">

              <strong>
                {projects.length}
              </strong>

              <span>
                projects loaded
              </span>

            </div>

          </section>

          {/* =================================
              RISK SUMMARY
          ================================== */}

          <section className="project-summary-grid">

            <RiskSummary
              label="Critical"
              value={criticalCount}
              type="critical"
              active={
                riskFilter === "critical"
              }
              onClick={() =>
                setRiskFilter(
                  riskFilter === "critical"
                    ? "all"
                    : "critical"
                )
              }
            />

            <RiskSummary
              label="High"
              value={highCount}
              type="high"
              active={
                riskFilter === "high"
              }
              onClick={() =>
                setRiskFilter(
                  riskFilter === "high"
                    ? "all"
                    : "high"
                )
              }
            />

            <RiskSummary
              label="Medium"
              value={mediumCount}
              type="medium"
              active={
                riskFilter === "medium"
              }
              onClick={() =>
                setRiskFilter(
                  riskFilter === "medium"
                    ? "all"
                    : "medium"
                )
              }
            />

            <RiskSummary
              label="Low"
              value={lowCount}
              type="low"
              active={
                riskFilter === "low"
              }
              onClick={() =>
                setRiskFilter(
                  riskFilter === "low"
                    ? "all"
                    : "low"
                )
              }
            />

          </section>

          {/* =================================
              SEARCH + FILTERS
          ================================== */}

          <section className="projects-controls">

            <div className="project-search">

              <Search size={16} />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search project, ministry, state or sector..."
              />

              {search && (
                <button
                  type="button"
                  onClick={() =>
                    setSearch("")
                  }
                  className="search-clear"
                >
                  <X size={14} />
                </button>
              )}

            </div>

            <div className="filter-icon">
              <SlidersHorizontal
                size={15}
              />
            </div>

            <FilterSelect
              value={stateFilter}
              onChange={setStateFilter}
              options={states}
              placeholder="State"
            />

            <FilterSelect
              value={sectorFilter}
              onChange={setSectorFilter}
              options={sectors}
              placeholder="Sector"
            />

            <FilterSelect
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                "planning",
                "under execution",
                "completed",
                "delayed",
                "on hold",
              ]}
              placeholder="Status"
            />

            {hasFilters && (
              <button
                type="button"
                className="reset-filters"
                onClick={resetFilters}
              >
                Reset
              </button>
            )}

          </section>

          {/* =================================
              RESULT COUNT
          ================================== */}

          <div className="results-toolbar">

            <div>
              Showing{" "}
              <strong>
                {filteredProjects.length}
              </strong>{" "}
              of{" "}
              <strong>
                {projects.length}
              </strong>{" "}
              projects
            </div>

            {riskFilter !== "all" && (
              <div className="active-filter">
                Risk: {riskFilter}
                <button
                  type="button"
                  onClick={() =>
                    setRiskFilter("all")
                  }
                >
                  <X size={11} />
                </button>
              </div>
            )}

          </div>

          {/* =================================
              PROJECT TABLE
          ================================== */}

          <section className="projects-table-panel">

            <div className="projects-table-header">

              <div>
                Project
              </div>

              <div>
                Location
              </div>

              <div>
                Risk
              </div>

              <div>
                Progress
              </div>

              <div>
                Status
              </div>

              <div />

            </div>

            {loading ? (
              <ProjectTableLoading />
            ) : filteredProjects.length === 0 ? (
              <EmptyProjects
                onReset={resetFilters}
              />
            ) : (
              filteredProjects.map(
                (project) => (
                  <ProjectRow
                    key={project.id}
                    project={project}
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
   RISK SUMMARY
========================================= */

function RiskSummary({
  label,
  value,
  type,
  active,
  onClick,
}: {
  label: string;
  value: number;
  type: RiskLevel;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`risk-summary risk-${type} ${
        active ? "risk-summary-active" : ""
      }`}
      onClick={onClick}
    >

      <div className="risk-summary-top">

        <span className="risk-summary-dot" />

        <span>
          {label}
        </span>

      </div>

      <strong>
        {value}
      </strong>

      <small>
        projects
      </small>

    </button>
  );
}

/* =========================================
   FILTER SELECT
========================================= */

function FilterSelect({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (value: any) => void;
  options: string[];
  placeholder: string;
}) {
  return (
    <div className="filter-select">

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
      >

        <option value="all">
          {placeholder}
        </option>

        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}

      </select>

      <ChevronDown size={13} />

    </div>
  );
}

/* =========================================
   PROJECT ROW
========================================= */

function ProjectRow({
  project,
}: {
  project: Project;
}) {
  const riskClass =
    `risk-pill risk-pill-${project.risk.level}`;

  return (
    <Link
      href={`/projects/${project.id}`}
      className="project-table-row"
    >

      {/* PROJECT */}

      <div className="project-table-name">

        <div className="table-project-icon">
          <Building2 size={16} />
        </div>

        <div>

          <strong>
            {project.name}
          </strong>

          <span>
            {project.id}
          </span>

          <small>
            {project.ministry}
          </small>

        </div>

      </div>

      {/* LOCATION */}

      <div className="project-location">

        <strong>
          {project.state}
        </strong>

        <span>
          {project.sector}
        </span>

      </div>

      {/* RISK */}

      <div className="project-risk-cell">

        <div className={riskClass}>

          <span />

          {project.risk.level}

        </div>

        <strong>
          {project.risk.overall}
        </strong>

      </div>

      {/* PROGRESS */}

      <div className="project-progress-cell">

        <div className="table-progress-header">

          <span>
            Physical
          </span>

          <strong>
            {project.progress.physical}%
          </strong>

        </div>

        <div className="table-progress-track">

          <span
            style={{
              width: `${project.progress.physical}%`,
            }}
          />

        </div>

      </div>

      {/* STATUS */}

      <div>

        <span className="project-status">
          {formatStatus(
            project.status
          )}
        </span>

      </div>

      {/* ARROW */}

      <div className="project-row-arrow">
        →
      </div>

    </Link>
  );
}

/* =========================================
   LOADING
========================================= */

function ProjectTableLoading() {
  return (
    <div className="project-table-loading">

      <div className="loading-spinner" />

      <span>
        Loading project portfolio...
      </span>

    </div>
  );
}

/* =========================================
   EMPTY
========================================= */

function EmptyProjects({
  onReset,
}: {
  onReset: () => void;
}) {
  return (
    <div className="empty-projects">

      <Search size={28} />

      <h3>
        No projects found
      </h3>

      <p>
        Try changing your search or filters.
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

/* =========================================
   FORMAT STATUS
========================================= */

function formatStatus(
  status: ProjectStatus
) {
  return status
    .split(" ")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");
}