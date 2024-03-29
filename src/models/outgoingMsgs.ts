import logger from "jet-logger";

import { clientStore } from "../server";
import Client from "../classes/Client";
import { systemState } from "./systemState";
import { ScooterState } from "../types/ClientStates";

// **** Variables **** //

// **** Helper functions **** //

function _send(list: string, message: string) {
    // logger.info(`Sending subscribers "${list}" message: ${message}`);

    for (const subscriber of clientStore._subscribed[list]) {
        subscriber.connection.send(message);
    }
}

function _sendLimitedScooter(data: any) {
    const limitedData: {
        message: "scooter",
        scooterId: number,
        [index: string]: any
    } = {
        message: "scooter",
        scooterId: data.scooterId
    }

    const scooters = systemState.getState("scooters") as Array<ScooterState>;
    if (!scooters) {
        return;
    }
    const scooter = scooters[limitedData.scooterId]

    // flag to determine if the scooter update is
    // relevant for the limited data subscription
    let sendLimitedData = false;

    if (!scooter) {
        sendLimitedData = true;
        limitedData["remove"] = true;
    } else {
        for (const [key, value] of Object.entries(data)) {
            if (
                key === "remove" ||
                (
                    scooter.available &&
                    ["positionX", "positionY", "battery"].includes(key)
                )
            ) {
                sendLimitedData = true;
                limitedData[key] = value;
            }
        }
    }

    if (sendLimitedData) {
        const message = JSON.stringify(limitedData);
        _send("scooterLimited", message);
    }
}

function _isScooterReadyToUse (scooter: ScooterState) {
return (
        scooter.available &&
        scooter.battery &&
        scooter.battery >= 0.3 &&
        !(scooter.beingServiced) &&
        !(scooter.charging) &&
        !(scooter.decomissioned) &&
        !(scooter.disabled)
    );
}

// **** Functions **** //

function sendScooter(data: any) {
    const message = JSON.stringify(data);
    _send("scooter", message);
    if (data.available === false) {
        data = {
            ...data,
            remove: true
        }
    }
    _sendLimitedScooter(data);
}

function sendCustomer(data: any) {
    const message = JSON.stringify(data);
    _send("customer", message);
}

function sendTrip(data: any) {
    const message = JSON.stringify(data);
    _send("trip", message);
}

function sendAllScooters(client: Client) {
    const scooters = systemState.getState("scooters").slice(1)

    for (const scooter of scooters) {
        if (scooter === undefined) { continue; }

        const message = JSON.stringify({
            message: "scooter",
            ...scooter
        });
        client.connection.send(message);
    }
}

function sendAllScootersLimited(client: Client) {
    const scooters = systemState.getState("scooters") as Array<ScooterState>

    for (const scooter of scooters) {
        if (scooter === undefined) { continue; }

        if (_isScooterReadyToUse(scooter)) {
            const message = JSON.stringify({
                message: "scooter",
                scooterId: scooter.scooterId,
                positionX: scooter.positionX,
                positionY: scooter.positionY,
                battery: scooter.battery
            });
            client.connection.send(message);
        }
    }
}

function sendAllTrips(client: Client) {
    const trips = systemState.getState("trips")

    for (const trip of trips) {
        if (trip === undefined) { continue; }

        const message = JSON.stringify({
            message: "trip",
            ...trip
        });
        client.connection.send(message);
    }
}

function sendAllCustomers(client: Client) {
    // cut off the first item, since its always empty
    const customers = systemState.getState("customers")

    for (const customer of customers) {
        if (customer === undefined) { continue; }

        const message = JSON.stringify({
            message: "customer",
            ...customer
        });
        client.connection.send(message);
    }
}

function sendTripStart(client: Client, responseBody: any) {
    client.connection.send(JSON.stringify({
        message: "tripStart",
        tripId: responseBody.tripId
    }));
}

function sendTripEnd(client: Client, data: {tripId: number, customerId: number, scooterId: number}) {
    _send("trip", JSON.stringify({
        message: "trip",
        ...data,
        timeEnded: new Date().toISOString()
    }));
}

// **** Exports **** //

export {
    sendScooter,
    sendCustomer,
    sendTrip,
    sendAllScooters,
    sendAllScootersLimited,
    sendAllCustomers,
    sendAllTrips,
    sendTripStart,
    sendTripEnd
};
