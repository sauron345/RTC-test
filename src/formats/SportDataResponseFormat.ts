import {defaultScore, score} from "../utils";

export default interface SportDataResponseFormat {
    id: string

    status: "LIVE" | "REMOVED" | "PRE"

    scores: Set<score> | defaultScore

    startTime: string

    sport: string

    competitors: {
        HOME: { type: "HOME"; name: string },
        AWAY: { type: "AWAY"; name: string },
    }

    competition: string
}
