const ctx = document.getElementById('digitalChart');
const freqCtx = document.getElementById('freqChart');
const sliderFreq = document.getElementById("rgFreq");
const textBoxFreq = document.getElementById("tbFreq");
const textBoxSampRate = document.getElementById('tbSampleFreq');
const sampleNumber = 50;

let freq = textBoxFreq.value;
let sampleRate = textBoxSampRate.value*50;
let timeSec = new Array(sampleRate).fill().map((_, i) => i/sampleRate);
let sinTime = new Array(sampleNumber).fill().map((_, i) => i/sampleNumber*(1/freq));
let sinAmp = sinTime.map((x) => Math.sin(2*Math.PI*freq*x));

let dataSet = timeSec.map((x) => Math.sin(2*Math.PI*freq*x));
let data = new ComplexArray(dataSet)
let fftData = data.FFT().magnitude();
let freqs = new Array(fftData.length).fill().map((_, i) => i*sampleRate/fftData.length);

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
}

function freqChartRefresh()
{
    freq = sliderFreq.value;
    dataSet = timeSec.map((x) => Math.sin(2*Math.PI*freq*x));
    data = new ComplexArray(dataSet);
    fftData = data.FFT().magnitude();
    freqs = new Array(fftData.length).fill().map((_, i) => i*sampleRate/fftData.length);

    freqChart.data.datasets[0].data = fftData;
    freqChart.data.labels = freqs;
    freqChart.update();
}



let dataChart = new Chart(ctx, {
type: 'line',
data: {
    labels: sinTime.map((x) => (x*1000).toFixed(1)),
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
    label: 'Sin wave',
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


sliderFreq.addEventListener("input", digitalChartRefresh);
textBoxFreq.addEventListener("change", (x) => {sliderFreq.value = textBoxFreq.value; digitalChartRefresh()});
sliderFreq.addEventListener("change", freqChartRefresh)

