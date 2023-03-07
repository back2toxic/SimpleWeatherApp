import { html, PolymerElement } from '@polymer/polymer/polymer-element.js'
import '@polymer/polymer/lib/elements/dom-repeat'
import '@polymer/polymer/lib/elements/dom-if'
import '@polymer/paper-icon-button/paper-icon-button.js'
import '@polymer/iron-icons/iron-icons.js'
import '@polymer/iron-icons/communication-icons.js'
import { api, processWeatherData } from '../../src/js/script.js'

/**
 * @customElement
 * @polymer
 */
class SimpleWeatherApp extends PolymerElement {
	static get template() {
		return html`
			<style>
				:host {
					display: block;
				}
			</style>
			<link rel="stylesheet" href="./src/css/style.css" />
			<div class="wrapper">
				<div class="searchWrapper">
					<iron-icon icon="communication:location-on"></iron-icon>
					<input type="text" class="searchCenter" placeholder="Enter location..." id="locationSearchBar" />
					<iron-icon id="searchButton" icon="icons:search" on-click="getWeatherData"></iron-icon>
					<fa-icons class="fa-solid fa-magnifying-glass"></fa-icons>
				</div>
				<div>
					<template is="dom-if" if="[[weatherData.resolvedAddress]]">
						<div class="weatherCurrent">
							<div>Weather for [[weatherData.resolvedAddress]]</div>
							<img src="./src/img/weather/[[weatherData.current.icon]].svg" alt="" />
							<div class="description">[[weatherData.description]]</div>
							<div class="temperature">
								[[weatherData.current.temperature]] (feels like [[weatherData.current.feelslike]] / Min. [[_getTempMinForToday()]] / Max.
								[[_getTempMaxForToday()]])
							</div>
							<div class="rainmeasure">[[weatherData.current.precip]]mm / [[weatherData.current.precipprob]]%</div>
							<div class="wind">
								<iron-icon icon="icons:arrow-upward" style$="transform: rotate([[weatherData.current.winddir]]deg);"></iron-icon>
								[[weatherData.current.windspeed]]km/h
							</div>
						</div>
						<div class="weatherDays"></div>
					</template>
				</div>
			</div>
		`
	}
	static get properties() {
		return {
			weatherData: {
				type: Object,
				value() {
					return {}
				},
			},
		}
	}

	getWeatherData() {
		const location = this.$.locationSearchBar.value

		let query = String.format(api.query, encodeURIComponent(location), api.key)
		query = 'src/js/dummydata.json'
		console.log(query)

		fetch(query)
			.then((response) => {
				if (!response.ok) {
					throw response //check the http response code and if isn't ok then throw the response as an error
				}
				return response.json() //parse the result as JSON
			})
			.then((response) => {
				//response now contains parsed JSON ready for use
				this.set('weatherData', processWeatherData(response))
				console.log(this.get('weatherData'))
			})
			.catch((errorResponse) => {
				if (errorResponse.text) {
					//additional error information
					errorResponse.text().then((errorMessage) => {
						console.log(errorMessage)
					})
				} else {
					//no additional error information
				}
			})
	}

	_getTempMinForToday() {
		return this.get('weatherData').days[0].tempmin
	}
	_getTempMaxForToday() {
		return this.get('weatherData').days[0].tempmax
	}
}

window.customElements.define('simple-weather-app', SimpleWeatherApp)

