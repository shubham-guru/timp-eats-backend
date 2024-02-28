export function currentDate(format = 'epoch' ){
    if(format === 'dateString') return (new Date(Date.now())).toDateString()
    if(format === 'timeString') return (new Date(Date.now())).toTimeString()
    if(format === 'string') return (new Date(Date.now())).toString()
    return Date.now()
}