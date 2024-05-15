const logMsg = (msg) => `[ITVX Adblocker] ${msg}`;

function getIdsFromVideoElement() {

    const rawId = document.getElementsByClassName("genie-container")[0]?.getAttribute("data-video-id")?.split("/").slice(-1)[0];

    return [rawId?.split(".")[0].replaceAll("_", "/"), rawId?.split(".")[1]];
}

function addFakeBreaksWatched(idBase, idIndex, count=20) {

    const storage = JSON.parse(localStorage.getItem("genie-productions")) || {};

    localStorage.setItem("genie-productions", JSON.stringify(
        {
            ...storage,
            [idBase]: {
                ...storage[idBase],
                [idIndex]: {
                    breaksWatched: {
                        indexes: [...Array(count).keys()],
                        timestamp: Date.now()
                    }
                }
            }
        }
    ));
}

const DELAY_MS = 1000;
const BREAKS_WATCHED_COUNT = 20;

console.log(logMsg(`Waiting ${DELAY_MS}ms`));

setTimeout(() => {

    console.log(logMsg("Running"));

    const [idBase, idIndex] = getIdsFromVideoElement();

    if (!idBase || !idIndex) {

        console.error(logMsg("Video ID not found"));
        return;
    }

    console.log(logMsg(`Episode IDs: ${idBase}, ${idIndex}`));

    addFakeBreaksWatched(idBase, idIndex, BREAKS_WATCHED_COUNT);

    console.log(logMsg(`Removed ad breaks 1-${BREAKS_WATCHED_COUNT}`));

}, DELAY_MS);