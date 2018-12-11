/**
 * Get the date of the next specified day
 */
function getNextDate(day, fromDate = Date.now()) {
    const parsedDate = new Date(fromDate); // So that we can also pass in a string
    const nextDate = new Date(fromDate);
    nextDate.setDate(parsedDate.getDate() + (7 + day - parsedDate.getDay() - 1) % 7 + 1);
    return nextDate.toISOString().split('T')[0];
}

export { getNextDate };