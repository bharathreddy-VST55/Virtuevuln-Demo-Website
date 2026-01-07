import type { FC } from 'react';

export const Counts: FC = () => {
  const counters = [
    { name: 'Hashira', value: 9 },
    { name: 'Demons Slain', value: 127 },
    { name: 'Breathing Styles', value: 14 },
    { name: 'Total Missions', value: 89 }
  ];

  return (
    <section id="counts" className="counts">
      <div className="container">
        <div className="row counters">
          {counters.map((counter, idx) => (
            <div className="col-lg-3 col-6 text-center" key={`counter-${idx}`}>
              <span data-toggle="counter-up">{counter.value}</span>
              <p>{counter.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Counts;
