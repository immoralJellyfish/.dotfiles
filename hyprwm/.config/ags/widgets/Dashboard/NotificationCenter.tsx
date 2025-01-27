import {Gtk} from 'astal/gtk3'
import AstalNotifd from 'gi://AstalNotifd'
import {bind} from '../../../../../../../../../usr/share/astal/gjs'
import NotificationPopup from '../Notification/Popup'

const NotificationService = AstalNotifd.get_default()

const NotificationCenter = () => {
    return (
        <box className="notification_center" vertical>
            <box className="head">
                <label className="title" label="Notifications" />
                <box hexpand={true} />
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
            <scrollable vexpand={true}>
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

                            return notifications.map((n) => {
                                const expired = setTimeout(
                                    () => {
                                        n.dismiss()
                                    },
                                    1000 * 60 * 10 + 5000,
                                )

                                return (
                                    <NotificationPopup
                                        notification={n}
                                        bodyTruncate={false}
                                        onDestroy={() => {
                                            expired.destroy()
                                        }}
                                    />
                                )
                            })
                        },
                    )}
                </box>
            </scrollable>
        </box>
    )
}

export default NotificationCenter
