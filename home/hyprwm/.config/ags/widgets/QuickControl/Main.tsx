import AstalBluetooth from 'gi://AstalBluetooth'
import AstalNetwork from 'gi://AstalNetwork'
import AstalWp from 'gi://AstalWp'
import {bind, Variable} from '../../../../../../../../../usr/share/astal/gjs'
import PopupWindow, {
    closeAllWindows,
    LayoutOptions,
    Padding,
} from '../../components/PopupWindow'
import {setBluetoothControlState} from './Bluetooth'
import Brightness from './Brightness'
import Microphone from './Microphone'
import {setNetworkControlState} from './Network'
import Speaker from './Speaker'
import {WifiIcon, WiredIcon} from './Toggle'

let NetworkService: AstalNetwork.Network | null
let WirePlumberService: AstalWp.Wp | null
let BluetoothService: AstalBluetooth.Bluetooth | null

try {
    NetworkService = AstalNetwork.get_default()
    WirePlumberService = AstalWp.get_default()
    BluetoothService = AstalBluetooth.get_default()
} catch (_) {
    NetworkService = null
    WirePlumberService = null
    BluetoothService = null
}

const WifiService = NetworkService && NetworkService.wifi
const WiredService = NetworkService && NetworkService.wired

export const quickControlState = Variable<boolean>(false)
export const setQuickControlState = (state?: boolean) =>
    quickControlState.set(
        typeof state !== 'undefined' ? state : !quickControlState.get(),
    )

const NetworkToggle = () => {
    const WifiSsid =
        WifiService &&
        bind(
            Variable.derive(
                [
                    bind(WifiService, 'enabled'),
                    bind(WifiService, 'internet'),
                    bind(WifiService, 'ssid'),
                ],
                (enabled, internet, ssid) => {
                    if (!enabled) return 'Disconnected'

                    return internet === AstalNetwork.Internet.CONNECTED
                        ? ssid
                        : 'Disconnected'
                },
            ),
        )

    const WiredDevice =
        WiredService &&
        bind(
            Variable.derive(
                [bind(WiredService, 'device'), bind(WiredService, 'state')],
                (device, wiredInternet) => {
                    return wiredInternet === AstalNetwork.DeviceState.ACTIVATED
                        ? device.interface
                        : 'Disconnected'
                },
            ),
        )

    return (
        <eventbox
            className="toggle network"
            setup={(self) => {
                if (!NetworkService)
                    return self.toggleClassName('active', false)

                self.hook(bind(NetworkService, 'primary'), (self) => {
                    if (NetworkService.primary === AstalNetwork.Primary.WIFI) {
                        if (WifiService) {
                            self.toggleClassName('active', WifiService.enabled)
                            self.hook(bind(WifiService, 'enabled'), (self) => {
                                self.toggleClassName(
                                    'active',
                                    WifiService.enabled,
                                )
                            })
                        }

                        return null
                    }

                    if (NetworkService.primary === AstalNetwork.Primary.WIRED) {
                        if (WiredService) {
                            self.toggleClassName(
                                'active',
                                WiredService.state >=
                                    AstalNetwork.DeviceState.ACTIVATED,
                            )
                            self.hook(bind(WiredService, 'state'), (self) => {
                                self.toggleClassName(
                                    'active',
                                    WiredService.state >=
                                        AstalNetwork.DeviceState.ACTIVATED,
                                )
                            })

                            return null
                        }
                    }

                    self.hook(bind(NetworkService, 'state'), (self) => {
                        self.toggleClassName(
                            'active',
                            NetworkService.state >
                                AstalNetwork.State.CONNECTED_LOCAL,
                        )
                    })
                })

                if (NetworkService.primary === AstalNetwork.Primary.WIFI) {
                    if (WifiService) {
                        return self.toggleClassName(
                            'active',
                            WifiService.enabled,
                        )
                    }
                }

                if (NetworkService.primary === AstalNetwork.Primary.WIRED) {
                    if (WiredService) {
                        return self.toggleClassName(
                            'active',
                            WiredService.state >=
                                AstalNetwork.DeviceState.ACTIVATED,
                        )
                    }
                }

                self.toggleClassName(
                    'active',
                    NetworkService.state > AstalNetwork.State.CONNECTED_LOCAL,
                )
            }}
        >
            <box>
                <button
                    hexpand
                    onClick={() => {
                        if (WifiService) {
                            WifiService.enabled = !WifiService.enabled
                        }
                    }}
                >
                    <box vertical>
                        {NetworkService &&
                            bind(NetworkService, 'primary').as((primary) => {
                                if (primary === AstalNetwork.Primary.WIFI)
                                    return <WifiIcon />
                                if (primary === AstalNetwork.Primary.WIRED) {
                                    return <WiredIcon />
                                }

                                return (
                                    <label
                                        label={bind(NetworkService, 'state').as(
                                            (state) => {
                                                return state >
                                                    AstalNetwork.State
                                                        .CONNECTED_LOCAL
                                                    ? '󰣺'
                                                    : '󰣼'
                                            },
                                        )}
                                    />
                                )
                            })}

                        {!NetworkService ? (
                            <label
                                maxWidthChars={8}
                                truncate
                                label="Unavailabe"
                            />
                        ) : (
                            bind(NetworkService, 'primary').as((primary) => {
                                if (primary === AstalNetwork.Primary.WIFI) {
                                    return (
                                        <label
                                            truncate
                                            maxWidthChars={0}
                                            label={
                                                !WifiSsid
                                                    ? 'Unavailabe'
                                                    : WifiSsid
                                            }
                                        />
                                    )
                                }

                                if (primary === AstalNetwork.Primary.WIRED) {
                                    return (
                                        <label
                                            truncate
                                            maxWidthChars={0}
                                            label={
                                                !WiredDevice
                                                    ? 'Unavailable'
                                                    : WiredDevice
                                            }
                                        />
                                    )
                                }

                                return (
                                    <label
                                        truncate
                                        maxWidthChars={0}
                                        label={bind(NetworkService, 'state').as(
                                            (state) =>
                                                state >
                                                AstalNetwork.State
                                                    .CONNECTED_LOCAL
                                                    ? 'Connected'
                                                    : 'Disconnected',
                                        )}
                                    />
                                )
                            })
                        )}
                    </box>
                </button>
                <button
                    label=""
                    onClick={() => {
                        if (!WifiService) return null

                        if (!WifiService.enabled) {
                            return (WifiService.enabled = !WifiService.enabled)
                        }

                        setQuickControlState(false)
                        setNetworkControlState(true)

                        WifiService.scan()
                    }}
                />
            </box>
        </eventbox>
    )
}

