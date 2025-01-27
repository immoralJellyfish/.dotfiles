import {Variable, bind} from 'astal'
import {Astal, Gtk} from 'astal/gtk3'
import Notifd from 'gi://AstalNotifd'
import AstalNotifd from 'gi://AstalNotifd?version=0.1'
import NotificationPopup from './Popup'

const TIMEOUT_DELAY = 5000
const LIMIT_POPUP = 5

const NotificationService = Notifd.get_default()

export default function Notification() {
    const Notifications = Variable<AstalNotifd.Notification[]>([])
    const NotificationsMap = new Map<number, AstalNotifd.Notification>()

    const UpdateNotifications = () => {
        Notifications.set([...NotificationsMap.values()].reverse())
    }

    NotificationService.connect('notified', (_, id) => {
        const notification = NotificationService.get_notification(id)
        const notificationNotified = Notifications.get()

        if (notificationNotified.length >= LIMIT_POPUP) {
            const firstChildId =
                notificationNotified[notificationNotified.length - 1].id

            NotificationsMap.delete(firstChildId)
        }

        if (!NotificationService.dontDisturb) {
            NotificationsMap.set(id, notification)
            UpdateNotifications()
        }
    })

    NotificationService.connect('resolved', (_, id) => {
        NotificationsMap.delete(id)
        UpdateNotifications()
    })

    return (
        <window
            name="notification"
            namespace="notification"
            exclusivity={Astal.Exclusivity.EXCLUSIVE}
            anchor={Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.RIGHT}
            valign={Gtk.Align.END}
            layer={Astal.Layer.TOP}
        >
            <box vertical>
                {bind(Notifications).as((notifications) => {
                    return notifications.map((notification) => {
                        const expired = setTimeout(() => {
                            NotificationsMap.delete(notification.id)
                            UpdateNotifications()
                        }, TIMEOUT_DELAY)

                        return (
                            <NotificationPopup
                                notification={notification}
                                bodyTruncate
                                onDestroy={() => {
                                    expired.destroy()
                                }}
                            />
                        )
                    })
                })}
            </box>
        </window>
    )
}
