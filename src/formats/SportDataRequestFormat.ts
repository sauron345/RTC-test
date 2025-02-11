import {score} from "../utils";

export default interface SportDataRequestFormat {
    id: string

    status: "LIVE" | "REMOVED" | "PRE"

    scores: Set<score> | {}

    startTime: string

    sport: string

    competitors: {
        "HOME": { "type": "HOME"; "name": string },
        "AWAY": { "type": "AWAY"; "name": string },
    }

    competition: string
}
