import { useTranslation } from "react-i18next"

interface Props {
    name?: string
}

export function Spinner({
    name
}: Props) {
    const [t] = useTranslation();
    if (!name) name = t('spinner.title');

    return (
        <div className="loadingWrap">
            <div className="spinner" />
            <span>{name}</span>
        </div>
    )
}