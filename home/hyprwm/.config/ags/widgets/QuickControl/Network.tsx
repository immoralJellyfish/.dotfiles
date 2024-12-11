import {Gtk} from 'astal/gtk3'
import AstalNetwork from 'gi://AstalNetwork'
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
import {getWifiIcons} from './Toggle'

export const networkControlState = Variable(false)
export const setNetworkControlState = (state?: boolean) =>
    networkControlState.set(
        typeof state !== 'undefined' ? state : !networkControlState.get(),
    )

let NetworkService: AstalNetwork.Network | null

try {
    NetworkService = AstalNetwork.get_default()
} catch (_) {
    NetworkService = null
}

const WifiService = NetworkService && NetworkService.wifi

const AccessPoint = (props: {accessPoint: AstalNetwork.AccessPoint}) => {
    const {accessPoint} = props
    const APState = !WifiService
        ? false
        : bind(
              Variable.derive(
                  [
                      bind(WifiService, 'activeAccessPoint'),
                      bind(accessPoint, 'bssid'),
                  ],
                  (activeAccessPoint, bssid) =>
                      activeAccessPoint && activeAccessPoint.bssid === bssid,
              ),
          )

    const APIndicator = !WifiService
        ? ''
        : bind(
              Variable.derive(
                  [
                      bind(WifiService, 'activeAccessPoint'),
                      bind(accessPoint, 'bssid'),
                  ],
                  (activeAccessPoint, bssid) =>
                      activeAccessPoint && activeAccessPoint.bssid === bssid
                          ? ''
                          : '',
              ),
          )

    return (
        <ToggleButton
            className="list_item access_point"
            state={APState}
            valign={Gtk.Align.START}
            onClick={() => {
                execAsync([
                    'bash',
                    '-c',
                    `nmcli device wifi connect ${accessPoint.bssid}`,
                ])
            }}
        >
            <box>
                <label
                    className="icon"
                    label={bind(accessPoint, 'strength').as((strength) =>
                        getWifiIcons(strength),
                    )}
                />
                <label
                    label={bind(accessPoint, 'ssid')}
                    hexpand
                    xalign={0}
                    maxWidthChars={16}
                    truncate
                />
                <label label={APIndicator} />
            </box>
        </ToggleButton>
    )
}

const NetworkControl = () => {
    return (
        <PopupWindow
            name="network-control"
            state={networkControlState}
            layout={LayoutOptions.SOUTHEAST}
        >
            <box>
                <Padding
                    vexpand={false}
                    onClick={() => {
                        setNetworkControlState(false)
                        closeAllWindows()
                    }}
                />
                <box
                    className="control_list network_control"
                    vertical
                    hexpand={false}
                >
                    <box className="head">
                        <button
                            className="back"
                            onClick={() => {
                                setQuickControlState(true)
                                setNetworkControlState(false)
                            }}
                        >
                            
                        </button>
                        <box hexpand />
                        <label
                            label={
                                !WifiService
                                    ? 'Wifi'
                                    : bind(WifiService, 'scanning').as(
                                          (scanning) =>
                                              scanning ? 'Scanning...' : 'Wifi',
                                      )
                            }
                        />
                        <box hexpand />
                        <button
                            className="setting"
                            onClick={() => {
                                setQuickControlState(false)
                                setNetworkControlState(false)

                                execAsync([
                                    'bash',
                                    '-c',
                                    'nm-connection-editor',
                                ])
                            }}
                        >
                            󰒓
                        </button>
                        <button
                            className="scan"
                            onClick={() => {
                                if (WifiService) {
                                    WifiService.scan()
                                }
                            }}
                        >
                            󰑐
                        </button>
                    </box>
                    <scrollable>
                        <box vertical vexpand={false}>
                            {!WifiService ? (
                                <label
                                    vexpand
                                    label="No WIFI networks are detected"
                                />
                            ) : (
                                bind(WifiService, 'accessPoints').as(
                                    (accessPoints) => {
                                        if (accessPoints.length === 0) {
                                            return (
                                                <>
                                                    <label
                                                        vexpand
                                                        label="No WIFI networks are detected"
                                                    />
                                                </>
                                            )
                                        }
                                        return accessPoints.map(
                                            (
                                                accessPoint: AstalNetwork.AccessPoint,
                                            ) => {
                                                return (
                                                    <AccessPoint
                                                        accessPoint={
                                                            accessPoint
                                                        }
                                                    />
                                                )
                                            },
                                        )
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

export default NetworkControl
