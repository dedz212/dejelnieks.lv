import { convertDate } from './convertDate.js';

document.addEventListener("DOMContentLoaded", function () {
    fetch('../data.json')
        .then(response => response.json())
        .then(data => {
            console.log("Version: " + data.version);
            console.log('URL: ' + window.location.pathname)
        })
        .catch(error => console.error('Error fetching JSON:', error));
});

const content = document.getElementById('content');
const timeFilter = document.getElementById('time-filter');
const monthFilter = document.getElementById('month-filter');
const mmFilter = document.getElementById('mmfilter');
var myChart = null
var activeMm = 1;

if (content && timeFilter && monthFilter && mmFilter) {
    let filteredData = null;
    let activeYear = null;
    let activeMonth = null;

    fetch('./avarijas.json')
        .then(response => response.json())
        .then(data => {
            filteredData = data;
            renderMetrics(data, 1);
            renderData(filteredData);
            renderChart(filteredData);
        })
        .catch(error => console.error('Error fetching JSON:', error));

    function renderAll(data) {
        renderData(data);
        renderChart(data);
        if (activeMm === 1) {
            renderMetrics(data, 1);
        } else if (activeMm === 2) {
            renderMetrics(data, 2);
        } else if (activeMm === 3) {
            renderMetrics(data, 3);
        } else if (activeMm === 4) {
            renderMetrics(data, 4);
        }
    }

    timeFilter.addEventListener('click', event => {
        if (event.target.tagName === 'BUTTON') {
            const filter = event.target.id;
            if (filter === 'all-time') {
                activeYear = null;
                setActiveFilter(timeFilter, 'all-time');
                renderAll(filteredData);
            } else if (filter.startsWith('year-')) {
                const selectedYear = parseInt(filter.split('-')[1]);
                activeYear = selectedYear;
                setActiveFilter(timeFilter, filter);
                if (activeMonth){
                    const filteredByMonth = filterDataByMonth(filteredData, activeMonth);
                    const filteredByYearAndMonth = filterDataByYear(filteredByMonth, activeYear);
                    renderAll(filteredByYearAndMonth);
                } else {
                    const filteredByYear = filterDataByYear(filteredData, selectedYear);
                    renderAll(filteredByYear);
                }
            }
        }
    });

    monthFilter.addEventListener('click', event => {
        if (event.target.tagName === 'BUTTON') {
            const filter = event.target.id;
            if (filter === 'all-months') {
                activeMonth = null;
                setActiveFilter(monthFilter, 'all-months');
                if (activeYear) {
                    const filteredByYear = filterDataByYear(filteredData, activeYear);
                    renderAll(filteredByYear);
                } else {
                    renderAll(filteredData);
                }
            } else if (filter.startsWith('month-')) {
                const selectedMonth = filter.split('-')[1];
                activeMonth = selectedMonth;
                setActiveFilter(monthFilter, filter);
                if (activeYear) {
                    const filteredByMonth = filterDataByMonth(filteredData, activeMonth);
                    const filteredByYearAndMonth = filterDataByYear(filteredByMonth, activeYear);
                    renderAll(filteredByYearAndMonth);
                } else {
                    const filteredByMonth = filterDataByMonth(filteredData, activeMonth);
                    renderAll(filteredByMonth);
                }
            }
        }
    });

    mmFilter.addEventListener('click', event => {
        if (event.target.tagName === 'BUTTON') {
            const filter = event.target.id;
            const filterMapping = {
                'max': 1,
                'min': 2,
                'sum': 3,
                'avg': 4
            };
            if (filter in filterMapping) {
                activeMm = filterMapping[filter];
                setActiveFilter(mmFilter, filter);
            }            
        }
        if (activeYear === null) {
            renderAll(filteredData);
        } else {
            if (activeMonth){
                const filteredByYearAndMonth = filterDataByYear(filterDataByMonth(filteredData, activeMonth), activeYear);
                renderAll(filteredByYearAndMonth);
            } else {
                const filteredByYear = filterDataByYear(filteredData, selectedYear);
                renderAll(filteredByYear);
            }
        }
        if (activeMonth == null) {
            if (activeYear) {
                const filteredByYear = filterDataByYear(filteredData, activeYear);
                renderAll(filteredByYear);
            } else {
                renderAll(filteredData);
            }
        } else {
            if (activeYear) {
                const filteredByYearAndMonth = filterDataByYear(filterDataByMonth(filteredData, activeMonth), activeYear);
                renderAll(filteredByYearAndMonth);
            } else {
                const filteredByMonth = filterDataByMonth(filteredData, activeMonth);
                renderAll(filteredByMonth);
            }
        }
    });
}

