var canvas=document.getElementById("canvas");

/***************自适应正方形****************/
//box的高度
var box=document.getElementById("box");
var side_length = window.innerWidth<window.innerHeight?window.innerWidth:window.innerHeight;
box.style.height = side_length+"px";//实际是656.64 － 数据是687
box.style.width = 0.9*side_length+"px";

//IE
//box.style.width = 500;
//box.style.height = 500;

//box.style.backgroundColor = "black";
//box.style.backgroundColor = "black";
//canvas.style.width = canvas.style.height = 0.95*side_length+"px";
var canvasSise = 0.9*side_length;
canvas.width = canvas.height = canvasSise;
/*******************************************/

/***************自适应坦克和子弹尺寸**************/
var TankSize = canvasSise * 0.1;
var TankPedrailHeight = TankSize;//履带长基准
var TankPedrailWidth = TankSize * (2/10);//履带宽
var TankPedrailPosition = TankSize * (8/10);//履带位置
var TankMainSize = TankSize * (6/10);//主体
var TankMainPositionX = TankSize * (2/10);//主体位置偏移x
var TankMainPositionY = TankSize * (2/10);//主体位置偏移y
var TankBarrel = { //炮筒开始偏移坐标
	x:TankSize*(5/10),
	y:TankSize*(5/10)
}
var TankBarrelSize = TankSize * (2/10);//炮宽
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var BulletSize = TankBarrelSize/2;//也可以等于炮宽/2 


/*******************************************/


var cxt=canvas.getContext("2d");

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//画布边缘
//var canMaginW = $("#can1").width();//JQ
//var canMaginH = $("#can1").height();//JQ
var canMaginW = canvas.width;
var canMaginH = canvas.height;

//cxt.fillRect(0,0,50,50);
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//测试为什么正方形会画成长方形(2倍),因为画布默认是300X150,通过css改变就像改变一条图一样会拉伸 
//cxt.fillRect(50,50+5,20,20);//主体(高,宽)

//调用坦克相关~~~~~~~~~~~~~~~~~~~~
var tankspeed = TankSize * 0.06;//速度也是自适应的不然像素低的屏幕跑得快.
var bulletspeed = TankSize * 0.5;//子弹速度
var tankScore = 10;//一辆坦克的分数
//创建坦克对象
var mytank=new MyTank(canvas.width/2-TankSize/2,canvas.height/2-TankSize/2,0,tankspeed);
drawTank(mytank);
var mybullet=null;

