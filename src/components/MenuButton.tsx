interface Prop {
    onClick: () => void,
    isActive: boolean,
    children: React.ReactNode
}

export default function MenuButton({ onClick, children, isActive }: Prop) {
  if (isActive) {
    return <b>{children}</b>
  }

  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
