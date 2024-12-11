import {Gtk} from 'astal/gtk3'
import {Binding, Variable} from '../../../../../../../../../usr/share/astal/gjs'

const cpu = Variable<number[]>([]).poll(
    1000 * 60,
    [
        'bash',
        '-c',
        `awk '{print $2,$4,$5}' <(grep -i -E "cpu[[:digit:]]" /proc/stat) <(echo "cpu0 ;") <(sleep 1; grep -i -E "cpu[[:digit:]]" /proc/stat)`,
    ],
    (out) => {
        const calc_usage = (a: number[], b: number[]): number => {
            const u = a[0] + a[1]
            const t = a.reduce((c, p) => c + p)

            const u1 = b[0] + b[1]
            const t1 = b.reduce((c, p) => c + p)

            return Math.ceil(((u1 - u) * 100) / (t1 - t))
        }

        let cpu_usage: number[] = []

        const [snapshot_a, snapshot_b] = out.split(/\n;\s*/).map((out) => {
            return out
                .split('\n')
                .map((out) => out.split(/\s/).map((out) => parseInt(out)))
        })

        for (let i = 0; i < snapshot_a.length; i++) {
            cpu_usage.push(calc_usage(snapshot_a[i], snapshot_b[i]))
        }

        return cpu_usage
    },
)

const memory = Variable<{
    [key: string]: number
    total: number
    used: number
    free: number
    shared: number
    buff: number
    available: number
}>({
    total: 0,
    used: 0,
    free: 0,
    shared: 0,
    buff: 0,
    available: 0,
}).poll(
    1000 * 60 * 10,
    ['bash', '-c', `free --bytes | awk 'NR==2'`],
    (out, _) => {
        const [total, used, free, shared, buff, available] = out
            .split(/\s+/)
            .filter((out) => !isNaN(parseInt(out)))
            .map((out) => parseInt(out))

        return {total, used, free, shared, buff, available}
    },
)

const disk = Variable<string[][]>([]).poll(
    1000 * 60 * 10,
    ['bash', '-c', 'df -h -x tmpfs -x vfat'],
    (out, _) => {
        const disk_data = out
            .split('\n')
            .slice(1)
            .map((row) => row.split(/\s+/))
            .filter((row) => row[0].includes('/dev'))

        return disk_data
    },
)

const update = Variable(0).poll(
    1000 * 60 * 10,
    ['bash', '-c', 'pacman -Qu | wc -l'],
    (out) => parseInt(out),
)

const SystemInfoItem = ({
    icon,
    label,
    tooltipMarkup,
    onDestroy,
}: {
    icon: string
    label: string | Binding<string>
    tooltipMarkup?: Binding<string> | string
    onDestroy?: (self: Gtk.EventBox) => void
}) => {
    return (
        <eventbox
            onDestroy={onDestroy}
            valign={Gtk.Align.CENTER}
            halign={Gtk.Align.CENTER}
            vexpand={true}
            hexpand={true}
            tooltipMarkup={tooltipMarkup ? tooltipMarkup : ''}
        >
            <box className="item">
                <label className="icon" label={icon} />
                <label className="percentage" label={label} />
            </box>
        </eventbox>
    )
}

const SystemInfo = () => {
    return (
        <box className="system-info">
            <SystemInfoItem
                icon="󰻠"
                tooltipMarkup={cpu((cores) => {
                    if (cores.length <= 0) return ''

                    const possible_row = 8
                    const possible_column =
                        Math.ceil(cores.length / possible_row) - 1

                    let cpu_chunk = []

                    for (let y = 0; y < possible_row; y++) {
                        let row = y
                        let chunk: {[index: string]: number} = {}

                        chunk[`Cpu${row + 1}`] = cores[row]

                        for (let x = possible_column; x > 0; x--) {
                            row += possible_row

                            chunk[`Cpu${row + 1}`] = cores[row]
                        }

                        cpu_chunk.push(chunk)

                        chunk = {}
                    }

                    const markup = cpu_chunk
                        .map((chunk) => {
                            let chunk_markup = ''

                            for (const i in chunk) {
                                chunk_markup += `${i} ~ <b>${chunk[i]}%</b> `
                            }

                            return chunk_markup
                        })
                        .join('\n')

                    return markup
                })}
                label={cpu((cores) => {
                    if (cores.length <= 0) return '0%'

                    return (
                        Math.ceil(
                            cores.reduce((c, p) => c + p) / cores.length,
                        ) + '%'
                    )
                })}
                onDestroy={cpu.drop}
            />
            <SystemInfoItem
                icon="󰍛"
                tooltipMarkup={memory((memory) => {
                    let memory_info: string[] = []

                    for (const i in memory) {
                        memory_info.push(
                            `${i[0].toUpperCase() + i.slice(1)} ~ <b>${Math.floor(memory[i] / 1024 ** 3)} GIB</b>`,
                        )
                    }

                    return memory_info.join('\n')
                })}
                label={memory((memory) => {
                    const {total, used} = memory
                    return Math.ceil((used / total) * 100) + '%'
                })}
                onDestroy={memory.drop}
            />
            <SystemInfoItem
                icon=""
                tooltipMarkup={disk((disks) => {
                    if (disks.length <= 0) return '0%'

                    const markup = disks.map((disk) => {
                        const [
                            device,
                            size,
                            used,
                            available,
                            used_pcent,
                            mounted,
                        ] = disk

                        return `${mounted} ~ <b>${available}</b>`
                    })

                    return markup.join('\n')
                })}
                label={disk((disks) => {
                    if (disks.length <= 0) return '0%'

                    return disks.filter((disk) => disk[5] === '/').flat()[4]
                })}
            />
            <SystemInfoItem
                icon="󰇚"
                tooltipMarkup={update(
                    (update_count) =>
                        `${update_count} Package need to be update`,
                )}
                label={update((update_count) =>
                    update_count > 9 ? '9+' : update_count.toString(),
                )}
                onDestroy={update.drop}
            />
        </box>
    )
}

export default SystemInfo
