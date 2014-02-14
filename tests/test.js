describe("A dependency manager", function(){

	// beforeEach(function(){
	// });

	it("should fire a single action with data passed from dependency", function(){
		var ret;

		var deps = new Dependencies({
			dep1: {
				count: 1
			}
		},[function(data){ ret = data }]);

		deps.resolve('dep1', 1337);

		expect( 1337 ).toBe( ret['dep1'][0] );
	});

	it("should fire a single action with data passed from both dependencies", function(){
		var ret;

		var deps = new Dependencies({
			dep1: {
				count: 1
			},
			dep2: {
				count: 2
			}
		},[function(data){ ret = data }]);

		deps.resolve('dep1', 1337);
		deps.resolve('dep2', 1982);
		deps.resolve('dep2', 1984);

		expect( 1337 ).toBe( ret['dep1'][0] );
		expect( 1982 ).toBe( ret['dep2'][0] );
		expect( 1984 ).toBe( ret['dep2'][1] );
	});

	it("should fire multiple actions with data passed from both dependencies", function(){
		var ret1, ret2;

		var deps = new Dependencies({
			dep1: {
				count: 1
			},
			dep2: {
				count: 2
			}
		},[
			function(data){ ret1 = data },
			function(data){ ret2 = data }
		]);

		deps.resolve('dep1', 1337);
		deps.resolve('dep2', 1982);
		deps.resolve('dep2', 1984);

		expect( 1337 ).toBe( ret1['dep1'][0] );
		expect( 1982 ).toBe( ret1['dep2'][0] );
		expect( 1984 ).toBe( ret1['dep2'][1] );

		expect( 1337 ).toBe( ret2['dep1'][0] );
		expect( 1982 ).toBe( ret2['dep2'][0] );
		expect( 1984 ).toBe( ret2['dep2'][1] );
	});

	it("should automatically fill in a missing count with one", function(){
		var ret1, ret2;

		var deps = new Dependencies({
			dep1: {},
			dep2: {}
		},[
			function(data){ ret1 = data },
			function(data){ ret2 = data }
		]);

		deps.resolve('dep1', 1337);
		deps.resolve('dep2', 1982);

		expect( 1337 ).toBe( ret1['dep1'][0] );
		expect( 1982 ).toBe( ret1['dep2'][0] );

		expect( 1337 ).toBe( ret2['dep1'][0] );
		expect( 1982 ).toBe( ret2['dep2'][0] );
	});

	it("should mutate the data", function(){
		var ret1, ret2;

		var deps = new Dependencies({
			dep1: {
				mutator: function(){ return 'hax3d' }
			},
			dep2: {
				mutator: function(){ return 'hax3d X2' }
			}
		},[
			function(data){ ret1 = data },
			function(data){ ret2 = data }
		]);

		deps.resolve('dep1', 1337);
		deps.resolve('dep2', 1982);

		expect( 'hax3d' ).toBe( ret1['dep1'][0] );
		expect( 'hax3d X2' ).toBe( ret1['dep2'][0] );

		expect( 'hax3d' ).toBe( ret2['dep1'][0] );
		expect( 'hax3d X2' ).toBe( ret2['dep2'][0] );
	});

	it("should allow you to add actions", function(){
		var ret1, ret2;

		var deps = new Dependencies({
			dep1: {
				mutator: function(){ return 'hax3d' }
			},
			dep2: {
				mutator: function(){ return 'hax3d X2' }
			}
		});

		deps.resolved(function(data){ ret1 = data });
		deps.resolved(function(data){ ret2 = data });

		deps.resolve('dep1', 1337);
		deps.resolve('dep2', 1982);

		expect( 'hax3d' ).toBe( ret1['dep1'][0] );
		expect( 'hax3d X2' ).toBe( ret1['dep2'][0] );

		expect( 'hax3d' ).toBe( ret2['dep1'][0] );
		expect( 'hax3d X2' ).toBe( ret2['dep2'][0] );
	});

	it("should allow you to add actions", function(){
		var ret1, ret2;

		var deps = new Dependencies({
			dep1: {
				validate: function(data){ return data === 1337 }
			},
			dep2: {
				validate: function(data){ return data === 2 }
			}
		});

		deps.resolved(function(data){ ret1 = data });
		deps.resolved(function(data){ ret2 = data });

		deps.resolve('dep1', 1337);
		deps.resolve('dep2', 1982);
		deps.resolve('dep2', 2);

		expect( 1337 ).toBe( ret1['dep1'][0] );
		expect( 2 ).toBe( ret1['dep2'][0] );
	});

	it("should allow you to add subdeps", function(){
		var ret1, ret2;

		var deps = new Dependencies({
			dep1: {
				validate: function(data){ return data === 1337 }
			},
			dep2: {
				validate: function(data){ return data === 2 }
			}
		});

		var sub1 = deps.resolved({
			dep1: {}
		});

		sub1.resolved(function(data){ ret1 = data });

		var sub2 = deps.resolved({
			dep2: {}
		});

		sub2.resolved(function(data){ ret2 = data });

		deps.resolve('dep1', 1337);
		deps.resolve('dep2', 2);

		expect( 1337 ).toBe( ret1['dep1'][0] );
		expect( 2 ).toBe( ret2['dep2'][0] );
	});

	it("should allow dep definitions via an array", function(){
		var deps = new Dependencies(['dep1', 'dep2']);

		var converted = {
			dep1: {count:1},
			dep2: {count:1}
		};

		expect( deps._dependencies ).toEqual( converted );
	});

	it("should allow dep definitions via multiple parameters", function(){
		var deps = new Dependencies('dep1', 'dep2');

		var converted = {
			dep1: {count:1},
			dep2: {count:1}
		};

		expect( deps._dependencies ).toEqual( converted );
	});

	it("should allow dep definitions via multiple parameters", function(){
		var deps = new Dependencies({
			'dep1': 2,
			'dep2': 3
		});

		var converted = {
			dep1: {count:2},
			dep2: {count:3}
		};

		expect( deps._dependencies ).toEqual( converted );
	});
});

