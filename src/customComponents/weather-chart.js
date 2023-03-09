import { html, PolymerElement } from '@polymer/polymer/polymer-element.js'

/**
 * @customElement
 * @polymer
 */
class WeatherChart extends PolymerElement {
	static get template() {
		return html`
			<style>
				:host {
					display: block;
				}
			</style>
			<link rel="stylesheet" href="./src/css/style.css" />
			<canvas id="chart"></canvas>
		`
	}

	static get properties() {
		return {
			data: {
				type: Object,
				value() {
					return {}
				},
			},
		}
	}
	connectedCallback() {
		super.connectedCallback()

		const [labels, datasets] = this.getChartData()
		const ctx = this.$.chart
		setTimeout(() => {
			new Chart(ctx, {
				type: 'line',
				data: {
					labels,
					datasets,
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,
					scales: {
						tempScale: {
							id: 'y-axis-temp',
							position: 'left',
							type: 'linear',
						},
						rainScale: {
							beginAtZero: true,
							id: 'y-axis-rain-snow',
							position: 'right',
							type: 'linear',
						},
					},
				},
			})
		}, 100)
	}
	getChartData() {
		const chartData = [
			[],
			[
				{ label: 'Temperature in °C', yAxisID: 'tempScale', data: [], borderColor: '#DD2222' },
				{ label: 'Rain in mm', yAxisID: 'rainScale', data: [], borderColor: '#2222DD' },
				{ label: 'Snow in cm', yAxisID: 'rainScale', data: [], borderColor: '#b0b0b0' },
			],
		]
		// [labels, [[data label], [data values], [options]]
		return this.get('data').reduce((acc, hour) => {
			acc[0].push(hour.datetime.substr(0, 5))
			acc[1][0].data.push(hour.temperature)
			acc[1][1].data.push(hour.precip)
			acc[1][2].data.push(hour.snow)
			return acc
		}, chartData)
	}
}

window.customElements.define('weather-chart', WeatherChart)
