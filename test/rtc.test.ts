import {beforeEach, afterAll, describe, expect, it, beforeAll} from 'vitest';
import {eventsResponseStorageFormat, stateDataFormat} from "../src/utils.js";
import ReceivedStateExtractor from "../src/api-state-handlers/ReceivedStateExtractor.js";
import ReceivedStateDecoder from "../src/api-state-handlers/ReceivedStateDecoder.js";
import ResponseFormatConverter from "../src/ResponseFormatConverter.js";
import * as fs from "node:fs";

let mappingsDataStr = fs.readFileSync('test/resources/mappings_storage.json', 'utf8')
let receivedStateDecoder = new ReceivedStateDecoder(JSON.parse(mappingsDataStr).mappings)
let receivedStateExtractor = new ReceivedStateExtractor()
let decodedStorageConverter = new ResponseFormatConverter()

let encodedEventStateStr = fs.readFileSync('test/resources/encoded_events_data.json', 'utf8')
let encodedEventState = JSON.parse(encodedEventStateStr)

let sportEncodedStorage = receivedStateExtractor.executeAndGetResult(encodedEventState.odds)
let sportDecodedStorage = receivedStateDecoder.executeAndGetResultFrom(sportEncodedStorage)
let responseFormatStorage = decodedStorageConverter.executeAndGetResult(sportDecodedStorage)

let updatedEventStateStr = fs.readFileSync('test/resources/updated_event_data.json', 'utf8')
let updatedEventState: stateDataFormat = JSON.parse(updatedEventStateStr)

const outputStr: string = fs.readFileSync('test/resources/expected_output.json', 'utf8')
const outputObj: eventsResponseStorageFormat = JSON.parse(outputStr)

describe('processing events states to response format test', () => {

    it('event with full data', () => {
        let eventID = '4bb7b78f-6a23-43d0-a61a-1341f03f64e0'
        expect(responseFormatStorage[eventID]).toStrictEqual(outputObj[eventID]);
    });

    it('event without specified scores', () => {
        expect(responseFormatStorage["995e0722-4118-4f8e-a517-82f6ea240673"].scores)
            .toStrictEqual({CURRENT: {type: "CURRENT", home: "0", away: "0"}});
    })

    it('event with REMOVED status', () => {
        if (Object.keys(sportDecodedStorage).length !== Object.keys(responseFormatStorage).length)
            expect({}).toStrictEqual({});
        else
            expect(undefined).toStrictEqual({});
    });

    describe('updated last event data', () => {
        sportEncodedStorage = receivedStateExtractor.executeAndGetResult(updatedEventState.odds)
        sportDecodedStorage = receivedStateDecoder.executeAndGetResultFrom(sportEncodedStorage)
        responseFormatStorage = decodedStorageConverter.executeAndGetResult(sportDecodedStorage)

        it('updated scores', () => {
            expect(responseFormatStorage['fd903e06-9a7d-423d-8869-1c060cc0b62d'].scores).toStrictEqual({
                    CURRENT: {type: "CURRENT", home: "1", away: "2"}, PERIOD_1: {type: "PERIOD_1", home: "2", away: "3"}
                }
            )
        })

        it('updated status', () => {
            expect(responseFormatStorage['fd903e06-9a7d-423d-8869-1c060cc0b62d'].status).toStrictEqual("PRE")
        })

    });

})
