const logMsg = (msg) => `[ITVX Adblocker] ${msg}`;

function getIdsFromNextJsData() {

    const json = JSON.parse(document.getElementById("__NEXT_DATA__").innerText);

    console.log(logMsg("Finding episode ID in NEXT_DATA"))
    
    let productionId = json.props.pageProps.episode?.productionId;

    if (!productionId) {

        console.log("No episode selected, finding video ID from first episode in selected series")

        const selectedSeries = json.props.pageProps.seriesList.find(series => series.seriesNumber === json.props.pageProps.initialSelectedSeries);

        productionId = selectedSeries.titles[0].productionId;
    }

    return productionId.split("#");
}

function addFakeBreaksWatched(idBase, idIndex, count=20) {

    const storage = JSON.parse(localStorage.getItem("productions")) || {};

    localStorage.setItem("productions", JSON.stringify(
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

const DELAY_MS = 200;
const BREAKS_WATCHED_COUNT = 20;

console.log(logMsg(`Waiting ${DELAY_MS}ms`));

setTimeout(() => {

    console.log(logMsg("Running"));

    const [idBase, idIndex] = getIdsFromNextJsData();

    if (!idBase || !idIndex) {

        console.error(logMsg("Video ID not found"));
        return;
    }

    console.log(logMsg(`Episode IDs: ${idBase}, ${idIndex}`));

    addFakeBreaksWatched(idBase, idIndex, BREAKS_WATCHED_COUNT);

    console.log(logMsg(`Removed ad breaks 1-${BREAKS_WATCHED_COUNT}`));

}, DELAY_MS);