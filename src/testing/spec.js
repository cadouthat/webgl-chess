describe("ChessGame", function() {

	describe("Test game #1", function() {

		var game = new ChessGame();

		it("should start on white's turn", function() {
			expect(game.turn).toEqual("white");
			expect(game.doMove(space("A7"), space("A6"))).toBe(false);
		});

		it("should not allow rooks to move first", function() {
			expect(game.doMove(space("A1"), space("A3"))).toBe(false);
		});

		it("should allow pawns to move two spaces", function() {
			expect(game.doMove(space("H2"), space("H4"))).toBe(true);
		});

		it("should switch to black's turn", function() {
			expect(game.turn).toEqual("black");
			expect(game.doMove(space("A2"), space("A3"))).toBe(false);
		});

		it("should allow pawns to move one space", function() {
			expect(game.doMove(space("H7"), space("H6"))).toBe(true);
		});

		it("should not allow pawns to move backwards", function() {
			expect(game.doMove(space("H4"), space("H3"))).toBe(false);
		});

		it("should allow a series of valid moves", function() {
			expect(game.doMove(space("H1"), space("H3"))).toBe(true);
			expect(game.doMove(space("G8"), space("F6"))).toBe(true);
			expect(game.doMove(space("E2"), space("E4"))).toBe(true);
			expect(game.doMove(space("B7"), space("B5"))).toBe(true);
			expect(game.doMove(space("F1"), space("C4"))).toBe(true);
			expect(game.doMove(space("C7"), space("C6"))).toBe(true);
			expect(game.doMove(space("E1"), space("E2"))).toBe(true);
			expect(game.doMove(space("D8"), space("A5"))).toBe(true);
			expect(game.doMove(space("E2"), space("F1"))).toBe(true);
		});

		it("should allow capturing opponents", function() {
			expect(game.doMove(space("A5"), space("A2"))).toBe(true);
			expect(game.graveyard.length).toEqual(1);
		});

		it("should not allow self capturing", function() {
			expect(game.doMove(space("B1"), space("D2"))).toBe(false);
		});

		it("should allow en passant", function() {
			expect(game.doMove(space("E4"), space("E5"))).toBe(true);
			expect(game.doMove(space("D7"), space("D5"))).toBe(true);
			expect(game.doMove(space("E5"), space("D6"))).toBe(true);
			expect(game.graveyard.length).toEqual(2);
		});

		it("should allow promotion", function() {
			expect(game.doMove(space("F6"), space("H5"))).toBe(true);
			expect(game.doMove(space("D6"), space("D7"))).toBe(true);
			expect(game.doMove(space("E8"), space("D8"))).toBe(true);
			expect(game.doMove(space("D2"), space("D4"))).toBe(true);
			expect(game.doMove(space("D8"), space("C7"))).toBe(true);
			expect(game.doMove(space("D7"), space("D8"))).toBe(false);
			expect(game.doMove(space("D7"), space("D8"), "queen")).toBe(true);
		});

		it("should not allow castling if the pieces have moved", function() {
			expect(game.doMove(space("C7"), space("D8"))).toBe(true);
			expect(game.doMove(space("H3"), space("G3"))).toBe(true);
			expect(game.doMove(space("D8"), space("E8"))).toBe(true);
			expect(game.doMove(space("C4"), space("B5"))).toBe(true);
			expect(game.doMove(space("C8"), space("A6"))).toBe(true);
			expect(game.doMove(space("B5"), space("A6"))).toBe(true);
			expect(game.doMove(space("B8"), space("D7"))).toBe(true);
			expect(game.doMove(space("D4"), space("D5"))).toBe(true);
			expect(game.doMove(space("E8"), space("C8"))).toBe(false);
		});

		it("should not allow self-check", function() {
			expect(game.doMove(space("E7"), space("E6"))).toBe(true);
			expect(game.doMove(space("C1"), space("H6"))).toBe(true);
			expect(game.doMove(space("G7"), space("G5"))).toBe(true);
			expect(game.doMove(space("G3"), space("G5"))).toBe(true);
			expect(game.doMove(space("F8"), space("A3"))).toBe(true);
			expect(game.doMove(space("A6"), space("B5"))).toBe(true);
			expect(game.doMove(space("E8"), space("F8"))).toBe(false);
		});

		it("should allow opponent to be placed in check", function() {
			expect(game.doMove(space("D7"), space("C5"))).toBe(true);
			expect(game.doMove(space("G5"), space("G8"))).toBe(true);
		});

		it("should detect check state", function() {
			expect(game.findCheck(game.turn)).not.toBe(null);
		});

		it("should not allow staying in check", function() {
			expect(game.doMove(space("E8"), space("D8"))).toBe(false);
		});

		it("should allow getting out of check", function() {
			expect(game.doMove(space("H8"), space("G8"))).toBe(true);
			expect(game.findCheck(game.turn)).toBe(null);
		});

		it("should detect checkmate", function() {
			expect(game.doMove(space("D5"), space("E6"))).toBe(true);
			expect(game.doMove(space("C5"), space("A4"))).toBe(true);
			expect(game.doMove(space("B5"), space("C6"))).toBe(true);
			expect(game.doMove(space("E8"), space("E7"))).toBe(true);
			expect(game.doMove(space("G1"), space("F3"))).toBe(true);
			expect(game.doMove(space("E7"), space("E6"))).toBe(true);
			expect(game.doMove(space("C6"), space("D5"))).toBe(true);
			expect(game.doMove(space("E6"), space("F6"))).toBe(true);
			expect(game.doMove(space("B1"), space("A3"))).toBe(true);
			expect(game.doMove(space("A7"), space("A6"))).toBe(true);
			expect(game.doMove(space("A3"), space("C4"))).toBe(true);
			expect(game.doMove(space("A6"), space("A5"))).toBe(true);
			expect(game.doMove(space("C4"), space("D6"))).toBe(true);
			expect(game.doMove(space("A2"), space("B2"))).toBe(true);
			expect(game.doMove(space("H6"), space("F8"))).toBe(true);
			expect(game.doMove(space("A4"), space("C3"))).toBe(true);
			expect(game.doMove(space("A1"), space("A4"))).toBe(true);
			expect(game.doMove(space("C3"), space("B1"))).toBe(true);
			expect(game.doMove(space("D1"), space("D3"))).toBe(true);
			expect(game.doMove(space("H5"), space("G3"))).toBe(true);
			expect(game.doMove(space("F1"), space("E1"))).toBe(true);
			expect(game.doMove(space("B2"), space("A1"))).toBe(true);
			expect(game.doMove(space("H4"), space("H5"))).toBe(true);
			expect(game.doMove(space("B1"), space("A3"))).toBe(true);
			expect(game.doMove(space("E1"), space("D2"))).toBe(true);
			expect(game.doMove(space("A1"), space("B1"))).toBe(true);
			expect(game.doMove(space("A4"), space("F4"))).toBe(true);
			expect(game.doMove(space("G3"), space("F5"))).toBe(true);
			expect(game.doMove(space("G2"), space("G4"))).toBe(true);
			expect(game.doMove(space("A3"), space("B5"))).toBe(true);
			expect(game.doMove(space("G4"), space("F5"))).toBe(true);
			expect(game.doMove(space("B5"), space("A7"))).toBe(true);
			expect(game.doMove(space("D3"), space("D4"))).toBe(true);
			expect(game.isCheckmate).toEqual(true);
			expect(game.isDraw).toEqual(false);
			expect(game.turn).toEqual("black");
		});
	});

	describe("Test game #2", function() {

		var game = new ChessGame();

		it("should not allow castling to jump pieces", function() {
			expect(game.doMove(space("A2"), space("A4"))).toBe(true);
			expect(game.doMove(space("A7"), space("A5"))).toBe(true);
			expect(game.doMove(space("B2"), space("B4"))).toBe(true);
			expect(game.doMove(space("B7"), space("B5"))).toBe(true);
			expect(game.doMove(space("C2"), space("C4"))).toBe(true);
			expect(game.doMove(space("C7"), space("C5"))).toBe(true);
			expect(game.doMove(space("D2"), space("D4"))).toBe(true);
			expect(game.doMove(space("D7"), space("D5"))).toBe(true);
			expect(game.doMove(space("E2"), space("E4"))).toBe(true);
			expect(game.doMove(space("E7"), space("E5"))).toBe(true);
			expect(game.doMove(space("F2"), space("F4"))).toBe(true);
			expect(game.doMove(space("F7"), space("F5"))).toBe(true);
			expect(game.doMove(space("G2"), space("G4"))).toBe(true);
			expect(game.doMove(space("G7"), space("G5"))).toBe(true);
			expect(game.doMove(space("H2"), space("H4"))).toBe(true);
			expect(game.doMove(space("H7"), space("H5"))).toBe(true);

			expect(game.doMove(space("A4"), space("B5"))).toBe(true);
			expect(game.doMove(space("C5"), space("B4"))).toBe(true);

			expect(game.doMove(space("C4"), space("D5"))).toBe(true);
			expect(game.doMove(space("E5"), space("D4"))).toBe(true);

			expect(game.doMove(space("E4"), space("F5"))).toBe(true);
			expect(game.doMove(space("G5"), space("F4"))).toBe(true);

			expect(game.doMove(space("G4"), space("H5"))).toBe(true);

			expect(game.doMove(space("G8"), space("F6"))).toBe(true);
			expect(game.doMove(space("G1"), space("F3"))).toBe(true);

			expect(game.doMove(space("E8"), space("G8"))).toBe(false);
		});

		it("should allow castling", function() {
			expect(game.doMove(space("F8"), space("D6"))).toBe(true);
			expect(game.doMove(space("F1"), space("H3"))).toBe(true);

			expect(game.doMove(space("E8"), space("G8"))).toBe(true);
		});

		it("should not allow castling to put the king in danger", function() {
			expect(game.doMove(space("F3"), space("D4"))).toBe(true);
			expect(game.doMove(space("F8"), space("F7"))).toBe(true);
			expect(game.doMove(space("D4"), space("C6"))).toBe(true);
			expect(game.doMove(space("F7"), space("G7"))).toBe(true);

			expect(game.doMove(space("E1"), space("G1"))).toBe(false);
		});

		it("should detect a draw", function() {
			expect(game.doMove(space("C1"), space("F4"))).toBe(true);
			expect(game.doMove(space("G8"), space("H7"))).toBe(true);
			expect(game.doMove(space("F4"), space("G5"))).toBe(true);
			expect(game.doMove(space("B8"), space("C6"))).toBe(true);
			expect(game.doMove(space("G5"), space("F6"))).toBe(true);
			expect(game.doMove(space("A8"), space("B8"))).toBe(true);
			expect(game.doMove(space("F6"), space("G7"))).toBe(true);
			expect(game.doMove(space("D8"), space("H4"))).toBe(true);
			expect(game.doMove(space("E1"), space("D2"))).toBe(true);
			expect(game.doMove(space("H4"), space("H5"))).toBe(true);
			expect(game.doMove(space("A1"), space("A5"))).toBe(true);
			expect(game.doMove(space("C6"), space("A5"))).toBe(true);
			expect(game.doMove(space("D1"), space("C1"))).toBe(true);
			expect(game.doMove(space("H5"), space("H3"))).toBe(true);
			expect(game.doMove(space("C1"), space("C8"))).toBe(true);
			expect(game.doMove(space("H3"), space("H1"))).toBe(true);
			expect(game.doMove(space("C8"), space("B8"))).toBe(true);
			expect(game.doMove(space("H1"), space("B1"))).toBe(true);
			expect(game.doMove(space("B8"), space("D6"))).toBe(true);
			expect(game.doMove(space("B1"), space("F1"))).toBe(true);
			expect(game.doMove(space("D6"), space("A6"))).toBe(true);
			expect(game.doMove(space("F1"), space("F5"))).toBe(true);
			expect(game.doMove(space("A6"), space("A5"))).toBe(true);
			expect(game.doMove(space("F5"), space("D5"))).toBe(true);
			expect(game.doMove(space("D2"), space("E2"))).toBe(true);
			expect(game.doMove(space("D5"), space("D8"))).toBe(true);
			expect(game.doMove(space("A5"), space("D8"))).toBe(true);
			expect(game.doMove(space("B4"), space("B3"))).toBe(true);
			expect(game.doMove(space("D8"), space("D7"))).toBe(true);
			expect(game.doMove(space("B3"), space("B2"))).toBe(true);
			expect(game.doMove(space("E2"), space("D2"))).toBe(true);
			expect(game.doMove(space("B2"), space("B1"), "queen")).toBe(true);
			expect(game.doMove(space("D7"), space("E7"))).toBe(true);
			expect(game.doMove(space("B1"), space("C2"))).toBe(true);
			expect(game.doMove(space("D2"), space("C2"))).toBe(true);
			expect(game.doMove(space("H7"), space("G6"))).toBe(true);
			expect(game.doMove(space("C2"), space("D3"))).toBe(true);
			expect(game.doMove(space("G6"), space("H5"))).toBe(true);
			expect(game.doMove(space("D3"), space("E4"))).toBe(true);
			expect(game.doMove(space("H5"), space("G4"))).toBe(true);
			expect(game.doMove(space("E7"), space("A7"))).toBe(true);
			expect(game.doMove(space("G4"), space("H3"))).toBe(true);
			expect(game.doMove(space("E4"), space("F3"))).toBe(true);
			expect(game.doMove(space("H3"), space("H4"))).toBe(true);
			expect(game.doMove(space("G7"), space("E5"))).toBe(true);
			expect(game.doMove(space("H4"), space("H3"))).toBe(true);
			expect(game.doMove(space("E5"), space("G3"))).toBe(true);
			expect(game.isDraw).toBe(true);
		});
	});
});
