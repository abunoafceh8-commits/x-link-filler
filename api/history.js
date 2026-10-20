const history = [];
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  
  if (req.method === 'POST') {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    // Accept both {links} array and regular history entries
    if (body.links && Array.isArray(body.links)) {
      body.links.forEach((link, i) => {
        history.unshift({ id: Date.now().toString() + '_' + i, link, type: typeof link === 'string' ? 'url' : 'object', savedAt: new Date().toISOString() });
      });
      if (history.length > 500) history.length = 500;
      return res.json({ success: true, count: body.links.length });
    }
    history.unshift({ id: Date.now().toString(), ...body, savedAt: new Date().toISOString() });
    if (history.length > 500) history.pop();
    return res.json({ success: true });
  }
  
  if (req.method === 'DELETE') {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const idx = history.findIndex(h => h.id === body.id);
    if (idx >= 0) history.splice(idx, 1);
    return res.json({ success: true });
  }
  
  return res.json(history);
}
