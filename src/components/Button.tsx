

export enum ButtonType {
    btnPrimary = 0,
    btnSecond
}

interface Props {
    title: string,
    type?: ButtonType,
    onClick?: () => void,
    buttonType?: 'button' | 'submit' | 'reset'
}

export default function Button({ 
    title, 
    type = ButtonType.btnPrimary, 
    onClick,
    buttonType = 'button'
 }: Props) {

    return (
        <>
        <button
            className={type === ButtonType.btnPrimary ? 'btn btnPrimary' : 'btn '} 
            onClick={onClick}
            type={buttonType}
        >
            {title}
        </button>
        </>
    );
}