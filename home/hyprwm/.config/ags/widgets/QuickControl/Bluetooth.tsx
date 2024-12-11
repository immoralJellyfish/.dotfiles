import {Gtk} from 'astal/gtk3'
import AstalBluetooth from 'gi://AstalBluetooth'
import {
    bind,
    execAsync,
    Variable,
} from '../../../../../../../../../usr/share/astal/gjs'
import PopupWindow, {
    closeAllWindows,
    LayoutOptions,
    Padding,
} from '../../components/PopupWindow'
import ToggleButton from '../../components/ToggleButton'
import {setQuickControlState} from './Main'

export const bluetoothControlState = Variable(false)
export const setBluetoothControlState = (state?: boolean) =>
    bluetoothControlState.set(
        typeof state !== 'undefined' ? state : !bluetoothControlState.get(),
    )

let BluetoothService: AstalBluetooth.Bluetooth | null

try {
    BluetoothService = AstalBluetooth.get_default()
} catch (_) {
    BluetoothService = null
}

const Bluetooth = (props: {bluetoothDevice: AstalBluetooth.Device}) => {
    const {bluetoothDevice} = props
    const {address} = bluetoothDevice

    return (
        <ToggleButton
            className="list_item bluetooth_device"
            state={bind(bluetoothDevice, 'connected')}
            onClick={() => {
                if (bluetoothDevice.connected) {
                    return execAsync([
                        'bash',
                        '-c',
                        `bluetoothctl disconnect ${address}`,
                    ])
                }

                execAsync(['bash', '-c', `bluetoothctl connect ${address}`])
            }}
        >
            <box>
                <label
                    className="icon"
                    label={bind(bluetoothDevice, 'connected').as(
                        (connected) => {
                            return connected ? '󰂱' : '󰂯'
                        },
                    )}
                />

                <label
                    label={bind(bluetoothDevice, 'name')}
                    className="name"
                    truncate
                    hexpand
                    xalign={0}
                    maxWidthChars={16}
                />

                <label
                    halign={Gtk.Align.END}
                    label={bind(
                        Variable.derive(
                            [
                                bind(bluetoothDevice, 'connected'),
                                bind(bluetoothDevice, 'connecting'),
                            ],
                            (connected, connecting) => {
                                return connected ? '' : connecting ? '' : ''
                            },
                        ),
                    )}
                />

                <label
                    halign={Gtk.Align.END}
                    label={bind(bluetoothDevice, 'paired').as((paired) =>
                        paired ? '' : '',
                    )}
                />
            </box>
        </ToggleButton>
    )
}

const BluetoothControl = () => {
    return (
        <PopupWindow
            name="bluetooth-control"
            state={bluetoothControlState}
            layout={LayoutOptions.SOUTHEAST}
        >
            <box>
                <Padding
                    vexpand={false}
                    onClick={() => {
                        setBluetoothControlState(false)
                        closeAllWindows()
                    }}
                />
                <box
                    className="control_list bluetooth_control"
                    vertical
                    hexpand={false}
                >
                    <box className="head">
                        <button
                            className="back"
                            onClick={() => {
                                setQuickControlState(true)
                                setBluetoothControlState(false)
                            }}
                        >
                            
                        </button>
                        <box hexpand />
                        <label
                            label={
                                !BluetoothService?.adapter
                                    ? 'Bluetooth'
                                    : bind(
                                          BluetoothService.adapter,
                                          'discovering',
                                      ).as((discovering) =>
                                          discovering
                                              ? 'Scanning'
                                              : 'Bluetooth',
                                      )
                            }
                        />
                        <box hexpand />
                        <button
                            className="setting"
                            onClick={() => {
                                setQuickControlState(false)
                                setBluetoothControlState(false)
                                closeAllWindows()
                                execAsync(['bash', '-c', 'blueman-manager'])
                            }}
                        >
                            󰒓
                        </button>
                        <button
                            className="scan"
                            onClick={() => {
                                if (BluetoothService) {
                                    BluetoothService.adapter.start_discovery()
                                    setTimeout(
                                        () => {
                                            BluetoothService.adapter.stop_discovery()
                                        },
                                        1000 * 60 * 5,
                                    )
                                }
                            }}
                        >
                            󰑐
                        </button>
                    </box>

                    <scrollable>
                        <box vertical vexpand={false}>
                            {!BluetoothService ? (
                                <label
                                    vexpand={true}
                                    label="No bluetooth device available"
                                />
                            ) : (
                                bind(BluetoothService, 'devices').as(
                                    (devices) => {
                                        if (devices.length === 0) {
                                            return (
                                                <label
                                                    vexpand={true}
                                                    label="No bluetooth device available"
                                                />
                                            )
                                        }

                                        return devices.map((device) => (
                                            <Bluetooth
                                                bluetoothDevice={device}
                                            />
                                        ))
                                    },
                                )
                            )}
                        </box>
                    </scrollable>
                </box>
            </box>
        </PopupWindow>
    )
}

export default BluetoothControl
