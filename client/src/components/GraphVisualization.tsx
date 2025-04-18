import { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { useGraphContext } from "@/hooks/useGraphContext";
import { GraphData } from "@shared/schema";

export default function GraphVisualization() {
  const { viewType, rawGraph, simplifiedGraph } = useGraphContext();
  const svgRef = useRef<SVGSVGElement>(null);
  const [zoom, setZoom] = useState(1);
  
  const graphData = viewType === 'simplified' ? simplifiedGraph : rawGraph;

  // Reset when null
  useEffect(() => {
    if (svgRef.current && (!graphData.nodes.length || !graphData.links.length)) {
      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove();
    }
  }, [graphData]);

  // Update visualization when data changes
  useEffect(() => {
    if (!svgRef.current || !graphData.nodes.length || !graphData.links.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Add arrow marker and gradients definition
    const defs = svg.append("defs");
    
    // Add arrow marker
    defs.append("marker")
      .attr("id", "arrowhead")
      .attr("markerWidth", 10)
      .attr("markerHeight", 10)
      .attr("refX", 9)
      .attr("refY", 5)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,0 L0,10 L10,5 z")
      .attr("fill", "#6366F1");
      
    // Add lender gradient (green to teal)
    const lenderGradient = defs.append("linearGradient")
      .attr("id", "lenderGradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "100%");
      
    lenderGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#10B981")
      .attr("stop-opacity", 1);
      
    lenderGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#14B8A6")
      .attr("stop-opacity", 1);
      
    // Add borrower gradient (red to pink)
    const borrowerGradient = defs.append("linearGradient")
      .attr("id", "borrowerGradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "100%");
      
    borrowerGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#F87171")
      .attr("stop-opacity", 1);
      
    borrowerGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#EC4899")
      .attr("stop-opacity", 1);
      
    // Add mixed gradient (purple to indigo)
    const mixedGradient = defs.append("linearGradient")
      .attr("id", "mixedGradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "100%");
      
    mixedGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#8B5CF6")
      .attr("stop-opacity", 1);
      
    mixedGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#6366F1")
      .attr("stop-opacity", 1);

    // Setup force simulation
    const simulation = d3.forceSimulation(graphData.nodes)
      .force("link", d3.forceLink(graphData.links)
        .id((d: any) => d.id)
        .distance(150))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2));

    // Create links with gradient strokes
    // Add link gradient
    graphData.links.forEach((link, i) => {
      const linkGradient = defs.append("linearGradient")
        .attr("id", `linkGradient-${i}`)
        .attr("gradientUnits", "userSpaceOnUse");
        
      linkGradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "#6366F1");
        
      linkGradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "#8B5CF6");
    });
    
    // Create links
    const links = svg.append("g")
      .attr("class", "links")
      .selectAll("path")
      .data(graphData.links)
      .enter()
      .append("path")
      .attr("fill", "none")
      .attr("stroke", (d, i) => `url(#linkGradient-${i})`)
      .attr("stroke-width", 3)
      .attr("stroke-linecap", "round")
      .attr("opacity", 0.8)
      .attr("marker-end", "url(#arrowhead)");

    // Add link amount labels
    const linkLabels = svg.append("g")
      .attr("class", "link-labels")
      .selectAll("text")
      .data(graphData.links)
      .enter()
      .append("text")
      .attr("text-anchor", "middle")
      .attr("fill", "#172B4D")
      .attr("font-size", 12)
      .text((d: any) => `$${d.amount.toFixed(2)}`);

    // Create nodes
    const nodes = svg.append("g")
      .attr("class", "nodes")
      .selectAll("circle")
      .data(graphData.nodes)
      .enter()
      .append("circle")
      .attr("r", 30)
      .attr("fill", (d: any) => {
        // Check if node is more of a lender or borrower
        const isLender = graphData.links.some(link => 
          (typeof link.source === 'object' ? link.source.id : link.source) === d.id);
        const isBorrower = graphData.links.some(link => 
          (typeof link.target === 'object' ? link.target.id : link.target) === d.id);
        
        // Vibrant gradient colors
        if (isLender && !isBorrower) return "url(#lenderGradient)"; // Primary lender color
        if (isBorrower && !isLender) return "url(#borrowerGradient)"; // Debt color
        return "url(#mixedGradient)"; // Mixed color
      })
      .attr("stroke", "#FFFFFF")
      .attr("stroke-width", 2)
      .call(d3.drag<SVGCircleElement, any>()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }) as any);

    // Add node labels
    const nodeLabels = svg.append("g")
      .attr("class", "node-labels")
      .selectAll("text")
      .data(graphData.nodes)
      .enter()
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("fill", "white")
      .attr("font-size", 12)
      .text((d: any) => d.name);

    // Update positions on simulation tick
    simulation.on("tick", () => {
      links
        .attr("d", (d: any) => {
          const sourceX = d.source.x;
          const sourceY = d.source.y;
          const targetX = d.target.x;
          const targetY = d.target.y;
          
          // Calculate direction vector
          const dx = targetX - sourceX;
          const dy = targetY - sourceY;
          const dr = Math.sqrt(dx * dx + dy * dy);
          
          // Calculate points for the source and target circles
          const sourceRadius = 30; // Circle radius
          const targetRadius = 30;
          
          // Normalized direction vector
          const nx = dx / dr;
          const ny = dy / dr;
          
          // Calculate points on the circle perimeters
          const sourcePointX = sourceX + sourceRadius * nx;
          const sourcePointY = sourceY + sourceRadius * ny;
          const targetPointX = targetX - targetRadius * nx;
          const targetPointY = targetY - targetRadius * ny;
          
          // Create curved links for a more attractive look
          // The curve is calculated with a quadratic Bezier curve
          const curveFactor = 1.2; // Adjust this value to change curve intensity
          const midX = (sourcePointX + targetPointX) / 2;
          const midY = (sourcePointY + targetPointY) / 2;
          
          // Control point for the curve (perpendicular to the line)
          const offsetX = -ny * dr * 0.2; // Perpendicular offset
          const offsetY = nx * dr * 0.2;  // Perpendicular offset
          
          // Create the curved path
          return `M${sourcePointX},${sourcePointY} 
                  Q${midX + offsetX},${midY + offsetY} ${targetPointX},${targetPointY}`;
        });

      linkLabels
        .attr("x", (d: any) => (d.source.x + d.target.x) / 2)
        .attr("y", (d: any) => (d.source.y + d.target.y) / 2);

      nodes
        .attr("cx", (d: any) => d.x)
        .attr("cy", (d: any) => d.y);

      nodeLabels
        .attr("x", (d: any) => d.x)
        .attr("y", (d: any) => d.y);
    });

    return () => {
      simulation.stop();
    };
  }, [graphData, viewType]);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleResetZoom = () => {
    setZoom(1);
  };

  return (
    <div className="w-full h-[500px] bg-gradient-to-br from-indigo-50 to-purple-100 rounded-lg flex items-center justify-center relative overflow-hidden shadow-xl">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      
      <div id="graph-container" className="absolute inset-0">
        <svg 
          width="100%" 
          height="100%" 
          id="graphSVG" 
          ref={svgRef}
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
        />
      </div>
      
      {/* Controls Overlay */}
      <div className="absolute bottom-4 right-4 flex space-x-2">
        <button 
          onClick={handleZoomIn}
          className="bg-white/90 p-2 rounded-lg shadow-md hover:bg-primary/20 hover:text-primary transition-colors text-zinc-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </button>
        <button 
          onClick={handleZoomOut}
          className="bg-white/90 p-2 rounded-lg shadow-md hover:bg-primary/20 hover:text-primary transition-colors text-zinc-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </button>
        <button 
          onClick={handleResetZoom}
          className="bg-white/90 p-2 rounded-lg shadow-md hover:bg-primary/20 hover:text-primary transition-colors text-zinc-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}
