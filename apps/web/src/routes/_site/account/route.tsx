import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { Container, TabLinks } from "#/components/site/kit";

export const Route = createFileRoute("/_site/account")({
  beforeLoad: ({ context, location }) => {
    if (!context.member) throw redirect({ to: "/login", search: { next: location.href } });
    return { member: context.member };
  },
  head: () => ({ meta: [{ title: "My account | Capevars" }] }),
  component: AccountLayout,
});

function AccountLayout() {
  return (
    <Container className="py-8">
      <h1 className="text-2xl font-black text-primary">My account</h1>
      <TabLinks
        className="mt-4 mb-6"
        items={[
          { to: "/account", label: "Profile", exact: true },
          { to: "/account/orders", label: "Orders" },
          { to: "/account/tickets", label: "Tickets & bookings" },
          { to: "/account/favourites", label: "Favourites" },
          { to: "/account/payments", label: "Payments" },
          { to: "/account/security", label: "Security" },
        ]}
      />
      <Outlet />
    </Container>
  );
}
