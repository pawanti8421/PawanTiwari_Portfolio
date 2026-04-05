import { useCounter } from "@/hooks";
import {
  LuFolderKanban,
  LuCpu,
  LuBuilding2,
  LuGitBranch,
} from "react-icons/lu";

const iconMap = {
  projects: LuFolderKanban,
  tech: LuCpu,
  work: LuBuilding2,
  commit: LuGitBranch,
};

export default function StatCard({ stat, active }) {
  const count = useCounter(stat.value, 1800, active);
  const Icon = iconMap[stat.icon];
  return (
    <div
      className="glass"
      style={{ padding: "28px 24px", borderRadius: 12, textAlign: "center" }}
    >
      <div style={{ marginBottom: 10 }}>{Icon ? <Icon size={28} /> : null}</div>
      <div
        className="grad-text f-display"
        style={{
          fontSize: "clamp(32px,4vw,48px)",
          fontWeight: 900,
          lineHeight: 1,
        }}
      >
        {count}
        {stat.suffix}
      </div>
      <div
        style={{
          color: "var(--text2)",
          fontSize: 12,
          fontWeight: 500,
          marginTop: 6,
          letterSpacing: "0.02em",
        }}
      >
        {stat.label}
      </div>
    </div>
  );
}
