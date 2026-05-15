import { logoutAdminAction } from "@/lib/actions/admin-auth";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  return (
    <form action={logoutAdminAction}>
      <Button variant="secondary" type="submit">
        Logout
      </Button>
    </form>
  );
}
