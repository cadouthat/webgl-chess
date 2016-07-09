var soundsPlayedOnce = [];
var muteAllAudio = false;

function playSound(obj)
{
	if(!muteAllAudio)
	{
		obj.play();
	}
}

function playSoundOnce(obj)
{
	if(soundsPlayedOnce.indexOf(obj) < 0)
	{
		soundsPlayedOnce.push(obj);
		playSound(obj);
	}
}

function toggleMute()
{
	muteAllAudio = !muteAllAudio;
	displayMuteStatus(muteAllAudio);
}
