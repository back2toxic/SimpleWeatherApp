import { html, PolymerElement } from '@polymer/polymer/polymer-element.js'
import '@polymer/paper-tooltip/paper-tooltip'
import '../../src/customComponents/weather-chart.js'

/**
 * @customElement
 * @polymer
 */
class FoldableContent extends PolymerElement {
	static get template() {
		return html`
			<style>
				:host {
					display: block;
				}
			</style>
			<link rel="stylesheet" href="./src/css/style.css" />
			<div class="foldable">
				<div class="dayHeading" on-click="_clicked">[[_computeDayName(headline)]]</div>
				<template is="dom-if" if="[[opened]]">
					<div class="grid imageDescriptionGrid">
						<img class="forecastIcon" src="./src/img/weather/[[data.icon]].svg" alt="" />
						<div class="description">[[data.description]]</div>
					</div>
					<div class="grid">
						<div class="temperature">[[data.temperature]]° ([[data.tempmin]]° - [[data.tempmax]]°)</div>
						<div class="sunrise">[[data.sunrise]]</div>
						<div class="sunset">[[data.sunset]]</div>
						<div class="rainmeasure">[[data.precip]]mm / [[data.precipprob]]%</div>
						<div class="snow">[[data.snow]]cm / depth [[data.snowdepth]]cm</div>
						<div class="wind">
							<iron-icon icon="icons:arrow-upward" style$="transform: rotate([[data.winddir]]deg);"></iron-icon>
							[[data.windspeed]]km/h
						</div>
						<div class="uvindex">[[data.uvindex]]</div>
					</div>
					<weather-chart data="[[data.hourly]]"></weather-chart>
					<div class="hourlyDataWrapper">
						<div on-click="_toggleHourlyData">Show hourly data</div>
						<template is="dom-if" if="[[hourlyDataVisible]]">
							<template is="dom-repeat" items="[[data.hourly]]" as="hour">
								<div class="hourlyData grid hourGrid">
									<div class="time">[[_max5(hour.datetime)]]</div>
									<img class="forecastIcon" src="./src/img/weather/[[hour.icon]].svg" alt="" />
									<div class="grid gridSmall">
										<div class="temperature">
											[[hour.temperature]]° ([[hour.feelslike]]°)<paper-tooltip>Feels like ([[hour.feelslike]]°)</paper-tooltip>
										</div>
										<div class="rainmeasure">[[hour.precip]]mm</div>
										<div class="snow">[[hour.snow]]cm</div>
										<div class="wind">
											<iron-icon icon="icons:arrow-upward" style$="transform: rotate([[hour.winddir]]deg);"></iron-icon
											>[[hour.windspeed]]km/h
										</div>
										<div class="uvindex">[[hour.uvindex]]</div>
									</div>
								</div>
							</template>
						</template>
					</div>
				</template>
			</div>
		`
	}
	connectedCallback() {
		super.connectedCallback()
	}
	static get properties() {
		return {
			headline: {
				type: String,
				value: 'Click here to open',
			},
			opened: {
				type: Boolean,
				value: true,
			},
			hourlyDataVisible: {
				type: Boolean,
				value: false,
			},
			data: {
				type: Object,
				value() {
					return {}
				},
			},
		}
	}
	_clicked() {
		this.set('opened', !this.get('opened'))
	}
	_calculateClass() {
		return this.get('opened') === true ? 'expanded' : 'collapsed'
	}
	_max5(t) {
		return t.substr(0, 5)
	}
	_computeDayName(date) {
		return new Intl.DateTimeFormat('en-db', { dateStyle: 'full' }).format(new Date(date))
	}
	_toggleHourlyData() {
		this.set('hourlyDataVisible', !this.get('hourlyDataVisible'))
	}
}

window.customElements.define('foldable-content', FoldableContent)
