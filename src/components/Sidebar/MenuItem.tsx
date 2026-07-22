type MenuRowProps = {
  icon: React.FC<{ size?: number; color?: string }>;
  label: string;
  active?: boolean;
  onClick: (e: React.MouseEvent) => void;
};

export function MenuItem({ 
  icon: Icon, 
  label, 
  active, 
  onClick, 
}: MenuRowProps) {
  return (
    <div
      role="button"
      onClick={onClick}
      className={`menuItem ${active ? "menuItemActive" : "menuItemInactive"}`}
    >
      {active && <div className="menuItemActiveBar" />}

      <div className="menuItemContent">
        {/* Icon should use currentColor internally */}
        <Icon size={20} />
        <label>{label}</label>
      </div>
    </div>
  );
}
