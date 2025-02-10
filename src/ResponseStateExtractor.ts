import SportEventDataFormat from "./SportEventDataFormat";

export default class ResponseStateExtractor {

    private readonly encodedText: string
    private sportEventsStorage: Set<SportEventDataFormat>
    private sportEventData: SportEventDataFormat

    constructor(encodedText: string) {
        this.encodedText = encodedText
    }

    executeAndGetResult(): Set<SportEventDataFormat> {
        let seperatedSportEventData: string[]
        for (let sportEventData of this.encodedText.split('\n')) {
            seperatedSportEventData = sportEventData.split(',')
            this.assignEventFields(seperatedSportEventData)
            this.sportEventsStorage.add(this.sportEventData)
        }
        return this.sportEventsStorage
    }

    private assignEventFields(seperatedSportEventData: string[]) {
        let index = 0
        for (let field of Object.keys(this.sportEventData)) {
            if (field == "scores") {
                this.sportEventData[field] = seperatedSportEventData[index].split('|')
            } else {
                this.sportEventData[field] = seperatedSportEventData[index]
            }
        }
    }

}
