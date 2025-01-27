import {Astal, Gtk} from 'astal/gtk3'
import AstalWp from 'gi://AstalWp'
import {
    bind,
    execAsync,
    Variable,
} from '../../../../../../../../../usr/share/astal/gjs'
import ToggleButton from '../../components/ToggleButton'
import {quickControlState, setQuickControlState} from './Main'
import {MicrophoneIcon} from './Toggle'

let WireplumberService: AstalWp.Wp | null

try {
    WireplumberService = AstalWp.get_default()
} catch (_) {
    WireplumberService = null
}

const DefaultMicrophone =
    WireplumberService && WireplumberService.defaultMicrophone
const Audio = WireplumberService && WireplumberService.audio

const revealMicrophone = Variable(false)
const overAmplified = Variable(false)

const Microphone = () => {
    quickControlState.subscribe((v) => {
        if (!v) {
            revealMicrophone.set(false)
        }
    })
    return (
        <box vertical className="brightness_control slider_control">
            <eventbox
                className="control"
                hexpand
                onClick={(_, e) => {
                    if (e.button === Astal.MouseButton.PRIMARY) {
                        revealMicrophone.set(!revealMicrophone.get())
                    }
                }}
            >
                <box vexpand={false}>
                    <ToggleButton
                        className="icon"
                        onClick={(_, e) => {
                            if (!DefaultMicrophone) {
                                return null
                            }

                            if (e.button === Astal.MouseButton.SECONDARY) {
                                overAmplified.set(!overAmplified.get())
                                return null
                            }

                            if (typeof DefaultMicrophone !== 'undefined')
                                DefaultMicrophone.mute = !DefaultMicrophone.mute
                        }}
                    >
                        <box vertical valign={Gtk.Align.CENTER}>
                            <MicrophoneIcon />
                            <label
                                truncate
                                maxWidthChars={0}
                                label={
                                    !DefaultMicrophone
                                        ? 'Unavailable'
                                        : bind(
                                              Variable.derive(
                                                  [
                                                      bind(
                                                          DefaultMicrophone,
                                                          'volume',
                                                      ),
                                                      bind(
                                                          DefaultMicrophone,
                                                          'mute',
                                                      ),
                                                  ],
                                                  (volume, mute) =>
                                                      mute
                                                          ? 'Muted'
                                                          : `${Math.round(volume * 100)}%`,
                                              ),
                                          )
                                }
                            />
                        </box>
                    </ToggleButton>
                    <slider
                        hexpand
                        setup={(self) => {
                            if (!DefaultMicrophone) {
                                self.value = 0
                                self.sensitive = false

                                return null
                            }

                            self.connect('dragged', (self) => {
                                DefaultMicrophone.mute = false
                                DefaultMicrophone.volume = self.value
                            })

                            self.hook(
                                bind(DefaultMicrophone, 'volume'),
                                (self) => {
                                    self.value = DefaultMicrophone.volume
                                },
                            )

                            self.hook(overAmplified(), (self) => {
                                self.max = overAmplified.get() ? 1.5 : 1
                                self.fillLevel = overAmplified.get() ? 1.5 : 1

                                DefaultMicrophone.volume = self.value
                            })
                        }}
                    />
                </box>
            </eventbox>
            <revealer
                revealChild={revealMicrophone()}
                transitionType={Gtk.RevealerTransitionType.SLIDE_UP}
            >
                {Audio && (
                    <box vertical className="control_sublist microphone">
                        {bind(Audio, 'microphones').as((microphones) => {
                            return microphones.map((microphone) => {
                                return (
                                    <ToggleButton
                                        state={bind(microphone, 'isDefault')}
                                        onClick={() =>
                                            microphone.set_is_default(true)
                                        }
                                    >
                                        <label
                                            label={bind(
                                                microphone,
                                                'description',
                                            )}
                                            truncate
                                        />
                                    </ToggleButton>
                                )
                            })
                        })}

                        <button
                            onClick={() => {
                                execAsync(['bash', '-c', 'pavucontrol -t 4'])
                                setQuickControlState(false)
                            }}
                        >
                            Pavucontrol
                        </button>
                    </box>
                )}
            </revealer>
        </box>
    )
}
export default Microphone
