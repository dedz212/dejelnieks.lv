export function convertDate(dateString) {
    const year = "20" + dateString.substring(4, 6);
    const month = dateString.substring(2, 4);
    const day = dateString.substring(0, 2);

    const months = [
        "janvāris",
        "februāris",
        "marts",
        "aprīlis",
        "maijs",
        "jūnijs",
        "jūlijs",
        "augusts",
        "septembris",
        "oktobris",
        "novembris",
        "decembris"
    ];

    return `${year}. gads ${parseInt(day, 10)}. ${months[parseInt(month, 10) - 1]}`;
}