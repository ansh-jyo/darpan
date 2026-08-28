"use client";
import Link from "next/link";

import {
  Activity,
  AlertTriangle,
  Bell,
  BrainCircuit,
  Building2,
  ChevronDown,
  CircleHelp,
  Clock3,
  DollarSign,
  FileWarning,
  LayoutDashboard,
  Map,
  Menu,
  Search,
  Settings,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";


type PriorityMode = "intervention" | "investigation";

const interventionProjects = [
  {
    rank: 1,
    name: "Eastern Freight Corridor",
    location: "Uttar Pradesh",
    sector: "Transport",
    risk: 91,
    priority: 96,
    driver: "Schedule deterioration",
    status: "Critical",
  },
  {
    rank: 2,
    name: "Regional Water Grid",
    location: "Rajasthan",
    sector: "Water",
    risk: 87,
    priority: 92,
    driver: "Cost trajectory",
    status: "High",
  },
  {
    rank: 3,
    name: "National Power Link",
    location: "Maharashtra",
    sector: "Energy",
    risk: 82,
    priority: 88,
    driver: "Progress deficit",
    status: "High",
  },
  {
    rank: 4,
    name: "Integrated Logistics Hub",
    location: "Gujarat",
    sector: "Logistics",
    risk: 76,
    priority: 81,
    driver: "Implementation risk",
    status: "Medium",
  },
  {
    rank: 5,
    name: "Urban Mobility Network",
    location: "Karnataka",
    sector: "Transport",
    risk: 72,
    priority: 78,
    driver: "Milestone deviation",
    status: "Medium",
  },
];

const investigationProjects = [
  {
    rank: 1,
    name: "Regional Water Grid",
    location: "Rajasthan",
    sector: "Water",
    risk: 87,
    priority: 95,
    driver: "Financial–physical divergence",
    status: "Review",
  },
  {
    rank: 2,
    name: "Eastern Freight Corridor",
    location: "Uttar Pradesh",
    sector: "Transport",
    risk: 91,
    priority: 91,
    driver: "Unusual expenditure pattern",
    status: "Review",
  },
  {
    rank: 3,
    name: "Coastal Energy Terminal",
    location: "Odisha",
    sector: "Energy",
    risk: 64,
    priority: 86,
    driver: "Peer deviation",
    status: "Review",
  },
  {
    rank: 4,
    name: "National Power Link",
    location: "Maharashtra",
    sector: "Energy",
    risk: 82,
    priority: 80,
    driver: "Progress anomaly",
    status: "Review",
  },
  {
    rank: 5,
    name: "Metro Expansion Phase II",
    location: "Tamil Nadu",
    sector: "Urban",
    risk: 58,
    priority: 76,
    driver: "Data inconsistency",
    status: "Review",
  },
];

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Projects", icon: Building2 },
  { label: "Early Warnings", icon: Bell },
  { label: "Analytics", icon: TrendingUp },
  { label: "Investigation", icon: ShieldAlert },
  { label: "What-if Lab", icon: Activity },
  { label: "DARPAN AI", icon: BrainCircuit },
];

