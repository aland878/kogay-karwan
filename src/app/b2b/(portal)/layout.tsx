import { B2BShell } from "@/components/portal/b2b-shell";
import { signOut } from "@/lib/auth/actions";
import { requireB2B } from "@/lib/auth/session";
import { CartProvider } from "@/lib/cart/cart-context";
import { getLocale } from "@/lib/i18n/locale";

/**
 * B2B portal layout.
 *
 * `requireB2B()` here is the real gate for every page in this group — the
 * middleware only decided where to redirect. Running it in the layout means a
 * new portal page cannot be added without inheriting the check.
 */
export default async function B2BPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, locale] = await Promise.all([requireB2B(), getLocale()]);

  return (
    <CartProvider>
      <B2BShell
        user={{
          name: session.businessName || session.ownerName,
          detail: session.phone,
        }}
        locale={locale}
        signOutAction={async () => {
          "use server";
          await signOut("b2b");
        }}
      >
        {children}
      </B2BShell>
    </CartProvider>
  );
}