function setActiveFilter(filterGroup, activeFilterId) {
    const buttons = filterGroup.querySelectorAll('button');
    buttons.forEach(button => {
        if (button.id === activeFilterId) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

function filterDataByYear(data, year) {
    const filtered = {};
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const dataYear = parseInt(key.substring(4, 6));
            if (dataYear === year) {
                filtered[key] = data[key];
            }
        }
    }
    return filtered;
}

function filterDataByMonth(data, month) {
    const filtered = {};
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const dataMonth = key.substring(2, 4);
            if (dataMonth === month) {
                filtered[key] = data[key];
            }
        }
    }
    return filtered;
}

function renderData(data) {
    content.innerHTML = '';
    
    const sortedKeys = Object.keys(data).sort((a, b) => {
        const dateA = new Date(`20${a.substring(4, 6)}`, a.substring(2, 4) - 1, a.substring(0, 2));
        const dateB = new Date(`20${b.substring(4, 6)}`, b.substring(2, 4) - 1, b.substring(0, 2));
        return dateA - dateB;
    });

    sortedKeys.forEach(key => {
                if (data.hasOwnProperty(key)) {
                    const container = document.createElement('div');
                    container.id = 'container';

                    const h1 = document.createElement('div');
                    h1.id = 'data';
                    h1.innerText = convertDate(key);

                    const situacijalr = document.createElement('div');
                    situacijalr.id = 'situacijalr';

                    const gajusiboja = document.createElement('div');
                    gajusiboja.innerText = "Gājuši bojā: " + data[key].gajusiboja;

                    const ievainoti = document.createElement('div');
                    ievainoti.innerText = "Ievainotie: " + data[key].ievainoti;

                    const cdata = data[key].citi;

                    const negadijumi = document.createElement('div');
                    if (cdata.negadijumi) {
                        negadijumi.innerText = "Ceļu satiksmes negadījumi: " + cdata.negadijumi;
                    }

                    const containerl = document.createElement('div');
                    containerl.id = 'left';
                    const containerr = document.createElement('div');
                    containerr.classList.add('situacija');
                    containerr.id = 'right';

                    const apl = cdata.apl
                    const h2 = document.createElement('div');
                    if(apl.ap) {
                        h2.id = 'data2';
                        h2.innerText = `Administratīvie pārkāpumi`;
                    }

                    const aplkopa = document.createElement('div');
                    aplkopa.classList.add('aa');
                    if (apl.kopa) {
                        aplkopa.innerText = "Kopumā pieņemti: " + apl.kopa;
                    }

                    const aplap = document.createElement('div');
                    aplap.classList.add('aa');
                    if (apl.ap) {
                        aplap.innerText = "Ātruma pārsniegšana: " + apl.ap;
                    }

                    const aplab = document.createElement('div');
                    aplab.classList.add('aa');
                    if (apl.ab) {
                        aplab.innerText = "Agresīva braukšana: " + apl.ab;
                    }

                    const aplapp = document.createElement('div');
                    aplapp.classList.add('aa');
                    if (apl.app) {
                        aplapp.innerText = "Administratīvā pārkāpuma process: " + apl.app;
                    }

                    const aplkp = document.createElement('div');
                    aplkp.classList.add('aa');
                    if (apl.kp_tvar) {
                        aplkp.innerText = "Kriminālprocess: " + apl.kp_tvar;
                    }

                    containerl.appendChild(h1);
                    containerl.appendChild(gajusiboja);
                    containerl.appendChild(ievainoti);
                    containerl.appendChild(negadijumi);
                    containerr.appendChild(h2);
                    containerr.appendChild(aplkopa);
                    containerr.appendChild(aplap);
                    containerr.appendChild(aplab);
                    containerr.appendChild(aplapp);
                    containerr.appendChild(aplkp);
                    situacijalr.appendChild(containerl);
                    if(apl.ap) {
                        situacijalr.appendChild(containerr);
                    }
                    container.appendChild(situacijalr);

                    const zinas = document.createElement('div');
                    zinas.id = 'data3';
                    zinas.innerText = "Ziņas";
                    const situacijas = data[key].situacijas;
                    if (situacijas != "") {
                        container.appendChild(zinas);
                    }
                    for (const situacija of situacijas) {
                        const situacijaContainer = document.createElement('div');
                        situacijaContainer.classList.add('situacija2');

                        const situacijaLContainer = document.createElement('div');
                        const situacijaRContainer = document.createElement('div');

                        // Создаем элементы для информации о ситуации
                        const nosaukums = document.createElement('div');
                        nosaukums.classList.add('nosaukums');
                        nosaukums.innerHTML = situacija.nosaukums;
                        if (situacija.avots) {
                            nosaukums.innerHTML = `<a href="${situacija.avots}">${situacija.nosaukums}</a>`;
                        }

                        const soseja = document.createElement('div');
                        soseja.classList.add('aa');
                        if (situacija.soseja) {
                            soseja.innerHTML = "Šoseja: " + situacija.soseja;
                        }

                        const vieta = document.createElement('div');
                        vieta.classList.add('aa');
                        if (situacija.vieta) {
                            vieta.innerText = "Vieta: " + situacija.vieta;
                        }

                        const gajusiboja = document.createElement('div');
                        gajusiboja.classList.add('aa');
                        if (situacija.gajusiboja) {
                            gajusiboja.innerText = "Gājuši bojā: " + situacija.gajusiboja;
                        }

                        const ievainoti = document.createElement('div');
                        ievainoti.classList.add('aa');
                        if (situacija.ievainoti) {
                            ievainoti.innerText = "Ievainotie: " + situacija.ievainoti;
                        }
                        
                        const attels = document.createElement('img');
                        if (situacija.attels) {
                            attels.src = situacija.attels;
                        }

                        situacijaLContainer.appendChild(nosaukums);
                        situacijaLContainer.appendChild(soseja);
                        situacijaLContainer.appendChild(vieta);
                        situacijaLContainer.appendChild(gajusiboja);
                        situacijaLContainer.appendChild(ievainoti);
                        if (situacija.attels) {
                        situacijaRContainer.appendChild(attels);
                        }
                        situacijaContainer.appendChild(situacijaLContainer);
                        situacijaContainer.appendChild(situacijaRContainer);
                        container.appendChild(situacijaContainer);
                    }

                    content.prepend(container);
                }
    })
}

