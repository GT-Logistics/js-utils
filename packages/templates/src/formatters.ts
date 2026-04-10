const currencyFormatter = new Intl.NumberFormat('es-MX', {style: 'currency', currency: 'MXN'});
const dateFormatter = new Intl.DateTimeFormat('es-MX', {dateStyle: 'short'});

function formatCurrency(number: number | bigint | Intl.StringNumericLiteral) {
    return currencyFormatter.format(number);
}
function formatDate(date: Date | number) {
    return dateFormatter.format(date);
}
