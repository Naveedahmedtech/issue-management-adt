const TemplateSidebar = ({
  templates,
  selected,
  onSelect,
}: {
  templates: any[];
  selected: any;
  onSelect: (entry: any) => void;
}) => (
  <aside className="space-y-2 sticky top-4 self-start max-h-[80vh] overflow-y-auto pr-1">
    {templates.map((entry) => (
      <button
        key={entry.id}
        onClick={() => onSelect(entry)}
        className={`w-full text-left px-3 py-2 rounded-md text-sm ${
          entry.id === selected?.id
            ? "bg-primary text-white"
            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
        }`}
      >
        {entry.template.name}
      </button>
    ))}
  </aside>
);

export default TemplateSidebar;
