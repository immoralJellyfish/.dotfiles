import AstalNetwork from 'gi://AstalNetwork'
import AstalWp from 'gi://AstalWp'
import {bind, Variable} from '../../../../../../../../../usr/share/astal/gjs'
import ToggleButton from '../../components/ToggleButton'
import {nearest} from '../../lib/helpers'
import {microphoneIcons, networkIcons, speakerIcons} from '../../lib/Variables'
import {quickControlState, setQuickControlState} from './Main'
import {setNetworkControlState} from './Network'
import {setBluetoothControlState} from './Bluetooth'

let NetworkService: AstalNetwork.Network | null
let WirePlumberService: AstalWp.Wp | null

try {
    NetworkService = AstalNetwork.get_default()
    WirePlumberService = AstalWp.get_default()
} catch (_) {
    NetworkService = null
    WirePlumberService = null
}

const WifiService = NetworkService && NetworkService.wifi
const WiredService = NetworkService && NetworkService.wired

const DefaultSpeaker =
    WirePlumberService && WirePlumberService.audio?.defaultSpeaker
const DefaultMicrophone =
    WirePlumberService && WirePlumberService.audio?.defaultMicrophone

export function getWifiIcons(
    wifiStrength: number,
    wifiState?: AstalNetwork.DeviceState,
): string {
    const networkIconsKeys = Object.keys(networkIcons.wireless)
        .filter((key) => !Number.isNaN(parseInt(key)))
        .map((key) => parseInt(key))
    const networkIconKey = nearest(wifiStrength, networkIconsKeys)

    if (!wifiState) {
        return networkIcons.wireless[networkIconKey]
    }

    if (wifiState <= AstalNetwork.DeviceState.DISCONNECTED) {
        return networkIcons.wireless.disconnected
    }

    if (wifiState <= AstalNetwork.DeviceState.PREPARE) {
        return networkIcons.wireless.connecting
    }

    return networkIcons.wireless[networkIconKey]
}

export function getVolumeClass(volume: number): string {
    const volumeLevel: {[key: number]: string} = {
        35: 'low',
        75: 'medium',
        90: 'high',
        111: 'warning',
        125: 'overamplified',
    }

    const volumeKey = nearest(
        volume,
        Object.keys(volumeLevel).map((volume) => parseInt(volume)),
    )

    return volumeLevel[volumeKey]
}

export const WifiIcon = () => {
    if (!WifiService)
        return (
            <label
                className="disconnected"
                label={networkIcons.wireless.disconnected}
            />
        )

    return (
        <label
            label={bind(
                Variable.derive(
                    [bind(WifiService, 'strength'), bind(WifiService, 'state')],
                    (strength, state) => getWifiIcons(strength, state),
                ),
            )}
        />
    )
}

export const WiredIcon = () => {
    return (
        <label
            label={networkIcons.wired.default}
            className={!WiredService ? 'disconnected' : ''}
        />
    )
}

export const MicrophoneIcon = () => {
    if (!DefaultMicrophone) {
        return <label className="disconnected" label={microphoneIcons.muted} />
    }

    const microphoneVolume = bind(DefaultMicrophone, 'volume').as((volume) =>
        Math.round(volume * 100),
    )
    const microphoneMute = bind(DefaultMicrophone, 'mute')

    return (
        <label
            label={bind(
                microphoneMute.as((mute) =>
                    mute ? microphoneIcons.muted : microphoneIcons.default,
                ),
            )}
            className={bind(
                Variable.derive(
                    [microphoneVolume, microphoneMute],
                    (volume, mute) => {
                        return [
                            'microphone',
                            mute ? 'low' : getVolumeClass(volume),
                        ].join(' ')
                    },
                ),
            )}
            tooltipText={microphoneVolume.as((volume) => `${volume}%`)}
        />
    )
}

export const SpeakerIcon = () => {
    if (!DefaultSpeaker) {
        return <label className="disconnected" label={speakerIcons.muted} />
    }

    const speakerVolume = bind(DefaultSpeaker, 'volume').as((volume) =>
        Math.round(volume * 100),
    )
    const speakerMute = bind(DefaultSpeaker, 'mute')

    return (
        <label
            label={bind(
                speakerMute.as((mute) =>
                    mute ? speakerIcons.muted : speakerIcons.default,
                ),
            )}
            className={bind(
                Variable.derive(
                    [speakerVolume, speakerMute],
                    (volume, mute) => {
                        return [
                            'microphone',
                            mute ? 'low' : getVolumeClass(volume),
                        ].join(' ')
                    },
                ),
            )}
            tooltipText={speakerVolume.as((volume) => `${volume}%`)}
        />
    )
}

const QuickControlToggle = () => {
    return (
        <ToggleButton
            className="quickcontrol_toggle"
            onClick={() => {
                setNetworkControlState(false)
                setBluetoothControlState(false)
                setQuickControlState()
            }}
            state={quickControlState()}
        >
            <box>
                <SpeakerIcon />
                <MicrophoneIcon />
                {NetworkService &&
                    bind(NetworkService, 'primary').as((primary) => {
                        if (primary === AstalNetwork.Primary.WIFI)
                            return <WifiIcon />

                        if (primary === AstalNetwork.Primary.WIRED) {
                            return <WiredIcon />
                        }

                        return (
                            <label
                                className={bind(NetworkService, 'state').as(
                                    (state) => {
                                        return state >
                                            AstalNetwork.State.CONNECTED_LOCAL
                                            ? ''
                                            : 'disconnected'
                                    },
                                )}
                                label={bind(NetworkService, 'state').as(
                                    (state) => {
                                        return state >
                                            AstalNetwork.State.CONNECTED_LOCAL
                                            ? '󰣺'
                                            : '󰣼'
                                    },
                                )}
                            />
                        )
                    })}
            </box>
        </ToggleButton>
    )
}

export default QuickControlToggle
