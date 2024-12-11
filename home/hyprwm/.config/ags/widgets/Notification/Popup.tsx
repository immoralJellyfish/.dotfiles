import { Binding, GLib } from 'astal'
import { Astal, Gtk } from 'astal/gtk3'
import { type EventBox } from 'astal/gtk3/widget'
import AstalNotifd from 'gi://AstalNotifd'

const isIcon = (icon: string) => !!Astal.Icon.lookup_icon(icon)

const fileExists = (path: string) => GLib.file_test(path, GLib.FileTest.EXISTS)

const time = (time: number, format = '%H:%M') =>
    GLib.DateTime.new_from_unix_local(time).format(format)!

const urgency = (n: AstalNotifd.Notification) => {
    const { LOW, NORMAL, CRITICAL } = AstalNotifd.Urgency
    // match operator when?
    switch (n.urgency) {
        case LOW:
            return 'low'
        case CRITICAL:
            return 'critical'
        case NORMAL:
        default:
            return 'normal'
    }
}

type NotificationProps = {
    setup?: (self: EventBox) => void
    onHoverLost?: (self: EventBox) => void
    halign?: Gtk.Align
    valign?: Gtk.Align
    bodyTruncate?: boolean
    notification: AstalNotifd.Notification
}

const NotificationPopup = (props: NotificationProps) => {
    const {
        notification: n,
        halign,
        valign,
        bodyTruncate = false,
        onHoverLost,
        setup,
    } = props
    const { START, CENTER, END } = Gtk.Align

    let actions: AstalNotifd.Action[][] = []
    let start = 0
    let end = 2

    let nactions = n.get_actions()
    let row = (start: number, end: number) => nactions.slice(start, end)

    while (row(start, end).length > 0) {
        actions.push(row(start, end))

        start += 2
        end += 2
    }

    return (
        <eventbox
            className={`notification_popup ${urgency(n)}`}
            setup={(self) => {
                if (!setup) return

                setup(self)
            }}
            onHoverLost={(self) => {
                if (!onHoverLost) return
                onHoverLost(self)
            }}
            halign={halign}
            valign={valign}
        >
            <box vertical>
                <box className="header">
                    {(n.appIcon || n.desktopEntry) && (
                        <icon
                            className="app-icon"
                            visible={Boolean(n.appIcon || n.desktopEntry)}
                            icon={n.appIcon || n.desktopEntry}
                        />
                    )}
                    <label
                        className="app-name"
                        halign={START}
                        maxWidthChars={16}
                        truncate
                        label={n.appName || 'Unknown'}
                    />
                    <label
                        className="time"
                        hexpand
                        halign={END}
                        label={time(n.time)}
                    />
                    <button
                        className="close"
                        valign={CENTER}
                        onClicked={() => n.dismiss()}
                    >
                        <label label="" />
                    </button>
                </box>
                <box className="content">
                    {n.image && fileExists(n.image) && (
                        <box
                            valign={START}
                            className="image"
                            css={`
                                background-image: url('${n.image}');
                            `}
                        />
                    )}
                    {n.image && isIcon(n.image) && (
                        <box
                            expand={false}
                            valign={START}
                            className="icon-image"
                        >
                            <icon
                                icon={n.image}
                                expand
                                halign={CENTER}
                                valign={CENTER}
                            />
                        </box>
                    )}
                    <box vertical>
                        <label
                            className="summary"
                            label={n.summary}
                            halign={START}
                            xalign={0}
                            maxWidthChars={18}
                            truncate
                            useMarkup
                        />
                        {n.body && (
                            <label
                                className="body"
                                label={n.body}
                                halign={START}
                                xalign={0}
                                truncate={bodyTruncate}
                                wrap={!bodyTruncate}
                                justifyFill
                                useMarkup
                            />
                        )}
                    </box>
                </box>

                {n.get_actions().length > 0 && (
                    <box className="actions" vertical>
                        {actions.map((actionsRow) => {
                            return (
                                <box className="actions_row" spacing={6}>
                                    {actionsRow.map(({ label, id }) => (
                                        <button
                                            hexpand
                                            onClicked={() => {
                                                n.invoke(id)
                                                n.dismiss()
                                            }}
                                        >
                                            <label
                                                label={label}
                                                halign={CENTER}
                                                hexpand
                                                truncate
                                                maxWidthChars={8}
                                            />
                                        </button>
                                    ))}
                                </box>
                            )
                        })}
                    </box>
                )}
            </box>
        </eventbox>
    )
}

export default NotificationPopup
