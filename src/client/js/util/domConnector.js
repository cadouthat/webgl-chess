function setGameStatus(str, waiting)
{
	$("#status_text").text(str);
	$("#status_wait").css("display", waiting ? "block" : "none");
}

function setGameResult(str)
{
	$("#game_over").text(str);
}

function displayChat(player, text)
{
	if(player)
	{
		player += ": ";
	}
	else player = "";
	var box = $("#chat_box");
	box.append(
		$("<p/>").append(
			$("<span/>").append(document.createTextNode(player)),
			document.createTextNode(text)
		)
	);
	box.scrollTop(box[0].scrollHeight);
}

function displayClock(whiteTime, blackTime)
{
	$("#white_timer").children("p").text(whiteTime);
	$("#black_timer").children("p").text(blackTime);
}

function showPromotionSelector()
{
	$("#promotion").css("display", "block");
}
function hidePromotionSelector()
{
	$("#promotion").css("display", "none");
}

function displayMuteStatus(muted)
{
	$("#toggle_mute").attr("src", muted ? "img/mute.png" : "img/unmute.png");
}
