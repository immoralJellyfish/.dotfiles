import {bind} from '../../../../../../../../../usr/share/astal/gjs'
import ToggleButton from '../../components/ToggleButton'
import AstalBrightness from '../../lib/brightness'
import {nearest} from '../../lib/helpers'
import {brightnessIcon} from '../../lib/Variables'
import {Gtk} from 'astal/gtk3'

const BrightnessService = AstalBrightness.get_default()

const Brightness = () => {
    return (
        <box vertical className="brightness_control slider_control">
            <eventbox hexpand className="control">
                <box>
                    <ToggleButton className="icon">
                        <box vertical valign={Gtk.Align.CENTER}>
                            <label
                                label={bind(BrightnessService, 'screen').as(
                                    (screen) => {
                                        const brightnessKey = nearest(
                                            Math.round(screen * 100),
                                            Object.keys(brightnessIcon).map(
                                                (key) => parseInt(key),
                                            ),
                                        )

                                        return brightnessIcon[brightnessKey]
                                    },
                                )}
                            />

                            <label
                                label={
                                    typeof BrightnessService === 'undefined'
                                        ? ''
                                        : bind(BrightnessService, 'screen').as(
                                              (screeen) =>
                                                  `${Math.round(screeen * 100)}%`,
                                          )
                                }
                            />
                        </box>
                    </ToggleButton>
                    <slider
                        min={0.05}
                        hexpand
                        setup={(self) => {
                            self.value = BrightnessService.screen

                            self.hook(
                                bind(BrightnessService, 'screen'),
                                (self) => {
                                    self.value = BrightnessService.screen
                                },
                            )

                            self.connect('dragged', (self) => {
                                BrightnessService.screen = self.value
                            })
                        }}
                    />
                </box>
            </eventbox>
        </box>
    )
}

export default Brightness
