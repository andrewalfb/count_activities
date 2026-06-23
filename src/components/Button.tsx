

export enum ButtonType {
    btnPrimary = 0,
    btnSecond
}

interface Props {
    title: string,
    type?: ButtonType,
    onClick: () => void
}

export default function Button({ title, type = ButtonType.btnPrimary, onClick }: Props) {

    return (
        <>
        <button
            className={type === ButtonType.btnPrimary ? 'btn btnPrimary' : 'btn '} 
            onClick={onClick}
        >
            {title}
        </button>
        </>
    );
}