
const ctx = document.getElementById('myChart');
const period = 0.02;
let freq = 50
const samplesNumber = 100;
const sinTime = new Array(samplesNumber).fill("").map((_, i) => i/samplesNumber*period)
let sinAmp = sinTime.map((x) => Math.sin(2*Math.PI*freq*x))

const sliderFreq = document.getElementById("rgFreq");
const textFreq = document.getElementById("tbFreq");

function sliderRefresh()
{
    freq = sliderFreq.value;
    sinAmp = sinTime.map((x) => Math.sin(2*Math.PI*freq*x))
    dataChart.data.datasets[0].data = sinAmp;
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
sliderFreq.addEventListener("input", (x) => textFreq.value = sliderFreq.value)
