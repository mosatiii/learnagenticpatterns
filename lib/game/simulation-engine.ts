/**
 * Simulation engine — orchestrates graph validation, simulation, and scoring.
 * Pure functions only. No React dependencies.
 */

import type { GameConfig, SimulationEvent } from "@/data/games";
import { isTopologyMatch, findMissingBlocks, findDistractors } from "./graph-validator";

export interface Score {
  architecture: number;
  resilience: number;
  efficiency: number;
  total: number;
  maxTotal: number;
  passed: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  missingBlocks: string[];
  distractorBlocks: string[];
  topologyMatch: boolean;
}

export function validateGraph(
  placedIds: string[],
  config: GameConfig
): ValidationResult {
  const missingBlocks = findMissingBlocks(placedIds, config.requiredBlockIds);
  const distractorBlocks = findDistractors(placedIds, config.requiredBlockIds);
  const topologyMatch = isTopologyMatch(placedIds, config.validTopologies);

  return {
    isValid: missingBlocks.length === 0 && topologyMatch,
    missingBlocks,
    distractorBlocks,
    topologyMatch,
  };
}

export function runSimulation(
  placedIds: string[],
  config: GameConfig
): SimulationEvent[] {
  return config.simulate(placedIds);
}

export function calculateScore(
  placedIds: string[],
  config: GameConfig
): Score {
  const { scoring } = config;
  const maxTotal = scoring.hasRequiredBlocks + scoring.correctOrder + scoring.noDistractors;

  const missing = findMissingBlocks(placedIds, config.requiredBlockIds);
  const distractors = findDistractors(placedIds, config.requiredBlockIds);
  const topoMatch = isTopologyMatch(placedIds, config.validTopologies);

  const architecture = missing.length === 0 ? scoring.hasRequiredBlocks : 0;
  const resilience = topoMatch ? scoring.correctOrder : 0;
  const efficiency = distractors.length === 0 ? scoring.noDistractors : 0;
  const total = architecture + resilience + efficiency;

  return {
    architecture,
    resilience,
    efficiency,
    total,
    maxTotal,
    passed: total >= maxTotal * 0.6,
  };
}
