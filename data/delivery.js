import dayjs from 'https://unpkg.com/dayjs@1.11.18/esm/index.js';

export function findOptionById(optionId) {
    let matching;
    deliveryOptions.forEach(option => {
        if(option.id === optionId) {
            matching = option;
        }
    });
    return matching;
}

export const deliveryOptions = [
    {
        id: '1',
        date: dayjs().add(7, 'days').format('dddd, MMMM D'),
        priceCents: 0
    },
    {
        id: '2',
        date: dayjs().add(3, 'days').format('dddd, MMMM D'),
        priceCents: 499
    },
    {
        id: '3',
        date: dayjs().add(1, 'days').format('dddd, MMMM D'),
        priceCents: 999
    }
];