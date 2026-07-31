import { useTranslation } from "react-i18next";
import Select from "../Select";
import { ButtonStyle } from "../Button";
import { Menu, TopMenu } from "../../models/menu";
import { useEffect, useRef, useState } from "react";
import { Action, State } from "../../hooks/taskReducer";


interface Props {
    state: State,
    dispatch: React.Dispatch<Action>,
}

export function MainPage({
    state,
    dispatch,
}: Props) {
    const [t] = useTranslation();
    const tRef = useRef(t);

  const [mainTopMenu] = useState(() => new TopMenu(Menu.main, [{
    id: "start",
    getTitle: () => tRef.current('app.start'),
    style: ButtonStyle.Primary,
    active: false,
    onClick: () => dispatch({ type: 'TIMER_START' })
  }]));

  useEffect(() => {
    tRef.current = t;
  }, [t]);

  useEffect(() => {
    dispatch({ type: 'TOP_MENU_INSTALL', topMenu: mainTopMenu });
  }, [dispatch, mainTopMenu]);

    return (
        <div className="hobbyPage">
            <label>{t('app.whatWillDo')}</label>
            <Select 
                items={  state.server.hobbies.map(item => ({ id: item.id, name: item.name }))} 
                defaultTitle={t('app.selectHobby')}
                active={state.selectedItemId}
                onChange={ value => {dispatch({ type: 'MENU_SELECT_HOBBY', id: value});}}            
            />
        </div>
    );
}