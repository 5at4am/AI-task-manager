import Section from '../layout/Section';

const STATS = [
  { value: '12K+',  label: 'Active users' },
  { value: '2.4M',  label: 'Tasks completed' },
  { value: '98%',   label: 'Uptime SLA' },
  { value: '4.9★',  label: 'App store rating' },
];

export default function Stats() {
  return (
    <Section className="bg-white dark:bg-void-800 py-16">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 divide-x divide-violet-200 dark:divide-violet-600/20">
        {STATS.map(({ value, label }, i) => (
          <div key={i} className="flex flex-col items-center justify-center py-8 px-6 text-center">
            <span className="text-5xl font-extrabold text-text-heading dark:text-mist-100 mb-2">
              {value}
            </span>
            <span className="text-sm text-text-secondary dark:text-mist-500">{label}</span>
          </div>
        ))}
      </div>
    </Section>
  );
}
