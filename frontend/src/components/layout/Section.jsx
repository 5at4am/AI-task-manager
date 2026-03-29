export default function Section({ children, className = '', id }) {
  return (
    <section id={id} className={`py-24 ${className}`}>
      <div className="max-w-[1280px] mx-auto px-5 sm:px-6 lg:px-8 xl:px-10">
        {children}
      </div>
    </section>
  );
}
