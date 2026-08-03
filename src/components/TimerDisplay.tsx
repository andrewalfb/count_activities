import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import Button, { ButtonStyle } from "./Button";
import { formatTime } from "../utils/helpers";

interface Props {
  name: string;
  active: boolean;
  secondsPass: number;

  onStartClick: () => void;
  onStopClick: () => void;     // no value passed; parent already has the value
  onCloseClick: () => void;
  onResetClick: () => void;
}

export default function Timer({
  name,
  active,
  secondsPass,
  onStartClick,
  onStopClick,
  onCloseClick,
  onResetClick,
}: Props) {
  const [t] = useTranslation();

  const display = useMemo(() => formatTime(secondsPass), [secondsPass]);

  return (
    <div className="columnContent">
      <div className="timeDisplay">{display}</div>
      <div className="centerText">
        <i>{t("timer.timeFor", { name })}</i>
      </div>

      <div className="btn-wrap">
        <Button
          title={active ? t("timer.stop") : t("timer.start")}
          onClick={active ? onStopClick : onStartClick}
        />
        <Button
          title={t("timer.reset")}
          style={ButtonStyle.Second}
          onClick={onResetClick}
        />
        <Button
          title={t("common.close")}
          style={ButtonStyle.Second}
          onClick={onCloseClick}
        />
      </div>
    </div>
  );
}
