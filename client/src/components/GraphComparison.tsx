import { useRef, useEffect } from "react";
import { useGraphContext } from "@/hooks/useGraphContext";
import * as d3 from "d3";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

export default function GraphComparison() {
  const { rawGraph, simplifiedGraph } = useGraphContext();
  const rawSvgRef = useRef<SVGSVGElement>(null);
  const simplifiedSvgRef = useRef<SVGSVGElement>(null);

  // Render raw graph
  useEffect(() => {
    if (!rawSvgRef.current || !rawGraph.nodes.length) return;

    const svg = d3.select(rawSvgRef.current);
    svg.selectAll("*").remove();

    const width = rawSvgRef.current.clientWidth;
    const height = rawSvgRef.current.clientHeight;

    // Create mini visualization
    renderMiniGraph(svg, rawGraph, width, height);
  }, [rawGraph]);

  // Render simplified graph
  useEffect(() => {
    if (!simplifiedSvgRef.current || !simplifiedGraph.nodes.length) return;

    const svg = d3.select(simplifiedSvgRef.current);
    svg.selectAll("*").remove();

    const width = simplifiedSvgRef.current.clientWidth;
    const height = simplifiedSvgRef.current.clientHeight;

    // Create mini visualization
    renderMiniGraph(svg, simplifiedGraph, width, height);
  }, [simplifiedGraph]);

  const renderMiniGraph = (svg: any, graphData: any, width: number, height: number) => {
    // Add arrow marker definition
    svg.append("defs")
      .append("marker")
      .attr("id", "mini-arrowhead")
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("refX", 7)
      .attr("refY", 3)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,0 L0,6 L6,3 z")
      .attr("fill", "#172B4D");

    // Setup force simulation
    const simulation = d3.forceSimulation(graphData.nodes)
      .force("link", d3.forceLink(graphData.links)
        .id((d: any) => d.id)
        .distance(80))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2));

    // Create links
    const links = svg.append("g")
      .attr("class", "links")
      .selectAll("path")
      .data(graphData.links)
      .enter()
      .append("path")
      .attr("fill", "none")
      .attr("stroke", "#172B4D")
      .attr("stroke-width", 1.5)
      .attr("marker-end", "url(#mini-arrowhead)");

    // Create nodes
    const nodes = svg.append("g")
      .attr("class", "nodes")
      .selectAll("circle")
      .data(graphData.nodes)
      .enter()
      .append("circle")
      .attr("r", 20)
      .attr("fill", (d: any) => {
        // Check if node is more of a lender or borrower
        const isLender = graphData.links.some(link => 
          (typeof link.source === 'object' ? link.source.id : link.source) === d.id);
        const isBorrower = graphData.links.some(link => 
          (typeof link.target === 'object' ? link.target.id : link.target) === d.id);
        
        if (isLender && !isBorrower) return "#38B2AC";
        if (isBorrower && !isLender) return "#FC8181";
        return "#9F7AEA";
      })
      .attr("stroke", "#FFFFFF")
      .attr("stroke-width", 2);

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
      .attr("font-size", 8)
      .text((d: any) => d.name.substring(0, 1));

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
          const sourceRadius = 20; // Circle radius
          const targetRadius = 20;
          
          // Normalized direction vector
          const nx = dx / dr;
          const ny = dy / dr;
          
          // Calculate points on the circle perimeters
          const sourcePointX = sourceX + sourceRadius * nx;
          const sourcePointY = sourceY + sourceRadius * ny;
          const targetPointX = targetX - targetRadius * nx;
          const targetPointY = targetY - targetRadius * ny;
          
          return `M${sourcePointX},${sourcePointY} L${targetPointX},${targetPointY}`;
        });

      nodes
        .attr("cx", (d: any) => clamp(d.x, 20, width - 20))
        .attr("cy", (d: any) => clamp(d.y, 20, height - 20));

      nodeLabels
        .attr("x", (d: any) => clamp(d.x, 20, width - 20))
        .attr("y", (d: any) => clamp(d.y, 20, height - 20));
    });

    return () => {
      simulation.stop();
    };
  };

  // Helper to keep nodes within bounds
  const clamp = (value: number, min: number, max: number) => {
    return Math.max(min, Math.min(value, max));
  };

  return (
    <Card className="bg-white rounded-xl shadow-sm">
      <CardContent className="p-6">
        <CardTitle className="font-heading font-semibold text-lg mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
          Graph Comparison
        </CardTitle>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-secondary-50 rounded-lg">
            <h4 className="font-medium text-base mb-2">Raw Graph</h4>
            <div className="aspect-video bg-white rounded relative overflow-hidden">
              <svg 
                ref={rawSvgRef}
                className="w-full h-full"
                viewBox="0 0 300 170"
                preserveAspectRatio="xMidYMid meet"
              />
            </div>
            <div className="mt-2">
              <p className="text-sm text-secondary-500">
                <span className="font-medium">{rawGraph.links.length}</span> edges / 
                <span className="font-medium"> {rawGraph.nodes.length}</span> users
              </p>
            </div>
          </div>
          
          <div className="p-4 bg-secondary-50 rounded-lg">
            <h4 className="font-medium text-base mb-2">Simplified Graph</h4>
            <div className="aspect-video bg-white rounded relative overflow-hidden">
              <svg
                ref={simplifiedSvgRef}
                className="w-full h-full"
                viewBox="0 0 300 170"
                preserveAspectRatio="xMidYMid meet"
              />
            </div>
            <div className="mt-2">
              <p className="text-sm text-secondary-500">
                <span className="font-medium">{simplifiedGraph.links.length}</span> edges / 
                <span className="font-medium"> {simplifiedGraph.nodes.length}</span> users
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 border border-primary-100 bg-primary-50 rounded-lg">
          <h4 className="font-medium text-base mb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-primary-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            How Simplification Works
          </h4>
          <p className="text-sm text-secondary-600 leading-relaxed">
            The debt simplification algorithm works by calculating net balances for each user, 
            then creating new optimized payment paths between debtors and creditors to minimize the total 
            number of transactions while preserving the same financial outcome.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
