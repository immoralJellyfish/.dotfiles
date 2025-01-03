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
            layout={LayoutOptions.NORTHEAST}
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
                            valign={Gtk.Align.CENTER}
                            halign={Gtk.Align.CENTER}
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
                            valign={Gtk.Align.CENTER}
                            halign={Gtk.Align.CENTER}
                            className={
                                BluetoothService && BluetoothService.adapter
                                    ? bind(
                                          BluetoothService.adapter,
                                          'discovering',
                                      ).as((scanning) =>
                                          scanning ? 'scan active' : 'scan',
                                      )
                                    : 'scan'
                            }
                            onClick={() => {
                                if (
                                    BluetoothService &&
                                    BluetoothService.adapter
                                ) {
                                    BluetoothService.adapter.start_discovery()
                                }
                            }}
                        >
                            
                        </button>
                        <switch
                            className="switch"
                            valign={Gtk.Align.CENTER}
                            halign={Gtk.Align.CENTER}
                            state={
                                BluetoothService
                                    ? bind(BluetoothService, 'isPowered')
                                    : false
                            }
                            onButtonPressEvent={(_) => {
                                if (BluetoothService) {
                                    BluetoothService.toggle()
                                }
                            }}
                        />
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
                                                    label="No bluetooth device detected"
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
                    <button
                        className="setting"
                        onClick={() => {
                            execAsync(['bash', '-c', 'blueman-manager'])
                            setBluetoothControlState(false)
                            setQuickControlState(false)
                        }}
                    >
                        More Settings
                    </button>
                </box>
            </box>
        </PopupWindow>
    )
}

export default BluetoothControl
