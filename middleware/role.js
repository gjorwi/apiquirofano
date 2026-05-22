/**
 * Role-based access control middleware factory.
 * Usage: router.post('/', requireRole('administrador', 'especialista'), handler)
 */
module.exports = function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'No autenticado' });
    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({
        error: `Acceso denegado. Se requiere rol: ${roles.join(' o ')}. Tu rol es: ${req.user.rol}`,
      });
    }
    next();
  };
};
