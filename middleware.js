const ROLES_FILE = __dirname + '/roles.txt';
const fs = require('fs');

module.exports = (scope) => (req, res, next) => {
  try {
    const roles = fs.readFileSync(ROLES_FILE, 'utf8');
    const parsedRoles = JSON.parse(roles.trim());
    const rolesList = parsedRoles.map(({ role }) => role);

    if (rolesList.includes(req.headers['x-role'])) {
      const scopes = parsedRoles.find(r => r.role === req.headers['x-role']).scopes;
      if (scopes[scope.split('.')[0]].includes(scope.split('.')[1])) {
        next();
      } else {
        res.status(403).send();
      }
    } else {
      res.status(403).send();
    }
  } catch (error) {
    console.error(error)
  }
};
