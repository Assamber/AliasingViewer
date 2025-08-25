const ctx = document.getElementById('digitalChart');
const freqCtx = document.getElementById('freqChart');
const filterCtx = document.getElementById('filterChart');
const sliderFreq = document.getElementById("rgFreq");
const textBoxFreq = document.getElementById("tbFreq");
const textBoxSampRate = document.getElementById('tbSampleFreq');
const selectFilter = document.getElementById('sbFilterType');
const firstHarmonic = 50;
const sampleNumber = 50;
const maxFreq = 40000;

let freq = textBoxFreq.value;
let sampleRate = textBoxSampRate.value*firstHarmonic;
let timeSec = new Array(sampleRate).fill().map((_, i) => i/sampleRate);
let sinTime = new Array(sampleNumber).fill().map((_, i) => i/sampleNumber*(1/freq));
let sinAmp = sinTime.map((x) => Math.sin(2*Math.PI*freq*x));
let filterAmp = 1;

let dataSet = timeSec.map((x) => Math.sin(2*Math.PI*freq*x));
let data = new ComplexArray(dataSet)
let fftData = data.FFT().magnitude().map((x) => x/dataSet.length);
let freqs = new Array(fftData.length).fill().map((_, i) => i*sampleRate/fftData.length);

let nonFilterFreq = new Array(100).fill().map((_,i) => Math.round(i/100*maxFreq));
let nonFilterAmp = new Array(100).fill(1);

calcParameters();

function digitalChartRefresh()
{
    freq = sliderFreq.value;
    textBoxFreq.value = freq
    T = Math.max(1/freq, 1/sampleRate*sampleNumber);
    sinTime = new Array(sampleNumber).fill().map((_, i) => i/sampleNumber*T);
    sinAmp = sinTime.map((x) => filterAmp*Math.sin(2*Math.PI*freq*x))

    dataChart.data.datasets[0].data = sinAmp;
    dataChart.data.labels = sinTime.map((x) => (x*1000).toFixed(3))
    dataChart.update();
}

function freqChartRefresh()
{
    freq = sliderFreq.value;
    dataSet = timeSec.map((x) => filterAmp*Math.sin(2*Math.PI*freq*x));
    data = new ComplexArray(dataSet);
    fftData = data.FFT().magnitude().map((x) => x/dataSet.length);
    freqs = new Array(fftData.length).fill().map((_, i) => Math.round(i*sampleRate/fftData.length));

    freqChart.data.datasets[0].data = fftData;
    freqChart.data.labels = freqs;
    freqChart.update();
}

function getFilterValue(freq, freqArr, ampArr)
{
    if (freq <= freqArr[0]) return ampArr[0];
    if (freq >= freqArr[freqArr.length - 1]) return ampArr[ampArr.length - 1];

    let i = 0;
    while (freq > freqArr[i + 1]) i++;

    const ratio = (freq - freqArr[i]) / (freqArr[i + 1] - freqArr[i]);
    return ampArr[i] + ratio * (ampArr[i + 1] - ampArr[i]);
}

function filterChartRefresh()
{
    freq = sliderFreq.value;
    switch(selectFilter.value)
    {
        case "0": filterAmp = 1; 
                  filterChart.data.datasets[0].data = nonFilterAmp; 
                  filterChart.data.labels = nonFilterFreq;
                  filterChart.options.plugins.annotation.annotations[0].value = Math.round(freq/maxFreq*100);
                  break;
        case "1": filterAmp = getFilterValue(freq, freq612, amp612);
                  filterChart.data.datasets[0].data = amp612; 
                  filterChart.data.labels = freq612.map((x) => x.toFixed(2));
                  filterChart.options.plugins.annotation.annotations[0].value =  Math.round((Math.log10(freq)+1)*20)
                  break;
    }

    filterChart.update()
}

