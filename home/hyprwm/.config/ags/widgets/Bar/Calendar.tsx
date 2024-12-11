import GLib from 'gi://GLib'
import {bind, Variable} from '../../../../../../../../../usr/share/astal/gjs'
import ToggleButton from '../../components/ToggleButton'
import {Gtk} from 'astal/gtk3'
import AstalNotifd from 'gi://AstalNotifd'
import {setStateDashboard, stateDashboard} from '../Dashboard/Main'

const date = Variable<string>('').poll(
    1000,
    () => GLib.DateTime.new_now_local().format('%A %d %b %Y')!,
)

const time = Variable<string>('').poll(
    1000,
    () => GLib.DateTime.new_now_local().format('%I:%M %p')!,
)

const NotificationService = AstalNotifd.get_default()

const Notification = () => {
    return (
        <box className="notification">
            <label
                className="icon"
                label={bind(NotificationService, 'dont_disturb').as((dnd) => {
                    return dnd ? '' : ''
                })}
            />
            <label
                className="count"
                label={bind(NotificationService, 'notifications').as(
                    (notifications) => {
                        const count = notifications.length
                        return count > 9 ? '9+' : count.toString()
                    },
                )}
                visible={bind(
                    Variable.derive(
                        [
                            bind(NotificationService, 'notifications'),
                            bind(NotificationService, 'dontDisturb'),
                        ],
                        (n, dnd) => {
                            return n.length > 0 && !dnd
                        },
                    ),
                )}
            />
        </box>
    )
}

const Calendar = () => {
    return (
        <ToggleButton
            className="calendar"
            onClick={() => setStateDashboard()}
            state={stateDashboard()}
        >
            <box>
                <label
                    valign={Gtk.Align.CENTER}
                    className="date"
                    onDestroy={() => date.drop()}
                    label={date()}
                />

                <label
                    valign={Gtk.Align.CENTER}
                    className="separator"
                    label=""
                />

                <label
                    valign={Gtk.Align.CENTER}
                    className="time"
                    onDestroy={() => time.drop()}
                    label={time()}
                />

                <Notification />
            </box>
        </ToggleButton>
    )
}

export default Calendar
