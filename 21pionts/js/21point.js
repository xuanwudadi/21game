$(function(){//继承
	Function.prototype.extends=function(fnc,ext){
		for(var prop in fnc.prototype){
			this.prototype[prop]=fnc.prototype[prop];
		}
		for(var prop in ext){
			this.prototype[ext]=ext[prop];
		}
	}
	function Puke(count){//扑克对象的功能
		this.count=count;
		this.cards=[];
		this.init();//初始化扑克
	}
	Puke.prototype={
		init : function(){//初始化扑克牌
			for(i=1;i<=this.count;i++){
				for(j=1;j<=4;j++){
					for(k=1;k<=13;k++){
						this.cards.push({point:(k>10?10:k),color:j,src:"images/"+j+"/"+k+".jpg"});
					}
				}
			}
			this.shuffle();
		},
		shuffle : function(){//洗牌功能
			this.cards.sort(function(a1,a2){
				return (Math.random()*10%3-1);
			});
		},
		deal : function(){//发牌功能
			if(this.cards.length==0){
				this.init();
			}
			return this.cards.pop();//删除并返回数组的最后一个元素
		}
	}
	new Puke(3);
	function Player(name){//玩家对象
		this.name = name;
		this.point = 0;
		this.cards = [];
	}
	Player.prototype={
		getCard : function(card){//获得一张牌
			this.cards.push(card);
		},
		getPoint : function(flag){//i=1 获得明牌的点数 comp用，1=0获得所有牌的点数 game用
			var sum = 0;
			for(i=(flag?1:0);i<this.cards.length;i++){
				sum+=this.cards[i].point; 
			}
			return sum;
		},
		isNeedCard : function(){
		//是否需要牌，玩家自己决定！！
		}
	}
	function User(name){//庄家
		Player.call(this,name);
	}
	User.extends(Player,{
		isNeedCard : function(need){
		//是否需要牌，玩家自己决定！！
		}
	});
	function Comp(name){//电脑玩家
		Player.call(this,name);
	}
	Comp.extends(Player,{
		isNeedCard : function(need){//AI智能概率选择是否要牌
			/*var random = Math.random();
			if(this.getPoint(true)>=19){
				if(random<=.1){
					this.getCard(puke.deal());
				}
			}else if(this.getPoint(true)>=16&&sum<=18){
				if(random<=.3){
					this.getCard(puke.deal());
				}
			}else if(this.getPoint(true)>=12&&sum<=15){
				if(random<=.6){
					this.getCard(puke.deal());
				}
			}else if(this.getPoint(true)<=11){
					this.getCard(puke.deal());
			}*/
		}
	});
	function Game(user,compCount,pukeCount){//游戏对象
		this.user = user;
		this.compCount = compCount;
		this.players = [];
		this.puke = new Puke(pukeCount);
		this.init();
	}
	Game.prototype = {
		init : function(){//初始化游戏
			this.players.push(this.user);
			for(i=1;i<=this.compCount;i++){
				this.players.push(new Comp('电脑'+i));
			}
		},
		play : function(){//第一回合发牌功能
			for(i=0;i<this.players.length;i++){
				this.players[i].getCard(this.puke.deal());
				this.players[i].getCard(this.puke.deal());
			}
		},
		nextRound : function(isNeed){//下一回合玩家选择是否要牌
			isNeed = this.players[0].isNeedCard(isNeed);
			if(isNeed){
				this.players[0].getCard(this.puke.deal());
			}
			for(i=1;i<=this.players.length;i++){
				if(this.players[i].isNeedCard(this.players[i].getPoint(true))){
					this.players[i].getCard(this.puke.deal());
				}
			}
		}
	}
	var $btnStart = $('#pk div.table-board div.start button');
	var $btnVerdict = $('#pk div.table-board div.verdict button');
	//点击开始游戏
	$btnStart.click(function(){
		do{
			var compCounts = prompt("请输入电脑玩家数1-3：");
		}while(compCounts!=1&&compCounts!=2&&compCounts!=3)
		do{
			var pukeCounts = prompt("请输入扑克数1-4：");
		}while(pukeCounts!=1&&pukeCounts!=2&&pukeCounts!=3&&pukeCounts!=4)
		var puke = new Puke(pukeCounts);//生成扑克牌
		var user = new User('赌鬼');//生成庄家
		var game = new Game(user,compCounts,pukeCounts);//生成游戏
		//生成牌局界面
		$('#pk div.table-board div.welcome').css('display','none');
		$btnVerdict.css('display','block');
		$('#pk div.table-board div.user').css('display','block');
		$('#pk div.table-board div.user').append($('<img src=images/'+6+'.jpg>'));
		$('#pk div.table-board div.userc').css('display','block');
		var $comp = $('#comp');
		var comp = new Comp();
		for(i=1;i<=compCounts;i++){
			a = parseInt(Math.random()*100%5);
			$comp.append($('<li><img src=images/'+a+'.jpg></li>'));
		}
		if(compCounts==1){
			$('#comp li').addClass('comp1');
			$('#pk div.table-board div.com1').css('display','block');
		}else if(compCounts==2){
			$('#comp li').addClass('comp2');
			$('#pk div.table-board div.com2').css('display','block');
		}else if(compCounts==3){
			$('#comp li').addClass('comp3');
			$('#pk div.table-board div.com3').css('display','block');
		}
		//比赛开始，第一轮发牌
		game.play();
		var $userc = $('#pk div.table-board div.userc ul');
		var $com1 = $('#pk div.table-board div.com1 ul');
		if(compCounts==1){
				for(i=1;i<2;i++){
					$userc.append($('<li><img src='+game.players[0].cards[i].src+'></li>'));
					$com1.append($('<li><img src='+game.players[1].cards[i].src+'></li>'));
				}
		}else if(compCounts==2){
			var $comp21 = $('#pk div.table-board div.com2 div.comp21 ul');
			var $comp22 = $('#pk div.table-board div.com2 div.comp22 ul');
			try{
				for(i=1;i<3;i++){
				$userc.append($('<li><img src='+game.players[0].cards[i].src+'></li>'));
				$comp21.append($('<li><img src='+game.players[1].cards[i].src+'></li>'));
				$comp22.append($('<li><img src='+game.players[2].cards[i].src+'></li>'));
				}
				throw 'someError';
			}catch(e){
				if(e=='someError')
				return;
			}
		}else if(compCounts==3){
			var $comp31 = $('#pk div.table-board div.com3 div.comp31 ul');
			var $comp32 = $('#pk div.table-board div.com3 div.comp32 ul');
			var $comp33 = $('#pk div.table-board div.com3 div.comp33 ul');
			try{
				for(i=1;i<4;i++){
				$userc.append($('<li><img src='+game.players[0].cards[i].src+'></li>'));
				$comp31.append($('<li><img src='+game.players[1].cards[i].src+'></li>'));
				$comp32.append($('<li><img src='+game.players[2].cards[i].src+'></li>'));
				$comp33.append($('<li><img src='+game.players[3].cards[i].src+'></li>'));
				}
				throw 'someError';
			}catch(e){
				if(e=='someError')
				return;
			}
		}
		//第二轮，玩家要牌
		var $need = $('#pk div.table-board div.need');
		$need.css('display','block');
		var clickCount = 0;
		//庄家点击要牌
		$('#pk div.table-board div.need button.btn1').click(function(){
			game.players[0].getCard(game.puke.deal());
			$userc.append($('<li class='+"card"+clickCount+'><img src='+game.players[0].cards[clickCount+2].src+'></li>'));
			var _left = (210+(clickCount+1)*105)/2+'px';
			$userc.children().filter('.card'+clickCount).addClass('card').css('left',_left);
			clickCount++;
			if(game.players[0].getPoint(true)>=16){
				alert('庄家点数大于16，不能要牌了！！');
				$need.css('display','none');
			}
		});
		//庄家不要牌即失去要牌功能
		$('#pk div.table-board div.need button.btn2').click(function(){
			$need.css('display','none');
		});
		//只有一个电脑玩家
		if(compCounts==1){
			$('#pk div.table-board div.com1_player').css('display','block');
			var click1 = 0;//鼠标点击次数
			var flag = false;
			//给电脑玩家发牌，电脑通过AI只能判断是否要牌
			$('#pk div.table-board div.com1_player').click(function(){
				var num = game.players[1].getPoint(true);
				//电脑通过AI智能判断是否要牌
				if(num>=19&&num<21){
					if(Math.random()<=0.05){
						game.players[1].getCard(game.puke.deal());
						$com1.append($('<li class='+"card"+click1+'><img src='+game.players[1].cards[click1+2].src+'></li>'));
						var _left = (105+(click1+1)*105/2)+'px';
						$com1.children().filter('.card'+click1).addClass('card').css('left',_left);
						flag = true;
					}else{
						flag = false;
					}
				}else if(num>=16&&num<=18){
					if(Math.random()<=0.1){
						game.players[1].getCard(game.puke.deal());
						$com1.append($('<li class='+"card"+click1+'><img src='+game.players[1].cards[click1+2].src+'></li>'));
						var _left = (105+(click1+1)*105/2)+'px';
						$com1.children().filter('.card'+click1).addClass('card').css('left',_left);
						flag = true;
					}else{
						flag = false;
					}
				}else if(num>=12&&num<=15){
					if(Math.random()<=0.3){
						game.players[1].getCard(game.puke.deal());
						$com1.append($('<li class='+"card"+click1+'><img src='+game.players[1].cards[click1+2].src+'></li>'));
						var _left = (105+(click1+1)*105/2)+'px';
						$com1.children().filter('.card'+click1).addClass('card').css('left',_left);
						flag = true;
					}else{
						flag = false;
					}
				}else if(num<=11){
					game.players[1].getCard(game.puke.deal());
					$com1.append($('<li class='+"card"+click1+'><img src='+game.players[1].cards[click1+2].src+'></li>'));
					var _left = (105+(click1+1)*105/2)+'px';
					$com1.children().filter('.card'+click1).addClass('card').css('left',_left);
					flag = true;
				}else if(num=21){
					flag = false;
				}else{
					flag = false;
					alert('你的点数已大于21，再接再厉！！');
				}
				click1++;
				//当电脑玩家出现第一次不要牌时，就失去要牌功能
				if(!flag){
					$('#pk div.table-board div.com1_player').css('display','none');
				}
			});
		}else if(compCounts==2){//两个电脑玩家参与游戏
			$('#pk div.table-board div.com2_player1').css('display','block');//玩家1
			$('#pk div.table-board div.com2_player2').css('display','block');//玩家2
			var click21 = 0,click22 = 0;
			var flag = false;
			//给电脑玩家1发牌，电脑通过AI只能判断是否要牌
			$('#pk div.table-board div.com2_player1').click(function(){
				var num = game.players[1].getPoint(true);
				if(num>=19&&num<21){
					if(Math.random()<=0.05){
						game.players[1].getCard(game.puke.deal());
						$comp21.append($('<li class='+"card"+click21+'><img src='+game.players[1].cards[click21+2].src+'></li>'));
						var _left = (105+(click21+1)*105/2)+'px';
						$comp21.children().filter('.card'+click21).addClass('card').css('left',_left);
						flag = true;
					}else{
						flag = false;
					}
				}else if(num>=16&&num<=18){
					if(Math.random()<=0.1){
						game.players[1].getCard(game.puke.deal());
						$comp21.append($('<li class='+"card"+click21+'><img src='+game.players[1].cards[click21+2].src+'></li>'));
						var _left = (105+(click21+1)*105/2)+'px';
						$comp21.children().filter('.card'+click21).addClass('card').css('left',_left);
						flag = true;
					}else{
						flag = false;
					}
				}else if(num>=12&&num<=15){
					if(Math.random()<=0.3){
						game.players[1].getCard(game.puke.deal());
						$comp21.append($('<li class='+"card"+click21+'><img src='+game.players[1].cards[click21+2].src+'></li>'));
						var _left = (105+(click21+1)*105/2)+'px';
						$comp21.children().filter('.card'+click21).addClass('card').css('left',_left);
						flag = true;
					}else{
						flag = false;
					}
				}else if(num<=11){
					game.players[1].getCard(game.puke.deal());
					$comp21.append($('<li class='+"card"+click21+'><img src='+game.players[1].cards[click21+2].src+'></li>'));
					var _left = (105+(click21+1)*105/2)+'px';
						$comp21.children().filter('.card'+click21).addClass('card').css('left',_left);
					flag = true;
				}else if(num=21){
					flag = false;
				}else{
					flag = false;
					alert('你的点数已大于21，再接再厉！！');
				}
				click21++;
				//当电脑玩家出现第一次不要牌时，就失去要牌功能
				if(!flag){
					$('#pk div.table-board div.com2_player1').css('display','none');
				}
			});
			//给电脑玩家2发牌，电脑通过AI只能判断是否要牌	
			$('#pk div.table-board div.com2_player2').click(function(){
				var num = game.players[2].getPoint(true);
				if(num>=19&&num<21){
					if(Math.random()<=0.05){
						game.players[2].getCard(game.puke.deal());
						$comp22.append($('<li class='+"card"+click22+'><img src='+game.players[2].cards[click22+2].src+'></li>'));
						var _left = (105+(click22+1)*105/2)+'px';
						$comp22.children().filter('.card'+click22).addClass('card').css('left',_left);
						flag = true;
					}else{
						flag = false;
					}
				}else if(num>=16&&num<=18){
					if(Math.random()<=0.1){
						game.players[2].getCard(game.puke.deal());
						$comp22.append($('<li class='+"card"+click22+'><img src='+game.players[2].cards[click22+2].src+'></li>'));
						var _left = (105+(click22+1)*105/2)+'px';
						$comp22.children().filter('.card'+click22).addClass('card').css('left',_left);
						flag = true;
					}else{
						flag = false;
					}
				}else if(num>=12&&num<=15){
					if(Math.random()<=0.3){
						game.players[2].getCard(game.puke.deal());
						$comp22.append($('<li class='+"card"+click22+'><img src='+game.players[2].cards[click22+2].src+'></li>'));
					var _left = (105+(click22+1)*105/2)+'px';
						$comp22.children().filter('.card'+click22).addClass('card').css('left',_left);
						flag = true;
					}else{
						flag = false;
					}
				}else if(num<=11){
					game.players[2].getCard(game.puke.deal());
					$comp22.append($('<li class='+"card"+click22+'><img src='+game.players[2].cards[click22+2].src+'></li>'));
					var _left = (105+(click22+1)*105/2)+'px';
						$comp22.children().filter('.card'+click22).addClass('card').css('left',_left);
					flag = true;
				}else if(num=21){
					flag = false;
				}else{
					flag = false;
					alert('你的点数已大于21，再接再厉！！');
				}
				click22++;
				if(!flag){
					$('#pk div.table-board div.com2_player2').css('display','none');
				}
			});
		}else if(compCounts==3){
			$('#pk div.table-board div.com3_player1').css('display','block');//玩家1
			$('#pk div.table-board div.com3_player2').css('display','block');//玩家2
			$('#pk div.table-board div.com3_player3').css('display','block');//玩家3
			var click31 = 0,click32 = 0,click33 = 0;
			var flag = false;
			//给电脑玩家1发牌，电脑通过AI只能判断是否要牌
			$('#pk div.table-board div.com3_player1').click(function(){
				var num = game.players[1].getPoint(true);
				if(num>=19&&num<21){
					if(Math.random()<=0.05){
						game.players[1].getCard(game.puke.deal());
						$comp31.append($('<li class='+"card"+click31+'><img src='+game.players[1].cards[click31+2].src+'></li>'));
						var _left = (105+(click31+1)*105/2)+'px';
						$comp31.children().filter('.card'+click31).addClass('card').css('left',_left);
						flag = true;
					}else{
						flag = false;
					}
				}else if(num>=16&&num<=18){
					if(Math.random()<=0.1){
						game.players[1].getCard(game.puke.deal());
						$comp31.append($('<li class='+"card"+click31+'><img src='+game.players[1].cards[click31+2].src+'></li>'));
						var _left = (105+(click31+1)*105/2)+'px';
						$comp31.children().filter('.card'+click31).addClass('card').css('left',_left);
						flag = true;
					}else{
						flag = false;
					}
				}else if(num>=12&&num<=15){
					if(Math.random()<=0.3){
						game.players[1].getCard(game.puke.deal());
						$comp31.append($('<li class='+"card"+click31+'><img src='+game.players[1].cards[click31+2].src+'></li>'));
						var _left = (105+(click31+1)*105/2)+'px';
						$comp31.children().filter('.card'+click31).addClass('card').css('left',_left);
						flag = true;
					}else{
						flag = false;
					}
				}else if(num<=11){
					game.players[1].getCard(game.puke.deal());
					$comp31.append($('<li class='+"card"+click31+'><img src='+game.players[1].cards[click31+2].src+'></li>'));
					var _left = (105+(click31+1)*105/2)+'px';
						$comp31.children().filter('.card'+click31).addClass('card').css('left',_left);
					flag = true;
				}else if(num=21){
					flag = false;
				}else{
					flag = false;
					alert('你的点数已大于21，再接再厉！！');
				}
				click31++;
				//当电脑玩家出现第一次不要牌时，就失去要牌功能
				if(!flag){
					$('#pk div.table-board div.com3_player1').css('display','none');
				}
			});
			//给电脑玩家2发牌，电脑通过AI只能判断是否要牌
			$('#pk div.table-board div.com3_player2').click(function(){
				var num = game.players[2].getPoint(true);
				if(num>=19&&num<21){
					if(Math.random()<=0.05){
						game.players[2].getCard(game.puke.deal());
						$comp32.append($('<li class='+"card"+click32+'><img src='+game.players[2].cards[click32+2].src+'></li>'));
						var _left = (105+(click32+1)*105/2)+'px';
						$comp32.children().filter('.card'+click32).addClass('card').css('left',_left);
						flag = true;
					}else{
						flag = false;
					}
				}else if(num>=16&&num<=18){
					if(Math.random()<=0.1){
						game.players[2].getCard(game.puke.deal());
						$comp32.append($('<li class='+"card"+click32+'><img src='+game.players[2].cards[click32+2].src+'></li>'));
						var _left = (105+(click32+1)*105/2)+'px';
						$comp32.children().filter('.card'+click32).addClass('card').css('left',_left);
						flag = true;
					}else{
						flag = false;
					}
				}else if(num>=12&&num<=15){
					if(Math.random()<=0.3){
						game.players[2].getCard(game.puke.deal());
						$comp32.append($('<li class='+"card"+click32+'><img src='+game.players[2].cards[click32+2].src+'></li>'));
						var _left = (105+(click32+1)*105/2)+'px';
						$comp32.children().filter('.card'+click32).addClass('card').css('left',_left);
						flag = true;
					}else{
						flag = false;
					}
				}else if(num<=11){
					game.players[2].getCard(game.puke.deal());
					$comp32.append($('<li class='+"card"+click32+'><img src='+game.players[2].cards[click32+2].src+'></li>'));
					var _left = (105+(click32+1)*105/2)+'px';
						$comp32.children().filter('.card'+click32).addClass('card').css('left',_left);
					flag = true;
				}else if(num=21){
					flag = false;
				}else{
					flag = false;
					alert('你的点数已大于21，再接再厉！！');
				}
				click32++;
				if(!flag){
					$('#pk div.table-board div.com3_player2').css('display','none');
				}
			});
			//给电脑玩家3发牌，电脑通过AI只能判断是否要牌
			$('#pk div.table-board div.com3_player3').click(function(){
				var num = game.players[3].getPoint(true);
				if(num>=19&&num<21){
					if(Math.random()<=0.05){
						game.players[3].getCard(game.puke.deal());
						$comp33.append($('<li class='+"card"+click33+'><img src='+game.players[3].cards[click33+2].src+'></li>'));
						var _left = (105+(click33+1)*105/2)+'px';
						$comp33.children().filter('.card'+click33).addClass('card').css('left',_left);
						flag = true;
					}else{
						flag = false;
					}
				}else if(num>=16&&num<=18){
					if(Math.random()<=0.1){
						game.players[3].getCard(game.puke.deal());
						$comp33.append($('<li class='+"card"+click33+'><img src='+game.players[3].cards[click33+2].src+'></li>'));
						var _left = (105+(click33+1)*105/2)+'px';
						$comp33.children().filter('.card'+click33).addClass('card').css('left',_left);
						flag = true;
					}else{
						flag = false;
					}
				}else if(num>=12&&num<=15){
					if(Math.random()<=0.3){
						game.players[3].getCard(game.puke.deal());
						$comp33.append($('<li class='+"card"+click33+'><img src='+game.players[3].cards[click33+2].src+'></li>'));
						var _left = (105+(click33+1)*105/2)+'px';
						$comp33.children().filter('.card'+click33).addClass('card').css('left',_left);
						flag = true;
					}else{
						flag = false;
					}
				}else if(num<=11){
					game.players[3].getCard(game.puke.deal());
					$comp33.append($('<li class='+"card"+click33+'><img src='+game.players[3].cards[click33+2].src+'></li>'));
					var _left = (105+(click33+1)*105/2)+'px';
					$comp33.children().filter('.card'+click33).addClass('card').css('left',_left);
					flag = true;
				}else if(num=21){
					flag = false;
				}else{
					flag = false;
					alert('你的点数已大于21，再接再厉！！');
				}
				click33++;
				if(!flag){
					$('#pk div.table-board div.com3_player3').css('display','none');
				}
			});
		}
		toggleButton1();
		function toggleButton1(){//点击游戏开始后让按钮失去功能不能被点击，即进入‘比赛中’
			var $btn = $('#pk div.table-board div.start button');
			$btn.attr('disabled',true);
			$btn.css('border-color','#bbb');
			$btn.html('比赛中!');
		}
		//裁决并反馈结果
		$btnVerdict.click(function(){
			if(compCounts==1){
				$userc.children().eq(0).children().attr('src',game.players[0].cards[0].src);
				$com1.children().eq(0).children().attr('src',game.players[1].cards[0].src);
				var user = game.players[0].getPoint(false);
				var player = game.players[1].getPoint(false);
				var $text = $('#pk div.table-board div.com1_text');
				var $verText = $('#pk div.table-board div.verdictText1');
				verdict(user,player,$text,$verText);
				var $width = $text.width();
					$text.css('left',(590-$width/2)+'px'); 
				$('#pk div.table-board div.dsText1').css('display','block').html('我左青龙，右白虎，老牛在腰间，龙头在胸口，人挡杀人，佛挡杀佛！');
			}else if(compCounts==2){
				$userc.children().eq(0).children().attr('src',game.players[0].cards[0].src);
				$comp21.children().eq(0).children().attr('src',game.players[1].cards[0].src);
				$comp22.children().eq(0).children().attr('src',game.players[2].cards[0].src);
				var user = game.players[0].getPoint(false);
				var player1 = game.players[1].getPoint(false);
				var player2 = game.players[2].getPoint(false);
				var $text1 = $('#pk div.table-board div.com2_text1');
				var $text2 = $('#pk div.table-board div.com2_text2');
				var $verText1 = $('#pk div.table-board div.verdictText21');
				var $verText2 = $('#pk div.table-board div.verdictText22');
				verdict(user,player1,$text1,$verText1);
				var $width1 = $text1.width();
					$text1.css('left',(291-$width1/2)+'px'); 
				verdict(user,player2,$text2,$verText2);
				var $width2 = $text2.width();
					$text2.css('left',(892-$width2/2)+'px');
				$('#pk div.table-board div.dsText2').css('display','block').html('凭你的智慧，我很难跟你解释！');
			}else if(compCounts==3){
				$userc.children().eq(0).children().attr('src',game.players[0].cards[0].src);
				$comp31.children().eq(0).children().attr('src',game.players[1].cards[0].src);
				$comp32.children().eq(0).children().attr('src',game.players[2].cards[0].src);
				$comp33.children().eq(0).children().attr('src',game.players[3].cards[0].src);
				var user = game.players[0].getPoint(false);
				var player1 = game.players[1].getPoint(false);
				var player2 = game.players[2].getPoint(false);
				var player3 = game.players[3].getPoint(false);
				var $text1 = $('#pk div.table-board div.com3_text1');
				var $text2 = $('#pk div.table-board div.com3_text2');
				var $text3 = $('#pk div.table-board div.com3_text3');
				var $verText1 = $('#pk div.table-board div.verdictText2');
				var $verText2 = $('#pk div.table-board div.verdictText1');
				var $verText3 = $('#pk div.table-board div.verdictText3');
				verdict(user,player1,$text1,$verText1);
				var $width1 = $text1.width();
					$text1.css('left',(191-$width1/2)+'px');
				verdict(user,player2,$text2,$verText2);
				var $width2 = $text2.width();
					$text2.css('left',(591-$width2/2)+'px');
				verdict(user,player3,$text3,$verText3);
				var $width3 = $text3.width();
					$text3.css('left',(993-$width3/2)+'px');
				$('#pk div.table-board div.dsText3').css('display','block').html('我这么年轻就已经达到人生最高的境界，接着下来，除了结束自己的生命之外，我是无路可走了！');
			}
			toggleButton2();
			function toggleButton2(){//点击‘裁决’后，显示‘再来一局’按钮，并失去裁决功能
				var $btn = $('#pk div.table-board div.start button');
				$btn.attr('disabled',false);
				$btn.css('display','none');
			}
			$btnVerdict.css('display','none');
			$('#pk div.table-board div.continue button').css('display','block');
			$('#pk div.table-board div.continue button').click(function(){
				window.location.reload();
			});
		});
	});
	//裁决规则及反馈内容
	function verdict(user,player,$text,$verText){
		if(player>21&&user<=21){
			$text.css('display','block').html('呜呜呜，爆牌了！！');
			$verText.css('display','block').html('庄家获胜！！');
		}else if(player>21&&user>21){
			$text.css('display','block').html('哎呦，都爆了啊！！');
			$verText.css('display','block').html('平局');
		}else if(player<=21&&user<=21){
			if((player-user)<0){
				$text.css('display','block').html('呜呜呜，输死了！让一下嘛！！');
				$verText.css('display','block').html('庄家获胜！加油噢！');
			}else if((player-user)==0){
				$text.css('display','block').html('怎么平局了！！');
				$verText.css('display','block').html('平局');
			}else{
				$text.css('display','block').html('耶！！终于赢啦！！');
				$verText.css('display','block').html('恭喜你赢得了比赛！');
			}
		}else if(player<=21&&user>21){
				$text.css('display','block').html('切！！赌侠也不过如此嘛！！');
				$verText.css('display','block').html('恭喜你赢得了比赛！');
		}else{
			$text.css('display','block').html('Fuck！！，还输啊！！');
			$verText.css('display','block').html('庄家获胜！再接再厉！');
		}
	}
});