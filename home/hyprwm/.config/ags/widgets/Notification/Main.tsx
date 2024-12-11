import {Variable, bind, timeout} from 'astal'
import {type Subscribable} from 'astal/binding'
import {Astal, Gtk} from 'astal/gtk3'
import Notifd from 'gi://AstalNotifd'
import NotificationPopup from './Popup'

const TIMEOUT_DELAY = 5000
const LIMIT_POPUP = 5

export class NotifiationMap implements Subscribable {
    private map: Map<number, Gtk.Widget> = new Map()
    private var: Variable<Array<Gtk.Widget>> = Variable([])
    private notifiy() {
        this.var.set([...this.map.values()].reverse())
    }

    constructor() {
        const notifd = Notifd.get_default()

        notifd.connect('notified', (_, id) => {
            const firstItem = this.map.entries().next().value
            if (
                this.var.get().length > LIMIT_POPUP &&
                typeof firstItem !== 'undefined'
            )
                this.delete(firstItem[0])

            this.set(
                id,
                NotificationPopup({
                    notification: notifd.get_notification(id)!,
                    onHoverLost: () => this.delete(id),
                    halign: Gtk.Align.END,
                    valign: Gtk.Align.END,
                    bodyTruncate: true,
                    setup: () =>
                        timeout(TIMEOUT_DELAY, () => {
                            this.delete(id)
                        }),
                }),
            )
        })

        notifd.connect('resolved', (_, id) => {
            this.delete(id)
        })
    }

    private set(key: number, value: Gtk.Widget) {
        this.map.get(key)?.destroy()
        this.map.set(key, value)
        this.notifiy()
    }

    private delete(key: number) {
        this.map.get(key)?.destroy()
        this.map.delete(key)
        this.notifiy()
    }

    get() {
        return this.var.get()
    }

    subscribe(callback: (list: Array<Gtk.Widget>) => void) {
        return this.var.subscribe(callback)
    }
}

export default function Notification() {
    const notifs = new NotifiationMap()
    const {BOTTOM, RIGHT} = Astal.WindowAnchor

    return (
        <window
            className="notification"
            exclusivity={Astal.Exclusivity.NORMAL}
            anchor={RIGHT | BOTTOM}
            valign={Gtk.Align.END}
        >
            <box vertical>{bind(notifs)}</box>
        </window>
    )
}
