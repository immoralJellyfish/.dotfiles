import {Astal, Gdk, Gtk} from 'astal/gtk3'
import AstalTray from 'gi://AstalTray?version=0.1'
import {bind, Variable} from '../../../../../../../../../usr/share/astal/gjs'
import PopupWindow, {
    closeAllWindows,
    LayoutOptions,
    Padding,
} from '../../components/PopupWindow'
import ToggleButton from '../../components/ToggleButton'
import {trayItemShownIds} from '../../lib/Variables'

const TrayServices = AstalTray.get_default()

export const trayItems = bind(TrayServices, 'items')
export const shownTrayItems = trayItems.as((items) => {
    return items.filter((item) =>
        trayItemShownIds.includes(item.id.toLowerCase()),
    )
})

export const systemTrayState = Variable(false)
export const setSystemTrayState = (state?: boolean) =>
    systemTrayState.set(
        typeof state !== 'undefined' ? state : !systemTrayState.get(),
    )

export const SystemTrayItem = ({item}: {item: AstalTray.TrayItem}) => {
    const menu = item.create_menu()

    return (
        <ToggleButton
            className="systemtray_item"
            tooltipText={bind(item, 'tooltipMarkup')}
            onDestroy={() => menu?.destroy}
            valign={Gtk.Align.CENTER}
            onClick={(self, e) => {
                const click = e.button

                if (click === Astal.MouseButton.PRIMARY) {
                    setSystemTrayState(false)
                    item.activate(0, 0)
                    return
                }

                menu?.popup_at_widget(
                    self,
                    Gdk.Gravity.SOUTH,
                    Gdk.Gravity.NORTH,
                    null,
                )
            }}
        >
            <icon icon={bind(item, 'iconName')} />
        </ToggleButton>
    )
}

export default function SystemTray() {
    const items = bind(
        trayItems
            .as((items) => {
                return items.filter(
                    (item) => !trayItemShownIds.includes(item.id.toLowerCase()),
                )
            })
            .as((items) => {
                let tray_items = []

                while (items.length > 0) {
                    tray_items.push(items.splice(0, 4))
                }

                return tray_items
            }),
    )

    return (
        <PopupWindow
            name="systemtray"
            namespace="systemtray"
            layout={LayoutOptions.SOUTH}
            state={systemTrayState}
        >
            <box>
                <Padding
                    vexpand={false}
                    onClick={() => {
                        setSystemTrayState(false)
                        closeAllWindows()
                    }}
                />
                <box
                    className="system_tray"
                    valign={Gtk.Align.START}
                    halign={Gtk.Align.END}
                    vertical={true}
                >
                    {items.as((items) => {
                        return items.map((item_row) => (
                            <box>
                                {item_row.map((item) => (
                                    <SystemTrayItem item={item} />
                                ))}
                            </box>
                        ))
                    })}
                </box>
            </box>
        </PopupWindow>
    )
}
