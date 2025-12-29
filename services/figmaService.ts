
export interface FigmaNode {
  id: string;
  name: string;
  type: 'FRAME' | 'COMPONENT' | 'INSTANCE' | 'GROUP' | 'VECTOR' | 'TEXT' | string;
  children?: FigmaNode[];
}

export const getFigmaFile = async (token: string, fileKey: string): Promise<any> => {
  const response = await fetch(`https://api.figma.com/v1/files/${fileKey}`, {
    headers: { 'X-Figma-Token': token }
  });
  if (!response.ok) throw new Error("Neural Link Failed: Could not fetch Figma file.");
  const data = await response.json();
  return data;
};

// Fetch detailed node metadata including structural properties
export const getFigmaNodesData = async (token: string, fileKey: string, ids: string[]): Promise<any> => {
  const idsParam = ids.join(',');
  const response = await fetch(`https://api.figma.com/v1/files/${fileKey}/nodes?ids=${idsParam}`, {
    headers: { 'X-Figma-Token': token }
  });
  if (!response.ok) throw new Error("Neural Link Failed: Could not fetch node structure.");
  return await response.json();
};

// Explicitly type the return as a mapping of node IDs to image URLs.
export const exportFigmaNodes = async (token: string, fileKey: string, ids: string[], format: string = 'png', scale: number = 2): Promise<Record<string, string>> => {
  const idsParam = ids.join(',');
  const response = await fetch(`https://api.figma.com/v1/images/${fileKey}?ids=${idsParam}&format=${format}&scale=${scale}`, {
    headers: { 'X-Figma-Token': token }
  });
  if (!response.ok) throw new Error("Neural Link Failed: Figma export protocol error.");
  const data = (await response.json()) as any;
  return data.images; // Map of { [id]: url }
};

export const extractFileKeyFromUrl = (url: string) => {
  const match = url.match(/file\/([a-zA-Z0-9]+)/);
  return match ? match[1] : url;
};
