'use strict'

export const api = {
	key: '94S8MJ9FJ2TYDFPF4ESUWMYYR',
	query: `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/{0}?unitGroup=metric&key={1}&contentType=json&iconSet=icons2`,
}

export async function getWeatherInfo(location) {}
export function processWeatherData(data) {
	const weather = {
		resolvedAddress: data.resolvedAddress,
		description: data.description,
		current: getCurrentWeather(data.currentConditions),
		days: getDailyWeather(data.days),
	}
	return weather
}

export function getCurrentWeather(data) {
	return {
		sunrise: data.sunrise,
		sunset: data.sunset,
		datetime: data.datetime,
		temperature: data.temp,
		feelslike: data.feelslike,
		humidity: data.humidity,
		windspeed: data.windspeed,
		winddir: data.winddir,
		uvindex: data.uvindex,
		conditions: data.conditions,
		precip: data.precip,
		precipprob: data.precipprob,
		snow: data.snow,
		snowdepth: data.snowdepth,
		icon: data.icon,
	}
}
export function getDailyWeather(data) {
	const days = data.reduce((acc, day) => {
		acc.push({
			sunrise: day.sunrise,
			sunset: day.sunset,
			datetime: day.datetime,
			temperature: day.temp,
			tempmin: day.tempmin,
			tempmax: day.tempmax,
			feelslike: day.feelslike,
			humidity: day.humidity,
			windspeed: day.windspeed,
			winddir: day.winddir,
			uvindex: day.uvindex,
			conditions: day.conditions,
			precip: day.precip,
			precipprob: day.precipprob,
			snow: day.snow,
			snowdepth: day.snowdepth,
			icon: day.icon,
			hourly: day.hours.reduce((h, hour) => {
				h.push({
					datetime: hour.datetime,
					temperature: hour.temp,
					feelslike: hour.feelslike,
					humidity: hour.humidity,
					windspeed: hour.windspeed,
					winddir: hour.winddir,
					uvindex: hour.uvindex,
					conditions: hour.conditions,
					precip: hour.precip,
					precipprob: hour.precipprob,
					snow: hour.snow,
					snowdepth: hour.snowdepth,
					icon: hour.icon,
				})
				return h
			}, []),
		})
		return acc
	}, [])
	return days
}