let aspectRatioData = 2.5;
let is22 = 22;
let is18 = 18;
let is16 = 16;

if (window.innerWidth < 500) {
    aspectRatioData = 0.75;
    is22 = 14;
    is18 = 14;
    is16 = 12;
} else if (window.innerWidth < 1000) {
    aspectRatioData = 1;
    is22 = 16;
    is18 = 14;
    is16 = 12;
} else if (window.innerWidth < 1300) {
    if (window.innerHeight < 815) {
        aspectRatioData = 2;
    } else {
        aspectRatioData = 1.5;
    }
}

function renderChart(data) {
    if (myChart) {
        myChart.destroy();
    }

    const sortedKeys = Object.keys(data).sort((a, b) => {
        const dateA = new Date(`20${a.substring(4, 6)}`, a.substring(2, 4) - 1, a.substring(0, 2));
        const dateB = new Date(`20${b.substring(4, 6)}`, b.substring(2, 4) - 1, b.substring(0, 2));
        return dateA - dateB;
    });
    
        const labels = [];
        const gajusibojaData = [];
        const ievainotiData = [];
        const negadijumiData = [];
        const citiKopaData = [];
        const citiApData = [];
        const citiAbData = [];
        const citiAppData = [];
        const citiKpTvarData = [];

        sortedKeys.forEach(key => {
            if (data.hasOwnProperty(key)) {
                labels.push(convertDate(key));
                gajusibojaData.push(data[key].gajusiboja);
                ievainotiData.push(data[key].ievainoti);
                negadijumiData.push(data[key].citi.negadijumi);
                const citi = data[key].citi.apl;
                    if (citi) {
                        citiKopaData.push(citi.kopa);
                        citiApData.push(citi.ap);
                        citiAbData.push(citi.ab);
                        citiAppData.push(citi.app);
                        citiKpTvarData.push(citi.kp_tvar);
                    }
            }
        })

        const ctx = document.getElementById('myChart').getContext('2d');
            myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Gājuši bojā',
                            data: gajusibojaData,
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 2
                        },
                        {
                            label: 'Ievainotie',
                            data: ievainotiData,
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 2
                        },
                        {
                            label: 'Negadījumi',
                            data: negadijumiData,
                            backgroundColor: 'rgba(23,177,105, 0.2)',
                            borderColor: 'rgba(23,177,105, 1)',
                            borderWidth: 2,
                            hidden: true
                        },
                        {
                            label: 'Administratīvie pārkāpumi',
                            data: citiKopaData,
                            backgroundColor: 'rgba(255, 206, 86, 0.2)',
                            borderColor: 'rgba(255, 206, 86, 1)',
                            borderWidth: 2,
                            hidden: true
                        },
                        {
                            label: 'Ātruma pārsniegšana',
                            data: citiApData,
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 2,
                            hidden: true
                        },
                        {
                            label: 'Agresīva braukšana',
                            data: citiAbData,
                            backgroundColor: 'rgba(153, 102, 255, 0.2)',
                            borderColor: 'rgba(153, 102, 255, 1)',
                            borderWidth: 2,
                            hidden: true
                        },
                        {
                            label: 'Administratīvā pārkāpuma process',
                            data: citiAppData,
                            backgroundColor: 'rgba(255, 159, 64, 0.2)',
                            borderColor: 'rgba(255, 159, 64, 1)',
                            borderWidth: 2,
                            hidden: true
                        },
                        {
                            label: 'Kriminālprocess',
                            data: citiKpTvarData,
                            backgroundColor: 'rgba(255, 99, 71, 0.2)',
                            borderColor: 'rgba(255, 99, 71, 1)',
                            borderWidth: 2,
                            hidden: true
                        }
                    ]
                },
                options: {
                    maintainAspectRatio: true,
                    aspectRatio: aspectRatioData,
                    plugins: {
                        legend: {
                            display: true,
                            onClick: (e, legendItem, legend) => {
                                const index = legendItem.datasetIndex;
                                const ci = legend.chart;
                                const meta = ci.getDatasetMeta(index);
    
                                // Toggle the visibility of the dataset
                                meta.hidden = meta.hidden === null ? !ci.data.datasets[index].hidden : null;
    
                                // Update the chart
                                ci.update();
                            },
                            labels: {
                                font: {
                                    size: is22
                                }
                            }
                        },
                        tooltip: {
                            // Custom cursor when hovering over tooltips
                            position: 'nearest',
                            callbacks: {
                                beforeBody: (tooltipItems) => {
                                    tooltipItems.forEach((tooltipItem) => {
                                        tooltipItem.element.cursor = 'pointer';
                                    });
                                }
                            },
                            titleFont: {
                                size: is18
                            },
                            bodyFont: {
                                size: is18
                            }
                        },
                    },
                    scales: {
                        x: {
                            ticks: {
                                font: {
                                    size: is16
                                }
                            }
                        },
                        y: {
                            ticks: {
                                font: {
                                    size: is16
                                }
                            }
                        }
                    },
                    interaction: {
                        mode: 'nearest',
                        axis: 'x',
                        intersect: false,
                        onHover: (event, chartElement) => {
                            event.native.target.style.cursor = chartElement.length ? 'pointer' : 'pointer';
                        }
                    }
                }
            });
}

