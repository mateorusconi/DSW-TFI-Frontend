import { PATHS } from "../../../router/paths";
import { ROLES } from "../../shared/constants/roles";

// Pantalla de inicio de cada rol. La usan ProtectedRoute, GuestRoute y los logins.
export function homeFor(role) {
  return role === ROLES.ADMIN ? PATHS.adminHome : PATHS.bookAppointment;
}
