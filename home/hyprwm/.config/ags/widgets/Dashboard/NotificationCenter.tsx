import AstalNotifd from 'gi://AstalNotifd'
import {bind, execAsync} from '../../../../../../../../../usr/share/astal/gjs'
import NotificationPopup from '../Notification/Popup'
import {Gtk} from 'astal/gtk3'

const NotificationService = AstalNotifd.get_default()

const NotificationCenter = () => {
    return (
        <box className="notification_center" vertical>
            <box className="head">
                <label className="title" label="Notifications" />
                <box hexpand={true} />
                <button
                    className="action"
                    tooltipText="Toggle dnd"
                    onClick={() =>
                        NotificationService.set_dont_disturb(
                            !NotificationService.dontDisturb,
                        )
                    }
                >
                    {bind(NotificationService, 'dont_disturb').as((dnd) => {
                        return !dnd ? '' : ''
                    })}
                </button>
                <button
                    className="action"
                    tooltipText="Clear Notifiaction"
                    onClick={() => {
                        const notifications =
                            NotificationService.get_notifications()

                        for (const notification of notifications) {
                            notification.dismiss()
                        }
                    }}
                >
                    󱏩
                </button>
            </box>
            <scrollable vexpand={true} vscroll={Gtk.PolicyType.AUTOMATIC}>
                <box vertical className="notifications">
                    {bind(NotificationService, 'notifications').as(
                        (notifications) => {
                            if (notifications.length <= 0)
                                return (
                                    <label
                                        vexpand
                                        halign={Gtk.Align.CENTER}
                                        valign={Gtk.Align.CENTER}
                                        label="Notification are empty"
                                    />
                                )

                            return notifications.map((n) => (
                                <NotificationPopup notification={n} />
                            ))
                        },
                    )}
                </box>
            </scrollable>
        </box>
    )
}

export default NotificationCenter
