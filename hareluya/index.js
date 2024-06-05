document.getElementById("player").addEventListener("init",PlayerInit);
var player = new Playerjs({
    id:"player",
    qualities:"480p",
    file:[
        {"title":"1 серия", "subtitle":"[Русский]./ru.srt", "file":"[480p]./1.mp4"},
        {"title":"2 серия","file":"./1.mp4"}
    ]
});

function PlayerInit(){
    player.api("moveplaylist","playlist_container");
 }