function RiskBadge({ risk }: { risk: number }) {
  const level =
    risk >= 85 ? "Critical" : risk >= 70 ? "High" : risk >= 50 ? "Medium" : "Low";

  return (
    <span className={`risk-badge risk-${level.toLowerCase()}`}>
      <span className="risk-dot" />
      {level}
    </span>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  delay,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: typeof Activity;
  trend?: string;
  delay: number;
}) {
  return (
    <motion.div
      className="stat-card"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <div className="stat-top">
        <div className="stat-icon">
          <Icon size={19} strokeWidth={1.8} />
        </div>

        {trend && (
          <span className="stat-trend">
            <TrendingUp size={13} />
            {trend}
          </span>
        )}
      </div>

      <div className="stat-value">{value}</div>
      <div className="stat-title">{title}</div>
      <div className="stat-subtitle">{subtitle}</div>
    </motion.div>
  );
}

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [priorityMode, setPriorityMode] =
    useState<PriorityMode>("intervention");

  const projects =
    priorityMode === "intervention"
      ? interventionProjects
      : investigationProjects;

  return (
    <main className="darpan-app">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="mobile-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR */}
      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
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

          <button
            className="mobile-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-section-label">COMMAND CENTER</div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                className={`nav-item ${item.active ? "nav-active" : ""}`}
              >
                <Icon size={18} strokeWidth={1.8} />
                <span>{item.label}</span>

                {item.label === "Early Warnings" && (
                  <span className="nav-count">37</span>
                )}
              </button>
            );
          })}
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

        <button className="nav-item settings-item">
          <Settings size={18} strokeWidth={1.8} />
          <span>Settings</span>
        </button>

        <div className="sidebar-footer">
          <div className="footer-symbol">D</div>
          <div>
            <div className="footer-name">DARPAN v0.1</div>
            <div className="footer-text">Predictive monitoring</div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <section className="main-area">
        {/* HEADER */}
        <header className="top-header">
          <div className="header-left">
            <button
              className="mobile-menu"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation"
            >
              <Menu size={21} />
            </button>

            <div>
              <div className="breadcrumb">COMMAND CENTER / OVERVIEW</div>
              <h1>National Infrastructure Pulse</h1>
            </div>
          </div>

          <div className="header-actions">
            <div className="search-box">
              <Search size={17} />
              <input placeholder="Search projects..." />
              <kbd>⌘ K</kbd>
            </div>

            <button className="header-icon" aria-label="Help">
              <CircleHelp size={19} />
            </button>

            <button className="header-icon notification" aria-label="Notifications">
              <Bell size={19} />
              <span />
            </button>

            <div className="profile">
              <div className="profile-avatar">AM</div>
              <div className="profile-info">
                <span>Admin Monitor</span>
                <small>MoSPI</small>
              </div>
              <ChevronDown size={15} />
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <div className="dashboard-content">
          {/* Intro */}
          <motion.div
            className="dashboard-intro"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div>
              <div className="eyebrow">
                <span className="eyebrow-dot" />
                LIVE PORTFOLIO INTELLIGENCE
              </div>

              <h2>
                See the risk.
                <span> Before it becomes a crisis.</span>
              </h2>

              <p>
                A consolidated view of infrastructure project health,
                emerging risk and intervention priorities.
              </p>
            </div>

            <div className="data-refresh">
              <div className="refresh-dot" />
              <span>Data snapshot</span>
              <strong>April 2026</strong>
            </div>
          </motion.div>

          {/* STATS */}
          <div className="stats-grid">
            <StatCard
              title="Total projects"
              value="1,981"
              subtitle="Across 17 ministries · 22 sectors"
              icon={Building2}
              delay={0.05}
            />

            <StatCard
              title="High-risk projects"
              value="142"
              subtitle="7.2% of monitored portfolio"
              icon={ShieldAlert}
              trend="+8.4%"
              delay={0.1}
            />

            <StatCard
              title="Cost exposure"
              value="₹42.78L Cr"
              subtitle="Revised portfolio cost"
              icon={DollarSign}
              delay={0.15}
            />

            <StatCard
              title="Active warnings"
              value="37"
              subtitle="Require monitoring attention"
              icon={AlertTriangle}
              trend="+5"
              delay={0.2}
            />
          </div>

          {/* ANALYTICS ROW */}
          <div className="analytics-grid">
            {/* Risk Distribution */}
            <motion.div
              className="panel risk-panel"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <div className="panel-header">
                <div>
                  <div className="panel-label">PORTFOLIO HEALTH</div>
                  <h3>Risk distribution</h3>
                </div>

                <button className="panel-action">
                  Last snapshot <ChevronDown size={14} />
                </button>
              </div>

              <div className="risk-overview">
                <div className="risk-ring">
                  <div className="risk-ring-inner">
                    <strong>7.2%</strong>
                    <span>High risk</span>
                  </div>
                </div>

                <div className="risk-legend">
                  <div className="legend-row">
                    <span className="legend-color low" />
                    <span>Low risk</span>
                    <strong>1,204</strong>
                  </div>

                  <div className="legend-row">
                    <span className="legend-color medium" />
                    <span>Medium</span>
                    <strong>635</strong>
                  </div>

                  <div className="legend-row">
                    <span className="legend-color high" />
                    <span>High</span>
                    <strong>105</strong>
                  </div>

                  <div className="legend-row">
                    <span className="legend-color critical" />
                    <span>Critical</span>
                    <strong>37</strong>
                  </div>
                </div>
              </div>

              <div className="risk-bar">
                <span className="bar-low" style={{ width: "61%" }} />
                <span className="bar-medium" style={{ width: "32%" }} />
                <span className="bar-high" style={{ width: "5%" }} />
                <span className="bar-critical" style={{ width: "2%" }} />
              </div>
            </motion.div>

            {/* Trend */}
            <motion.div
              className="panel trend-panel"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="panel-header">
                <div>
                  <div className="panel-label">RISK TRAJECTORY</div>
                  <h3>Portfolio risk trend</h3>
                </div>

                <div className="trend-value">
                  <TrendingUp size={15} />
                  <strong>+4.8%</strong>
                  <span>vs previous</span>
                </div>
              </div>

              <div className="fake-chart">
                <div className="chart-grid">
                  <span />
                  <span />
                  <span />
                  <span />
                </div>

                <svg
                  viewBox="0 0 600 190"
                  preserveAspectRatio="none"
                  className="chart-svg"
                >
                  <defs>
                    <linearGradient id="riskFill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopOpacity="0.25" />
                      <stop offset="100%" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  <path
                    d="M0,145 C50,139 65,130 100,135 C140,141 155,116 190,120 C230,124 240,103 280,108 C320,113 335,82 370,91 C410,101 420,65 455,72 C490,78 515,42 550,54 C575,61 585,38 600,31 L600,190 L0,190 Z"
                    fill="url(#riskFill)"
                  />

                  <path
                    d="M0,145 C50,139 65,130 100,135 C140,141 155,116 190,120 C230,124 240,103 280,108 C320,113 335,82 370,91 C410,101 420,65 455,72 C490,78 515,42 550,54 C575,61 585,38 600,31"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    vectorEffect="non-scaling-stroke"
                  />

                  <circle cx="550" cy="54" r="5" fill="currentColor" />
                </svg>

                <div className="chart-labels">
                  <span>Nov</span>
                  <span>Dec</span>
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* PRIORITY */}
          <motion.section
            className="panel priority-panel"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <div className="priority-header">
              <div>
                <div className="panel-label">DECISION SUPPORT</div>
                <h3>Priority projects</h3>
                <p>
                  Projects requiring the highest level of attention based on
                  current intelligence.
                </p>
              </div>

              <div className="priority-switch">
                <button
                  className={priorityMode === "intervention" ? "selected" : ""}
                  onClick={() => setPriorityMode("intervention")}
                >
                  <AlertTriangle size={15} />
                  Intervention
                </button>

                <button
                  className={priorityMode === "investigation" ? "selected" : ""}
                  onClick={() => setPriorityMode("investigation")}
                >
                  <FileWarning size={15} />
                  Investigation
                </button>
              </div>
            </div>

            <div className="priority-table-wrap">
              <table className="priority-table">
                <thead>
                  <tr>
                    <th>RANK</th>
                    <th>PROJECT</th>
                    <th>SECTOR</th>
                    <th>RISK</th>
                    <th>PRIORITY</th>
                    <th>PRIMARY SIGNAL</th>
                    <th>STATUS</th>
                    <th />
                  </tr>
                </thead>

                <tbody>
                  {projects.map((project, index) => (
                    <motion.tr
                      key={project.name}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                      className="project-row"
                    >
                      <td>
                        <span className="rank-number">
                          {String(project.rank).padStart(2, "0")}
                        </span>
                      </td>

                      <td>
                        <div className="project-name">
                          <div className="project-mini-icon">
                            <Building2 size={15} />
                          </div>

                          <div>
                            <strong>{project.name}</strong>
                            <span>{project.location}</span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="sector-pill">{project.sector}</span>
                      </td>

                      <td>
                        <div className="risk-cell">
                          <strong>{project.risk}</strong>
                          <RiskBadge risk={project.risk} />
                        </div>
                      </td>

                      <td>
                        <div className="priority-score">
                          <strong>{project.priority}</strong>
                          <div className="priority-line">
                            <span
                              style={{
                                width: `${project.priority}%`,
                              }}
                            />
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="driver">{project.driver}</span>
                      </td>

                      <td>
                        <span
                          className={`status-pill status-${project.status.toLowerCase()}`}
                        >
                          {project.status}
                        </span>
                      </td>

                      <td>
                        <Link
                            href={`/projects/${project.rank}`}
                            className="view-project"
                          >
                            View <span>→</span>
                          </Link>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="priority-footer">
              <span>
                Showing <strong>5</strong> highest-priority projects
              </span>

              <button>
                View all projects <span>→</span>
              </button>
            </div>
          </motion.section>

          {/* BOTTOM INFO */}
          <div className="bottom-grid">
            <div className="quick-card">
              <div className="quick-icon">
                <Clock3 size={19} />
              </div>
              <div>
                <span>EARLY WARNING</span>
                <strong>12 projects show rising risk velocity</strong>
              </div>
              <button>Review →</button>
            </div>

            <div className="quick-card">
              <div className="quick-icon">
                <Map size={19} />
              </div>
              <div>
                <span>GEOGRAPHIC VIEW</span>
                <strong>Explore project risk across India</strong>
              </div>
              <button>Open map →</button>
            </div>

            <div className="quick-card ai-card">
              <div className="quick-icon">
                <Sparkles size={19} />
              </div>
              <div>
                <span>DARPAN AI</span>
                <strong>Ask about projects, risk or trends</strong>
              </div>
              <button>Ask AI →</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}