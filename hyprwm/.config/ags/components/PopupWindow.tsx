import {Astal, Gdk, Gtk} from 'astal/gtk3'
import {Variable} from '../../../../../../../../usr/share/astal/gjs'
import {
    BoxProps,
    EventBoxProps,
    WindowProps,
} from '../../../../../../../../usr/share/astal/gjs/gtk3/widget'

export const windowStates: Variable<boolean>[] = []
export const closeAllWindows = () => {
    for (const windowState of windowStates) {
        windowState.set(false)
    }
}

export enum LayoutOptions {
    NORTH,
    NORTHEAST,
    EAST,
    SOUTHEAST,
    SOUTH,
    SOUTHWEST,
    WEST,
    NORTHWEST,
    CENTER,
}

export interface PopupWindowProps extends WindowProps {
    name: string
    namespace?: string
    child?: Gtk.Widget
    state: Variable<boolean>
    layout: LayoutOptions
}

export interface LayoutProps extends BoxProps {
    close: () => void
}

export const Padding = (props: EventBoxProps) => (
    <eventbox
        onClick={props.onClick}
        className="padding"
        hexpand={true}
        vexpand={true}
        {...props}
    />
)

const getLayout = (layout: LayoutOptions) => {
    const layouts = [
        (props: LayoutProps) => (
            <box>
                <Padding onClick={props.close} />
                <box vertical={true}>
                    {props.child}
                    <Padding onClick={props.close} />
                    <Padding onClick={props.close} />
                </box>
                <Padding onClick={props.close} />
            </box>
        ),
        (props: LayoutProps) => (
            <box>
                <Padding onClick={props.close} />
                <Padding onClick={props.close} />
                <box vertical={true}>
                    {props.child}
                    <Padding onClick={props.close} />
                    <Padding onClick={props.close} />
                </box>
            </box>
        ),
        (props: LayoutProps) => (
            <box>
                <Padding onClick={props.close} />
                <Padding onClick={props.close} />
                <box vertical={true}>
                    <Padding onClick={props.close} />
                    {props.child}
                    <Padding onClick={props.close} />
                </box>
            </box>
        ),
        (props: LayoutProps) => (
            <box>
                <Padding onClick={props.close} />
                <Padding onClick={props.close} />
                <box vertical={true}>
                    <Padding onClick={props.close} />
                    <Padding onClick={props.close} />
                    {props.child}
                </box>
            </box>
        ),
        (props: LayoutProps) => (
            <box>
                <Padding onClick={props.close} />
                <box vertical={true}>
                    <Padding onClick={props.close} />
                    <Padding onClick={props.close} />
                    {props.child}
                </box>
                <Padding onClick={props.close} />
            </box>
        ),
        (props: LayoutProps) => (
            <box>
                <box vertical={true}>
                    <Padding onClick={props.close} />
                    <Padding onClick={props.close} />
                    {props.child}
                </box>
                <Padding onClick={props.close} />
                <Padding onClick={props.close} />
            </box>
        ),
        (props: LayoutProps) => (
            <box>
                <box vertical={true}>
                    <Padding onClick={props.close} />
                    {props.child}
                    <Padding onClick={props.close} />
                </box>
                <Padding onClick={props.close} />
                <Padding onClick={props.close} />
            </box>
        ),
        (props: LayoutProps) => (
            <box>
                <box vertical={true}>
                    {props.child}
                    <Padding onClick={props.close} />
                    <Padding onClick={props.close} />
                </box>
                <Padding onClick={props.close} />
                <Padding onClick={props.close} />
            </box>
        ),
        (props: LayoutProps) => (
            <box>
                <Padding onClick={props.close} />
                <box vertical={true}>
                    <Padding onClick={props.close} />
                    {props.child}
                    <Padding onClick={props.close} />
                </box>
                <Padding onClick={props.close} />
            </box>
        ),
    ]

    return layouts[layout]
}

export default function PopupWindow(props: PopupWindowProps) {
    const {
        child,
        layout = LayoutOptions.CENTER,
        state = false,
        namespace = 'popup_window',
        setup,
    } = props

    const innerState = Variable(state instanceof Variable ? state.get() : state)

    const close = () => {
        innerState.set(false)

        if (state instanceof Variable) {
            state.set(false)
        }

        closeAllWindows()
    }

    const Layout = getLayout(layout)

    return (
        <window
            namespace={`${namespace ? namespace : props.name}`}
            keymode={Astal.Keymode.ON_DEMAND}
            layer={Astal.Layer.TOP}
            exclusivity={Astal.Exclusivity.EXCLUSIVE}
            anchor={
                Astal.WindowAnchor.TOP |
                Astal.WindowAnchor.BOTTOM |
                Astal.WindowAnchor.LEFT |
                Astal.WindowAnchor.RIGHT
            }
            onKeyPressEvent={(_, e) => {
                if (e.get_keyval()[1] === Gdk.KEY_Escape) close()
            }}
            setup={(self) => {
                setup?.(self)

                self.visible = innerState.get()
                self.hook(innerState, () => {
                    self.visible = innerState.get()
                })

                if (state instanceof Variable) {
                    self.hook(state, () => innerState.set(state.get()))
                    windowStates.push(state)
                }
            }}
            {...props}
        >
            <Layout close={close}>{child}</Layout>
        </window>
    )
}
