"use client";

import { useState, useEffect } from 'react';

export default function TestAPIPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching from API...');
        const response = await fetch('/api/projects');
        const projects = await response.json();
        console.log('API Response:', projects);
        setData(projects);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 bg-black text-white min-h-screen">
      <h1 className="text-2xl mb-4">API Test Page</h1>
      
      <div className="mb-4">
        <h2 className="text-xl mb-2">Projects Count: {data?.length || 0}</h2>
      </div>

      {data?.map((project: any, idx: number) => (
        <div key={idx} className="border border-gray-700 p-4 mb-4 rounded">
          <h3 className="text-lg font-bold">{project.title}</h3>
          <p>ID: {project.id}</p>
          <p>Entries: {project.entries?.length || 0}</p>
          
          {project.entries?.map((entry: any, entryIdx: number) => (
            <div key={entryIdx} className="ml-4 mt-2 border-l-2 border-blue-500 pl-2">
              <p className="font-semibold">Article: {entry.title}</p>
              <p className="text-sm">ID: {entry.id}</p>
              <p className="text-xs text-gray-400">Date: {entry.date}</p>
            </div>
          ))}
        </div>
      ))}

      <div className="mt-8">
        <h2 className="text-xl mb-2">Raw JSON:</h2>
        <pre className="bg-gray-900 p-4 rounded text-xs overflow-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
}
