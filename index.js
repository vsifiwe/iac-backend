const express = require("express");
const { google } = require("googleapis");

const app = express();
require("dotenv").config();

const port = process.env.PORT;

const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);
const calendarId = process.env.CALENDAR_ID;

// Google calendar API Settings
const SCOPES = "https://www.googleapis.com/auth/calendar";
const calendar = google.calendar({ version: "v3" });

const auth = new google.auth.JWT(
	CREDENTIALS.client_email,
	null,
	CREDENTIALS.private_key,
	SCOPES
);

app.get("/events", (req, res) => {
	let startDate = new Date();
	let calc = new Date();
	let endTime = calc.setDate(calc.getDate() + 5);
	let endDate = new Date(endTime);
	try {
		calendar.events
			.list({
				auth: auth,
				calendarId: calendarId,
				timeMin: startDate,
				timeMax: endDate,
				timeZone: "Africa/Kigali",
			})
			.then((result) => {
				let items = result["data"]["items"];
				res.send({ events: items });
			});
	} catch (error) {
		console.log(`Error in getEvents --> ${error}`);
		res.send({ message: "An error occured", code: 500 });
	}
});

app.get("/next", (req, res) => {
	res.send({ next: new Date() });
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
