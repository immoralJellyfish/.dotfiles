import {Gtk} from 'astal/gtk3'
import {Variable} from '../../../../../../../../../usr/share/astal/gjs'
import PopupWindow, {
    closeAllWindows,
    LayoutOptions,
    Padding,
} from '../../components/PopupWindow'
import MprisPlayers from './Mpris'
import NotificationCenter from './NotificationCenter'

export const stateDashboard = Variable<boolean>(false)
export const setStateDashboard = (state?: boolean) =>
    stateDashboard.set(
        typeof state !== 'undefined' ? state : !stateDashboard.get(),
    )

export default function Dashboard() {
    return (
        <PopupWindow
            name="dashboard"
            namespace="dashboard"
            layout={LayoutOptions.SOUTH}
            state={stateDashboard}
        >
            <box>
                <Padding
                    vexpand={false}
                    onClick={() => {
                        setStateDashboard(false)
                        closeAllWindows()
                    }}
                />
                <box
                    halign={Gtk.Align.CENTER}
                    hexpand={false}
                    className="dashboard"
                >
                    <NotificationCenter />
                    <box className="separator" vexpand />
                    <MprisPlayers />
                </box>
                <Padding
                    vexpand={false}
                    onClick={() => {
                        setStateDashboard(false)
                        closeAllWindows()
                    }}
                />
            </box>
        </PopupWindow>
    )
}
