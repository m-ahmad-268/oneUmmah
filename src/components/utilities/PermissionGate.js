import propTypes from 'prop-types';
import { useAuth } from '../../context/AuthContext';

/**
 * Renders children only when the current user has the required permission(s).
 * Usage:
 *   <PermissionGate permission="CAMPAIGN_CREATE">
 *     <Button>Create</Button>
 *   </PermissionGate>
 *
 *   <PermissionGate permission={['CAMPAIGN_EDIT', 'CAMPAIGN_CREATE']} requireAll={false}>
 *     ...
 *   </PermissionGate>
 */
function PermissionGate({ permission, requireAll, fallback, children }) {
  const { permissions } = useAuth();

  const required = Array.isArray(permission) ? permission : [permission];
  const check = requireAll
    ? required.every((p) => permissions.includes(p))
    : required.some((p) => permissions.includes(p));
  return check ? children : fallback;
}

PermissionGate.propTypes = {
  permission: propTypes.oneOfType([propTypes.string, propTypes.arrayOf(propTypes.string)]).isRequired,
  requireAll: propTypes.bool,
  fallback: propTypes.node,
  children: propTypes.node,
};

PermissionGate.defaultProps = {
  requireAll: true,
  fallback: null,
  children: null,
};

export default PermissionGate;
