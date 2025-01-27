import {Gtk} from 'astal/gtk3'
import {bind, Variable} from '../../../../../../../../../usr/share/astal/gjs'
import ToggleButton from '../../components/ToggleButton'
import {
    setSystemTrayState,
    SystemTrayItem,
    systemTrayState,
    trayItems,
} from './Main'
import {trayItemShownIds} from '../../lib/Variables'

const shownTrayItems = trayItems.as((items) => {
    return items.filter(
        (item) => item.id && trayItemShownIds.includes(item.id.toLowerCase()),
    )
})

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
                {systemTrayState((state) => (state ? '' : ''))}
            </ToggleButton>
            {bind(
                Variable.derive([trayItems, shownTrayItems], (_, sti) => {
                    if (sti.length > 0) {
                        return sti.map((item) => <SystemTrayItem item={item} />)
                    }

                    return ''
                }),
            )}
        </box>
    )
}

export default SystemTrayToggle
