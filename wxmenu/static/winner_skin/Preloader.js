Winner.Preloader = function(game){
	// define width and height of the game
	Winner.GAME_WIDTH = 640;
	Winner.GAME_HEIGHT = 960;
};
Winner.Preloader.prototype = {
	preload: function(){
		// set background color and preload image
		this.stage.backgroundColor = '#B32929';
		this.add.sprite((Winner.GAME_WIDTH-428)/2, (Winner.GAME_HEIGHT-36)/2, 'preloaderBarBg');
		this.preloadBar = this.add.sprite((Winner.GAME_WIDTH-428)/2, (Winner.GAME_HEIGHT-36)/2, 'preloaderBar');
		this.load.setPreloadSprite(this.preloadBar);
		// load images
		this.load.image('background', '/static/winner_skin/imgs/background.png');
		this.load.image('background2', '/static/winner_skin/imgs/background2.png');
		//this.load.image('intro', 'imgs/intro.png');
		this.load.image('floor', '/static/winner_skin/imgs/floor.png');
		this.load.image('title', '/static/winner_skin/imgs/title.png');
		this.load.image('gameover', '/static/winner_skin/imgs/gameover.png');
		this.load.image('score-bg', '/static/winner_skin/imgs/score-bg.png');
		// this.load.image('monster-idle', 'imgs/monster-cover.png');
		
		// load spritesheets
		this.load.spritesheet('candy', '/static/winner_skin/imgs/candy.png', 135, 109);
		this.load.spritesheet('monster-idle', '/static/winner_skin/imgs/monster-cover.png', 229, 304);
		this.load.spritesheet('button-start', '/static/winner_skin/imgs/button-start.png', 342, 115);
		this.load.spritesheet('button-pause', '/static/winner_skin/imgs/button-pause.png',104,92);
		this.load.spritesheet('arrow-left', '/static/winner_skin/imgs/arrowL.png',119,78);
		this.load.spritesheet('arrow-right', '/static/winner_skin/imgs/arrowR.png',119,78);
	},
	create: function(){
		// start the MainMenu state
		this.state.start('MainMenu');
	}
};