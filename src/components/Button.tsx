

export enum ButtonStyle {
    Primary = 0,
    Second
}

interface Props {
    title: string,
    style?: ButtonStyle,
    onClick?: () => void,
    buttonType?: 'button' | 'submit' | 'reset'
}

export default function Button({ 
    title, 
    style: type = ButtonStyle.Primary, 
    onClick,
    buttonType = 'button'
 }: Props) {

    return (
        <>
        <button
            className={type === ButtonStyle.Primary ? 'btn btnPrimary' : 'btn'} 
            onClick={onClick}
            type={buttonType}
        >
            {title}
        </button>
        </>
    );
}