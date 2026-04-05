import { Github, ArrowUpRight } from "lucide-react";
import { projects, personal } from "@/data";
import ProjectCard from "./ProjectCard";

export default function Projects() {
  return (
    <section id="projects" style={{ background: "var(--bg1)" }}>
      <div className="section-wrap">
        <div className="section-header">
          <div className="label" style={{ marginBottom: 14 }}>
            05 / Projects
          </div>
          <h2 className="display-lg">
            Selected
            <br />
            <span style={{ fontStyle: "italic", color: "var(--text2)" }}>
              work
            </span>
          </h2>
          <p
            style={{
              color: "var(--text2)",
              fontSize: 15,
              marginTop: 18,
              maxWidth: 480,
            }}
          >
            A curated set of real-world applications showcasing full-stack
            engineering
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: 24,
          }}
        >
          {projects.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 52 }}>
          <a
            href={personal.github}
            target="_blank"
            rel="noreferrer"
            className="btn-ghost"
          >
            <Github size={14} /> View All on GitHub <ArrowUpRight size={13} />
          </a>
        </div>
      </div>
    </section>
  );
}
