var hoverSpace = null;
var activeSpace = null;
var glowSpaces = [];
var pendingMove = null;
var greenGlowColor = null;
var whiteGlowColor = null;
var blueGlowColor = null;
var redGlowColor = null;

//Refresh cursor hover selection
function updateHover()
{
	//Static color init
	if(!greenGlowColor)
	{
		greenGlowColor = new vec3(0.412, 0.98, 0.427).scaleIn(2);
		whiteGlowColor = new vec3(1.5);
		blueGlowColor = new vec3(0.3, 0.3, 1.5);
		redGlowColor = new vec3(1.5, 0.5, 0.5);
	}

	//Reset hover/glow state
	hoverSpace = null;
	glowSpaces = [];
	pendingMove = null;
	for(var i = 0; i < renderer.pieces.length; i++)
	{
		renderer.pieces[i].glowColor = null;
	}

	//No interaction if the game is over or it is not my turn
	if(!client.isGameActive() || game.turn != client.myColor)
	{
		activeSpace = null;
		return;
	}

	//If player is in check, highlight the threatening piece
	var inCheckBy = game.findCheck(client.myColor);
	if(inCheckBy)
	{
		renderer.findByGamePiece(inCheckBy).glowColor = redGlowColor;
		//Also highlight the king red
		renderer.findByGamePiece(game.findKing(client.myColor)).glowColor = redGlowColor;
	}
	else
	{
		//Last opponent move is highlighted
		if(game.lastMoved)
		{
			renderer.findByGamePiece(game.lastMoved).glowColor = blueGlowColor;
			glowSpaces.push({
				"position": game.lastMoved.lastPosition,
				"color": blueGlowColor
			});
		}
	}

	//Pending promotion stays highlighted
	if(promotionDisplayPiece)
	{
		promotionDisplayPiece.glowColor = greenGlowColor;
		return;
	}

	//Active space stays highlighted
	if(activeSpace)
	{
		//It should always be a piece
		var activePiece = renderer.pieceAt(activeSpace);
		if(activePiece)
		{
			activePiece.glowColor = greenGlowColor;
		}
	}

	//No selection while dragging
	if(mouseRB) return;

	//Get the cursor direction in world space (based at the eye)
	var start = cam.getEye();
	var dir = unProject(lastMouseX, lastMouseY).subIn(start).normalize();

	//Find the earliest intersection
	var u;
	var uMin = null;

	//Check pieces
	for(var i = 0; i < renderer.pieces.length; i++)
	{
		var piece = renderer.pieces[i];
		var mdl = piece.gamePiece.constructor.model;
		//Get world position
		var base = piece.worldPosition;
		var top = base.add(new vec3(0, mdl.maxPoint.y, 0));
		//Approximate radius with largest horizontal dimension
		var rad = [mdl.minPoint.x, mdl.minPoint.z, mdl.maxPoint.x, mdl.maxPoint.z].reduce(function(prev, cur){
			return Math.max(Math.abs(prev), Math.abs(cur));
		});
		rad *= 0.75;
		//Check for cylinder intersection
		u = intersectLineCylinder(start, dir, base, top, rad);
		if(u != null && (uMin == null || u < uMin))
		{
			hoverSpace = piece.gamePiece.position;
			uMin = u;
		}
	}

	//Check board plane intersection
	u = intersectLinePlane(start, dir, new vec3(0, 1, 0), 0);
	if(u != null && (uMin == null || u < uMin))
	{
		//Project to point on plane
		var bx = start.x + dir.x * u;
		var bz = start.z + dir.z * u;
		//Check if point lies on board
		if(bx > -BOARD_SCALE && bx < BOARD_SCALE &&
			bz > -BOARD_SCALE && bz < BOARD_SCALE)
		{
			//Determine space index by board dimensions
			hoverSpace = [
				Math.floor(((bx / BOARD_SCALE + 1) / 2) * BOARD_ROW_COUNT),
				Math.floor(((bz / BOARD_SCALE + 1) / 2) * BOARD_ROW_COUNT)
				];
			uMin = u;
		}
	}

	//Determine highlight for hover
	if(hoverSpace && !game.equalSpaces(hoverSpace, activeSpace))
	{
		var hoverPiece = renderer.pieceAt(hoverSpace);
		//Highlight my own pieces to select them
		if(hoverPiece && hoverPiece.gamePiece.owner == client.myColor)
		{
			hoverPiece.glowColor = whiteGlowColor;
		}
		else if(activeSpace)
		{
			//Check for possible move
			var blockedBy = [];
			pendingMove = game.interpretMove(activeSpace, hoverSpace, blockedBy);
			if(pendingMove != null)
			{
				//This move must save the king from danger, so clear any check highlight
				var kingPiece = game.findKing(client.myColor);
				if(game.pieceAt(pendingMove.from) != kingPiece)
				{
					renderer.findByGamePiece(kingPiece).glowColor = null;
				}
				//Highlight whatever lies at the hover location
				if(hoverPiece)
				{
					hoverPiece.glowColor = greenGlowColor;
				}
				else
				{
					glowSpaces.push({
						"position": hoverSpace,
						"color": greenGlowColor
					});
				}
			}
			else
			{
				//If the move is blocked by an opponent, highlight it
				if(blockedBy.length)
				{
					renderer.findByGamePiece(blockedBy[0]).glowColor = redGlowColor;
					//Also highlight the king red
					renderer.findByGamePiece(game.findKing(client.myColor)).glowColor = redGlowColor;
					//Highlight whatever lies at the hover location
					if(hoverPiece)
					{
						hoverPiece.glowColor = redGlowColor;
					}
					else
					{
						glowSpaces.push({
							"position": hoverSpace,
							"color": redGlowColor
						});
					}
				}
			}
		}
	}
}