//敌方坦克(自适应位置)----------------
var enemyTankNumber = 3//敌方坦克数量
var enemyTankLife = 3;//复活次数
var TankSpace = (canvasSise - TankSize*enemyTankNumber)/(enemyTankNumber+1);//空地
var enemyTanks=Array();
for(var i=0;i<enemyTankNumber;i++){
	enemyTanks[i]=new EnemyTank(TankSpace + i*TankSize + i*TankSpace,0,1,tankspeed);
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var showScore = document.getElementsByClassName("showScore")[0];
var score = 0;
//自动
var timer;
function startFlashAll(){
    timer = setInterval("flashAll()",100);
}
startFlashAll();

//坦克父类
function Tank(x,y,d,s){
	this.initx=this.x=x;
	this.inity=this.y=y;
	this.d=d;
	this.s=s;
	this.life = enemyTankLife;
	this.isAlive=true;
	//移动方法
	this.moveUp=function(){ //向上
		this.d=0;
		if(this.y>0)
			this.y-=this.s;
	}
	this.moveDown=function(){ //向下
		this.d=1;
		if(this.y<canvasSise - TankSize)
			this.y+=this.s;
	}
	this.moveLeft=function(){ //向左
		this.d=2;
		if(this.x>0)
			this.x-=this.s;
	}
	this.moveRight=function(){ //向右
		this.d=3;
		if(this.x<canvasSise - TankSize)
			this.x+=this.s;
	}
	
}
//已方坦克类
function MyTank(x,y,d,s){
	this.MyTank=Tank;
	this.MyTank(x,y,d,s);
	this.color="#88AA88";
	//射击方法
	this.shot=function(){
		//alert("进入射击方法");
		if(mybullet==null){
			drawBullet(mybullet);
			mybullet=new Bullet(this.x+TankBarrel.x,this.y+TankBarrel.y,this.d,bulletspeed);
			//mybullet.run();
			//新增声音
			document.getElementById("sound").src = "bullet.mp3";
			if(!document.getElementById("sound").autoplay){
				//alert("进入");
				document.getElementById("sound").autoplay = "autoplay";
			}
		}
		
	}
}
//敌方坦克类
function EnemyTank(x,y,d,s){
	this.MyTank=Tank;
	this.MyTank(x,y,d,s);
	this.color="#0000FF";
}
//子弹类
function Bullet(x,y,d,s){
	this.x=x;
	this.y=y;
	this.d=d;
	this.s=s;
	this.isAlive=true;
	//飞行方法
	switch(this.d){
		case 0:
			this.run=function(){//向上
				this.y-=this.s;
				if(this.y<0){
					this.isAlive=false;
				}
			}
		break;
		case 1:
			this.run=function(){//向下
				this.y+=this.s;
				if(this.y>canvasSise){
					this.isAlive=false;
				}
			}
		break;
		case 2:
			this.run=function(){//向左
				this.x-=this.s;
				if(this.x<0){
					this.isAlive=false;
				}
			}
		break;
		case 3:
			this.run=function(){//向右
				this.x+=this.s;
				if(this.x>canvasSise){
					this.isAlive=false;
				}
			}
		break;
	}
}
//画坦克函数
function drawTank(tank){
	if(tank.isAlive == true){
		switch(tank.d){
			//上下
			case 0:
			case 1:
				cxt.fillStyle=tank.color;
				cxt.strokeStyle=tank.color;
				cxt.lineWidth=TankBarrelSize;//炮宽
				cxt.fillRect(tank.x,tank.y,TankPedrailWidth,TankPedrailHeight);//履带
				//cxt.fillStyle="red";//test
				cxt.fillRect(tank.x+TankMainPositionX,tank.y+TankMainPositionY,TankMainSize,TankMainSize);//主体(高,宽)
				//cxt.fillStyle=tank.color;//test
				cxt.fillRect(tank.x+TankPedrailPosition,tank.y,TankPedrailWidth,TankPedrailHeight);//履带
				
				cxt.beginPath();
				cxt.moveTo(tank.x+TankBarrel.x,tank.y+TankBarrel.y);//炮筒开始偏移坐标
				if(tank.d==0)
					cxt.lineTo(tank.x+TankBarrel.x,tank.y);
				else
					cxt.lineTo(tank.x+TankBarrel.x,tank.y+TankSize);
				cxt.closePath();
				cxt.stroke();
				
			break;
			//左右
			case 2:
			case 3:
				cxt.fillStyle=tank.color;
				cxt.strokeStyle=tank.color;
				cxt.lineWidth=TankBarrelSize;//炮宽
				cxt.fillRect(tank.x,tank.y,TankPedrailHeight,TankPedrailWidth);//履带
				cxt.fillRect(tank.x+TankMainPositionX,tank.y+TankMainPositionY,TankMainSize,TankMainSize);//主体
				cxt.fillRect(tank.x,tank.y+TankPedrailPosition,TankPedrailHeight,TankPedrailWidth);//履带
				cxt.beginPath();
				cxt.moveTo(tank.x+TankBarrel.x,tank.y+TankBarrel.y);
				if(tank.d==2)
					cxt.lineTo(tank.x,tank.y+TankBarrel.y);
				else
					cxt.lineTo(tank.x+TankSize,tank.y+TankBarrel.y);
				cxt.closePath();
				cxt.stroke();
		}
	}
}
//画子弹函数
function drawBullet(bullet){
	//alert("进入画子弹函数");
	if(bullet){
		cxt.fillStyle="#FF0000";
		cxt.fillRect(bullet.x-BulletSize/2,bullet.y-BulletSize/2,BulletSize,BulletSize);//子弹位置和大小TankBarrelSize
	}
}
//击中函数
function hitTank(bullet,tank){
	//有子弹并且这一个tank还活着
	if(bullet&&tank.isAlive){
		if(bullet.x>tank.x&&bullet.x<tank.x+TankSize&&bullet.y>tank.y&&bullet.y<tank.y+TankSize){
			bullet.isAlive=false;
			tank.isAlive=false;
			tank.life -= 1;//命-1
			score += tankScore;//计分
			positionClear(tank);//位置清零
			showScore.innerHTML = '分数:'+score;
			document.getElementById("burn").src="burn.mp3";
			if(!document.getElementById("burn").autoplay){
				//alert("进入");
				document.getElementById("burn").autoplay="autoplay";
			}
		}
	}
}
//刷新全局函数
function flashAll(){
	cxt.clearRect(0,0,canvasSise,canvasSise);//清空
	//重绘
	drawTank(mytank);//已方坦克
	if(mybullet&&mybullet.isAlive){//子弹
		mybullet.run();
		drawBullet(mybullet);
		//显示坐标
		//document.getElementsByClassName("hint")[0].innerHTML="x="+mybullet.x+"--y="+mybullet.y;
	}else{
		mybullet=null;
	}
	for(var i=0;i<enemyTanks.length;i++){//敌方坦克
		hitTank(mybullet,enemyTanks[i]);
		//~~~~~~~~~~~移动~~~~~~~~~~~
		//var r = Math.ceil(Math.random()*10%4);
		if(enemyTanks[i].isAlive)
			enemyTanksMove(enemyTanks[i]);//用函数也可以
		//console.log(enemyTanks[1].x+enemyTanks[1].y);
		//~~~~~~~~~~~~~~~~~~~~~~~~~~~
		//复活
		if(enemyTanks[i].isAlive == false && enemyTanks[i].life>0){
			setTimeout('resurrection(enemyTanks['+i+'])',3000);
		}
		
		drawTank(enemyTanks[i]);
	}

} 
//复活函数
function resurrection(tank){
	tank.isAlive = true;
}

//已方控制函数###############################################
function getComman(){
	//startFlashAll();
	var code=event.keyCode;
	//alert(code);
	switch(code){
		case 119:mytank.moveUp(); break;//限制在框内放在坦克里了,这样这边事件发出那边不反映就行.
		case 115:mytank.moveDown(); break;
		case 97:mytank.moveLeft(); break;
		case 100:mytank.moveRight(); break;
		case 106:mytank.shot();break;
	}
	cxt.clearRect(0,0,canvasSise,canvasSise);//清空
	drawTank(mytank);//重绘
	//重绘敌方坦克
	for(var i=0;i<enemyTanks.length;i++){//敌方坦克
		drawTank(enemyTanks[i]);
	}
	//重绘子弹
	if(mybullet&&mybullet.isAlive)//子弹
		drawBullet(mybullet);
}
//按钮控制
document.getElementById("up").addEventListener("click",function(){
	mytank.moveUp();
});

document.getElementById("down").addEventListener("click",function(){
	mytank.moveDown();
});

document.getElementById("left").addEventListener("click",function(){
	mytank.moveLeft();
});

document.getElementById("right").addEventListener("click",function(){
	mytank.moveRight();
});

document.getElementsByClassName("shot")[0].addEventListener("click",function(){
	mytank.shot();
});
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//敌方移动函数(直接写到flashAll()里吧?)
function enemyTanksMove(tank){
	var r = Math.ceil(Math.random()*10%4);
	switch(r){
		case 1:tank.moveUp(); break;//限制在框内放在坦克里了,这样这边事件发出那边不反映就行.
		case 2:tank.moveDown(); break;
		case 3:tank.moveLeft(); break;
		case 4:tank.moveRight(); break;
		//case 106:enemyTanks[i].shot();break;
	}
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//死后位置清零方法:
function positionClear(tank){
	tank.x = tank.initx;
	tank.y = tank.inity;
}

//保存函数
function save(){
	alert("保存");
	localStorage.save = JSON.stringify(enemyTanks);
	localStorage.score = score;
}
document.getElementsByClassName("save")[0].addEventListener("click",save);
//读取
function load(){
	var tanksData = JSON.parse(localStorage.save);
	for(var i=0;i<enemyTanks.length;i++){//敌方坦克
		enemyTanks[i].x = tanksData[i].x;
		enemyTanks[i].y = tanksData[i].y;
		enemyTanks[i].d = tanksData[i].d;
		enemyTanks[i].life = tanksData[i].life;
		enemyTanks[i].isAlive = tanksData[i].isAlive;
	}
	score = Number(localStorage.score);
	showScore.innerHTML = '分数:'+score;
}
document.getElementsByClassName("load")[0].addEventListener("click",load);
//暂停
function pause(){
	clearInterval(timer);
}
document.getElementsByClassName("pause")[0].addEventListener("click",pause);
//开始
document.getElementsByClassName("start")[0].addEventListener("click",startFlashAll);
//###################################################################

//###################################################################
/* 
//看看JQ是不是正常
$(document).ready(function(){
	alert("aaaaaa");
}); */

