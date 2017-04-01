var canvas=document.getElementById("can1");
var cxt=canvas.getContext("2d");
//cxt.fillRect(0,0,50,50);
//创建对象
var mytank=new MyTank(250,250,3,5);
drawTank(mytank);
var mybullet=null;
var enemytanks=Array();
for(var i=0;i<3;i++){
	enemytanks[i]=new EnemyTank(i*150+80,0,1,5);
}
//自动
setInterval("flashAll()",100);

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
	this.color="#FF0000";
	//射击方法
	this.shot=function(){
		//alert("进入射击方法");
		if(mybullet==null){
			drawBullet(mybullet);
			mybullet=new Bullet(this.x+12,this.y+12,this.d,15);
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
		case 0:
		case 1:
			cxt.fillStyle=tank.color;
			cxt.strokeStyle=tank.color;
			cxt.lineWidth=3;
			cxt.fillRect(tank.x,tank.y,5,30);
			cxt.fillRect(tank.x,tank.y+5,25,20);
			cxt.fillRect(tank.x+25,tank.y,5,30);
			cxt.beginPath();
			cxt.moveTo(tank.x+15,tank.y+15);
			if(tank.d==0)
				cxt.lineTo(tank.x+15,tank.y);
			else
				cxt.lineTo(tank.x+15,tank.y+30);
			cxt.closePath();
			cxt.stroke();
		break;
		case 2:
		case 3:
			cxt.fillStyle=tank.color;
			cxt.strokeStyle=tank.color;
			cxt.lineWidth=3;
			cxt.fillRect(tank.x,tank.y,30,5);
			cxt.fillRect(tank.x+5,tank.y,20,25);
			cxt.fillRect(tank.x,tank.y+25,30,5);
			cxt.beginPath();
			cxt.moveTo(tank.x+15,tank.y+15);
			if(tank.d==2)
				cxt.lineTo(tank.x,tank.y+15);
			else
				cxt.lineTo(tank.x+30,tank.y+15);
			cxt.closePath();
			cxt.stroke();
	}
}
//画子弹函数
function drawBullet(bullet){
	//alert("进入画子弹函数");
	if(bullet){
		cxt.fillStyle="#FF0000";
		cxt.fillRect(bullet.x,bullet.y,5,5);
	}
}
//击中函数
function hitTank(bullet,tank){
	if(bullet&&tank){
		if(bullet.x>tank.x&&bullet.x<tank.x+30&&bullet.y>tank.y&&bullet.y<tank.y+30){
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
		document.getElementById("span1").innerHTML="x="+mybullet.x+"--y="+mybullet.y;
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