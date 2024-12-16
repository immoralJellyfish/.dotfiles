export const trayItemShownIds = ['fcitx', 'obs']

export const batteryIcons: {[key: number]: string} = {
    15: '',
    45: '',
    75: '',
    100: '',
}

export const networkIcons: {
    disconnected: string
    default: string
    wired: {[key: string | number]: string}
    wireless: {[key: string | number]: string}
} = {
    disconnected: '',
    default: '',
    wired: {
        disconnected: '',
        default: '󰈀',
    },
    wireless: {
        disconnected: '󰤭',
        connecting: '󰤩',
        5: '󰤯',
        35: '󰤟',
        55: '󰤢',
        75: '󰤥',
        95: '󰤨',
    },
}

export const brightnessIcon: {[index: number]: string} = {
    10: '󰃞',
    35: '󰃟',
    60: '󰃝',
    85: '󰃠',
}

export const speakerIcons = {
    default: '',
    muted: '',
}

export const microphoneIcons = {
    default: '',
    muted: '',
}
