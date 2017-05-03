export function getToastBackgroundColor(type) {
    // INFO
    let color = '#2980b9';

    if (type == 'ERROR') {
        color = '#e74c3c';
    } else if (type == 'WARNING') {
        color = '#f39c12';
    }

    return color;
}
