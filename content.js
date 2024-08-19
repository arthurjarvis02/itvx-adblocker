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

    return count;
}

function run() {

    console.log(logMsg("Running"));

    const [idBase, idIndex] = getIdsFromNextJsData();

    if (!idBase || !idIndex) {

        console.error(logMsg("Video ID not found"));
        return;
    }

    console.log(logMsg(`Episode IDs: ${idBase}, ${idIndex}`));

    const count = addFakeBreaksWatched(idBase, idIndex);

    console.log(logMsg(`Removed ad breaks 1-${count}`));
}

run();