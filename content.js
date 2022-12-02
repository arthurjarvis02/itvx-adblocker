function removeAds() {

    console.log("ITVX Adblocker Active")

    elem = document.getElementsByClassName("genie-container")[0]

    if (elem) {

        attrib = elem.getAttribute("data-video-id")

        if (!attrib) {

            console.log("Video ID not found");
            return;
        }

        rawId = attrib.split("/").slice(-1)[0];
        idBase = rawId.split(".")[0].replaceAll("_", "/");
        idIndex = rawId.split(".")[1];

        if (!idBase || !idIndex) {

            console.log("Video ID in unknown format");
            return;
        }

        console.log("Episode IDs:", rawId, idBase, idIndex);

        timestamp = Date.now() - 60000
        breaksWatched = {
            indexes: [...Array(20).keys()],
            timestamp: timestamp
        }

        storage = JSON.parse(localStorage.getItem("genie-productions")) || {};
        storage[idBase] = storage[idBase] || {};
        storage[idBase][idIndex] = storage[idBase][idIndex] || {};
        storage[idBase][idIndex].breaksWatched = breaksWatched;

        localStorage.setItem("genie-productions", JSON.stringify(storage));

        console.log("Removed ad breaks 1-20")

    } else {

        console.log("Video element not found");
    }
}

removeAds();