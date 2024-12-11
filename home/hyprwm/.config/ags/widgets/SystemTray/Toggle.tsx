import { Gtk } from 'astal/gtk3'
import { bind, Variable } from '../../../../../../../../../usr/share/astal/gjs'
import ToggleButton from '../../components/ToggleButton'
import {
    setSystemTrayState as setSystemTrayState,
    shownTrayItems,
    SystemTrayItem,
    systemTrayState,
    trayItems,
} from './Main'

const SystemTrayToggle = () => {
    return (
        <box
            className="systemtray_toggle"
            visible={trayItems.as((ti) => ti.length > 0)}
            valign={Gtk.Align.CENTER}
        >
            <ToggleButton
                className="toggle"
                valign={Gtk.Align.CENTER}
                onClick={() => setSystemTrayState()}
                state={systemTrayState()}
            >
                
            </ToggleButton>
            {bind(
                Variable.derive([trayItems, shownTrayItems], (ti, sti) => {
                    if (sti.length <= 0) {
                        return ti
                            .slice(0, 3)
                            .map((item) => <SystemTrayItem item={item} />)
                    }

                    return sti.map((item) => <SystemTrayItem item={item} />)
                })
            )}
        </box>
    )
}

export default SystemTrayToggle
