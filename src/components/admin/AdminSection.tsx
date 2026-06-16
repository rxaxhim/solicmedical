export default function AdminSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-border bg-white p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-navy-900">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-navy-500">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}
