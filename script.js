const ctx = document.getElementById('digitalChart');
const freqCtx = document.getElementById('freqChart');
const filterCtx = document.getElementById('filterChart');
const sliderFreq = document.getElementById("rgFreq");
const textBoxFreq = document.getElementById("tbFreq");
const textBoxSampRate = document.getElementById('tbSampleFreq');
const firstHarmonic = 50;
const sampleNumber = 50;
const maxFreq = 30000;

let freq = textBoxFreq.value;
let sampleRate = textBoxSampRate.value*firstHarmonic;
let timeSec = new Array(sampleRate).fill().map((_, i) => i/sampleRate);
let sinTime = new Array(sampleNumber).fill().map((_, i) => i/sampleNumber*(1/freq));
let sinAmp = sinTime.map((x) => Math.sin(2*Math.PI*freq*x));

let dataSet = timeSec.map((x) => Math.sin(2*Math.PI*freq*x));
let data = new ComplexArray(dataSet)
let fftData = data.FFT().magnitude().map((x) => x/dataSet.length);
let freqs = new Array(fftData.length).fill().map((_, i) => i*sampleRate/fftData.length);

let filterFreq = new Array(100).fill().map((_,i) => Math.round(i/100*maxFreq));
let filterAmp = new Array(100).fill(1);

calcParameters();

function digitalChartRefresh()
{
    freq = sliderFreq.value;
    textBoxFreq.value = freq
    T = Math.max(1/freq, 1/sampleRate*sampleNumber);
    sinTime = new Array(sampleNumber).fill().map((_, i) => i/sampleNumber*T);
    sinAmp = sinTime.map((x) => Math.sin(2*Math.PI*freq*x))

    dataChart.data.datasets[0].data = sinAmp;
    dataChart.data.labels = sinTime.map((x) => (x*1000).toFixed(3))
    dataChart.update();

    filterChart.options.plugins.annotation.annotations[0].value = Math.round(freq/maxFreq*100);
    filterChart.update()
}

function freqChartRefresh()
{
    freq = sliderFreq.value;
    dataSet = timeSec.map((x) => Math.sin(2*Math.PI*freq*x));
    data = new ComplexArray(dataSet);
    fftData = data.FFT().magnitude().map((x) => x/dataSet.length);
    freqs = new Array(fftData.length).fill().map((_, i) => Math.round(i*sampleRate/fftData.length));

    freqChart.data.datasets[0].data = fftData;
    freqChart.data.labels = freqs;
    freqChart.update();
}

function calcParameters()
{
    const createParam = (x) => `<label class="param">${x}</label>`;
    let text = createParam(`Основная частота: ${firstHarmonic} Гц`);
    text += createParam(`Частота дискретизации: ${sampleRate} Гц`);
    text += createParam(`Частота Найквиста: ${sampleRate/2} Гц`)
    
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
    labels: filterFreq,
    datasets: [{
    label: 'Filter',
    data: filterAmp,
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

sliderFreq.addEventListener("input", digitalChartRefresh);
sliderFreq.addEventListener("input", freqChartRefresh)
textBoxFreq.addEventListener("change", () => {sliderFreq.value = textBoxFreq.value; digitalChartRefresh(), freqChartRefresh();});
textBoxSampRate.addEventListener("change", () => {sampleRate = textBoxSampRate.value*firstHarmonic; calcParameters();})