const topMetricsDiv = document.getElementById('top-metrics');
function renderMetrics(data, number) {
    topMetricsDiv.innerHTML = ''; // Очищаем содержимое div перед обновлением

    let Gajusiboja;
    let Ievainoti;
    let Negadijumi;
    let Kopa;
    let Ap;
    let Ab;
    let App;
    let Kp;

    if (number === 1) {
        Gajusiboja = findTopMetric(data, 'gajusiboja');
        Ievainoti = findTopMetric(data, 'ievainoti');
        Negadijumi = findTopMetric(data, 'citi.negadijumi');
        Kopa = findTopMetric(data, 'citi.apl.kopa');
        Ap = findTopMetric(data, 'citi.apl.ap');
        Ab = findTopMetric(data, 'citi.apl.ab');
        App = findTopMetric(data, 'citi.apl.app');
        Kp = findTopMetric(data, 'citi.apl.kp_tvar');
    } else if (number === 2) {
        Gajusiboja = findMinMetric(data, 'gajusiboja');
        Ievainoti = findMinMetric(data, 'ievainoti');
        Negadijumi = findMinMetric(data, 'citi.negadijumi');
        Kopa = findMinMetric(data, 'citi.apl.kopa');
        Ap = findMinMetric(data, 'citi.apl.ap');
        Ab = findMinMetric(data, 'citi.apl.ab');
        App = findMinMetric(data, 'citi.apl.app');
        Kp = findMinMetric(data, 'citi.apl.kp_tvar');
    } else if (number === 3) {
        Gajusiboja = sumMetric(data, 'gajusiboja');
        Ievainoti = sumMetric(data, 'ievainoti');
        Negadijumi = sumMetric(data, 'citi.negadijumi');
        Kopa = sumMetric(data, 'citi.apl.kopa');
        Ap = sumMetric(data, 'citi.apl.ap');
        Ab = sumMetric(data, 'citi.apl.ab');
        App = sumMetric(data, 'citi.apl.app');
        Kp = sumMetric(data, 'citi.apl.kp_tvar');
    } else if (number === 4) {
        Gajusiboja = averageMetric(data, 'gajusiboja');
        Ievainoti = averageMetric(data, 'ievainoti');
        Negadijumi = averageMetric(data, 'citi.negadijumi');
        Kopa = averageMetric(data, 'citi.apl.kopa');
        Ap = averageMetric(data, 'citi.apl.ap');
        Ab = averageMetric(data, 'citi.apl.ab');
        App = averageMetric(data, 'citi.apl.app');
        Kp = averageMetric(data, 'citi.apl.kp_tvar');
    }

    const gajusibojaDiv = document.createElement('div');
    if (number === 1 || number === 2) {
        gajusibojaDiv.textContent = `Gājuši bojā: ${Gajusiboja.value} (${convertDate(Gajusiboja.date)})`;
    } else if (number === 3) {
        gajusibojaDiv.textContent = `Gājuši bojā: ${Gajusiboja.sum}`;
    } else if (number === 4) {
        gajusibojaDiv.textContent = `Gājuši bojā: ${Gajusiboja.average} dienā`;
    }

    const ievainotiDiv = document.createElement('div');
    if (number === 1 || number === 2) {
        ievainotiDiv.textContent = `Ievainotie: ${Ievainoti.value} (${convertDate(Ievainoti.date)})`;
    } else if (number === 3) {
        ievainotiDiv.textContent = `Ievainotie: ${Ievainoti.sum}`;
    } else if (number === 4) {
        ievainotiDiv.textContent = `Ievainotie: ${Ievainoti.average} dienā`;
    }

    const negadijumiDiv = document.createElement('div');
    if (number === 1 || number === 2) {
        negadijumiDiv.textContent = `Ceļu satiksmes negadījumi: ${Negadijumi.value} (${convertDate(Negadijumi.date)})`;
    } else if (number === 3) {
        negadijumiDiv.textContent = `Ceļu satiksmes negadījumi: ${Negadijumi.sum}`;
    } else if (number === 4) {
        negadijumiDiv.textContent = `Ceļu satiksmes negadījumi: ${Negadijumi.average} dienā`;
    }
    
    const kopaDiv = document.createElement('div');
    if (number === 1 || number === 2) {
        kopaDiv.textContent = `Administratīvie pārkāpumi: ${Kopa.value} (${convertDate(Kopa.date)})`;
    } else if (number === 3) {
        kopaDiv.textContent = `Administratīvie pārkāpumi: ${Kopa.sum}`;
    } else if (number === 4) {
        kopaDiv.textContent = `Administratīvie pārkāpumi: ${Kopa.average} dienā`;
    }

    const apDiv = document.createElement('div');
    if (number === 1 || number === 2) {
        apDiv.textContent = `Ātruma pārsniegšana: ${Ap.value} (${convertDate(Ap.date)})`;
    } else if (number === 3) {
        apDiv.textContent = `Ātruma pārsniegšana: ${Ap.sum}`;
    } else if (number === 4) {
        apDiv.textContent = `Ātruma pārsniegšana: ${Ap.average} dienā`;
    }

    const abDiv = document.createElement('div');
    if (number === 1 || number === 2) {
        abDiv.textContent = `Agresīva braukšana: ${Ab.value} (${convertDate(Ab.date)})`;
    } else if (number === 3) {
        abDiv.textContent = `Agresīva braukšana: ${Ab.sum}`;
    } else if (number === 4) {
        abDiv.textContent = `Agresīva braukšana: ${Ab.average} dienā`;
    }

    const appDiv = document.createElement('div');
    if (number === 1 || number === 2) {
        appDiv.textContent = `Administratīvā pārkāpuma process: ${App.value} (${convertDate(App.date)})`;
    } else if (number === 3) {
        appDiv.textContent = `Administratīvā pārkāpuma process: ${App.sum}`;
    } else if (number === 4) {
        appDiv.textContent = `Administratīvā pārkāpuma process: ${App.average} dienā`;
    }

    const kpDiv = document.createElement('div');
    if (number === 1 || number === 2) {
        kpDiv.textContent = `Kriminālprocess: ${Kp.value} (${convertDate(Kp.date)})`;
    } else if (number === 3) {
        kpDiv.textContent = `Kriminālprocess: ${Kp.sum}`;
    } else if (number === 4) {
        kpDiv.textContent = `Kriminālprocess: ${Kp.average} dienā`;
    }

    topMetricsDiv.appendChild(gajusibojaDiv);
    topMetricsDiv.appendChild(ievainotiDiv);
    topMetricsDiv.appendChild(negadijumiDiv);
    topMetricsDiv.appendChild(kopaDiv);
    topMetricsDiv.appendChild(apDiv);
    topMetricsDiv.appendChild(abDiv);
    topMetricsDiv.appendChild(appDiv);
    topMetricsDiv.appendChild(kpDiv);
}

