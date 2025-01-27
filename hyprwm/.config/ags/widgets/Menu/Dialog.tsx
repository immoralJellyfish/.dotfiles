import {Gtk} from 'astal/gtk3'
import {Variable} from '../../../../../../../../../usr/share/astal/gjs'
import PopupWindow, {
    closeAllWindows,
    LayoutOptions,
    Padding,
} from '../../components/PopupWindow'

export const dialogState = Variable(false)
export const setDialogState = (state: boolean) =>
    dialogState.set(state ? state : !dialogState.get())

export const dialogContent = Variable<{summary: string; desc: string}>({
    summary: '',
    desc: '',
})
export const dialogConfirm = Variable<(self: Gtk.Button) => void>(() => {})

function cancel() {
    setDialogState(false)
    dialogConfirm.set(() => {})
}

export default function Dialog() {
    return (
        <PopupWindow
            state={dialogState}
            layout={LayoutOptions.NORTH}
            name="dialog"
            namespace="dialog"
        >
            <box vertical>
                <Padding
                    onClick={() => {
                        setDialogState(false)
                        closeAllWindows()
                    }}
                />
                <box
                    className="dialog"
                    vertical
                    valign={Gtk.Align.END}
                    halign={Gtk.Align.CENTER}
                    hexpand={false}
                >
                    <label
                        className="summary"
                        label={dialogContent((content) => content.summary)}
                        visible={dialogContent(
                            (content) => content.summary !== '',
                        )}
                        wrap
                        halign={Gtk.Align.CENTER}
                        useMarkup
                    />
                    <label
                        className="desc"
                        label={dialogContent((content) => content.desc)}
                        visible={dialogContent(
                            (content) => content.desc !== '',
                        )}
                        maxWidthChars={36}
                        wrap
                        halign={Gtk.Align.CENTER}
                        useMarkup
                    />

                    <box hexpand={false} className="action" spacing={6}>
                        <button
                            hexpand
                            className="confirm"
                            onClick={(self) => {
                                dialogConfirm.get()(self)
                                cancel()
                            }}
                        >
                            Confirm
                        </button>
                        <button hexpand onClick={cancel} className="cancel">
                            Cancel
                        </button>
                    </box>
                </box>
                <Padding
                    hexpand={false}
                    onClick={() => {
                        setDialogState(false)
                        closeAllWindows()
                    }}
                />
            </box>
        </PopupWindow>
    )
}
