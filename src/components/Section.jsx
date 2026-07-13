export default function Section({ title, children, className = "" }) {
  return (
    <section className={`bg-white rounded-2xl border border-ink/10 p-5 ${className}`}>
      <h2 className="font-display font-semibold text-ink mb-4">{title}</h2>
      {children}
    </section>
  );
}
