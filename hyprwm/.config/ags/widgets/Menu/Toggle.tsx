import ToggleButton from '../../components/ToggleButton'
import {setMenuState, menuState} from './Main'

const MenuToggle = () => {
    return (
        <ToggleButton
            onClick={(_) => {
                setMenuState()
            }}
            state={menuState()}
            className="menu_toggle"
        >
            󰼁
        </ToggleButton>
    )
}

export default MenuToggle
