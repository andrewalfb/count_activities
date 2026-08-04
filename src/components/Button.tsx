

export enum ButtonStyle {
    Primary = 0,
    Second,
    Icon
}

interface Props {
    title: string,
    style?: ButtonStyle,
    onClick?: () => void,
    buttonType?: 'button' | 'submit' | 'reset'
    enabled?: boolean,
    icon?: React.FC<{ size?: number; color?: string}>;
}

export default function Button({ 
    title, 
    style: type = ButtonStyle.Primary, 
    onClick,
    buttonType = 'button',
    enabled = true,
    icon: Icon,
 }: Props) {

    const className =
        type === ButtonStyle.Primary
        ? "btn btnPrimary"
        : type === ButtonStyle.Icon
            ? "btn btnIconOnly"
            : "btn btnSecondary";

    return (
           <button
                className={className} 
                onClick={onClick}
                type={buttonType}
                disabled={!enabled}
            >
                { Icon ? (
                    <Icon />
                ) : (
                    title
                )}
            </button>   

    );
}