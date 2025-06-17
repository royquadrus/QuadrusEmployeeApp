export function formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours === 0) {
        return `${remainingMinutes}m`;
    }

    return remainingMinutes === 0 ? `${hours}h` : `${hours}h ${remainingMinutes}m`;
}