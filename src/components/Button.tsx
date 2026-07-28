

export enum ButtonStyle {
    Primary = 0,
    Second
}

interface Props {
    title: string,
    style?: ButtonStyle,
    onClick?: () => void,
    buttonType?: 'button' | 'submit' | 'reset'
    enabled?: boolean
}

export default function Button({ 
    title, 
    style: type = ButtonStyle.Primary, 
    onClick,
    buttonType = 'button',
    enabled = true
 }: Props) {

    const className =
    type === ButtonStyle.Primary ? 'btn btnPrimary' :
    'btn btnSecondary';

    return (
           <button
                className={className} 
                onClick={onClick}
                type={buttonType}
                disabled={!enabled}
            >
                {title}
            </button>   

    );
}