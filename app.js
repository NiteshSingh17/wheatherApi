const express=require('express')
const app=express()
const PORT=process.env.PORT||3001;
const fs = require('fs')

const cors=require('cors');
app.use(cors());

app.get("/soilMoisture",(req,res)=>{
console.log('/soil');
fs.readFile("./soilMoisture.json", "utf8", (err, jsonString) => {
  if (err) {
    console.log("File read failed:", err);
    return;
  }
const jsob=JSON.parse(jsonString);
const country=req.query.cnt;
const city=req.query.ct;
const date=req.query.date+" 00:00:00";

console.log("date ",date)
for(let i=0;i<jsob['data'].length;i++){

if(jsob['data'][i][date] && jsob['data'][i]['city']===city && jsob['data'][i]['country']===country){
console.log(jsob['data'][i]);
res.send(jsob['data'][i][date]);
return;
}
}
res.status(404).send({msg:"SoilMoisture Not Found"});

//console.log("File data:", jsob['data'][0]["2021-02-07 00:00:00"]);
});
})


const MONTHS = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];

function getmonth(month){
for(var i=0;i<MONTHS.length;i++){
if(MONTHS[i]===month){
return i;
}
}
}




app.get("/getdata",(req,res)=>{
console.log("/getdata",req.query);

const reslimit=req.query.limit||1;
const country=req.query.country;
const city=req.query.city;

const syear=parseInt(req.query.year);
const eyear=parseInt(req.query.eyear||req.query.year);

let smonth=req.query.month;

let emonth=req.query.emonth||smonth;

console.log(smonth,emonth);

smonth=getmonth(smonth);
emonth=getmonth(emonth);

const sday=parseInt(req.query.day);
const eday=parseInt(req.query.eday||req.query.day);



console.log(smonth,emonth,sday,eday,syear,eyear,country,city);
const users = [];

fs.readFile("./input.json", "utf8", (err, jsonString) => {
  if (err) {
    console.log("File read failed:", err);
res.Staus(404).send({"Msg":"Not Enougn Info"});
    return;
  }

const data=JSON.parse(jsonString);

//  console.log("File data:",data);
const result=[];

const startDate=new Date(syear,smonth,sday);
const endDate=new Date(eyear,emonth,eday);
data.forEach(one=>{

one.Month=getmonth(one.Month);

//console.log(one.Month,smonth,emonth,one.day);
console.log(one.country,country,one.city,city,typeof(one.country),typeof(country))
if(one.country===country && one.city===city){

const curDate=new Date(one.year,one.Month,one.day)
if(startDate<=curDate&&curDate<=endDate){
result.push(one);
}
}
})
result.forEach((one)=>{
one.id=one.year*100;
one.id=one.id+one.Month;
one.id=one.id*100+one.day;
})
result.sort((a,b)=>{
return b.id-a.id;
})

console.log("res  ",result);
res.send(result.splice(0,reslimit));
});

})


app.listen(PORT,(err)=>{
console.log("listening at 3000");
});
