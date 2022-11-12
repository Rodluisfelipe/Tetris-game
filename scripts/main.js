var myAudio = document.getElementById("myAudio");

function togglePlay() {
    return myAudio.paused ? myAudio.play() : myAudio.pause();
};
document.getElementById('tetris').style.border = '0px solid transparent';

document.getElementById("start_game").addEventListener("click", function () {

    document.getElementById('tetris').style.border = 'solid .2em #fff';
    document.getElementById('start_game').style.display = "none";

    document.getElementById('demo-img').style.display = "none";
    document.getElementById('restart_game').style.display = "block";

});
