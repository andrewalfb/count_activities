import { useTranslation } from "react-i18next";
import Select from "../Select";
import { OnToolbarChange } from "../../types/toolbar";
import { useEffect } from "react";
import { ButtonStyle } from "../Button";
import { State } from "../../App";


interface Props {
    selectedHobbyId: number | null,
    state: State,
    onSelectedHobbyIdChange: React.Dispatch<React.SetStateAction<number | null>>,
    dispatch: React.Dispatch<any>,
    onToolbarChange: OnToolbarChange,
}

export function MainPage({
    selectedHobbyId,
    state,
    onSelectedHobbyIdChange,
    dispatch,
    onToolbarChange,
}: Props) {
    const [t] = useTranslation();

useEffect(() => {
    onToolbarChange({
      actions: [
            {
              id: "start",
              title: t("app.start"),
              style: ButtonStyle.Primary,
              enabled: selectedHobbyId != null,
              onClick: () => dispatch({ type: 'TIMER_START'})
            },
          ]
    });
  }, [selectedHobbyId, onToolbarChange, dispatch, t]);


    return (
        <div>
            <label>{t('app.whatWillDo')}</label>
            <br/>
            <Select 
                items={  state.server.hobbies.map(item => ({ id: item.id, name: item.name }))} 
                defaultTitle={t('app.selectHobby')}
                active={selectedHobbyId}
                onChange={ value => {onSelectedHobbyIdChange(value);}}            
            />
        </div>
    );
}