// JavaScript source code

const videoPlayerId = 'video-main';
const videoPipId = 'video-pip';


var playerMain;
var playerPip;

// TODO: debounce

let debouncer = true
let mainReady = false
let pipReady = false

function onPlayerReady(event) {
    // document.getElementById(event.target.f.id).style.borderColor = '#FF6D00';
    // playerMain.seekTo(0)
    mainReady = true
}

function onPipReady(event) {
    // playerPip.playVideo()
    // playerPip.pauseVideo()
    playerPip.seekTo(0)
    pipReady = true
}
function changeBorderColor(elId, playerStatus) {
    var color;
    let thePlayer = elId === videoPlayerId ? playerMain : playerPip
    let altPlayer = elId === videoPlayerId ? playerPip : playerMain
    if (playerStatus == -1) {
        color = "#37474F"; // unstarted = gray
    } else if (playerStatus == 0) {
        color = "#FFFF00"; // ended = yellow
    } else if (playerStatus == 1) {
        color = "#33691E"; // playing = green
        console.log('theplayer', thePlayer)
        // let time = thePlayer.getCurrentTime()
        // altPlayer.seekTo(time)
        altPlayer.playVideo()
    } else if (playerStatus == 2) {
        altPlayer.pauseVideo();
        color = "#DD2C00"; // paused = red
    } else if (playerStatus == 3) {
        color = "#AA00FF"; // buffering = purple
        altPlayer.playVideo();
    } else if (playerStatus == 5) {
        color = "#FF6DOO"; // video cued = orange
    }
    if (color) {
        // keep for dev
        // document.getElementById(elId).style.borderColor = color;
    }
}
function onPlayerStateChange(event) {
    console.log('state', event)
    if (mainReady && pipReady && debouncer) {
        changeBorderColor(event.target.f.id, event.data);
        debouncer = false
        setTimeout(function () {
            debouncer = true
        }, 200)
    }
}

function onPlayerError(err) {
    console.error(err)
}

function onYouTubeIframeAPIReady() {

    playerMain = new YT.Player(videoPlayerId, {
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
            'onError': onPlayerError
        }
    });

    playerPip = new YT.Player(videoPipId, {
        events: {
            'onReady': onPipReady,
            'onStateChange': onPlayerStateChange,
            'onError': onPlayerError
        }
    });
}
window.onload = function () {
    let query = queryObject(window.location.search);
    const v1 = query.v1 || "";
    const v2 = query.v2 || "";
    if (v1 && v2) {
        const link1 = addTube(v1);
        const link2 = addTube(v2);

        document.getElementById("video1-input").value = link1;
        document.getElementById("video2-input").value = link2;
        const vMainEl = document.getElementById("video-main");
        const vPipEl = document.getElementById("video-pip");
        vMainEl.src = link1 + "?cc_load_policy=1&enablejsapi=1&origin=" + window.location.host;
        vPipEl.src = link2 + "?origin=" + window.location.host + "&controls=0&enablejsapi=1";
        vMainEl.classList.add('active');
        vPipEl.classList.add('active');
        createLink(v1, v2);
    } else if (v1) {
        document.getElementById("video1-input").value = addTube(v1);
    } else if (v2) {
        document.getElementById("video2-input").value = addTube(v2);
    }

    var tag = document.createElement('script');
    tag.id = 'iframe-demo';
    tag.src = 'https://www.youtube.com/iframe_api';
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
};
function queryObject(queryString) {
    let queryStrings = queryString.replace("?", "").split("&");
    let query = {};
    for (let i = 0, len = queryStrings.length; i < len; i++) {
        const parts = queryStrings[i].split("=");
        query[parts[0]] = parts[1];
    }
    return query;
}
function createLinkHandler(evt) {
    evt.preventDefault();
    const inputs = filterForms(evt.target);
    const v1 = stripTube(inputs.video1);
    const v2 = stripTube(inputs.video2);
    if (v1 && v2) {
        createLink(v1, v2);
    }
}
function createLink(v1, v2) {
    const link =
        window.location.href.split("?")[0] + "?v1=" + v1 + "&v2=" + v2;
    document.getElementById("new-link").href = link;
    document.getElementById("new-link-text").value = link;
}
function filterForms(target) {
    const inputs = target.querySelectorAll("input");
    let filtered = {};

    inputs.forEach((entry) => {
        const name = entry.name;
        if (entry.multiple) {
            const options = entry.selectedOptions;
            const files = entry.files;
            const values = [];
            if (options) {
                for (let pair of options) {
                    values.push(pair.value);
                }
            } else if (files) {
                for (let file of files) {
                    values.push(file);
                }
            }
            if (values.length) {
                filtered[name] = values;
            }
        } else {
            const val = entry.value;
            if (typeof val === "string") {
                filtered[name] = val;
            }
        }
    });
    return filtered;
}
function stripTube(link) {
    try {
        if (link.indexOf('/embed/') >= 0) {
            return link.split('/embed/')[1].split('?')[0]
        } else if (link.match(/^https\:\/\/youtu\.be\/\w+$/)) {
            let parts = link.split('/')
            return parts.pop().split('?')[0]
        }
        const query = queryObject(link.split('?')[1]);
        return query.v;
    } catch (err) {
        throw err;
    }
}
function addTube(vId) {
    return "https://www.youtube.com/embed/" + vId;
}