function calcParameters()
{
    const createParam = (x) => `<label class="param">${x}</label>`;
    let text = createParam(`Основная частота, fnom: ${firstHarmonic} Гц`);
    text += createParam('Амплитуда исходного сигнала, A: 1');
    text += createParam(`Частота дискретизации fd: ${sampleRate} Гц`);
    let fny = sampleRate/2
    text += createParam(`Частота Найквиста fny: ${fny} Гц`);
    text += createParam(`Амплитуда фильтра, Af: ${filterAmp.toFixed(3)}`);
    let allisingFreq = Math.floor(freq/(fny))&1 //odd/even
    allisingFreq = allisingFreq ? fny - freq%(fny) : freq%(fny)
    text += createParam(`Расчетное наложение: ${(allisingFreq).toFixed(2)} Гц`);
    
    document.getElementById("textOutput").innerHTML = text;
}
let dataChart = new Chart(ctx, {
type: 'line',
data: {
    labels: sinTime.map((x) => (x*1000).toFixed(3)),
    datasets: [{
    label: 'Sin wave',
    data: sinAmp,
    fill: false,

    }]
},
options: {
    responsive: true,
    scales: {
    x: {
        title: {
            display:true,
            text: "Time, ms"
        }
    },
    y: {
        beginAtZero: true,
        title:{
            display:true,
            text: "Amplitude"
        }
    }
    },
    plugins: {
        legend: {
            display: false,
            position:'bottom'
        },
        decimation: {
            enabled: true,
            algorithm: 'min-max'
        }
    },
    pointStyle:false,
    animation:{
        duration:0
    }
}
});

let freqChart = new Chart(freqCtx, {
type: 'line',
data: {
    labels: freqs,
    datasets: [{
    label: 'Spectrum',
    data: fftData,
    fill: false,

    }]
},
options: {
    responsive: true,
    scales: {
    x: {
        title: {
            display:true,
            text: "Frequency, Hz"
        }
    },
    y: {
        beginAtZero: true,
        title:{
            display:true,
            text: "Amplitude"
        }
    }
    },
    plugins: {
        legend: {
            display: false,
            position:'bottom'
        },
        decimation: {
            enabled: true,
            algorithm: 'min-max'
        }
    },
    pointStyle:false,
    animation:{
        duration:0
    }
}
});

let filterChart = new Chart(filterCtx, {
type: 'line',
data: {
    labels: nonFilterFreq,
    datasets: [{
    label: 'Filter',
    data: nonFilterAmp,
    fill: false,

    }]
},
options: {
    responsive: true,
    scales: {
    x: {
        title: {
            display:true,
            text: "Frequency, Hz"
        }
    },
    y: {
        beginAtZero: true,
        title:{
            display:true,
            text: "Amplitude"
        }
    }
    },
    plugins: {
        legend: {
            display: false,
            position:'bottom'
        },
        decimation: {
            enabled: true,
            algorithm: 'min-max'
        },
        annotation: {
            annotations: [{
                type: 'line',
                mode: 'vertical',
                scaleID: 'x',
                value: 5,
                borderColor: 'red',
                borderWidth: 1,
                label: {
                    enabled: true,
                    content: 'Vertical Line'
                }
            }]
        }
    },
    pointStyle:false,
    animation:{
        duration:0
    }
},
lineAtIndex: [1300,4,8]
});

function refreshData()
{
    filterChartRefresh();
    digitalChartRefresh();
    freqChartRefresh();
    calcParameters();
}

sliderFreq.addEventListener("input", () => {
    refreshData();
});

textBoxFreq.addEventListener("change", () => {
    sliderFreq.value = textBoxFreq.value;
    refreshData();
});

textBoxSampRate.addEventListener("change", () => {
    sampleRate = textBoxSampRate.value*firstHarmonic;
    timeSec = new Array(sampleRate).fill().map((_, i) => i/sampleRate);
    sinAmp = sinTime.map((x) => Math.sin(2*Math.PI*freq*x));
    filterAmp = 1;

    dataSet = timeSec.map((x) => Math.sin(2*Math.PI*freq*x));
    data = new ComplexArray(dataSet)
    fftData = data.FFT().magnitude().map((x) => x/dataSet.length);
    freqs = new Array(fftData.length).fill().map((_, i) => i*sampleRate/fftData.length);
    
    refreshData();
});
selectFilter.addEventListener("change", refreshData);
