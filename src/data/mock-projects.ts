import { Project } from "@/types/project";

export const mockProjects: Project[] = [
  {
    id: "DARPAN-EC-001",
    name: "Eastern Freight Corridor",

    ministry: "Ministry of Railways",
    department: "Railway Board",

    sector: "Transport",
    state: "Uttar Pradesh",
    district: "Kanpur",

    status: "under execution",

    startDate: "2021-04-01",
    expectedCompletion: "2027-12-01",

    financial: {
      approvedCost: 81459,
      revisedCost: 94820,
      expenditure: 63210,
      currency: "INR",
    },

    progress: {
      physical: 71,
      financial: 78,
    },

    risk: {
      overall: 91,
      cost: 84,
      schedule: 94,
      implementation: 78,
      level: "critical",
    },

    prediction: {
      costOverrunProbability: 68,
      timeOverrunProbability: 81,
      implementationRiskProbability: 62,
    },

    warnings: [
      {
        id: "W-001",
        title: "Schedule deterioration",
        description:
          "Project trajectory indicates an elevated probability of schedule deviation.",
        severity: "critical",
        probability: 81,
        createdAt: "2026-04-01",
      },
    ],

    anomalies: [],

    benchmark: {
      peerCount: 24,
      costPerformance: 63,
      schedulePerformance: 41,
      percentile: 82,
    },

    primaryRiskDriver: "Schedule deterioration",

    lastUpdated: "2026-04-01",
  },

  {
    id: "DARPAN-NH-002",
    name: "National Highway Development",

    ministry: "Ministry of Road Transport & Highways",
    department: "National Highways Authority",

    sector: "Transport",
    state: "Maharashtra",
    district: "Nashik",

    status: "under execution",

    startDate: "2022-01-01",
    expectedCompletion: "2027-08-01",

    financial: {
      approvedCost: 42500,
      revisedCost: 45100,
      expenditure: 28900,
      currency: "INR",
    },

    progress: {
      physical: 64,
      financial: 61,
    },

    risk: {
      overall: 57,
      cost: 49,
      schedule: 61,
      implementation: 55,
      level: "medium",
    },

    prediction: {
      costOverrunProbability: 32,
      timeOverrunProbability: 47,
      implementationRiskProbability: 29,
    },

    warnings: [],

    anomalies: [],

    benchmark: {
      peerCount: 31,
      costPerformance: 71,
      schedulePerformance: 58,
      percentile: 64,
    },

    primaryRiskDriver: "Milestone slippage",

    lastUpdated: "2026-04-01",
  },

  {
    id: "DARPAN-WS-003",
    name: "Regional Water Supply Programme",

    ministry: "Ministry of Jal Shakti",
    department: "Department of Water Resources",

    sector: "Water & Sanitation",
    state: "Rajasthan",
    district: "Jaipur",

    status: "under execution",

    startDate: "2023-03-01",
    expectedCompletion: "2027-03-01",

    financial: {
      approvedCost: 18600,
      revisedCost: 19300,
      expenditure: 14200,
      currency: "INR",
    },

    progress: {
      physical: 76,
      financial: 73,
    },

    risk: {
      overall: 34,
      cost: 28,
      schedule: 39,
      implementation: 31,
      level: "low",
    },

    prediction: {
      costOverrunProbability: 17,
      timeOverrunProbability: 24,
      implementationRiskProbability: 18,
    },

    warnings: [],

    anomalies: [],

    benchmark: {
      peerCount: 18,
      costPerformance: 84,
      schedulePerformance: 79,
      percentile: 31,
    },

    primaryRiskDriver: "Low execution variance",

    lastUpdated: "2026-04-01",
  },
];