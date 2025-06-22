
import React, { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  Position,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Client, Vendor } from '@/types';
import { Link } from 'react-router-dom';

interface GraphProps {
  clients: Client[];
  vendors: Vendor[];
}

const Graph: React.FC<GraphProps> = ({ clients, vendors }) => {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    
    let yOffset = 0;
    
    clients.forEach((client, clientIndex) => {
      // Add client node
      const clientNodeId = `client-${client.id}`;
      nodes.push({
        id: clientNodeId,
        type: 'default',
        position: { x: 50, y: yOffset },
        data: { 
          label: (
            <div className="text-center">
              <div className="font-bold text-green-700">{client.name}</div>
              <div className="text-xs text-gray-500">{client.contactNo}</div>
              <div className="text-xs font-semibold text-green-600">
                ${client.totalCost.toLocaleString()}
              </div>
            </div>
          )
        },
        style: {
          background: '#f0fdf4',
          border: '2px solid #16a34a',
          borderRadius: '12px',
          width: 200,
          height: 80,
        },
        sourcePosition: Position.Right,
      });

      // Group events by vendor
      const vendorEvents = client.events.reduce((acc, event) => {
        if (event.vendorId) {
          if (!acc[event.vendorId]) {
            acc[event.vendorId] = [];
          }
          acc[event.vendorId].push(event);
        }
        return acc;
      }, {} as { [vendorId: number]: typeof client.events });

      let eventYOffset = 0;
      Object.entries(vendorEvents).forEach(([vendorIdStr, events]) => {
        const vendorId = parseInt(vendorIdStr);
        const vendor = vendors.find(v => v.id === vendorId);
        if (!vendor) return;

        // Add vendor node
        const vendorNodeId = `vendor-${client.id}-${vendorId}`;
        const totalCost = events.reduce((sum, event) => {
          return sum + event.categories.reduce((catSum, category) => {
            return catSum + (vendor.categoryPrices[category] || 0);
          }, 0);
        }, 0);

        nodes.push({
          id: vendorNodeId,
          type: 'default',
          position: { x: 400, y: yOffset + eventYOffset },
          data: { 
            label: (
              <div className="text-center">
                <div className="font-bold text-blue-700">{vendor.name}</div>
                <div className="text-xs text-gray-600 mb-1">
                  {events.length} event{events.length !== 1 ? 's' : ''}
                </div>
                <div className="text-xs space-y-1">
                  {events.slice(0, 2).map((event, idx) => (
                    <div key={idx} className="bg-blue-50 px-1 rounded">
                      {event.eventName}
                    </div>
                  ))}
                  {events.length > 2 && (
                    <div className="text-gray-500">+{events.length - 2} more</div>
                  )}
                </div>
                <div className="text-xs font-semibold text-blue-600 mt-1">
                  ${totalCost.toLocaleString()}
                </div>
              </div>
            )
          },
          style: {
            background: '#eff6ff',
            border: '2px solid #2563eb',
            borderRadius: '12px',
            width: 180,
            height: 120,
          },
          targetPosition: Position.Left,
        });

        // Add edge from client to vendor
        edges.push({
          id: `edge-${client.id}-${vendorId}`,
          source: clientNodeId,
          target: vendorNodeId,
          animated: true,
          style: { stroke: '#16a34a', strokeWidth: 2 },
          label: events.map(e => e.categories.join(', ')).join(' | '),
          labelStyle: { fontSize: '10px', fontWeight: 'bold' },
        });

        eventYOffset += 140;
      });

      yOffset += Math.max(eventYOffset, 100) + 50;
    });

    return { nodes, edges };
  }, [clients, vendors]);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Client-Vendor Relationship Graph
            </h1>
            <p className="text-gray-600">Visual representation of client and vendor relationships</p>
          </div>
          <Link
            to="/"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* Graph Container */}
        <div className="bg-white rounded-xl shadow-lg" style={{ height: '70vh' }}>
          {nodes.length > 0 ? (
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              fitView
              attributionPosition="bottom-left"
              style={{ borderRadius: '12px' }}
            >
              <MiniMap 
                nodeStrokeColor="#374151"
                nodeColor="#f3f4f6"
                nodeBorderRadius={8}
              />
              <Controls />
              <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
            </ReactFlow>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <p className="text-lg mb-2">No client-vendor relationships to display</p>
                <p className="text-sm">Add clients with events and vendors to see the graph</p>
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Legend</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-green-100 border-2 border-green-600 rounded"></div>
              <span className="text-sm text-gray-700">Client nodes (with total cost)</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-blue-100 border-2 border-blue-600 rounded"></div>
              <span className="text-sm text-gray-700">Vendor nodes (with event count and cost)</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-0.5 bg-green-600"></div>
              <span className="text-sm text-gray-700">Animated connections show event categories</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Graph;
