import { useTranslation } from "react-i18next";
import Select from "../Select";
import { ButtonStyle } from "../Button";
import { Action, State } from "../../App";
import { Menu, TopMenu } from "../../models/menu";
import { useEffect, useMemo } from "react";


interface Props {
    selectedHobbyId: number | null,
    state: State,
    dispatch: React.Dispatch<Action>,
}

export function MainPage({
    selectedHobbyId,
    state,
    dispatch,
}: Props) {
    const [t] = useTranslation();


  const mainTopMenu = useMemo(() => new TopMenu(Menu.main, [{
    id: "start",
    title: t("app.start"),
    style: ButtonStyle.Primary,
    enabled: true,
    onClick: () => dispatch({ type: 'TIMER_START' })
  }]), [dispatch, t]);

  useEffect(() => {
    dispatch({ type: 'TOP_MENU_INSTALL', topMenu: mainTopMenu });
  }, [dispatch, mainTopMenu]);

    return (
        <div>
            <label>{t('app.whatWillDo')}</label>
            <br/>
            <Select 
                items={  state.server.hobbies.map(item => ({ id: item.id, name: item.name }))} 
                defaultTitle={t('app.selectHobby')}
                active={selectedHobbyId}
                onChange={ value => {dispatch({ type: 'MENU_SELECT_HOBBY', id: value});}}            
            />
        </div>
    );
}