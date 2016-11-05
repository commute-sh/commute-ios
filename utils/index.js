export function isPositionEqual(p1, p2, precision = 3) {
    if (!p1 && !p2) {
        return true;
    } else if (p1 && p2) {
        return (
            p1.coords.latitude.toFixed(precision) === p2.coords.latitude.toFixed(precision) &&
            p1.coords.longitude.toFixed(precision) === p2.coords.longitude.toFixed(precision)
        );
    } else {
        return false;
    }
}
