"use client";

import { useState } from "react";

const SERVERS = [
  { name: "Slack", tools: "Send message, read channel, search history" },
  { name: "Database", tools: "Query, read-only or write" },
  { name: "CRM", tools: "Look up contact, create deal, log activity" },
  { name: "Email", tools: "Send, read, draft" },
];

export function MCPArchitectureDiagram() {
  const [selected, setSelected] = useState<string | null>(null);
  const server = SERVERS.find((s) => s.name === selected);

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <h4 className="font-mono text-primary text-sm font-bold mb-4">
        MCP: Agent (client) → Protocol → Servers
      </h4>
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="px-3 py-2 rounded bg-primary/10 text-primary font-mono text-sm">
          Agent
        </span>
        <span className="text-text-secondary self-center">→</span>
        <span className="px-3 py-2 rounded border border-border font-mono text-sm">
          MCP Protocol
        </span>
        <span className="text-text-secondary self-center">→</span>
        {SERVERS.map((s) => (
          <button
            key={s.name}
            type="button"
            onClick={() => setSelected(selected === s.name ? null : s.name)}
            className={`px-3 py-2 rounded border font-mono text-sm transition-colors ${
              selected === s.name
                ? "border-primary bg-primary/10 text-primary"
                : "border-border hover:border-primary/40"
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>
      {server && (
        <p className="text-text-secondary text-sm">
          <strong>{server.name}</strong>: {server.tools}
        </p>
      )}
    </div>
  );
}

export function PermissionMatrix() {
  const [matrix, setMatrix] = useState<Record<string, { read: boolean; write: boolean }>>({
    CRM: { read: true, write: false },
    Email: { read: true, write: false },
    Database: { read: true, write: false },
  });

  const toggle = (row: string, col: "read" | "write") => {
    setMatrix((m) => ({
      ...m,
      [row]: { ...m[row], [col]: !m[row]?.[col] },
    }));
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6 overflow-x-auto">
      <h4 className="font-mono text-primary text-sm font-bold mb-4">
        Permission matrix (example)
      </h4>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left font-mono text-xs text-text-secondary">
            <th className="pb-2 pr-4">Tool</th>
            <th className="pb-2 pr-4">Read</th>
            <th className="pb-2">Write</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(matrix).map(([row, v]) => (
            <tr key={row} className="border-t border-border">
              <td className="py-2 pr-4 font-mono">{row}</td>
              <td className="py-2 pr-4">
                <button
                  type="button"
                  onClick={() => toggle(row, "read")}
                  className={`w-8 h-5 rounded border ${
                    v.read ? "bg-primary/20 border-primary" : "border-border"
                  }`}
                />
              </td>
              <td className="py-2">
                <button
                  type="button"
                  onClick={() => toggle(row, "write")}
                  className={`w-8 h-5 rounded border ${
                    v.write ? "bg-amber-500/20 border-amber-500" : "border-border"
                  }`}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-text-secondary text-xs mt-3">
        Write = higher risk. Start read-only; add write with approval gates.
      </p>
    </div>
  );
}
