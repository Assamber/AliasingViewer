const ctx = document.getElementById('myChart');
const sliderFreq = document.getElementById("rgFreq");
const textBoxFreq = document.getElementById("tbFreq");
const textBoxSampRate = document.getElementById('tbSampleFreq');

let sampleRate = textBoxSampRate.value*50;
let freq = textBoxFreq.value;
let sampleNumber = 50;
let sinTime = new Array(sampleNumber).fill("").map((_, i) => i/sampleNumber*(1/freq));
let sinAmp = sinTime.map((x) => Math.sin(2*Math.PI*freq*x));
console.log(sampleRate);


function sliderRefresh()
{
    freq = sliderFreq.value;
    textBoxFreq.value = freq
    T = Math.max(1/freq, 1/sampleRate*sampleNumber);
    sinTime = new Array(sampleNumber).fill("").map((_, i) => i/sampleNumber*T);
    sinAmp = sinTime.map((x) => Math.sin(2*Math.PI*freq*x))
    dataChart.data.datasets[0].data = sinAmp;
    dataChart.data.labels = sinTime.map((x) => (x*1000).toFixed(3))
    dataChart.update();
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


sliderFreq.addEventListener("input", sliderRefresh);
textBoxFreq.addEventListener("change", (x) => {sliderFreq.value = textBoxFreq.value; sliderRefresh()});