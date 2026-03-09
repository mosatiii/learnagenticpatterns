"use client";

import type { PMModule } from "@/data/pm-curriculum";
import {
  AutonomyStepper,
  ThreeWavesTimeline,
  SkillSetCallout,
} from "./Module1UI";
import {
  DiscoveryWarningCallout,
  AgentVsAutomationVsHuman,
  CaseStudyExpandables,
} from "./Module2UI";
import {
  ToolsComparisonGrid,
  FourHourWalkthrough,
  PrototypeVsPRDFlowchart,
  VideoPlaceholder,
} from "./Module3UI";
import {
  ChainVisualizer,
  LatencyCalculator,
  FixedVsDynamicCards,
} from "./Module4UI";
import {
  PricingTable,
  FallbackChainDiagram,
} from "./Module5UI";
import { ProgressiveResultsDemo } from "./Module6UI";
import {
  BeforeAfterReflection,
  EvalCriteriaCallout,
} from "./Module7UI";
import {
  RAGPipelineDiagram,
  RAGVsFineTuningVsContext,
  RAGFailureModes,
} from "./Module8UI";
import {
  MCPArchitectureDiagram,
  PermissionMatrix,
} from "./Module9UI";
import {
  TopologyCards,
  MultiAgentCostCalculator,
} from "./Module10UI";
import {
  MemoryArchitectureDiagram,
  PrivacyChecklist,
} from "./Module11UI";
import {
  SafetyStackDiagram,
  IncidentCaseStudies,
  SafetyAuditChecklist,
} from "./Module12UI";
import {
  AgentMetricsDashboardMockup,
  EvalFlywheelDiagram,
} from "./Module13UI";
import {
  LLMOpsChecklist,
  CostDashboardMockup,
  IncidentPlaybook,
} from "./Module14UI";
import {
  RoadmapBuilder,
  NinetyDayPlanTemplate,
  CurriculumMap,
  CompletionCTA,
} from "./Module15UI";

interface ModuleSpecificContentProps {
  slug: string;
  module: PMModule;
}

export default function ModuleSpecificContent({ slug, module: mod }: ModuleSpecificContentProps) {
  const wrap = (title: string, children: React.ReactNode) => (
    <div className="space-y-3">
      <h3 className="font-mono text-primary text-sm font-bold">{title}</h3>
      {children}
    </div>
  );

  switch (slug) {
    case "ai-native-foundations":
      return (
        <div className="space-y-6">
          {wrap("Where is your product? (L0–L4)", <AutonomyStepper />)}
          {wrap("The three waves", <ThreeWavesTimeline />)}
          <SkillSetCallout />
        </div>
      );

    case "ai-product-discovery":
      return (
        <div className="space-y-6">
          <DiscoveryWarningCallout />
          {wrap("Agent vs. automation vs. human", <AgentVsAutomationVsHuman />)}
          {wrap("Case studies", <CaseStudyExpandables />)}
        </div>
      );

    case "pm-prototyping-toolkit":
      return (
        <div className="space-y-6">
          {wrap("Tools comparison", <ToolsComparisonGrid />)}
          {wrap("4-hour walkthrough", <FourHourWalkthrough />)}
          {wrap("Prototype or PRD?", <PrototypeVsPRDFlowchart />)}
          <VideoPlaceholder />
        </div>
      );

    case "task-orchestration":
      return (
        <div className="space-y-6">
          {wrap("Example agent chain", <ChainVisualizer />)}
          {wrap("Latency calculator", <LatencyCalculator />)}
          {wrap("Fixed vs. dynamic", <FixedVsDynamicCards />)}
        </div>
      );

    case "intelligent-routing":
      return (
        <div className="space-y-6">
          {wrap("Pricing (per 1K tokens)", <PricingTable />)}
          {wrap("Fallback chain", <FallbackChainDiagram />)}
        </div>
      );

    case "speed-at-scale":
      return (
        <div className="space-y-6">
          {wrap("Progressive results demo", <ProgressiveResultsDemo />)}
        </div>
      );

    case "quality-self-correction":
      return (
        <div className="space-y-6">
          {wrap("Reflection: before vs. after", <BeforeAfterReflection />)}
          <EvalCriteriaCallout />
        </div>
      );

    case "rag-knowledge-systems":
      return (
        <div className="space-y-6">
          {wrap("RAG pipeline", <RAGPipelineDiagram />)}
          {wrap("RAG vs. fine-tuning vs. context", <RAGVsFineTuningVsContext />)}
          {wrap("Failure modes", <RAGFailureModes />)}
        </div>
      );

    case "tools-apis-mcp":
      return (
        <div className="space-y-6">
          {wrap("MCP architecture", <MCPArchitectureDiagram />)}
          {wrap("Permissions", <PermissionMatrix />)}
        </div>
      );

    case "multi-agent-teams":
      return (
        <div className="space-y-6">
          {wrap("Topologies", <TopologyCards />)}
          {wrap("Cost comparison", <MultiAgentCostCalculator />)}
        </div>
      );

    case "memory-personalization":
      return (
        <div className="space-y-6">
          {wrap("Memory layers", <MemoryArchitectureDiagram />)}
          {wrap("Privacy checklist", <PrivacyChecklist />)}
        </div>
      );

    case "safety-guardrails":
      return (
        <div className="space-y-6">
          {wrap("Safety stack", <SafetyStackDiagram />)}
          {wrap("Incident case studies", <IncidentCaseStudies />)}
          {wrap("Safety audit", <SafetyAuditChecklist />)}
        </div>
      );

    case "measuring-success":
      return (
        <div className="space-y-6">
          {wrap("Metrics dashboard (example)", <AgentMetricsDashboardMockup />)}
          {wrap("Eval flywheel", <EvalFlywheelDiagram />)}
        </div>
      );

    case "llmops-production":
      return (
        <div className="space-y-6">
          {wrap("LLMOps checklist", <LLMOpsChecklist />)}
          {wrap("Cost dashboard (example)", <CostDashboardMockup />)}
          {wrap("Incident playbook", <IncidentPlaybook />)}
        </div>
      );

    case "maturity-roadmap":
      return (
        <div className="space-y-6">
          {wrap("Roadmap builder", <RoadmapBuilder />)}
          {wrap("90-day plan", <NinetyDayPlanTemplate />)}
          {wrap("Curriculum map", <CurriculumMap />)}
          <CompletionCTA />
        </div>
      );

    default:
      return null;
  }
}