/*
describe("A board", function(){

	var board;
	var cols = 20;
	var rows = 33;

	beforeEach(function(){
		board = new Board(cols, rows);
	});

	it("should have " + cols + " columns", function(){

		expect( board.cols ).toBe( cols );
	});

	it("should have " + rows + " columns", function(){

		expect( board.rows ).toBe( rows );
	});

	it("should be empty to start with", function(){

		for(var col = 0; col < cols; col++){
			for(var row = 0; row < rows; row++){
				expect( board.occupied(col, row) ).toBe( false );
			}
		}
	});

	it("should be able to insert a new cell", function(){

		expect( board.occupied(0, 0) ).toBe( false );
		board.insert(0, 0, ALIVE);
		expect( board.occupied(0, 0) ).toBe( true );
	});

	it("should know when you're out of bounds", function(){

		expect( board.outOfBounds(-1, 0) ).toBe( true );
		expect( board.outOfBounds(0, -1) ).toBe( true );
		expect( board.outOfBounds(cols, 0) ).toBe( true );
		expect( board.outOfBounds(0, rows) ).toBe( true );
	});
});

describe("A game", function(){

	var board;
	var game;
	var cols = 20;
	var rows = 33;

	beforeEach(function(){
		board = new Board(cols, rows);
		game = new Game(board);
	});

	it("should have a board", function(){

		expect( game.board ).toBe( board );
	});

	it("should know how many neighbors a cell has", function(){

		game.board.insert(0,0,true);
		game.board.insert(0,1,true);
		game.board.insert(1,0,true);

		expect( game.countNeighbors(1,1) ).toBe( 3 );
	});
});
*/