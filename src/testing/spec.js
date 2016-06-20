describe("ChessGame", function() {
	var game = new ChessGame();

	it("should start on white's turn", function() {
		expect(game.turn).toEqual("white");
		expect(game.interpretMove(space("A7"), space("A6"))).toBe(null);
		expect(game.interpretMove(space("A2"), space("A3"))).not.toBe(null);
	});

	it("should not allow rooks to move first", function() {
		expect(game.interpretMove(space("A1"), space("A3"))).toBe(null);
	});

	it("should allow pawns to move two spaces", function() {
		expect(game.doMove(space("H2"), space("H4"))).toBe(true);
	});

	it("should switch to black's turn", function() {
		expect(game.turn).toEqual("black");
		expect(game.interpretMove(space("A7"), space("A6"))).not.toBe(null);
		expect(game.interpretMove(space("A2"), space("A3"))).toBe(null);
	});

	it("should allow pawns to move one space", function() {
		expect(game.doMove(space("H7"), space("H6"))).toBe(true);
	});

	it("should allow a series of valid moves", function() {
		//
	});

	it("should allow capturing opponents", function() {
		//
	});

	it("should not allow self capturing", function() {
		//
	});

	it("should allow en passant", function() {
		//
	});

	it("should allow promotion", function() {
		//
	});

	it("should allow castling", function() {
		//
	});

	it("should not allow self-check", function() {
		//
	});

	it("should allow opponent to be placed in check", function() {
		//
	});

	it("should detect check state", function() {
		//
	});

	it("should not allow staying in check", function() {
		//
	});

	it("should allow getting out of check", function() {
		//
	});

	it("should detect checkmate", function() {
		//
	});

	it("should detect a draw", function() {
		//
	});
});
