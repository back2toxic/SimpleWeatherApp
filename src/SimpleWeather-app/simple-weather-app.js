import { html, PolymerElement } from '@polymer/polymer/polymer-element.js'
import '@polymer/polymer/lib/elements/dom-repeat'
import '@polymer/polymer/lib/elements/dom-if'
import '@polymer/paper-icon-button/paper-icon-button.js'
import '@polymer/iron-icons/iron-icons.js'
import '@polymer/iron-icons/communication-icons.js'
import { api, processWeatherData } from '../../src/js/script.js'
import '../../src/customComponents/foldable-content.js'
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

				.noSearch {
					margin-top: 50%;
					transform: translateY(-50%);
				}
			</style>

			<link rel="stylesheet" href="./src/css/style.css" />
			<div class$="wrapper [[_calculateStyle(weatherData.resolvedAddress)]]">
				<div class="searchWrapper">
					<iron-icon icon="communication:location-on"></iron-icon>
					<input
						type="text"
						class="searchCenter"
						on-keypress="isEnterPressed"
						placeholder="Enter town, state, country..."
						id="locationSearchBar"
					/>
					<iron-icon id="searchButton" icon="icons:search" on-click="getWeatherData"></iron-icon>
				</div>
				<div>[[errorMessage]]</div>
				<div>
					<template is="dom-if" if="[[weatherData.resolvedAddress]]">
						<div class="weatherCurrent">
							<h2 class="headline">Current weather for [[weatherData.resolvedAddress]]</h2>
							<div class="grid imageDescriptionGrid">
								<img class="forecastIcon" src="./src/img/weather/[[weatherData.current.icon]].svg" alt="" />
								<span class="description">[[weatherData.description]]</span>
							</div>
							<div class="grid">
								<div class="temperature">[[weatherData.current.temperature]]° (feels like [[weatherData.current.feelslike]]°)</div>
								<div class="rainmeasure">[[weatherData.current.precip]]mm / [[weatherData.current.precipprob]]%</div>
								<div class="snow">[[weatherData.current.snow]]cm / depth [[weatherData.current.snowdepth]]cm</div>
								<div class="wind">
									<iron-icon icon="icons:arrow-upward" style$="transform: rotate([[weatherData.current.winddir]]deg);"></iron-icon>
									[[weatherData.current.windspeed]]km/h
								</div>
								<div class="uvindex">[[weatherData.current.uvindex]]</div>
							</div>
						</div>
						<template is="dom-repeat" items="[[weatherData.days]]" as="day">
							<foldable-content data="[[day]]" headline="[[day.datetime]]" opened="[[day.opened]]"></foldable-content>
						</template>
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
			errorMessage: {
				type: String,
				value: '',
			},
		}
	}

	displayLocationError() {
		this.$.locationSearchBar.style.background = '#ffeeee'
	}

	hideLocationError() {
		delete this.$.locationSearchBar.style.background
	}

	getWeatherData() {
		const location = this.$.locationSearchBar.value
		this.set('errorMessage', '')
		this.hideLocationError()
		if (location.trim() == '') {
			this.displayLocationError()
			return false
		}

		let query = String.format(api.query, encodeURIComponent(location), api.key)
		// query = 'src/js/dummydata.json'
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
						this.set('errorMessage', errorMessage)
						console.log(errorMessage)
					})
				} else {
					//no additional error information
				}
			})
	}

	isEnterPressed(event) {
		if (event.charCode == 13) this.getWeatherData()
	}

	_getTempMinForToday() {
		return this.get('weatherData').days[0].tempmin
	}
	_getTempMaxForToday() {
		return this.get('weatherData').days[0].tempmax
	}

	_calculateStyle(data) {
		return data ? '' : 'noSearch'
	}
}

window.customElements.define('simple-weather-app', SimpleWeatherApp)

