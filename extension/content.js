const logMsg = (msg) => `[ITVX Adblocker] ${msg}`;

function pollForPlayerVersion(intervalMs = 500, attempts = 10) {

    return new Promise((resolve) => {

        (function poll(attemptsLeft) {

            if (typeof window.__FE_PLAYER_VERSION__ === "string") {
                resolve(window.__FE_PLAYER_VERSION__);
                return;
            }

            if (attemptsLeft <= 0) {
                resolve(null);
                return;
            }

            setTimeout(() => poll(attemptsLeft - 1), intervalMs);
        })(attempts);
    });
}

function getIdsFromNextJsData() {

    const json = JSON.parse(document.getElementById("__NEXT_DATA__").innerText);

    console.log(logMsg("Finding episode ID in NEXT_DATA"))
    
    let productionId = json.props.pageProps.episode?.productionId;

    if (!productionId) {

        console.log(logMsg("No episode selected, finding video ID from first episode in selected series"));

        const selectedSeries = json.props.pageProps.seriesList.find(series => series.seriesNumber === json.props.pageProps.initialSelectedSeries);

        productionId = selectedSeries.titles[0].productionId;
    }

    return productionId.split("#");
}

function addFakeBreaksWatched(encryption, idBase, idIndex, count=20) {

    const raw = encryption.getItem("productions") ?? encryption.getLegacyItem("productions");
    const storage = JSON.parse(raw) || {};

    encryption.setItem("productions", JSON.stringify(
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

async function run() {

    console.log(logMsg("Running"));

    const version = await pollForPlayerVersion();

    if (!version) {
        console.warn(logMsg("__FE_PLAYER_VERSION__ not found"));
    }

    console.log(logMsg(`Detected FE player version '${version ?? "fallback"}'`));

    const encryption = new Encryption(version);

    const [idBase, idIndex] = getIdsFromNextJsData();

    if (!idBase || !idIndex) {

        console.error(logMsg("Video ID not found"));
        return;
    }

    console.log(logMsg(`Episode IDs: ${idBase}, ${idIndex}`));

    const count = addFakeBreaksWatched(encryption, idBase, idIndex);

    console.log(logMsg(`Removed ad breaks 1-${count}`));
}

run();