import {bind, Variable} from 'astal'
import AstalBluetooth from 'gi://AstalBluetooth'
import AstalNetwork from 'gi://AstalNetwork'
import {truncate} from '../../lib/helpers'
import {bluetoothIcons} from '../../lib/Variables'
import {networkSpeed} from '../../lib/networkSpeed'

let NetworkService: AstalNetwork.Network | null
let BluetoothService: AstalBluetooth.Bluetooth | null

try {
    BluetoothService = AstalBluetooth.get_default()
} catch (_) {
    NetworkService = null
    BluetoothService = null
}

const Indicator = () => {
    return (
        <box className="indicator">
            <label
                useMarkup
                onDestroy={networkSpeed.drop}
                label={networkSpeed((value) => {
                    const {upload} = value
                    const uploadDisplay =
                        upload > 1024
                            ? `${Math.round(upload / 1000)},${Math.round(Math.round(upload % 1000) / 100)}<small>MB</small>`
                            : `${Math.round(upload)}<small>KB</small>`

                    return ` ${uploadDisplay}/s`
                })}
            />
            <label
                useMarkup
                onDestroy={networkSpeed.drop}
                label={networkSpeed((value) => {
                    const {download} = value
                    const downloadDisplay =
                        download > 1024
                            ? `${Math.round(download / 1000)},${Math.round(Math.round(download % 1000) / 100)}<small>MB</small>`
                            : `${Math.round(download)}<small>KB</small>`

                    return ` ${downloadDisplay}/s`
                })}
            />
            {BluetoothService && (
                <label
                    visible={bind(BluetoothService, 'isConnected')}
                    tooltipText={bind(BluetoothService, 'devices').as(
                        (devices) => {
                            const connectedDevice = devices.filter((device) => {
                                return device.connected
                            })[0]

                            if (typeof connectedDevice === 'undefined') {
                                return bluetoothIcons.default
                            }

                            return (
                                connectedDevice &&
                                `${truncate(connectedDevice.alias)}`
                            )
                        },
                    )}
                    label={bind(
                        Variable.derive(
                            [
                                bind(BluetoothService, 'isConnected'),
                                bind(BluetoothService, 'isPowered'),
                                bind(BluetoothService, 'devices'),
                            ],
                            (connected, powered, devices) => {
                                const connectedDevice = devices.filter(
                                    (device) => {
                                        return device.connected
                                    },
                                )[0]

                                if (!powered) {
                                    return bluetoothIcons.disabled
                                }

                                if (typeof connectedDevice === 'undefined') {
                                    return bluetoothIcons.default
                                }

                                if (!connected) {
                                    return bluetoothIcons.default
                                }

                                if (
                                    !Object.keys(bluetoothIcons).includes(
                                        connectedDevice.icon,
                                    )
                                ) {
                                    return bluetoothIcons.default
                                }

                                return bluetoothIcons[connectedDevice.icon]
                            },
                        ),
                    )}
                />
            )}
        </box>
    )
}

export default Indicator
