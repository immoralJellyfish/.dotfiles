import {bind, Variable} from 'astal'
import AstalBluetooth from 'gi://AstalBluetooth'
import AstalNetwork from 'gi://AstalNetwork'
import {truncate} from '../../lib/helpers'

const update = Variable(0).poll(
    1000 * 60 * 10,
    ['bash', '-c', 'pacman -Qu | wc -l'],
    (out) => parseInt(out),
)

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
                visible={update((update_count) => update_count > 0)}
                tooltipMarkup={update(
                    (update_count) => `${update_count} Updates availabe`,
                )}
                label={update(
                    (update_count) =>
                        `${update_count > 9 ? '9+' : update_count.toString()} 󰇚`,
                )}
                onDestroy={update.drop}
            />
            {BluetoothService && (
                <label
                    tooltipText={bind(BluetoothService, 'devices').as(
                        (devices) => {
                            const connectedDevice = devices.filter((device) => {
                                return device.connected
                            })[0]

                            return (
                                connectedDevice &&
                                `${truncate(connectedDevice.alias)}`
                            )
                        },
                    )}
                    label={bind(BluetoothService, 'devices').as((_) => {
                        return `󰂱`
                    })}
                    visible={bind(BluetoothService, 'isConnected')}
                />
            )}
            {NetworkService && (
                <label
                    label={bind(NetworkService.wired, 'speed').as((speed) => {
                        return speed.toString()
                    })}
                />
            )}
        </box>
    )
}

export default Indicator
