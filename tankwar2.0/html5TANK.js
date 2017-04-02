﻿var canvas=document.getElementById("can1");

/***************自适应正方形****************/
//box的高度
var box=document.getElementById("box");
var side_length = window.innerWidth<window.innerHeight?window.innerWidth:window.innerHeight;
box.style.width = box.style.height = side_length+"px";//实际是656.64 － 数据是687
//box.style.backgroundColor = "black";
//box.style.backgroundColor = "black";
//canvas.style.width = canvas.style.height = 0.95*side_length+"px";
var canvasSise = 0.95*side_length;
canvas.width = canvas.height = canvasSise;
console.log(window.innerHeight);
console.log(window.innerWidth);
console.log(window.innerWidth);
console.log("画布宽为:"+canvas.width);
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

console.log(TankPedrailHeight);
console.log(TankMainSize);
/*******************************************/


var cxt=canvas.getContext("2d");

//********************************
//画布边缘
var canMaginW = $("#can1").width();
var canMaginH = $("#can1").height();
//console.log(canMaginW+""+canMaginH);
//cxt.fillRect(0,0,50,50);
//***********************************

//测试为什么正方形会画成长方形(2倍),因为画布默认是300X150,通过css改变就像改变一条图一样会拉伸 
//cxt.fillRect(50,50+5,20,20);//主体(高,宽)

//调用坦克相关************************
//创建坦克对象
var mytank=new MyTank(canvas.width/2-TankSize/2,canvas.height/2-TankSize/2,0,5);
drawTank(mytank);
var mybullet=null;

//敌方坦克(自适应位置)
var enemyTankNumber = 5//敌方坦克数量
var TankSpace = (canvasSise - TankSize*enemyTankNumber)/(enemyTankNumber+1);//空地
var enemytanks=Array();
for(var i=0;i<enemyTankNumber;i++){
	enemytanks[i]=new EnemyTank(TankSpace + i*TankSize + i*TankSpace,0,1,5);
}
//************************************
//自动
//function startFlashAll(){
	setInterval("flashAll()",100);
//}

//坦克父类
function Tank(x,y,d,s){
	this.x=x;
	this.y=y;
	this.d=d;
	this.s=s;
	this.isAlive=true;
	//移动方法
	this.moveUp=function(){ //向上
		this.d=0;
		if(this.y>0)
			this.y-=this.s;
	}
	this.moveDown=function(){ //向下
		this.d=1;
		if(this.y<470)
			this.y+=this.s;
	}
	this.moveLeft=function(){ //向左
		this.d=2;
		if(this.x>0)
			this.x-=this.s;
	}
	this.moveRight=function(){ //向右
		this.d=3;
		if(this.x<470)
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
			mybullet=new Bullet(this.x+TankBarrel.x,this.y+TankBarrel.y,this.d,15);//暂时#####
			//mybullet.run();
			//新增声音
			document.getElementById("sound").src="bullet.mp3";
			if(!document.getElementById("sound").autoplay){
				//alert("进入");
				document.getElementById("sound").autoplay="autoplay";
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
				if(this.y>500){
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
				if(this.x>500){
					this.isAlive=false;
				}
			}
		break;
	}
}
//画坦克函数
function drawTank(tank){
	//alert("进入drawTank");
	//alert(tank.color);
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
	if(bullet&&tank){
		if(bullet.x>tank.x&&bullet.x<tank.x+TankSize&&bullet.y>tank.y&&bullet.y<tank.y+TankSize){
			bullet.isAlive=false;
			tank.isAlive=false;
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
	cxt.clearRect(0,0,500,500);//清空
	//重绘
	drawTank(mytank);//已方坦克
	if(mybullet&&mybullet.isAlive){//子弹
		mybullet.run();
		drawBullet(mybullet);
		//显示坐标
		//document.getElementById("span1").innerHTML="x="+mybullet.x+"--y="+mybullet.y;
	}else{
		mybullet=null;
	}
	for(var i=0;i<enemytanks.length;i++){//敌方坦克
		hitTank(mybullet,enemytanks[i]);
		if(enemytanks[i].isAlive==false){
			enemytanks.splice(i,1);//删除
		}else{
			drawTank(enemytanks[i]);
		}
	}
	
}
//控制函数
function getComman(){
	//startFlashAll();
	var code=event.keyCode;
	//alert(code);
	switch(code){
		case 119:mytank.moveUp(); break;
		case 115:mytank.moveDown(); break;
		case 97:mytank.moveLeft(); break;
		case 100:mytank.moveRight(); break;
		case 106:mytank.shot();break;
	}
	cxt.clearRect(0,0,500,500);//清空
	drawTank(mytank);//重绘
	//重绘敌方坦克
	for(var i=0;i<enemytanks.length;i++){//敌方坦克
		drawTank(enemytanks[i]);
	}
	//重绘子弹
	if(mybullet&&mybullet.isAlive)//子弹
		drawBullet(mybullet);
}

//###################################################################
/* 
//看看JQ是不是正常
$(document).ready(function(){
	alert("aaaaaa");
}); */
