import type { DiagramFamily, DiagramIR } from "../src/types.js";

const genericNodes = [
  { key: "client", label: "Client", kind: "person" },
  { key: "service", label: "Application service", kind: "service" },
  { key: "store", label: "Primary store", kind: "database" },
];

const genericEdges = [
  {
    key: "client-calls-service",
    from: "client",
    to: "service",
    label: "requests",
  },
  {
    key: "service-uses-store",
    from: "service",
    to: "store",
    label: "reads and writes",
  },
];

function generic(family: DiagramFamily): DiagramIR {
  return {
    version: 1,
    name: `${family}-fixture`,
    title: `${family} fixture`,
    family,
    orientation: "LR",
    nodes: genericNodes,
    edges: genericEdges,
  };
}

export const fixtures: DiagramIR[] = [
  {
    ...generic("architecture"),
    groups: [
      {
        key: "system-boundary",
        label: "System boundary",
        kind: "boundary",
        members: ["service", "store"],
      },
    ],
  },
  {
    version: 1,
    name: "sequence-fixture",
    title: "Request sequence",
    family: "sequence",
    sequence: {
      participants: [
        { key: "browser", label: "Browser" },
        { key: "api", label: "API" },
        { key: "database", label: "Database" },
      ],
      messages: [
        {
          key: "submit-request",
          from: "browser",
          to: "api",
          label: "POST /orders",
          kind: "sync",
          activate: true,
        },
        {
          key: "save-order",
          from: "api",
          to: "database",
          label: "insert order",
          kind: "sync",
        },
        {
          key: "return-order",
          from: "api",
          to: "browser",
          label: "201 Created",
          kind: "return",
        },
      ],
      frames: [
        {
          key: "transaction",
          kind: "opt",
          label: "valid request",
          fromMessage: "submit-request",
          toMessage: "save-order",
        },
      ],
    },
  },
  {
    version: 1,
    name: "flowchart-fixture",
    title: "Approval process",
    family: "flowchart",
    orientation: "TB",
    nodes: [
      { key: "start", label: "Request submitted", kind: "terminator" },
      { key: "review", label: "Review request", kind: "process" },
      { key: "approved", label: "Approved?", kind: "decision" },
      { key: "finish", label: "Publish result", kind: "terminator" },
    ],
    edges: [
      { key: "start-review", from: "start", to: "review", label: "next" },
      { key: "review-decision", from: "review", to: "approved", label: "assess" },
      { key: "yes-finish", from: "approved", to: "finish", label: "yes" },
      { key: "no-review", from: "approved", to: "review", label: "no" },
    ],
  },
  {
    version: 1,
    name: "data-model-fixture",
    title: "Order data model",
    family: "data-model",
    orientation: "LR",
    nodes: [
      {
        key: "account",
        label: "Account",
        kind: "entity",
        attributes: [
          { name: "id", type: "uuid", key: "PK" },
          { name: "email", type: "text", key: "UK" },
        ],
      },
      {
        key: "order",
        label: "Order",
        kind: "entity",
        attributes: [
          { name: "id", type: "uuid", key: "PK" },
          { name: "account_id", type: "uuid", key: "FK" },
        ],
      },
    ],
    edges: [
      {
        key: "account-orders",
        from: "account",
        to: "order",
        label: "places",
        fromCardinality: "1",
        toCardinality: "0..*",
      },
    ],
  },
  {
    version: 1,
    name: "state-machine-fixture",
    title: "Job lifecycle",
    family: "state-machine",
    orientation: "LR",
    nodes: [
      { key: "initial", label: "Initial", kind: "initial" },
      { key: "queued", label: "Queued", kind: "state" },
      { key: "running", label: "Running", kind: "state" },
      { key: "completed", label: "Completed", kind: "final" },
    ],
    edges: [
      { key: "enqueue", from: "initial", to: "queued", label: "enqueue" },
      { key: "start-job", from: "queued", to: "running", label: "worker starts" },
      { key: "finish-job", from: "running", to: "completed", label: "success" },
    ],
  },
  {
    ...generic("infrastructure"),
    groups: [
      {
        key: "private-network",
        label: "Private network",
        kind: "network",
        members: ["service", "store"],
      },
    ],
  },
  {
    version: 1,
    name: "concept-map-fixture",
    title: "Delivery concepts",
    family: "concept-map",
    nodes: [
      { key: "delivery", label: "Software delivery", kind: "concept" },
      { key: "quality", label: "Quality", kind: "concept" },
      { key: "speed", label: "Speed", kind: "concept" },
    ],
    edges: [
      {
        key: "delivery-needs-quality",
        from: "delivery",
        to: "quality",
        label: "requires",
      },
      {
        key: "delivery-improves-speed",
        from: "delivery",
        to: "speed",
        label: "optimizes",
      },
    ],
  },
  {
    ...generic("freeform"),
    annotations: [
      {
        key: "important-note",
        label: "The service is the central coordination point.",
        target: "service",
        kind: "note",
      },
    ],
  },
];

