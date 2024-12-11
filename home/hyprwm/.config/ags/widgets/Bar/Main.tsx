import {App, Astal, Gdk, Gtk} from 'astal/gtk3'
import MenuToggle from '../Menu/Toggle'
import QuickControlToggle from '../QuickControl/Toggle'
import SystemTrayToggle from '../SystemTray/Toggle'
import AppLauncherToggle from './AppLauncherToggle'
import Battery from './Battery'
import Calendar from './Calendar'
import SystemInfo from './SystemInfo'
import Workspace from './Workspace'

function BarPanel(monitor: Gdk.Monitor) {
    return (
        <window
            gdkmonitor={monitor}
            name="astal_bar"
            namespace="astal_bar"
            className="window_bar"
            exclusivity={Astal.Exclusivity.EXCLUSIVE}
            layer={Astal.Layer.BOTTOM}
            anchor={
                Astal.WindowAnchor.BOTTOM |
                Astal.WindowAnchor.LEFT |
                Astal.WindowAnchor.RIGHT
            }
        >
            <centerbox
                className="bar"
                vexpand={false}
                hexpand={false}
                valign={Gtk.Align.START}
            >
                <box halign={Gtk.Align.START}>
                    <MenuToggle />
                    <SystemInfo />
                </box>
                <box halign={Gtk.Align.CENTER}>
                    <Calendar />
                    <Workspace />
                    <SystemTrayToggle />
                </box>
                <box halign={Gtk.Align.END}>
                    <QuickControlToggle />
                    <Battery />
                    <AppLauncherToggle />
                </box>
            </centerbox>
        </window>
    )
}

export default function Bar() {
    const bars = new Map<Gdk.Monitor, Gtk.Widget>()

    // initialize
    for (const gdkmonitor of App.get_monitors()) {
        bars.set(gdkmonitor, BarPanel(gdkmonitor))
    }

    App.connect('monitor-added', (_, gdkmonitor) => {
        bars.set(gdkmonitor, BarPanel(gdkmonitor))
    })

    App.connect('monitor-removed', (_, gdkmonitor) => {
        bars.get(gdkmonitor)?.destroy()
        bars.delete(gdkmonitor)
    })
}