function findTopMetric(data, metricKey) {
    let maxValue = 0;
    let maxDate = '';
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const metricValue = parseInt(getNestedValue(data[key], metricKey));
            if (metricValue > maxValue) {
                maxValue = metricValue;
                maxDate = key;
            }
        }
    }
    return { value: maxValue, date: maxDate };
}

function findMinMetric(data, metricKey) {
    let minValue = Infinity;
    let minDate = '';
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const metricValue = parseInt(getNestedValue(data[key], metricKey));
            if (metricValue < minValue) {
                minValue = metricValue;
                minDate = key;
            }
        }
    }
    return { value: minValue, date: minDate };
}

function sumMetric(data, metricKey) {
    let sum = 0;
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const metricValue = parseInt(getNestedValue(data[key], metricKey));
            if (isNaN(metricValue)) {
                sum += 0;
            } else {
                sum += metricValue;
            }
        }
    }
    return { sum: sum };
}

function averageMetric(data, metricKey) {
    let sum = 0;
    let count = 0;
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const metricValue = parseInt(getNestedValue(data[key], metricKey));
            if (isNaN(metricValue)) {
                sum += 0;
            } else {
                sum += metricValue;
            }
            count++;
        }
    }
    const average = count > 0 ? sum / count : 0;
    return {
        average: average.toFixed(2),
    };
}


function getNestedValue(obj, keyPath) {
    const keys = keyPath.split('.');
    let value = obj;
    for (const key of keys) {
        if (value.hasOwnProperty(key)) {
            value = value[key];
        } else {
            return null;
        }
    }
    return value;
}

const openb = document.getElementById("open");
const maxb = document.getElementById("max");
const minb = document.getElementById("min");
const sumb = document.getElementById("sum");
const avgb = document.getElementById("avg");
let openbc = false;
openb.addEventListener('click', () => {
    if (openbc) {
        openbc = false;
        openb.textContent = "Atvērt";
        maxb.style.display = "none"
        minb.style.display = "none"
        sumb.style.display = "none"
        avgb.style.display = "none"
        topMetricsDiv.style.display = "none"
    } else if (!openbc) {
        openbc = true;
        openb.textContent = "Aizvērt";
        maxb.style.display = "block"
        minb.style.display = "block"
        sumb.style.display = "block"
        avgb.style.display = "block"
        topMetricsDiv.style.display = "block"
    }
});