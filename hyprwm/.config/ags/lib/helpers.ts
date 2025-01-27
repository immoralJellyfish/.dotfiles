export function nearest(number: number, numbers: number[]): number {
    return numbers.reduce((current, previous) => {
        return Math.abs(number - current) < Math.abs(previous - number)
            ? current
            : previous
    })
}

export function str_pad(
    str: string,
    pad: number = 24,
    pad_char: string = ' ',
): string {
    const str_explode = str.split('')

    while (str_explode.length < pad) {
        str_explode.push(pad_char)
    }

    return str_explode.join('')
}

export function truncate(str: string, limit: number = 32): string {
    if (str.length === limit) return str
    return `${str.slice(0, limit - 1)}...`
}
