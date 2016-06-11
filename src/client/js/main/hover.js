var hoverSpace = null;
var activeSpace = null;
var glowSpace = null;
var greenGlowColor = null;
var whiteGlowColor = null;

//Refresh cursor hover selection
function updateHover()
{
	//Static color init
	if(!greenGlowColor)
	{
		greenGlowColor = new vec3(0.412, 0.98, 0.427).scaleIn(2);
		whiteGlowColor = new vec3(1.5);
	}

	//Reset hover/glow state
	hoverSpace = null;
	glowSpace = null;
	for(var i = 0; i < game.pieces.length; i++)
	{
		game.pieces[i].glowColor = null;
	}

	//No interaction if it is not my turn
	if(game.turn != myColor)
	{
		activeSpace = null;
		return;
	}

	//Active space stays highlighted
	if(activeSpace)
	{
		//It should always be a piece
		var activePiece = game.pieceAt(activeSpace);
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
	for(var i = 0; i < game.pieces.length; i++)
	{
		var piece = game.pieces[i];
		var mdl = piece.constructor.model;
		//Get world position
		var base = getSpaceWorldPosition(piece.position);
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
			hoverSpace = piece.position;
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
		var hoverPiece = game.pieceAt(hoverSpace);
		//Highlight my own pieces to select them
		if(hoverPiece && hoverPiece.owner == myColor)
		{
			hoverPiece.glowColor = whiteGlowColor;
		}
		else if(activeSpace)
		{
			//Highlight possible moves
			if(game.canMove(activeSpace, hoverSpace))
			{
				//Highlight whatever lies at the hover location
				if(hoverPiece)
				{
					hoverPiece.glowColor = greenGlowColor;
				}
				else
				{
					glowSpace = hoverSpace;
				}
			}
		}
	}
}