const BluetoothToggle = () => {
    const BluetoothIcon = !BluetoothService
        ? '󰂲'
        : bind(
              Variable.derive(
                  [
                      bind(BluetoothService, 'isPowered'),
                      bind(BluetoothService, 'isConnected'),
                  ],
                  (_, connected) => {
                      return connected ? '󰂱' : '󰂯'
                  },
              ),
          )

    const BluetoothDevice = !BluetoothService
        ? 'Disconnected'
        : bind(
              Variable.derive(
                  [
                      bind(BluetoothService, 'isPowered'),
                      bind(BluetoothService, 'isConnected'),
                      bind(BluetoothService, 'devices'),
                  ],
                  (powered, connected, devices) => {
                      const connectedDevices = devices.filter(
                          (device) => device.connected,
                      )

                      return powered && connected
                          ? connectedDevices[0].name
                          : 'Disconnected'
                  },
              ),
          )

    return (
        <eventbox
            className="toggle bluetooth"
            setup={(self) => {
                if (BluetoothService) {
                    self.toggleClassName('active', BluetoothService.isPowered)
                    self.hook(bind(BluetoothService, 'isPowered'), (self) => {
                        self.toggleClassName(
                            'active',
                            BluetoothService.isPowered,
                        )
                    })
                }
            }}
        >
            <box hexpand>
                <button
                    hexpand
                    onClick={() => {
                        if (BluetoothService) {
                            BluetoothService.toggle()
                        }
                    }}
                >
                    <box vertical>
                        <label label={BluetoothIcon} />
                        <label
                            truncate
                            maxWidthChars={0}
                            label={BluetoothDevice}
                        />
                    </box>
                </button>
                <button
                    label=""
                    onClick={() => {
                        if (BluetoothService && BluetoothService.adapter) {
                            setQuickControlState(false)
                            setBluetoothControlState(true)
                        }
                    }}
                />
            </box>
        </eventbox>
    )
}

export default function QuickControl() {
    return (
        <PopupWindow
            name="quickcontrol"
            state={quickControlState}
            layout={LayoutOptions.SOUTHEAST}
        >
            <box>
                <Padding
                    vexpand={false}
                    onClick={() => {
                        setQuickControlState(false)
                        closeAllWindows()
                    }}
                />
                <box className="quickcontrol" vertical hexpand={false}>
                    <box className="toggler">
                        <NetworkToggle />
                        <BluetoothToggle />
                    </box>

                    <Speaker />
                    <Microphone />
                    <Brightness />
                </box>
            </box>
        </PopupWindow>
    )
}
