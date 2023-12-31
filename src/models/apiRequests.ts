
// **** Variables **** //

import { TripState, CustomerState, ScooterState } from "../types/ClientStates";
import EnvVars from "../constants/EnvVars";
import { adminJwt } from "./systemState";

// **** Helper functions **** //

async function _httpPut(url: string, data: any, token: string) {
    return fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "X-Access-Token": token
        },
        body: JSON.stringify(data)
    }).then((response) => {
        return response;
    });
}

async function _httpPost(url: string, data: any, token: string) {
    // console.log(data)
    return fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Access-Token": token
        },
        body: JSON.stringify(data)
    }).then((response) => {
        return response.json();
    }).then((result) => {
        return result;
    })
}

async function _httpGet(url: string) {
    return fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "X-Access-Token": adminJwt
        }
    }).then((response) => {
        return response.json();
    }).then((result) => {
        return result;
    });
}

// **** Functions **** //

async function putScooter(scooterId: number, data: ScooterState, token: string) {
    return await _httpPut(
        `${EnvVars.ApiHost}v1/scooter/${scooterId}`,
        data,
        token
    )
}

async function putCustomer(customerId: number, data: CustomerState, token: string) {
    return await _httpPut(
        `${EnvVars.ApiHost}v1/customer/${customerId}`,
        data,
        token
    )
}

async function putTrip(tripId: number, data: TripState, token: string) {
    return await _httpPut(
        `${EnvVars.ApiHost}v1/trip/${tripId}`,
        data,
        token
    )
}

async function getScooterPosition(scooterId: number) {
    const result = await _httpGet(`${EnvVars.ApiHost}v1/scooter/${scooterId}`);

    return [result.data.positionY, result.data.positionX];
}

async function getTrip(tripId: number) {
    const result = await _httpGet(`${EnvVars.ApiHost}v1/trip/${tripId}`);

    return result.data;
}

async function postTrip(data: TripState, token: string) {
    const result = await _httpPost(
        `${EnvVars.ApiHost}v1/trip/${data.tripId}`,
        data,
        token
    );

    return result.data;
}

// **** Exports **** //

export default {
    putScooter,
    putCustomer,
    putTrip,
    getScooterPosition,
    getTrip,
    postTrip
}
