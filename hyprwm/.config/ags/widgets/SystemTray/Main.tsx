import {Gtk} from 'astal/gtk3'
import AstalTray from 'gi://AstalTray'
import {bind, Variable} from '../../../../../../../../../usr/share/astal/gjs'
import PopupWindow, {
    closeAllWindows,
    LayoutOptions,
    Padding,
} from '../../components/PopupWindow'
import {trayItemShownIds} from '../../lib/Variables'

const TrayServices = AstalTray.get_default()

export const trayItems = bind(TrayServices, 'items')

export const systemTrayState = Variable(false)
export const setSystemTrayState = (state?: boolean) =>
    systemTrayState.set(
        typeof state !== 'undefined' ? state : !systemTrayState.get(),
    )

export const SystemTrayItem = ({item}: {item: AstalTray.TrayItem}) => {
    return (
        <menubutton
            className="systemtray_item"
            tooltipText={bind(item, 'tooltipMarkup')}
            valign={Gtk.Align.CENTER}
            tooltipMarkup={bind(item, 'tooltipMarkup')}
            usePopover={false}
            actionGroup={bind(item, 'actionGroup').as((ag) => ['dbusmenu', ag])}
            menuModel={bind(item, 'menuModel')}
        >
            <icon icon={bind(item, 'iconName')} />
        </menubutton>
    )
}

export default function SystemTray() {
    const items = bind(
        trayItems
            .as((items) => {
                return items.filter(
                    (item) =>
                        item.id &&
                        !trayItemShownIds.includes(item.id.toLowerCase()),
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
