import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import SignOutButton from "./SignOutButton";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-muted">
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="flex items-center gap-2.5">
              <span className="relative h-10 w-12">
                <Image
                  src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/images/logo.png`}
                  alt="Solic Medical"
                  fill
                  priority
                  className="object-contain"
                />
              </span>
              <span className="leading-tight">
                <span className="block text-lg font-bold tracking-tight text-navy-800">
                  Solic Medical
                </span>
                <span className="block text-[10px] font-medium uppercase tracking-[0.15em] text-navy-500">
                  Admin
                </span>
              </span>
            </Link>
            <nav className="hidden items-center gap-6 sm:flex">
              <Link
                href="/admin"
                className="text-sm font-medium text-navy-600 hover:text-navy-900"
              >
                Products
              </Link>
              <Link
                href="/admin/categories"
                className="text-sm font-medium text-navy-600 hover:text-navy-900"
              >
                Categories
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-5">
            <Link
              href="/"
              target="_blank"
              className="hidden items-center gap-1.5 text-sm font-medium text-navy-600 hover:text-navy-900 sm:flex"
            >
              View site
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
            <span className="hidden text-sm text-navy-400 sm:inline">
              {user.email}
            </span>
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
