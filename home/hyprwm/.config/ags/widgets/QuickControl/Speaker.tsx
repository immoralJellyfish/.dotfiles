import {Astal, Gtk} from 'astal/gtk3'
import AstalWp from 'gi://AstalWp'
import {
    bind,
    execAsync,
    Variable,
} from '../../../../../../../../../usr/share/astal/gjs'
import ToggleButton from '../../components/ToggleButton'
import {quickControlState, setQuickControlState} from './Main'
import {SpeakerIcon} from './Toggle'

let WireplumberService: AstalWp.Wp | null

try {
    WireplumberService = AstalWp.get_default()
} catch (_) {
    WireplumberService = null
}

const DefaultSpeaker = WireplumberService && WireplumberService.defaultSpeaker
const Audio = WireplumberService && WireplumberService.audio

const revealSpeaker = Variable(false)
const overAmplified = Variable(false)

const Speaker = () => {
    quickControlState.subscribe((v) => {
        if (!v) {
            revealSpeaker.set(false)
        }
    })
    return (
        <box vertical className="brightness_control slider_control">
            <eventbox
                className="control"
                hexpand
                onClick={(_, e) => {
                    if (e.button === Astal.MouseButton.PRIMARY) {
                        revealSpeaker.set(!revealSpeaker.get())
                    }
                }}
            >
                <box vexpand={false}>
                    <ToggleButton
                        className="icon"
                        onClick={(_, e) => {
                            if (!DefaultSpeaker) {
                                return null
                            }

                            if (e.button === Astal.MouseButton.SECONDARY) {
                                overAmplified.set(!overAmplified.get())
                                return null
                            }

                            if (typeof DefaultSpeaker !== 'undefined')
                                DefaultSpeaker.mute = !DefaultSpeaker.mute
                        }}
                    >
                        <box vertical valign={Gtk.Align.CENTER}>
                            <SpeakerIcon />
                            <label
                                truncate
                                maxWidthChars={0}
                                label={
                                    !DefaultSpeaker
                                        ? 'Unavailable'
                                        : bind(
                                              Variable.derive(
                                                  [
                                                      bind(
                                                          DefaultSpeaker,
                                                          'volume',
                                                      ),
                                                      bind(
                                                          DefaultSpeaker,
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
                            if (!DefaultSpeaker) {
                                self.value = 0
                                self.sensitive = false

                                return null
                            }

                            self.connect('dragged', (self) => {
                                DefaultSpeaker.mute = false
                                DefaultSpeaker.volume = self.value
                            })

                            self.hook(
                                bind(DefaultSpeaker, 'volume'),
                                (self) => {
                                    self.value = DefaultSpeaker.volume
                                },
                            )

                            self.hook(overAmplified(), (self) => {
                                self.max = overAmplified.get() ? 1.5 : 1
                                self.fillLevel = overAmplified.get() ? 1.5 : 1

                                DefaultSpeaker.volume = self.value
                            })
                        }}
                    />
                </box>
            </eventbox>
            <revealer
                revealChild={bind(
                    Variable.derive(
                        [quickControlState(), revealSpeaker()],
                        (qcState, raState) => {
                            return qcState && raState
                        },
                    ),
                )}
                transitionType={Gtk.RevealerTransitionType.SLIDE_UP}
            >
                {Audio && (
                    <box vertical className="control_sublist speaker">
                        {bind(Audio, 'speakers').as((speakers) => {
                            return speakers.map((speaker) => {
                                return (
                                    <ToggleButton
                                        state={bind(speaker, 'isDefault')}
                                        onClick={() =>
                                            speaker.set_is_default(true)
                                        }
                                    >
                                        <label
                                            label={bind(speaker, 'description')}
                                            truncate
                                        />
                                    </ToggleButton>
                                )
                            })
                        })}
                        <button
                            onClick={() => {
                                execAsync(['bash', '-c', 'pavucontrol -t 3'])
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
export default Speaker
