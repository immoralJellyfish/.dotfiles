import {Astal, Gtk} from 'astal/gtk3'
import Mpris from 'gi://AstalMpris'
import {bind} from 'astal'

function lengthStr(length: number) {
    const min = Math.floor(length / 60)
    const sec = Math.floor(length % 60)
    const sec0 = sec < 10 ? '0' : ''
    return `${min}:${sec0}${sec}`
}

function MediaPlayer({player}: {player: Mpris.Player}) {
    const {START, END} = Gtk.Align

    const title = bind(player, 'title').as((t) => t || 'Unknown Track')

    const artist = bind(player, 'artist').as((a) => a || 'Unknown Artist')

    const coverArt = bind(player, 'coverArt').as(
        (c) => `background-image: url('${c}')`,
    )

    const playerIcon = bind(player, 'entry').as((e) =>
        Astal.Icon.lookup_icon(e) ? e : 'audio-x-generic-symbolic',
    )

    const position = bind(player, 'position').as((p) =>
        player.length > 0 ? p / player.length : 0,
    )

    return (
        <box className="media_player" vexpand={false}>
            <box className="cover_art" css={coverArt} />
            <box vertical>
                <box className="title">
                    <label truncate hexpand halign={START} label={title} />
                    <icon icon={playerIcon} />
                </box>
                <label
                    halign={START}
                    valign={START}
                    vexpand
                    wrap
                    label={artist}
                    className="artist"
                />
                <slider
                    visible={bind(player, 'length').as((l) => l > 0)}
                    onDragged={({value}) =>
                        (player.position = value * player.length)
                    }
                    value={position}
                />
                <centerbox className="actions">
                    <label
                        hexpand
                        className="position"
                        halign={START}
                        visible={bind(player, 'length').as((l) => l > 0)}
                        label={bind(player, 'position').as((pos) => {
                            return lengthStr(pos)
                        })}
                    />
                    <box>
                        <button
                            onClicked={() => player.previous()}
                            visible={bind(player, 'canGoPrevious')}
                        >
                            <label label="󰒮" />
                        </button>
                        <button
                            onClicked={() => player.play_pause()}
                            visible={bind(player, 'canControl')}
                        >
                            <label
                                label={bind(player, 'playbackStatus').as(
                                    (playback_status) => {
                                        return playback_status ===
                                            Mpris.PlaybackStatus.PAUSED
                                            ? ''
                                            : ''
                                    },
                                )}
                            />
                        </button>
                        <button
                            onClicked={() => player.next()}
                            visible={bind(player, 'canGoNext')}
                        >
                            <label label="󰒭" />
                        </button>
                    </box>
                    <label
                        className="length"
                        hexpand
                        halign={END}
                        visible={bind(player, 'length').as((l) => l > 0)}
                        label={bind(player, 'length').as((l) => {
                            return l > 0 ? lengthStr(l) : '0:00'
                        })}
                    />
                </centerbox>
            </box>
        </box>
    )
}

const MprisPlayers = () => {
    const mpris = Mpris.get_default()
    return (
        <box className="mpris" vertical>
            <box className="head">
                <label label="Media Players" className="title" />
            </box>
            <scrollable vexpand={true} vscroll={Gtk.PolicyType.AUTOMATIC}>
                <box vertical className="players">
                    {bind(mpris, 'players').as((players) => {
                        if (players.length <= 0)
                            return (
                                <label
                                    vexpand
                                    halign={Gtk.Align.CENTER}
                                    valign={Gtk.Align.CENTER}
                                    label="No media player are playing"
                                />
                            )
                        return players.map((player) => (
                            <MediaPlayer player={player} />
                        ))
                    })}
                </box>
            </scrollable>
        </box>
    )
}

export default MprisPlayers
