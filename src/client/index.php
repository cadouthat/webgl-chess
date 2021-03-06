<?php

require_once("lib/Mobile_Detect.php");
$detect = new Mobile_Detect;

$showMobileWarning = ($detect->isMobile() && !isset($_GET['mobileConfirm']));

?><!DOCTYPE html>
<!--
Copyright 2016 Connor Douthat
https://github.com/cadouthat/webgl-chess
-->
<html>
	<head>
		<title>WebGL Chess by Connor Douthat</title>
		<link rel="icon" href="img/favicon.ico"/>
		<link rel="stylesheet" type="text/css" href="css/index.css"/>
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js"></script>
		<link href='https://fonts.googleapis.com/css?family=Dosis:400,700|Oleo+Script:400' rel='stylesheet' type='text/css'>
		<?php if(!$showMobileWarning): ?><script src="app.js"></script><?php endif; ?>
	</head>
	<body>
		<?php if($showMobileWarning): ?>
		<div id="mobile_warning">
			<h2>Note to mobile users</h2>
			<p>This game is not likely to be very playable on mobile devices, and loading it could use a good chunk of data. <a href="?mobileConfirm=true">Proceed at your own risk.</a></p>
		</div>
		<?php else: ?>
		<canvas id="glview">
			<p>If you're seeing this, your browser does not support HTML5 canvas</p>
		</canvas>
		<img id="toggle_mute" src="img/unmute.png" alt="" onclick="toggleMute()"/>
		<img style="display: none;" src="img/mute.png" alt=""/>
		<div id="status">
			<p id="status_text">Loading..</p>
			<img id="status_wait" src="img/waiting.gif" alt=""/>
			<div class="turn_timer" id="white_timer"><p>15:00</p></div>
			<div class="turn_timer" id="black_timer"><p>15:00</p></div>
		</div>
		<div id="promotion">
			<img class="prev" src="img/prev.png" alt="" onclick="promotionPrev()"/>
			<img class="next" src="img/next.png" alt="" onclick="promotionNext()"/>
			<img class="confirm" src="img/confirm.png" alt="" onclick="promotionConfirm()"/>
		</div>
		<h1 id="game_over"></h1>
		<div id="chat">
			<div id="chat_wrapper"><div id="chat_box">
				<p>Welcome to WebGL Chess!</p>
			</div></div>
			<input id="chat_entry" type="text" placeholder="Press enter to chat"/>
		</div>
		<?php endif; ?>
		<p id="footer">&copy; 2016 Connor Douthat - <a target="_blank" href="https://github.com/cadouthat/webgl-chess">view source</a></p>
	</body>
</html>
