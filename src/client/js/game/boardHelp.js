//Helpful chess constants
const BOARD_ROW_COUNT = 8;
const BOARD_SCALE = 5.82;

//Get position of a board space in world space
function getSpaceWorldPosition(pos) {
	const spaceWidth = BOARD_SCALE * 2 / BOARD_ROW_COUNT;
	return new vec3(
		(pos[0] + 0.5) * spaceWidth - BOARD_SCALE,
		0,
		(pos[1] + 0.5) * spaceWidth - BOARD_SCALE);
};
