const ITEMS = [
  { label: 'Barato', color: 'bg-green' },
  { label: 'Normal', color: 'bg-yellow' },
  { label: 'Alto', color: 'bg-orange' },
  { label: 'Caro', color: 'bg-red' },
];

export default function Legend() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-4 flex-wrap">
        {ITEMS.map((item) => (
          <div key={item.label} className="flex items-center gap-1.5 text-xs text-muted">
            <span className={`w-2.5 h-2.5 rounded-full ${item.color} opacity-80`} />
            {item.label}
          </div>
        ))}
      </div>
      <p className="text-xs text-muted2">
        Clique em um dia para ver os voos disponíveis naquela data.
      </p>
    </div>
  );
}
