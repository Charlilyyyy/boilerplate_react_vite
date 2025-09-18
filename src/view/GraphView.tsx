// components/GraphView.tsx
import React, { useRef, useEffect, useState } from "react";
import ForceGraph2D from "react-force-graph-2d";
import type { ForceGraphMethods } from "react-force-graph-2d";

interface GraphNode {
  id: string;
  name: string;
  group?: number;
  x?: number;
  y?: number;
}

interface GraphLink {
  source: string;
  target: string;
}

interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

interface City { name: string; country: string }
interface Visitor { name: string; country: string }
interface Attraction { name: string; type: string; city: City[]; visitors: Visitor[] }

const API_GRAPHQL_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const GraphView: React.FC = () => {
  const fgRef = useRef<ForceGraphMethods | null>(null);
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(API_GRAPHQL_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            query {
              attractions {
                name
                type
                city { name country }
                visitors { name country }
              }
            }
          `,
        }),
      });
      const json = await res.json();
      console.log(json)

      const attractions: Attraction[] = json?.data?.attractions ?? [];

      const nodesMap = new Map<string, GraphNode>();
      const links: GraphLink[] = [];

      const ensureNode = (id: string, name: string, group: number) => {
        if (!nodesMap.has(id)) {
          nodesMap.set(id, { id, name, group });
        }
        return nodesMap.get(id)!;
      };

      attractions.forEach((attr: Attraction) => {
        const attrId = `attr:${attr.name}`;
        ensureNode(attrId, attr.name, 1);

        (attr.city ?? []).forEach((c: City) => {
          const cityId = `city:${c.name}`;
          ensureNode(cityId, c.name, 2);
          links.push({ source: attrId, target: cityId });
        });

        (attr.visitors ?? []).forEach((v: Visitor) => {
          const visitorId = `visitor:${v.name}`;
          ensureNode(visitorId, v.name, 3);
          links.push({ source: visitorId, target: attrId });
        });
      });

      setGraphData({ nodes: Array.from(nodesMap.values()), links });

      // wait a bit for nodes to get initial positions then fit view
      setTimeout(() => {
        fgRef.current?.zoomToFit(600, 80);
      }, 600);
    };

    fetchData();
  }, []);

  const setFgRef = (el: ForceGraphMethods | null) => {
    fgRef.current = el;
  };

  // Simple palette per group
  const colorForGroup = (group?: number) => {
    switch (group) {
      case 1: return "#ff8a3d"; // attraction - orange
      case 2: return "#b388ff"; // city - purple
      case 3: return "#45c1e6"; // visitor - teal
      default: return "#9ca3af"; // gray
    }
  };

  return (
    <div style={{ width: "100%", height: "70vh", background: "#0f172a", borderRadius: 8 }}>
      <ForceGraph2D
        // @ts-expect-error Upstream generic typing for ref is too strict; callback ref is valid
        ref={setFgRef}
        graphData={graphData}
        backgroundColor="#0f172a"
        cooldownTicks={100}
        linkColor={() => "#94a3b8"}
        linkWidth={2}
        linkDirectionalArrowLength={10}
        linkDirectionalArrowRelPos={0.98}
        linkCurvature={0.15}
        nodeLabel={(node: GraphNode) => node.name}
        nodeCanvasObject={(node: GraphNode, ctx: CanvasRenderingContext2D, _globalScale: number) => {
          void _globalScale;
          const label = node.name;
          const fontSize = 12; // fixed px
          const padding = 6;   // fixed px

          ctx.font = `${fontSize}px Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif`;
          const textWidth = ctx.measureText(label).width;
          const radius = Math.max(18, textWidth / 2 + padding);

          // bubble
          ctx.beginPath();
          ctx.arc(node.x ?? 0, node.y ?? 0, radius, 0, 2 * Math.PI);
          ctx.fillStyle = colorForGroup(node.group);
          ctx.fill();
          ctx.lineWidth = 2;
          ctx.strokeStyle = "#ffffff";
          ctx.stroke();

          // label
          ctx.fillStyle = "#0f172a";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(label, (node.x ?? 0), (node.y ?? 0));
        }}
        nodePointerAreaPaint={(node: GraphNode, color: string, ctx: CanvasRenderingContext2D) => {
          const label = node.name;
          ctx.font = `12px Inter, system-ui`;
          const textWidth = ctx.measureText(label).width;
          const radius = Math.max(18, textWidth / 2 + 6);
          ctx.beginPath();
          ctx.arc(node.x ?? 0, node.y ?? 0, radius, 0, 2 * Math.PI);
          ctx.fillStyle = color;
          ctx.fill();
        }}
      />
    </div>
  );
};

export default GraphView;
