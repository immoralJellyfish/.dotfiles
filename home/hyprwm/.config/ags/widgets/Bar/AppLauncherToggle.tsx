import {execAsync} from '../../../../../../../../../usr/share/astal/gjs'
import ToggleButton from '../../components/ToggleButton'

const AppLauncherToggle = () => {
    return (
        <ToggleButton
            onClick={() =>
                execAsync(['bash', '-c', 'killall anyrun || anyrun'])
            }
            className="applauncher_toggle"
        >
            
        </ToggleButton>
    )
}

export default AppLauncherToggle
