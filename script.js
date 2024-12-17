const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const needleLength = 50;
const lineSpacing = 100;
let totalNeedles = 0;
let crossingNeedles = 0;
let piEstimates = [];
let needleCounts = [];
let chart;

function drawLines() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#000';
    for (let y = lineSpacing; y < canvas.height; y += lineSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

function dropNeedles() {
    const numNeedles = 100;
    for (let i = 0; i < numNeedles; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const angle = Math.random() * Math.PI;
        const xEnd = x + needleLength * Math.cos(angle);
        const yEnd = y + needleLength * Math.sin(angle);

        ctx.strokeStyle = '#f00';
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(xEnd, yEnd);
        ctx.stroke();

        totalNeedles++;
        if (Math.floor(y / lineSpacing) !== Math.floor(yEnd / lineSpacing)) {
            crossingNeedles++;
        }
    }
    updatePiValue();
    updateChart();
}

function updatePiValue() {
    if (crossingNeedles > 0) {
        const piEstimate = (2 * needleLength * totalNeedles) / (crossingNeedles * lineSpacing);
        document.getElementById('piValue').textContent = piEstimate.toFixed(5);
        piEstimates.push(piEstimate);
        needleCounts.push(totalNeedles);
    }
}

function resetSimulation() {
    totalNeedles = 0;
    crossingNeedles = 0;
    piEstimates = [];
    needleCounts = [];
    document.getElementById('piValue').textContent = '0';
    drawLines();
    if (chart) {
    chart.reset().update();
    }
    updateChart();
}

function updateChart() {
    const chartCanvas = document.getElementById('chart').getContext('2d');
    if (chart) {
        chart.data.labels = needleCounts;
        chart.data.datasets[0].data = piEstimates;
        chart.data.datasets[1].data = needleCounts.map(() => Math.PI);
        chart.update();
    } else {
        chart = new Chart(chartCanvas, {
            type: 'line',
            data: {
                labels: needleCounts,
                datasets: [
                    {
                        label: 'Estimated π',
                        data: piEstimates,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 2,
                        fill: false
                    },
                    {
                        label: 'Real π',
                        data: needleCounts.map(() => Math.PI),
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        fill: false
                    }
                ]
            },
            options: {
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Number of Needles'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Estimated π'
                        },
                        beginAtZero: false
                    }
                }
            }
        });
    }
}

drawLines();
