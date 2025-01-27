import {Gtk} from 'astal/gtk3'
import GLib from 'gi://GLib?version=2.0'
import {
    exec,
    execAsync,
    Variable,
} from '../../../../../../../../../usr/share/astal/gjs'
import {EventBoxProps} from '../../../../../../../../../usr/share/astal/gjs/gtk3/widget'
import PopupWindow, {
    closeAllWindows,
    LayoutOptions,
    Padding,
} from '../../components/PopupWindow'
import {dialogConfirm, dialogContent, setDialogState} from './Dialog'
import {truncate} from '../../lib/helpers'

export const menuState = Variable(false)
export const setMenuState = (state?: boolean) =>
    menuState.set(typeof state !== 'undefined' ? state : !menuState.get())

export interface MenuItemProps extends EventBoxProps {
    label?: string
    keybind?: string
}

function openDialog(
    content: {summary: string; desc?: string},
    action: (self: Gtk.Button) => void = () => {},
) {
    const {summary = '', desc = ''} = content

    dialogContent.set({
        summary,
        desc,
    })
    dialogConfirm.set((self) => {
        action(self)
    })
    setMenuState(false)
    setDialogState(true)
}

const Line = () => <box className="line" />

const MenuItem = (props: MenuItemProps) => {
    return (
        <eventbox className="menu_item" {...props}>
            <box>
                <label
                    halign={Gtk.Align.START}
                    hexpand={true}
                    label={props.label}
                    maxWidthChars={24}
                    truncate={true}
                />
                {props.keybind ? (
                    <label
                        halign={Gtk.Align.END}
                        label={props.keybind}
                        maxWidthChars={24}
                        truncate={true}
                    />
                ) : null}
            </box>
        </eventbox>
    )
}

export default function Menu() {
    return (
        <PopupWindow
            layout={LayoutOptions.SOUTHWEST}
            name="menu"
            namespace="menu"
            state={menuState}
        >
            <box>
                <box
                    className="menu"
                    valign={Gtk.Align.START}
                    halign={Gtk.Align.START}
                    hexpand={false}
                    vertical={true}
                >
                    <box vertical={true} className="menu_group">
                        <MenuItem
                            label="About This PC"
                            onClick={() => {
                                execAsync([
                                    'bash',
                                    '-c',
                                    'kitty sh -c "fastfetch;exec $SHELL"',
                                ])
                                setMenuState(false)
                            }}
                        />
                        <MenuItem
                            keybind="󰘳 + 󱁐"
                            label="Applications"
                            onClick={() => {
                                execAsync([
                                    'bash',
                                    '-c',
                                    'wofi --show drun --prompt applications',
                                ])
                                setMenuState(false)
                            }}
                        />
                        <MenuItem
                            keybind="󰘳 + S"
                            label="Files"
                            onClick={() => {
                                execAsync([
                                    'bash',
                                    '-c',
                                    '$HOME/.scripts/hypr/workspace onworkspace 1 class:thunar thunar',
                                ])
                                setMenuState(false)
                            }}
                        />
                    </box>
                    <Line />
                    <box vertical={true} className="menu_group">
                        <MenuItem
                            onClick={() => {
                                openDialog(
                                    {
                                        summary: 'Suspend PC Now?',
                                    },
                                    () => {
                                        exec([
                                            'bash',
                                            '-c',
                                            'systemctl suspend --quiet',
                                        ])
                                    },
                                )
                            }}
                            label="Suspend"
                        />
                        <MenuItem
                            label="Reboot"
                            onClick={() => {
                                openDialog(
                                    {
                                        summary: 'Reboot PC Now?',
                                    },
                                    () => {
                                        exec([
                                            'bash',
                                            '-c',
                                            'systemctl reboot --quiet',
                                        ])
                                    },
                                )
                            }}
                        />
                        <MenuItem
                            label="Shutdown"
                            onClick={() => {
                                openDialog(
                                    {
                                        summary: 'Shutdown PC Now?',
                                    },
                                    () => {
                                        exec([
                                            'bash',
                                            '-c',
                                            'systemctl poweroff --quiet',
                                        ])
                                    },
                                )
                            }}
                        />
                    </box>
                    <Line />
                    <box vertical={true} className="menu_group">
                        <MenuItem
                            keybind="󰘳 + X"
                            label="Lock Screen"
                            onClick={() => {
                                execAsync([
                                    'bash',
                                    '-c',
                                    'loginctl lock-session',
                                ])
                                setMenuState(false)
                            }}
                        />
                        <MenuItem
                            label={`Log Out ${truncate(GLib.getenv('USER')!, 8)}`}
                            onClick={() => {
                                openDialog(
                                    {
                                        summary: `Log out from ${GLib.getenv('USER')}?`,
                                    },
                                    () => {
                                        execAsync([
                                            'bash',
                                            '-c',
                                            'hyprctl dispatch exit 0',
                                        ])
                                    },
                                )
                            }}
                        />
                    </box>
                </box>
                <Padding
                    vexpand={false}
                    hexpand={true}
                    onClick={() => {
                        closeAllWindows()
                        setMenuState(false)
                    }}
                />
            </box>
        </PopupWindow>
    )
}
