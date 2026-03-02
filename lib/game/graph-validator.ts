/**
 * Pure graph validation utilities.
 * No React, no side effects — testable in isolation.
 */

export function isTopologyMatch(
  userOrder: string[],
  validOrders: string[][]
): boolean {
  return validOrders.some(
    (valid) =>
      valid.length === userOrder.length &&
      valid.every((id, i) => userOrder[i] === id)
  );
}

export function findMissingBlocks(
  userIds: string[],
  requiredIds: string[]
): string[] {
  return requiredIds.filter((id) => !userIds.includes(id));
}

export function findDistractors(
  userIds: string[],
  requiredIds: string[]
): string[] {
  return userIds.filter((id) => !requiredIds.includes(id));
}
