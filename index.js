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
	let {email} = req.query

	let startDate = new Date();
	let calc = new Date();
	let endTime = calc.setDate(calc.getDate() + 5);
	let endDate = new Date(endTime);
	try {
		calendar.events
			.list({
				auth: auth,
				calendarId: email,
				timeMin: startDate,
				timeMax: endDate,
				timeZone: "Africa/Kigali",
			})
			.then((result) => {
				let items = result["data"]["items"];
				res.send({ events: items, message: "Success" });
			})
			.catch(err => res.send({message: "You have not shared your calendar with The App"}));
	} catch (error) {
		console.log(`Error in getEvents --> ${error}`);
		res.send({ message: "An error occured", code: 500 });
	}
});

app.get("/next", (req, res) => {
	res.send({ next: new Date().getTime() });
});
app.get("/switch/:type", (req, res) => {
	const { type } = req.params;

	if (type === "on") {
		return res.send({ msg: "turning on the alarm" });
	}
	if (type === "off") {
		return res.send({ msg: "turning off the alarm" });
	}
	res.send({ msg: "the type is wrong" });
});

app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
