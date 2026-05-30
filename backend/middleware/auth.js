const getBearerToken = (req) => {
  const header = req.get('authorization') || '';
  const [scheme, token] = header.split(' ');
  return scheme?.toLowerCase() === 'bearer' ? token : null;
};

export const requireSupabaseAuth = async (req, res, next) => {
  const token = getBearerToken(req);
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return res.status(503).json({ message: 'Supabase auth is not configured on the backend' });
  }

  try {
    const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        apikey: supabaseAnonKey,
        authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return res.status(401).json({ message: 'Invalid or expired session' });
    }

    req.authUser = await response.json();
    return next();
  } catch (err) {
    return res.status(503).json({ message: 'Could not verify session' });
  }
};
